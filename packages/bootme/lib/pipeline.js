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

    this.onRollbackHooks = []
    this.onTaskEndHooks = []
    this.onTaskStartHooks = []
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
        for (let hook of this.onRollbackHooks) {
          await hook(task)
        }
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
    this.onTaskStartHooks.push(fn)
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Pipeline
   */
  onTaskEnd(fn) {
    this.onTaskEndHooks.push(fn)
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Pipeline
   */
  onRollback(fn) {
    this.onRollbackHooks.push(fn)
  }
  /**
   *
   *
   * @param {any} task
   * @param {any} state
   * @memberof Pipeline
   */
  async executeTask(task, state) {
    for (let hook of this.onTaskStartHooks) {
      await hook(state)
    }

    task.config.bootme = this.registry.sharedConfig
    await this.loadConfig(state)
    task.addHook('onInit', async state => task.init(state))

    await task.executeHooks('onInit', state)
    await task.executeHooks('onBefore', state)

    const result = await task.action(state)
    if (result && typeof task.validateResult === 'function') {
      await task.validateResult(result)
    }

    this.results.set(`${task.name}`, result)

    await task.executeHooks('onAfter', state)

    for (let hook of this.onTaskEndHooks) {
      await hook(state)
    }
  }
  /**
   *
   *
   * @param {any} state
   * @memberof Pipeline
   */
  async loadConfig(state) {
    const task = state.task

    if (typeof task.config === 'function') {
      let config = await task.config(state)
      config = Object.assign(
        config,
        this.registry.preTaskConfigs.get(task.name)
      )
      task.setConfig(config)
    } else {
      task.config = Object.assign(
        task.config,
        this.registry.preTaskConfigs.get(task.name)
      )
      task.setConfig(task.config)
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
        try {
          let state = new State(child, task, this)
          await this.executeTask(task, state)
        } catch (err) {
          error('Task error %O', err)
          this.results.set(`${task.name}:error`, err)
          await this.rollback(err)
        }
      })
    }
  }
}

module.exports = Pipeline
