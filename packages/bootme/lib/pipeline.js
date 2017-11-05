'use strict'

const q = require('workq')
const debug = require('debug')('pipeline')
const Parent = require('./parent')

/**
 *
 *
 * @class Pipeline
 */
class Pipeline {
  /**
   * Creates an instance of Pipeline.
   * @param {any} registry
   * @memberof Pipeline
   */
  constructor(registry) {
    this.registry = registry
    this.queue = q()
  }
  /**
   *
   *
   * @param {any} task
   * @memberof Pipeline
   */
  async execute(task) {
    for (let [name, task] of this.registry.tasks) {
      this.queue.add(async child => {
        try {
          await task.executeHooks('onBefore', [child])
        } catch (err) {
          task.hookErrored = true
          await task.recover(err)
        }
      })
      this.queue.add(async child => {
        if (task.hookErrored) {
          return
        }
        try {
          await task.start(new Parent(child, task))
        } catch (err) {
          task.actionErrored = true
          debug('Task <%s> execute recover routine', name)
          await task.recover(err)
        }
      })
      this.queue.add(async child => {
        if (task.actionErrored) {
          return
        }
        try {
          await task.executeHooks('onAfter', [child])
        } catch (err) {
          task.hookErrored = true
          debug('Task <%s> execute recover routine', name)
          await task.recover(err)
        }
      })
    }
  }
}

module.exports = Pipeline
