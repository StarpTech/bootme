'use strict'

class Registry {
  constructor() {
    this.tasks = new Map()
  }
  addTask(task) {
    this.tasks.set(task.name, task)
  }
  addHook(taskName, hookName, fn) {
    const task = this.tasks.get(taskName)

    if (task) {
      task[hookName].push(fn)
    }
  }
}

module.exports = Registry
