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
  /**
   *
   *
   * @memberof DelayTask
   */
  async rollback() {
    if (this.delay) {
      this.delay.cancel()
    }
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof DelayTask
   */
  async validateConfig(value) {
    return Joi.validate(
      value,
      Joi.object().keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        value: Joi.number().default(1000)
      })
    )
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
