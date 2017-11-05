'use strict'

const q = require('workq')
const debug = require('debug')('pipeline')
const error = require('debug')('pipeline:error')
const State = require('./state')
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
    this.results = new Map()
  }
  /**
   *
   *
   * @param {any} name
   * @memberof Pipeline
   */
  getResult(name) {
    return this.results.get(name)
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

      // onBefore
      this.queue.add(async child => {
        try {
          const state = new State(child, task, this)
          this.results.set(
            `${name}:onBefore`,
            await task.executeHooks('onBefore', [state])
          )
        } catch (err) {
          task.hookErrored = true
          this.results.set(`${name}:onBefore:error`, err)
          error('Task <%s> error %O', name, err)
          await task.recover(err)
        }
      })

      // action
      this.queue.add(async child => {
        if (task.hookErrored) {
          return
        }
        try {
          const state = new State(child, task, this)
          this.results.set(`${name}`, await task.start(state))
        } catch (err) {
          task.actionErrored = true
          this.results.set(`${name}:error`, err)
          debug('Task <%s> execute recover routine', name)
          error('Task <%s> error %O', name, err)
          await task.recover(err)
        }
      })

      // onAfter
      this.queue.add(async child => {
        if (task.actionErrored) {
          return
        }
        try {
          const state = new State(child, task, this)
          this.results.set(
            `${name}:onAfter`,
            await task.executeHooks('onAfter', [state])
          )
        } catch (err) {
          task.hookErrored = true
          this.results.set(`${name}:onAfter:error`, err)
          debug('Task <%s> execute recover routine', name)
          error('Task <%s> error %O', name, err)
          await task.recover(err)
        }
      })
    }
  }
}

module.exports = Pipeline
