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
  constructor() {
    super()
    this.git = SimpleGit()
  }
  /**
   *
   *
   * @readonly
   * @memberof GitcloneTask
   */
  get configSchema() {
    return Joi.object().keys({
      path: Joi.string().required(),
      url: Joi.string()
        .uri()
        .required()
    })
  }
  /**
   *
   *
   * @memberof GitcloneTask
   */
  async init() {
    this.path = Path.join(this.config.bootme.basePath, this.config.path)
    this.addHook('onError', async () => del([this.path]))
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
