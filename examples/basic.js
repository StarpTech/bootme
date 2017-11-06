'use strict'

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onError', async function(err) {
  console.log(err)
})

task.action(async function(state) {
  console.log('Foo')
  state.addJob(async function(state) {
    console.log('Boo')
    state.addJob(async function(state) {
      console.log(state.pipeline.get('foo'))
    })
  })
  return 'finished'
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(task)

registry.addHook('foo', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('foo', 'onAfter', async function() {
  console.log(`After ${this.name}`)
})

pipeline.execute()
