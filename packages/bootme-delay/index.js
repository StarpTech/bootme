'use strict'

const Task = require('bootme').Task
const Joi = require('joi')
const Delay = require('delay')

/**
 *
 *
 * @class DelayTask
 * @extends {Task}
 */
class DelayTask extends Task {
  init(state) {
    this.addHook('onError', () => {
      if (this.delay) {
        this.delay.cancel()
      }
    })
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof DelayTask
   */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        value: Joi.number().default(1000)
      })
      .validate(value)
  }
  /**
 *
 *
 * @returns
 * @memberof DelayTask
 */
  async action() {
    this.delay = Delay(this.config.value)
    return this.delay
  }
}

module.exports = DelayTask
