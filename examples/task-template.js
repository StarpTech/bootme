'use strict'

/**
 * Demonstrate the Task interface
 */

const Joi = require('joi')
const Bootme = require('./../packages/bootme')

class SampleTask extends Bootme.Task {
  async init(state) {
    // try to get value from previous task or fallback to config
    this.flag = await state.getValue(this.config.refs.flag)
  }
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
        flag: Joi.string(),
        refs: Joi.object()
          .keys({
            url: Joi.string()
          })
          .default({}),
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

const task = new SampleTask('helloWorld').setConfig({
  cmd: 'hello',
  flag: 'foo'
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

registry.addHook('helloWorld', 'onInit', async function() {
  console.log('Flag:', this.flag)
})

registry.addHook('helloWorld', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('helloWorld', 'onAfter', async function() {
  console.log(`After ${this.name}`)
})

pipeline.execute()
