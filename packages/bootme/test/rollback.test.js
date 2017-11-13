'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Rollback', async t => {
  t.plan(3)

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

  await pipeline.execute()

  await delay(20)

  t.equal(pipeline.error.message, 'test')

  t.pass()
})

test('Rollback multiple tasks', async t => {
  t.plan(4)

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
  task.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
  })

  registry.addTask(task)
  registry.addTask(task2)

  await pipeline.execute()

  await delay(20)

  t.same(callOrder, ['foo'])
  t.equal(pipeline.error.message, 'test')

  t.pass()
})

test('Error abort the pipeline', async t => {
  t.plan(4)

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
  task.setRollback(async function(state) {
    t.type(state.pipeline.error, Error)
    callOrder.push(this.name)
  })
  task.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)
  registry.addTask(task2)

  await pipeline.execute()

  await delay(20)

  t.same(callOrder, ['foo'])
  t.equal(pipeline.error.message, 'test')

  t.pass()
})

test('Thrown error in rollback handler does not abort rollback', async t => {
  t.plan(5)

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

  await pipeline.execute()

  await delay(30)

  t.same(callOrder, ['foo2', 'foo'])
  t.equal(pipeline.error.message, 'test')

  t.pass()
})
