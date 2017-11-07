'use strict'

const tempy = require('tempy')
const Task = require('bootme').Task
const Joi = require('joi')

/**
 *
 *
 * @class TempTask
 * @extends {Task}
 */
class TempTask extends Task {
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof TempTask
   */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        type: Joi.string()
          .lowercase()
          .allow(['directory', 'file'])
          .required(),
        options: Joi.object().keys({
          name: Joi.string(),
          extension: Joi.string().lowercase()
        })
      })
      .validate(value)
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof TempTask
   */
  async validateResult(value) {
    return Joi.validate(value, Joi.string().required())
  }
  /**
   *
   *
   * @returns
   * @memberof TempTask
   */
  async action() {
    return tempy[this.config.type](this.config.options)
  }
}

module.exports = TempTask
