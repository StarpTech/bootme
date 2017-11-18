'use strict'

const q = require('workq')
const debug = require('debug')('bootme:pipeline')
const error = require('debug')('bootme:pipeline:error')
const State = require('./state')
const Task = require('./task')
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
    this.rollbacking = false
    this.restoring = false
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
  get(name) {
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
  async rollback() {
    if (this.rollbacking) {
      debug(`Rollback already in progress`)
      return
    }

    this.rollbacking = true

    for (let task of this.registry.tasks.filter(x => x.initialized).reverse()) {
      // errors are swallowed so that each task can try to recover
      try {
        let state = new State(this.queue, task, this)
        for (let hook of this.onRollbackHooks) {
          if (hook instanceof Task) {
            await state.addTask(hook, state)
          } else {
            await hook.call(task, state)
          }
        }
        await task.executeRollback(state)
      } catch (err) {
        error(
          `Task <%s:%s> Error during rollback process %O`,
          task.constructor.name,
          task.name,
          err
        )
      }
    }

    this.rollbacking = false
  }
  /**
   *
   *
   * @memberof Pipeline
   */
  async restore() {
    if (this.restoring) {
      debug(`Restore already in progress`)
      return
    }

    this.restoring = true

    for (let task of this.registry.tasks) {
      try {
        let state = new State(this.queue, task, this)
        for (let hook of this.onTaskStartHooks) {
          await hook.call(task, state)
        }

        await this.initializeTask(task, state)

        for (let hook of this.onTaskEndHooks) {
          await hook.call(task, state)
        }
      } catch (err) {
        error('Task error during restore %O', err)
      }
    }

    debug(`Starting rollback after restore`)
    await this.rollback()

    this.restoring = false
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
  async initializeTask(task, state) {
    task.config.bootme = this.registry.sharedConfig
    await this.loadConfig(state)

    task.addHook('onInit', task.init)
    task.addHook('onRollback', task.rollback)

    await task.executeHooks('onInit', state)
    // mark task as initialized so it can be filtered for rollback and restore
    task.initialized = true
  }
  /**
   *
   *
   * @param {any} task
   * @param {any} state
   * @memberof Pipeline
   */
  async executeTask(task, state) {
    // execute task only when we are in rollback mode or no error was occured
    if (this.error && !this.rollbacking) {
      debug(`Abort task due to pipeline error`)
      return
    }

    for (let hook of this.onTaskStartHooks) {
      await hook.call(task, state)
    }

    await task.executeHooks('onBefore', state)

    await this.initializeTask(task, state)

    const result = await task.action(state)
    // mark task as initialized so it can be filtered for rollback and restore
    task.run = true
    if (result && typeof task.validateResult === 'function') {
      await task.validateResult(result)
    }

    this.results.set(`${task.name}`, result)

    await task.executeHooks('onAfter', state)

    for (let hook of this.onTaskEndHooks) {
      await hook.call(task, state)
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
  execute() {
    for (let task of this.registry.tasks) {
      if (this.error) {
        error('Abort task due to pipeline error %O', this.error)
        break
      }

      this.queue.add(async child => {
        let state
        try {
          state = new State(child, task, this)
          await this.executeTask(task, state)
        } catch (err) {
          error('Task error %O', err)
          this.error = err
          this.results.set(`${task.name}:error`, err)
          await this.rollback()
        }
      })
    }
  }
}

module.exports = Pipeline
