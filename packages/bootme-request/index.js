'use strict'

const r2 = require('r2')
const Task = require('bootme').Task
const Joi = require('joi')

/**
 *
 *
 * @class HttpRequestTask
 * @extends {Task}
 */
class HttpRequestTask extends Task {
  /**
 *
 *
 * @readonly
 * @memberof HttpRequestTask
 */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        method: Joi.string()
          .lowercase()
          .allow(['get', 'post', 'put', 'delete'])
          .default('get'),
        contentType: Joi.string()
          .lowercase()
          .allow(['text', 'json', 'response'])
          .default('json'),
        url: Joi.string()
          .uri()
          .required(),
        options: Joi.object()
          .keys({
            headers: Joi.object()
          })
          .optional()
      })
      .validate(value)
  }
  /**
   *
   *
   * @param {any} result
   * @memberof HttpRequestTask
   */
  async validateResult(value) {
    switch (this.config.contentType) {
      case 'text':
        return Joi.validate(value, Joi.string().required())
      case 'json':
        return Joi.validate(
          value,
          Joi.any()
            .allow(Joi.object(), Joi.array())
            .required()
        )
      case 'response':
        return Joi.validate(value, Joi.object().required())
      default:
        break
    }
  }
  /**
   *
   *
   * @returns
   * @memberof HttpRequestTask
   */
  async action() {
    const result = await r2[this.config.method.toLowerCase()](
      this.config.url,
      this.config.options
    )
    return result[this.config.contentType]
  }
}

module.exports = HttpRequestTask
