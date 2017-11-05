'use strict'

class Pipeline {
  constructor(registry) {
    this.registry = registry
  }
  async execute(task) {
    for (let [name, task] of this.registry.tasks) {
      try {
        await task.start()
      } catch (err) {
        await task.recover()
      }
    }
  }
}

module.exports = Pipeline
