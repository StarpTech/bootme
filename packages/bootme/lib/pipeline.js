'use strict'

const q = require('workq')
const debug = require('debug')('pipeline')
const error = require('debug')('pipeline:error')
const Parent = require('./parent')
const Registry = require('./registry')

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
    if (!(registry instanceof Registry)) {
      throw new TypeError('The Registry must be a Registry instance')
    }

    this.registry = registry
    this.queue = q()
  }
  /**
   *
   *
   * @param {any} task
   * @memberof Pipeline
   */
  async execute() {
    for (let [name, task] of this.registry.tasks) {
      task.config.bootme = this.registry.sharedConfig

      this.queue.add(async child => {
        try {
          await task.executeHooks('onBefore', [child])
        } catch (err) {
          task.hookErrored = true
          error('Task <%s> error %O', name, err)
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
          error('Task <%s> error %O', name, err)
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
          error('Task <%s> error %O', name, err)
          await task.recover(err)
        }
      })
    }
  }
}

module.exports = Pipeline
