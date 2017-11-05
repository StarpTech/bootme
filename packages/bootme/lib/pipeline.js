'use strict'

const q = require('workq')

class Pipeline {
  constructor(registry) {
    this.registry = registry
    this.queue = q()
  }
  async execute(task) {
    for (let [name, task] of this.registry.tasks) {
      this.queue.add(async child => task.executeHooks('onBefore', [child]))
      this.queue.add(async child => {
        try {
          await task.start(new Parent(child, task))
        } catch (err) {
          await task.recover(err)
        }
      })
      this.queue.add(async child => task.executeHooks('onAfter', [child]))
    }
  }
}

class Parent {
  constructor(queue, parentTask) {
    this.queue = queue
    this.parentTask = parentTask
  }
  addJob(fn) {
    this.queue.add(async child => {
      try {
        await fn(new Parent(child, this.parentTask))
      } catch (err) {
        await this.parentTask.recover(err)
      }
    })
  }
}

module.exports = Pipeline
