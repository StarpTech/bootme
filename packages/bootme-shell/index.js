'use strict'

const Joi = require('joi')
const Shelljs = require('shelljs')
const Task = require('bootme').Task

/**
 *
 *
 * @class TaskShell
 * @extends {Task}
 */
class TaskShell extends Task {
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof TaskShell
   */
  async validateConfig(value) {
    return Joi.validate(
      value,
      Joi.object().keys({
        bootme: Joi.object(),
        refs: Joi.object(),
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
    )
  }
  /**
   *
   *
   * @returns
   * @memberof TaskShell
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
