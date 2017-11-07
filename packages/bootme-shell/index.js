'use strict'

const Joi = require('joi')
const Shelljs = require('shelljs')
const Task = require('bootme').Task

/**
 *
 *
 * @class GitcloneTask
 * @extends {Task}
 */
class TaskShell extends Task {
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
        cmd: Joi.string()
          .allow([
            'rm',
            'cp',
            'cd',
            'grep',
            'chmod',
            'dirs',
            'echo',
            'exec',
            'find',
            'head',
            'ls',
            'mv',
            'mkdir',
            'set',
            'sed',
            'sort',
            'tail',
            'test',
            'touch',
            'which'
          ])
          .required(),
        args: Joi.array()
          .items(Joi.string(), Joi.number(), Joi.object())
          .optional()
      })
      .validate(value)
  }
  /**
   *
   *
   * @returns
   * @memberof GitcloneTask
   */
  async action() {
    const cmd = Shelljs[this.config.cmd].apply(Shelljs, this.config.args)

    if (cmd.code !== 0) {
      throw new Error(
        `Shell command "${this.config.cmd}" returned with none zero code`
      )
    }

    return cmd
  }
}

module.exports = TaskShell
