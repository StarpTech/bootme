'use strict'

const debug = require('debug')('bootme:task')
const error = require('debug')('bootme:task:error')

const supportedHooks = ['onBefore', 'onAfter', 'onRollback', 'onInit']

/**
 *
 *
 * @class Task
 */
class Task {
  constructor(name, info) {
    if (!name) {
      throw new Error(`Task name is required`)
    }

    if (typeof name !== 'string') {
      throw new TypeError(`Name must be a string`)
    }

    if (info && typeof info !== 'string') {
      throw new TypeError(`Info must be a string`)
    }

    this.name = name
    this.info = info
    this.onAfter = []
    this.onBefore = []
    this.onRollback = []
    this.onInit = []
    this.config = {}
    this.deps = []
    this.run = false

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
  validateConfig(value) {
    return value
  }
  /**
   *
   *
   * @memberof Task
   */
  async init() {}
  /**
   *
   *
   * @memberof Task
   */
  async rollback() {}
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
          error(
            `Task <${this.constructor.name}:${this
              .name}> Invalid config schema. Error: %O`,
            result.error
          )
          throw new Error(
            `Task <${this.constructor.name}:${this
              .name}> has an innvalid config schema. ${result.error.message}`
          )
        } else if (result.value) {
          this.config = result.value
        } else if (config) {
          this.config = config
        }
      }
    }

    this.setRefs()

    return this
  }
  /**
   *
   *
   * @memberof Task
   */
  setRefs() {
    for (var key in this.config.refs) {
      const taskName = this.config.refs[key]
      if (taskName) {
        this.deps.push(taskName)
      }
    }
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
        `Task <${this.constructor.name}:${this
          .name}> Action handler must be a function`
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
        `Task <${this.constructor.name}:${this
          .name}> Hook handler of must be a function or Task instance`
      )
    }

    if (supportedHooks.indexOf(name) === -1) {
      throw new TypeError(
        `Task <${this.constructor.name}:${this
          .name}> Hook "${name}" not supported!`
      )
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
      throw new TypeError(
        `Task <${this.constructor.name}:${this
          .name}> Action must be a function. Actual ${typeof this.action}`
      )
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
      throw new Error(
        `Task <${this.constructor.name}:${this
          .name}> Hook "${name}" not supported!`
      )
    }

    debug(
      `Task <${this.constructor.name}:${this.name}> execute "${name}" hooks`
    )

    for (let hook of this[name]) {
      // allow passing tasks as hook handlers
      if (hook instanceof Task) {
        await state.addTask(hook, state)
      } else {
        await hook.call(this, state)
      }
    }
  }
  /**
 *
 *
 * @param {any} state
 * @memberof Task
 */
  async executeRollback(state) {
    debug(
      `Task <${this.constructor.name}:${this.name}> execute rollback routines`
    )

    for (let hook of this.onRollback) {
      await hook.call(this, state)
    }
  }
}

module.exports = Task
