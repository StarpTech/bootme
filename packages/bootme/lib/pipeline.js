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
  async get(name) {
    if (Array.isArray(name)) {
      let results = new Map()
      for (let task of name) {
        results.set(name, await this.results.get(task))
      }
      return results
    } else {
      return this.results.get(name)
    }
  }
  /**
   *
   *
   * @param {any} task
   * @memberof Pipeline
   */
  async execute() {
    for (let task of this.registry.tasks) {
      // lazy evaluation
      if (typeof task.config === 'function') {
        task.config = task.config()
      }
      // onInit
      this.queue.add(async child => {
        try {
          const state = new State(child, task, this)
          this.results.set(
            `${task.name}:onInit`,
            await task.executeHooks('onInit', [state])
          )
        } catch (err) {
          task.hookErrored = true
          this.results.set(`${task.name}:onInit:error`, err)
          error('Task <%s> error %O', task.name, err)
          await task.recover(err)
        }
      })

      // onBefore
      this.queue.add(async child => {
        if (task.hookErrored) {
          return
        }
        try {
          const state = new State(child, task, this)
          this.results.set(
            `${task.name}:onBefore`,
            await task.executeHooks('onBefore', [state])
          )
        } catch (err) {
          task.hookErrored = true
          this.results.set(`${task.name}:onBefore:error`, err)
          error('Task <%s> error %O', task.name, err)
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
          this.results.set(`${task.name}`, await task.start(state))
        } catch (err) {
          task.actionErrored = true
          this.results.set(`${task.name}:error`, err)
          error('Task <%s> error %O', task.name, err)
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
            `${task.name}:onAfter`,
            await task.executeHooks('onAfter', [state])
          )
        } catch (err) {
          task.hookErrored = true
          this.results.set(`${task.name}:onAfter:error`, err)
          error('Task <%s> error %O', task.name, err)
          await task.recover(err)
        }
      })
    }
  }
}

module.exports = Pipeline
