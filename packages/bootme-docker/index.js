'use strict'

const Joi = require('joi')
const Docker = require('dockerode')
const Task = require('bootme').Task

/**
 *
 *
 * @class TaskDocker
 * @extends {Task}
 */
class TaskDocker extends Task {
  init() {
    this.docker = new Docker({
      host: this.config.host,
      port: this.config.port,
      version: this.config.version // required when Docker >= v1.13, https://docs.docker.com/engine/api/version-history/
    })
  }
  /**
   *
   *
   * @param {any} value
   * @returns
   * @memberof TaskDocker
   */
  validateConfig(value) {
    return Joi.object()
      .keys({
        bootme: Joi.object(),
        refs: Joi.object(),
        host: Joi.string().default('127.0.0.1'),
        port: Joi.number().default(2375),
        version: Joi.string().default('v1.25'),
        name: Joi.string(),
        image: Joi.string(),
        cmd: Joi.string()
          .allow([
            'createContainer',
            'listContainers',
            'getContainer',
            'stopAllContainers',
            'inspectContainer'
          ])
          .required()
      })
      .validate(value)
  }
  /**
   *
   *
   * @returns
   * @memberof TaskDocker
   */
  async action() {
    switch (this.config.cmd) {
      case 'createContainer':
        return this.docker
          .createContainer({
            name: this.config.name,
            Image: this.config.image,
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: false,
            StdinOnce: false
          })
          .then(function(container) {
            return container.start()
          })
      case 'listContainers':
        return this.docker.listContainers()
      case 'getContainer':
        return this.docker.getContainer(this.config.name)
      case 'stopContainer':
        return this.docker.getContainer(this.config.name).stop()
      case 'inspectContainer':
        return this.docker.getContainer(this.config.name).inspect()
      case 'stopAllContainers':
        const containers = await this.docker.listContainers()
        for (let containerInfo of containers) {
          await this.docker.getContainer(containerInfo.Id).stop()
        }
        break
      default:
        break
    }
  }
}

module.exports = TaskDocker
