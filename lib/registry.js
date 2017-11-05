'use strict'

class Registry {
  constructor() {
    this.tasks = new Map()
  }
  addTask(task) {
    this.tasks.set(task.name, task)
  }
  addAfterHook(taskName, fn) {
    const task = this.tasks.get(taskName)

    if (task) {
      task.after(fn)
    }
  }
  addBeforeHook(taskName, fn) {
    const task = this.tasks.get(taskName)

    if (task) {
      task.before(fn)
    }
  }
}

module.exports = Registry
