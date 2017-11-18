'use strict'

const t = require('tap')
const test = t.test
const Bootme = require('./..')

test('Execute pipeline', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('Hooks', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  pipeline.onTaskStart(async state => t.type(state, Bootme.State))
  pipeline.onTaskEnd(async state => t.type(state, Bootme.State))

  pipeline.onDrain(async () => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('Rollback hook', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.onTaskRollback(async state => {
    t.type(state, Bootme.State)
    t.type(state.pipeline.error, Error)
  })

  pipeline.onDrain(async () => {
    t.ok(pipeline.error)
  })

  pipeline.execute()
})

test('hasError()', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.ok(pipeline.hasError('foo'))
  })

  pipeline.execute()
})

test('hasResult()', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.ok(pipeline.hasResult('foo'))
  })

  pipeline.execute()
})

test('get()', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.strictEqual(pipeline.get('foo'), true)
  })

  pipeline.execute()
})

test('get() with array of task names', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.same(pipeline.get(['foo']).get('foo'), true)
  })

  pipeline.execute()
})
