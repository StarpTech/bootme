'use strict'

/**
 *
 *
 * @class Task
 */
class Task {
  constructor() {
    this.onAfter = []
    this.onBefore = []
    this.onFailure = []
    this.actionErrored = false
    this.hookErrored = false
  }
  /**
   *
   *
   * @param {any} config
   * @returns
   * @memberof Task
   */
  setConfig(config) {
    this.config = config
    return this
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof Task
   */
  setName(name) {
    this.name = name
    return this
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Task
   */
  action(fn) {
    this.action = fn
  }
  /**
   *
   *
   * @param {any} name
   * @param {any} fn
   * @memberof Task
   */
  addHook(name, fn) {
    this[name].push(fn)
  }
  /**
   *
   *
   * @param {any} queue
   * @returns
   * @memberof Task
   */
  async start(queue) {
    const result = await this.action(queue)

    return result
  }
  /**
   *
   *
   * @param {any} hookName
   * @param {any} args
   * @memberof Task
   */
  async executeHooks(hookName, args) {
    for (let hook of this[hookName]) {
      await hook.apply(this, args)
    }
  }
  /**
   *
   *
   * @param {any} err
   * @memberof Task
   */
  async recover(err) {
    for (let hook of this.onFailure) {
      await hook(err)
    }
  }
}

module.exports = Task
