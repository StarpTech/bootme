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
    this.error = null

    this.onRollbackHook = () => {}
    this.onTaskEndHook = () => {}
    this.onTaskStartHook = () => {}
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof Pipeline
   */
  hasError(name) {
    return this.results.get(`${name}:error`)
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
  hasResult(name) {
    return !!this.results.get(name)
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof Pipeline
   */
  getResult(name) {
    return this.results.get(name)
  }
  /**
   *
   *
   * @memberof Pipeline
   */
  async rollback(err) {
    this.errored = true
    this.error = err

    for (let task of this.registry.tasks.reverse()) {
      // errors are suppressed so that each task can try to recover
      try {
        await this.onRollbackHook(task)
        await task.rollback(err)
      } catch (err) {
        error(
          `Task <%s:%s> Error during rollback process %O`,
          task.constructor.name,
          task.name,
          err
        )
      }
    }
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Pipeline
   */
  onTaskStart(fn) {
    this.onTaskStartHook = fn
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Pipeline
   */
  onTaskEnd(fn) {
    this.onTaskEndHook = fn
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Pipeline
   */
  onRollback(fn) {
    this.onRollbackHook = fn
  }
  /**
   *
   *
   * @param {any} task
   * @param {any} state
   * @memberof Pipeline
   */
  async executeTask(task, state) {
    // pass share config
    task.config.bootme = this.registry.sharedConfig

    // lazy evaluation of task config
    if (typeof task.config === 'function') {
      let config = await task.config(state)
      config = Object.assign(
        config,
        this.registry.preTaskConfigs.get(task.name, config)
      )
      task.setConfig(config)
    } else {
      task.config = Object.assign(
        task.config,
        this.registry.preTaskConfigs.get(task.name, task.config)
      )
      task.setConfig(task.config)
    }

    task.addHook('onInit', async state => task.init(state))

    await task.executeHooks('onInit', state)
    await task.executeHooks('onBefore', state)

    const result = await task.action(state)
    if (result && typeof task.validateResult === 'function') {
      await task.validateResult(result)
    }

    this.results.set(`${task.name}`, result)

    await task.executeHooks('onAfter', state)
  }
  /**
   *
   *
   * @param {any} state
   * @memberof Pipeline
   */
  async action(state) {
    if (this.errored) {
      return
    }
    const task = state.task

    try {
      const result = await task.start(state)

      if (result && typeof task.validateResult === 'function') {
        await task.validateResult(result)
      }

      this.results.set(`${task.name}`, result)
    } catch (err) {
      error(
        'Task <%s:%s> action error %O',
        task.constructor.name,
        task.name,
        err
      )
      throw err
    }
  }
  /**
   *
   *
   * @param {any} state
   * @memberof Pipeline
   */
  async onBefore(state) {
    if (this.errored) {
      return
    }
    const task = state.task

    try {
      await task.executeHooks('onBefore', state)
    } catch (err) {
      error(
        'Task <%s:%s> onBefore error %O',
        task.constructor.name,
        task.name,
        err
      )
      throw err
    }
  }
  /**
   *
   *
   * @param {any} state
   * @memberof Pipeline
   */
  async onInit(state) {
    const task = state.task
    try {
      // lazy evaluation of task config
      if (typeof task.config === 'function') {
        const config = await task.config(state)
        task.setConfig(config)
      } else {
        task.setConfig(task.config)
      }

      await task.executeHooks('onInit', state)
    } catch (err) {
      error(
        'Task <%s:%s> onInit error %O',
        task.constructor.name,
        task.name,
        err
      )
      throw err
    }
  }
  /**
   *
   *
   * @param {any} state
   * @memberof Pipeline
   */
  async onAfter(state) {
    if (this.errored) {
      return
    }
    const task = state.task

    try {
      await task.executeHooks('onAfter', state)
    } catch (err) {
      error(
        'Task <%s:%s> onAfter error %O',
        task.constructor.name,
        task.name,
        err
      )
      throw err
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
        error('Abort Pipeline error %O', this.error)
        break
      }

      this.queue.add(async child => {
        let state = new State(child, task, this)

        try {
          await this.onTaskStartHook(state)
          await this.onInit(state)
          await this.onBefore(state)
          await this.action(state)
          await this.onAfter(state)
          await this.onTaskEndHook(state)
        } catch (err) {
          error('Task error %O', err)
          this.results.set(`${task.name}:error`, err)
          await this.rollback(err)
          await this.onTaskEndHook(state)
        }
      })
    }
  }
}

module.exports = Pipeline
