'use strict'

class Task {
  constructor() {
    this.onAfter = []
    this.onBefore = []
    this.onFailure = []
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
  async start() {
    for (let hook of this.onBefore) {
      await hook()
    }

    const result = await this.action()

    for (let hook of this.onAfter) {
      await hook()
    }

    return result
  }
  async recover() {
    for (let hook of this.onFailure) {
      await hook()
    }
  }
}

module.exports = Task
