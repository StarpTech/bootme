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
  async rollback() {}
  async validateConfig(value) {
    return Joi.validate(
      value,
      Joi.object().keys({
        bootme: Joi.object(),
        flag: Joi.string(),
        refs: Joi.object(),
        cmd: Joi.string()
          .lowercase()
          .allow(['hello'])
          .required()
      })
    )
  }
  async validateResult(value) {
    return Joi.validate(value, Joi.string().required())
  }
  async action() {
    console.log('Flag: ', this.flag)
    return this.validateConfig.method + ' world'
  }
}

const task = new SampleTask('helloWorld')
task.setConfig({
  cmd: 'hello',
  flag: 'default',
  refs: {
    flag: 'foo' // task with name 'foo'
  }
})

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
