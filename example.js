'use strict'

const Bootme = require('./')

const task = new Bootme.Task().setName('test').setConfig({})

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onFailure', async function() {})
task.action(async function() {
  console.log('Foo', this.config)
})

const registry = new Bootme.Registry()
registry.addTask(task)
registry.addHook('test', 'onBefore', () => console.log('Before test'))
registry.addHook('test', 'onAfter', () => console.log('After test'))

const pipeline = new Bootme.Pipeline(registry)
pipeline.execute()
