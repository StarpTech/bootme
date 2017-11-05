'use strict'

class Task {
  constructor() {
    this.afterHooks = []
    this.beforeHooks = []
  }
  setName(name) {
    this.name = name
    return this
  }
  action(fn) {
    this.action = fn
  }
  after(fn) {
    this.afterHooks.push(fn)
  }
  before(fn) {
    this.beforeHooks.push(fn)
  }
  recover(fn) {
    this.restore = fn
  }
  async start() {
    for (let hook of this.beforeHooks) {
      const result = await hook()
    }
  }
}

module.exports = Task
