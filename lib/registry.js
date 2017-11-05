'use strict'

class Registry {
  constructor() {
    this.tasks = {}
  }
  addTask(task) {
    this.tasks[task.name] = task
  }
}

module.exports = Registry
