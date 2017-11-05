'use strict'

const supportedHooks = ['onBefore', 'onAfter', 'onFailure']

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
    this.config = {}
  }
  /**
   *
   *
   * @param {any} config
   * @returns
   * @memberof Task
   */
  setConfig(config) {
    if (typeof config !== 'object') {
      throw new TypeError('The Config must be an Object')
    }

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
    if (typeof name !== 'string') {
      throw new TypeError('The Task name must be a string')
    }

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
    if (typeof fn !== 'function') {
      throw new TypeError('The action handler must be a function')
    }

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
    if (typeof fn !== 'function') {
      throw new TypeError('The hook handler must be a function')
    }

    if (supportedHooks.indexOf(name) === -1) {
      throw new Error(`${name} hook not supported!`)
    }

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
  async executeHooks(name, args) {
    if (supportedHooks.indexOf(name) === -1) {
      throw new Error(`${name} hook not supported!`)
    }

    for (let hook of this[name]) {
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
