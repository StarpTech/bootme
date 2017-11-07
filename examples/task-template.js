'use strict'

/**
 * Demonstrate the Task interface
 */

const Joi = require('joi')
const Bootme = require('./../packages/bootme')

class SampleTask extends Bootme.Task {
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
        cmd: Joi.string()
          .lowercase()
          .allow(['hello'])
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
   * @returns
   * @memberof HttpRequestTask
   */
  async action() {
    return this.validateConfig.method + ' world'
  }
}

const task = new SampleTask('helloWorld').setConfig({ cmd: 'hello' })

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

registry.addHook('helloWorld', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('helloWorld', 'onAfter', async function() {
  console.log(`After ${this.name}`)
})

pipeline.execute()
