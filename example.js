'use strict'

const Bootme = require('./packages/bootme')
const HttpRequestTask = require('./packages/bootme-request')

const task = new Bootme.Task().setName('foo').setConfig({})

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onFailure', async function(err) {
  console.log(err)
})
task.action(async function(parent) {
  console.log('Foo')
  parent.addJob(async function(parent) {
    console.log('Boo')
    parent.addJob(async function() {
      console.log('Boo2')
    })
  })
})

const registry = new Bootme.Registry()
registry.addTask(task)
registry.addTask(
  new HttpRequestTask().setName('createRepository').setConfig({})
)
registry.addHook('foo', 'onBefore', () => console.log('Before foo'))
registry.addHook('foo', 'onAfter', () => console.log('After foo'))
registry.addHook('createRepository', 'onAfter', () =>
  console.log('Repository created!')
)

const pipeline = new Bootme.Pipeline(registry)
pipeline.execute()
