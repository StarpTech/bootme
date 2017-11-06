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
  constructor(name) {
    if (!name) {
      throw new Error(`Task name is required`)
    }

    if (typeof name !== 'string') {
      throw new TypeError(`Name must be a string`)
    }

    this.name = name
    this.onAfter = []
    this.onBefore = []
    this.onError = []
    this.onInit = []
    this.config = {}

    return this
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

      if (result.error) {
        error(`Invalid config schema. Task "${this.name}"`)
        throw result.error
      }

      this.config = result.value
    }

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
      throw new TypeError(
        `Action handler must be a function. Task "${this.name}"`
      )
    }

    this.action = fn

    return this
  }
  /**
   *
   *
   * @param {any} name
   * @param {any} fn
   * @memberof Task
   */
  addHook(name, fn) {
    if (typeof fn !== 'function' && !(fn instanceof Task)) {
      throw new TypeError(
        `Hook handler of must be a function or Task instance. Task "${this
          .name}"`
      )
    }

    if (supportedHooks.indexOf(name) === -1) {
      throw new Error(`Hook not supported! Task "${this.name}"`)
    }

    this[name].push(fn)

    return this
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
   * @param {any} state
   * @memberof Task
   */
  async executeHooks(name, state) {
    if (supportedHooks.indexOf(name) === -1) {
      throw new Error(`${name} hook not supported!`)
    }

    debug(`Task <${this.name}> execute ${name} hooks`)

    for (let hook of this[name]) {
      // allow passing tasks as hook handlers
      if (hook instanceof Task) {
        await state.pipeline.bootSubTask(hook, state)
      } else {
        await hook.call(this, state)
      }
    }
  }
  /**
   *
   *
   * @param {any} err
   * @memberof Task
   */
  async rollback(err) {
    debug(`Task <${this.name}> execute rollback routines`)

    for (let hook of this.onError) {
      await hook(err)
    }
  }
}

module.exports = Task
