'use strict'

const SimpleGit = require('simple-git/promise')
const Path = require('path')
const del = require('del')
const Joi = require('joi')
const Task = require('bootme').Task

/**
 *
 *
 * @class GitcloneTask
 * @extends {Task}
 */
class GitcloneTask extends Task {
  /**
   * Creates an instance of GitcloneTask.
   * @memberof GitcloneTask
   */
  constructor(name) {
    super(name)
    this.git = SimpleGit()
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof GitcloneTask
   */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        path: Joi.string().required(),
        url: Joi.string()
          .uri()
          .required()
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
    return Joi.validate(value, Joi.string().required())
  }
  /**
   *
   *
   * @memberof GitcloneTask
   */
  async init() {
    this.path = Path.join(this.config.bootme.basePath, this.config.path)
    this.addHook('onRollback', async () => del([this.path]))
  }
  /**
   *
   *
   * @returns
   * @memberof GitcloneTask
   */
  async action() {
    await this.git.silent(true).clone(this.config.url, this.path)
    return this.path
  }
}

module.exports = GitcloneTask
