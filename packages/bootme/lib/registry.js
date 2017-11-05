'use strict'

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
   * @param {any} task
   * @memberof Registry
   */
  addTask(task) {
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
      task[hookName].push(fn)
    }
  }
}

module.exports = Registry
