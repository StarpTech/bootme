'use strict'

const Task = require('bootme').Task
const Joi = require('joi')
const Gulp = require('gulp')
const Mustache = require('gulp-mustache')

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
    this.path = await state.getValue(this.config.refs.url)
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof TemplateTask
   */
  async validateConfig(value) {
    return Joi.validate(
      value,
      Joi.object().keys({
        bootme: Joi.object(),
        url: Joi.string().optional(),
        templateData: Joi.object().required(),
        refs: Joi.object()
          .keys({
            url: Joi.string().required()
          })
          .required(),
        files: Joi.array()
          .items(Joi.string())
          .required()
      })
    )
  }
  /**
   *
   *
   * @returns
   * @memberof TemplateTask
   */
  async action() {
    return new Promise((resolve, reject) => {
      Gulp.src(this.config.files, { cwd: this.path })
        .pipe(Mustache(this.config.templateData))
        .pipe(Gulp.dest(this.path))
        .on('error', reject)
        .on('end', resolve)
    })
  }
}

module.exports = TemplateTask
