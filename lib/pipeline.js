'use strict'
const q = require('workq')

class Pipeline {
  constructor(registry) {
    this.registry = registry
    this.queue = q()
  }
  async execute(task) {
    for (let [name, task] of this.registry.tasks) {
      try {
        this.queue.add(async child => task.executeHooks('onBefore', [child]))
        this.queue.add(async child => task.start(child))
        this.queue.add(async child => task.executeHooks('onAfter', [child]))
      } catch (err) {
        await task.recover()
      }
    }
  }
}

module.exports = Pipeline
