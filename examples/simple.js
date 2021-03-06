'use strict'

/**
 * Basic example
 */

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')
task.setConfig({
  foo: 'bar'
})
task.setInit(async function(state) {
  console.log('Init', this.name)
})
task.setRollback(async function(state) {
  console.log('Rollback', this.name)
})
task.setAction(async function(state) {
  console.log('Job 1 in', this.name)
  state.addJob(async function(state) {
    console.log('Job 2 in', state.task.name)
  })
  return { a: 1 }
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

pipeline.execute()
