'use strict'

/**
 * Restore all tasks in the pipeline
 */

const Bootme = require('./../packages/bootme')

const task1 = new Bootme.Task('foo1')
  .setAction(async function() {
    console.log(this.name, ' executed')
  })
  .addHook('onInit', function() {
    console.log('Init', this.name)
  })
  .addHook('onRollback', function() {
    console.log('Restore', this.name)
  })

const task2 = new Bootme.Task('foo2')
  .setAction(async function() {
    console.log(this.name, ' executed')
  })
  .addHook('onInit', function() {
    console.log('Init', this.name)
  })
  .addHook('onRollback', function() {
    console.log('Restore', this.name)
  })

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task1)
registry.addTask(task2)

pipeline.restore()
