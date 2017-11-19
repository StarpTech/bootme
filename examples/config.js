'use strict'

/**
 * Basic config scenarios
 */

const Bootme = require('./../packages/bootme')

// config is set immediatly
const task = new Bootme.Task('foo')
task.setConfig({
  foo: 'bar'
})

// config is loaded at runtime
const task2 = new Bootme.Task('foo2')
task2.setConfig(async function(state) {
  return { foo: 'bar' }
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)
registry.addTask(task2)

pipeline.execute()
