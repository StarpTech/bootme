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
  get configSchema() {
    return Joi.object().keys({
      method: Joi.string()
        .lowercase()
        .allow(['get', 'post', 'put', 'delete'])
        .required(),
      url: Joi.string()
        .uri()
        .required(),
      options: Joi.object().keys({
        headers: Joi.object()
      }).optional()
    })
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
    return result
  }
}

module.exports = HttpRequestTask
