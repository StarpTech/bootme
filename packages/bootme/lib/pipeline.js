'use strict'

const q = require('workq')
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
    this.errored = false
    this.pipeError = null
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof Pipeline
   */
  hasError(name) {
    return (
      this.results.get(`${name}:error`) ||
      this.results.get(`${name}:onBefore:error`) ||
      this.results.get(`${name}:onAfter:error`) ||
      this.results.get(`${name}:onInit:error`)
    )
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
        results.set(task, this.getResult(task))
      }
      return results
    } else {
      return this.getResult(name)
    }
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof Pipeline
   */
  getResult(name) {
    const res = this.results.get(name)

    if (res === undefined) {
      throw new Error(`Task result "${name}" not available`)
    }

    return res
  }
  /**
   *
   *
   * @memberof Pipeline
   */
  async rollback(err) {
    this.errored = true
    this.pipeError = err

    for (let task of this.registry.tasks) {
      try {
        await task.recover(err)
      } catch (err) {
        error(`Error during recover process %O`, err)
      }
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
      if (this.errored) {
        error('Abort Pipeline cause Task error %O', this.pipeError)
        break
      }

      // lazy evaluation of task config
      if (typeof task.config === 'function') {
        const config = await task.config()
        task.setConfig(config)
      }

      // onInit
      this.queue.add(async child => {
        try {
          const state = new State(child, task, this)
          await task.executeHooks('onInit', [state])
        } catch (err) {
          error('Task <%s> onInit error %O', task.name, err)
          this.results.set(`${task.name}:onInit:error`, err)
          await this.rollback(err)
        }
      })

      // onBefore
      this.queue.add(async child => {
        if (this.errored) {
          return
        }
        try {
          const state = new State(child, task, this)
          await task.executeHooks('onBefore', [state])
        } catch (err) {
          error('Task <%s> onBefore error %O', task.name, err)
          this.results.set(`${task.name}:onBefore:error`, err)
          await this.rollback(err)
        }
      })

      // action
      this.queue.add(async child => {
        if (this.errored) {
          return
        }
        try {
          const state = new State(child, task, this)
          const result = await task.start(state)

          if (result && typeof task.validateResult === 'function') {
            await task.validateResult(result)
          }

          this.results.set(`${task.name}`, result)
        } catch (err) {
          error('Task <%s> action error %O', task.name, err)
          this.results.set(`${task.name}:error`, err)
          await this.rollback(err)
        }
      })

      // onAfter
      this.queue.add(async child => {
        if (this.errored) {
          return
        }
        try {
          const state = new State(child, task, this)
          await task.executeHooks('onAfter', [state])
        } catch (err) {
          error('Task <%s> onAfter error %O', task.name, err)
          this.results.set(`${task.name}:onAfter:error`, err)
          await this.rollback(err)
        }
      })
    }
  }
}

module.exports = Pipeline
