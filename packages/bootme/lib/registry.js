'use strict'

const Task = require('./task')

const supportedHooks = ['onTaskStart', 'onTaskEnd']

/**
 *
 *
 * @class Registry
 */
class Registry {
  /**
   * Creates an instance of Registry.
   * @memberof Registry
   */
  constructor() {
    this.tasks = []
    this.preTaskConfigs = new Map()
    this.onTaskStart = []
    this.onTaskEnd = []
    this.sharedConfig = {
      basePath: process.cwd()
    }
  }
  /**
   *
   *
   * @param {any} cfg
   * @memberof Registry
   */
  shareConfig(cfg) {
    if (typeof cfg !== 'object') {
      throw new TypeError('The Config must be an Object')
    }

    this.sharedConfig = Object.assign(this.sharedConfig, cfg)
  }
  /**
   *
   *
   * @param {any} taskName
   * @param {any} value
   * @memberof Registry
   */
  setConfig(taskName, value) {
    this.preTaskConfigs.set(taskName, value)
  }
  /**
   *
   *
   * @param {any} name
   * @memberof Registry
   */
  setRef(taskName, key, value) {
    const task = this.tasks.find(t => t.name === taskName)

    if (!task) {
      throw new Error(`The Task "${taskName}" does not exists`)
    }

    if (task.config.refs) {
      task.config.refs[key] = value
    } else {
      task.config.refs = { [key]: value }
    }
  }
  /**
   *
   *
   * @param {any} task
   * @memberof Registry
   */
  addTask(task) {
    if (!(task instanceof Task)) {
      throw new TypeError('The Task must be a Task instance')
    }
    const t = this.tasks.find(t => t.name === task.name)

    if (t) {
      throw new Error(
        `The Task <${t.constructor.name}:${t.name}> already exists`
      )
    }

    task.addHook('onInit', async state => task.init(state))
    task.config.bootme = this.sharedConfig

    this.tasks.push(task)

    return task
  }
  /**
   *
   *
   * @param {any} taskName
   * @param {any} hookName
   * @param {any} fn
   * @memberof Registry
   */
  addHook(taskName, hookName, fn) {
    // addHook('task:start', fn)
    if (
      typeof hookName === 'function' &&
      supportedHooks.indexOf(taskName) !== -1
    ) {
      this[taskName].push(hookName)
      return
    }

    // addHook('name', 'onBefore', fn)
    const task = this.tasks.find(t => t.name === taskName)

    if (task) {
      task.addHook(hookName, fn)
    } else {
      throw new Error(`Task "${taskName}" could not be found`)
    }
  }
}

module.exports = Registry
