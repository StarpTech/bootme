'use strict'

const Task = require('./task')

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
    this.tasks = new Map()
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

    this.sharedConfig = cfg
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

    this.tasks.set(task.name, task)
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
    const task = this.tasks.get(taskName)

    if (task) {
      task.addHook(hookName, fn)
    } else {
      throw new Error(`Task ${taskName} could not be found`)
    }
  }
}

module.exports = Registry
