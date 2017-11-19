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
    this.initialized = false

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
  async validateConfig(value) {
    return value
  }
  /**
   *
   *
   * @memberof Task
   */
  async action() {}
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

      if (result && typeof result.then === 'function') {
        return result.then(c => {
          this.config = Object.assign(c, this.config)
        })
      } else if (typeof result === 'object') {
        this.config = Object.assign(result, config, this.config)
      } else {
        throw new Error('Respond with an invalid config construct')
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
  setAction(fn) {
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
   * @param {any} fn
   * @memberof Task
   */
  setInit(fn) {
    if (typeof fn !== 'function' && !(fn instanceof Task)) {
      throw new TypeError(
        `Task <${this.constructor.name}:${this
          .name}> Init handler must be a function or Task instance`
      )
    }

    this.init = fn

    return this
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Task
   */
  setRollback(fn) {
    if (typeof fn !== 'function' && !(fn instanceof Task)) {
      throw new TypeError(
        `Task <${this.constructor.name}:${this
          .name}> Rollback handler must be a function or Task instance`
      )
    }

    this.rollback = fn

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
          .name}> Hook handler must be a function or Task instance`
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
   * @param {any} hookName
   * @param {any} state
   * @memberof Task
   */
  async executeHooks(name, state) {
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
      // allow passing tasks as hook handlers
      if (hook instanceof Task) {
        await state.addTask(hook, state)
      } else {
        await hook.call(this, state)
      }
    }
  }
}

module.exports = Task
