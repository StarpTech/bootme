'use strict'

const Fs = require('fs')
const Path = require('path')
const Task = require('bootme').Task
const Joi = require('joi')

/**
 *
 *
 * @class GitHookTask
 * @extends {Task}
 */
class GitHookTask extends Task {
  async init() {
    this.addHook('onError', async () =>
      this.unlink(this.config.bootme.basePath, this.config.hookDir)
    )
  }
  /**
   *
   *
   * @readonly
   * @memberof GitHookTask
   */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        cmd: Joi.string()
          .allow(['link', 'unlink'])
          .default('link'),
        hookDir: Joi.string().default('git_hooks'),
        hooks: Joi.array()
          .items(
            Joi.string()
              .allow([
                'applypatch-msg',
                'commit-msg',
                'post-commit',
                'post-receive',
                'post-update',
                'pre-applypatch',
                'pre-commit',
                'prepare-commit-msg',
                'pre-rebase',
                'update'
              ])
              .required()
          )
          .required()
      })
      .validate(value)
  }
  /**
   *
   *
   * @param {any} basePath
   * @param {any} hookDir
   * @memberof GitHookTask
   */
  unlink(basePath, hookDir) {
    this.config.hooks.forEach(function(hook) {
      const hookInSourceControl = Path.resolve(basePath, hookDir, hook)
      const hookInHiddenDirectory = Path.resolve(
        basePath,
        '.git',
        'hooks',
        hook
      )

      Fs.accessSync(hookInHiddenDirectory)
      Fs.unlinkSync(hookInSourceControl, hookInHiddenDirectory)
    })
  }
  /**
   *
   *
   * @param {any} basePath
   * @param {any} hookDir
   * @memberof GitHookTask
   */
  link(basePath, hookDir) {
    this.config.hooks.forEach(function(hook) {
      const hookInSourceControl = Path.resolve(basePath, hookDir, hook)
      const hookInHiddenDirectory = Path.resolve(
        basePath,
        '.git',
        'hooks',
        hook
      )

      Fs.accessSync(hookInHiddenDirectory)
      Fs.unlinkSync(hookInHiddenDirectory)

      Fs.linkSync(hookInSourceControl, hookInHiddenDirectory)
    })
  }
  /**
   *
   *
   * @returns
   * @memberof GitHookTask
   */
  async action() {
    this[this.config.cmd](this.config.bootme.basePath, this.config.hookDir)
  }
}

module.exports = GitHookTask
