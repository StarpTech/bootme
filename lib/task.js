'use strict'

class Task {
  constructor() {
    this.onAfter = []
    this.onBefore = []
    this.onFailure = []
  }
  setConfig(config) {
    this.config = config
    return this
  }
  setName(name) {
    this.name = name
    return this
  }
  action(fn) {
    this.action = fn
  }
  addHook(name, fn) {
    this[name].push(fn)
  }
  async start(queue) {
    const result = await this.action(queue)

    return result
  }
  async executeHooks(hookName, args) {
    for (let hook of this[hookName]) {
      await hook.apply(this, args)
    }
  }
  async recover(err) {
    for (let hook of this.onFailure) {
      await hook(err)
    }
  }
}

module.exports = Task
