'use strict'

const debug = require('debug')('task')
const error = require('debug')('task:error')

const supportedHooks = ['onBefore', 'onAfter', 'onError', 'onInit']

/**
 *
 *
 * @class Task
 */
class Task {
  constructor() {
    this.onAfter = []
    this.onBefore = []
    this.onError = []
    this.onInit = []
    this.actionErrored = false
    this.hookErrored = false
    this.initErrored = false
    this.config = {}
  }
  /**
   *
   *
   * @memberof Task
   */
  async validateResult() {}
  /**
   *
   *
   * @memberof Task
   */
  validateConfig() {}
  /**
   *
   *
   * @memberof Task
   */
  async init() {}
  /**
   *
   *
   * @param {any} config
   * @returns
   * @memberof Task
   */
  setConfig(config) {
    if (typeof config === 'function') {
      this.config = config
    } else {
      const result = this.validateConfig(config)
      if (result) {
        if (result.error) {
          error(`Invalid config schema. Task ${this.name}`)
          throw result.error
        }

        this.config = result.value
      } else {
        this.config = config
      }
    }

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
      throw new TypeError(`Name must be a string. Task "${this.name}"`)
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
      throw new TypeError(`Action handler must be a function. Task "${this.name}"`)
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
      throw new TypeError(`Hook handler of must be a function. Task "${this.name}"`)
    }

    if (supportedHooks.indexOf(name) === -1) {
      throw new Error(`Hook not supported! Task "${this.name}"`)
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
    if (typeof this.action !== 'function') {
      throw new TypeError(`Action must be a function. Task "${this.name}"`)
    }

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

    debug(`Task <${this.name}> execute ${name} hooks`)

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
    debug(`Task <${this.name}> execute recover routines`)

    for (let hook of this.onError) {
      await hook(err)
    }
  }
}

module.exports = Task
