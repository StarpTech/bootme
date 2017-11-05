'use strict'

const Bootme = require('./')

const task = new Bootme.Task().setName('foo').setConfig({})

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onFailure', async function() {})
task.action(async function(queue) {
  console.log('Foo')
  queue.add(async function() {
    console.log('Boo')
  })
})

const registry = new Bootme.Registry()
registry.addTask(task)
registry.addHook('foo', 'onBefore', () => console.log('Before foo'))
registry.addHook('foo', 'onAfter', () => console.log('After foo'))

const pipeline = new Bootme.Pipeline(registry)
pipeline.execute()
