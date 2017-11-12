'use strict'

/**
 * Rollback
 */

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')
const task2 = new Bootme.Task('foo2').action(async function() {
  console.log(this.name, ' executed')
})
const task3 = new Bootme.Task('foo3').action(async function() {
  console.log(this.name, ' executed')
})

task.addHook('onRollback', task2)

task.action(async function(state) {
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

pipeline.onRollback(task3)

pipeline.execute()
