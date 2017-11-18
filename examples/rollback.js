'use strict'

/**
 * Rollback
 */

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')

task.setAction(async function(state) {
  console.log('Job 1 in', state.task.name)
  state.addJob(async function(state) {
    console.log('Job 2 in', state.task.name)
    state.addJob(async function(state) {
      console.log('Job 3 in', state.task.name)
    })
    throw new Error('test')
  })
  return { a: 1 }
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

pipeline.onTaskRollback(async function() {
  console.log('Rollback')
})

pipeline.execute()
