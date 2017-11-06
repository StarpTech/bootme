'use strict'

const Task = require('bootme').Task
const Joi = require('joi')

/**
 *
 *
 * @class TemplateTask
 * @extends {Task}
 */
class TemplateTask extends Task {
  /**
   *
   *
   * @param {any} state
   * @memberof TemplateTask
   */
  async init(state) {
    const results = await state.pipeline.get(this.config.deps)
    console.log(results)
  }
  async action() {}
}

module.exports = TemplateTask
