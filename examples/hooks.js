'use strict'

/**
 * Hooks
 */

const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')

// Task hooks
task.addHook('onBefore', async state => console.log('onBefore Task', state.task.name))
task.addHook('onAfter', async state => console.log('onAfter Task', state.task.name))
task.addHook('onRollback', async state => console.log('onRollback Task', state.task.name))

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

// Add hooks for task after registration
registry.addHook('foo', 'onBefore', async state => console.log('onBefore Registry', state.task.name))
registry.addHook('foo', 'onAfter', async state => console.log('onAfter Registry', state.task.name))

// Global hooks
pipeline.onTaskStart(async state => console.log('Task Start', state.task.name))
pipeline.onTaskEnd(async state => console.log('Task End', state.task.name))
pipeline.onTaskRollback(async state => console.log('Task Rollback', state.task.name))

pipeline.execute()
