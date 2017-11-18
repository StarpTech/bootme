'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')
const delayMs = 100

test('Rollback', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.rollback = async function(state) {
    t.type(state.pipeline.error, Error)
    return false
  }
  task.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})

test('Can not run execute() during rollback', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task1 = new Bootme.Task('foo1')
  task1.rollback = async function(state) {
    state.pipeline.execute()
    t.type(state, Bootme.State)
    return false
  }

  const task2 = new Bootme.Task('foo2')
  task2.setAction(async function(state) {
    t.type(state, Bootme.State)
    throw new Error('test')
  })

  registry.addTask(task1)
  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})

test('Do not execute tasks after an error in a previous task', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  const callOrder = []

  const task = new Bootme.Task('foo')
  task.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
  })
  task.setAction(async function(state) {
    throw new Error('test')
  })

  const task2 = new Bootme.Task('foo2')
  task2.setRollback(async function(state) {
    callOrder.push(this.name)
  })

  registry.addTask(task)
  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.same(callOrder, ['foo'])
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})

test('Error abort the pipeline', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  const callOrder = []

  const task = new Bootme.Task('foo')
  task.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
    return true
  })
  task.setAction(async function(state) {
    throw new Error('test')
  })

  const task2 = new Bootme.Task('foo2')
  task2.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
  })
  task2.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)
  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.same(callOrder, ['foo'])
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})

test('Thrown error in rollback handler does not abort rollback', t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  const callOrder = []

  const task = new Bootme.Task('foo')
  task.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
  })

  const task2 = new Bootme.Task('foo2')
  task2.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
    throw new Error('test2')
  })
  task2.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)
  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.same(callOrder, ['foo2', 'foo'])
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})

test('Error in rollback cause nested job error is swallowed', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  let rollbackTask1Called = false
  let rollbackTask2Called = false

  const task1 = new Bootme.Task('foo1')
  task1.setRollback(async function() {
    rollbackTask1Called = true
    throw new Error('test')
  })

  const task2 = new Bootme.Task('foo2')
  task2.setRollback(async function() {
    rollbackTask2Called = true
    throw new Error('test')
  })

  task2.setAction(async function(state) {
    state.addJob(async function(state) {
      throw new Error('test')
    })
    return true
  })

  registry.addTask(task1)
  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.ok(pipeline.error)
    t.ok(rollbackTask1Called)
    t.ok(rollbackTask2Called)
    done()
  })

  pipeline.execute()
})

test('Error in rollback cause nested task error is swallowed', async t => {
  t.plan(5)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  let rollbackTask1Called = false
  let rollbackTask2Called = false
  let rollbackTask3Called = false

  const task1 = new Bootme.Task('foo1')
  task1.setRollback(async function() {
    rollbackTask1Called = true
    throw new Error('test')
  })

  const task2 = new Bootme.Task('foo2')
  task2.setRollback(async function() {
    rollbackTask2Called = true
    throw new Error('test')
  })

  task2.setAction(async function(state) {
    state.addTask(
      new Bootme.Task('foo3')
        .setRollback(async function() {
          rollbackTask3Called = true
        })
        .setAction(async state => {
          throw new Error('test')
        })
    )
    return true
  })

  registry.addTask(task1)
  registry.addTask(task2)

  pipeline.execute()

  await delay(30)

  t.ok(pipeline.error)
  t.ok(rollbackTask1Called)
  t.ok(rollbackTask2Called)
  t.ok(rollbackTask3Called)

  t.pass()
})

test('Use Task as Rollback handler', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setRollback(
    new Bootme.Task('foo1').setAction(async state => {
      t.type(state, Bootme.State)
    })
  )
  task.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.equal(pipeline.error.message, 'test')
    done()
  })

  pipeline.execute()
})
