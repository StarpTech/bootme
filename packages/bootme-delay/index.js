'use strict'

const Task = require('bootme').Task
const Joi = require('joi')

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
    return new Promise(resolve => {
      setTimeout(() => resolve(), this.config.value).unref()
    })
  }
}

module.exports = DelayTask
