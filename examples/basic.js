'use strict'

/**
 * Demonstrate the API
 */

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')
const task2 = new Bootme.Task('foo2').action(async function() {
  console.log(this.name, ' executed')
})
const task3 = new Bootme.Task('foo3').action(async function() {
  console.log(this.name, ' executed')
})

task.addHook('onBefore', task2)
task.addHook('onAfter', async function(state) {
  state.addTask(task3)
})
task.addHook('onError', async function(err) {
  console.log(err)
})

task.action(async function(state) {
  console.log('Before Job in', this.name)
  state.addJob(async function(state) {
    console.log('Before Job 2 in', state.task.name)
    state.addJob(async function(state) {
      console.log('Result of', state.task.name, await state.pipeline.get('foo'))
    })
  })
  return { a: 1 }
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
