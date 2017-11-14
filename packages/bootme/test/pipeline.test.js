'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Execute pipeline', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.ok(!pipeline.error)

  t.pass()
})

test('Hooks', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  pipeline.onTaskStart(async state => t.type(state, Bootme.State))
  pipeline.onTaskEnd(async state => t.type(state, Bootme.State))

  await pipeline.execute()

  await delay(20)

  t.ok(!pipeline.error)

  t.pass()
})

test('Rollback hook', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.onRollback(async (state) => {
    t.type(state, Bootme.State)
    t.type(state.pipeline.error, Error)
  })

  pipeline.execute()

  await delay(20)

  t.ok(pipeline.error)

  t.pass()
})

test('hasError()', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(20)

  t.ok(pipeline.hasError('foo'))

  t.pass()
})

test('hasResult()', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(20)

  t.ok(pipeline.hasResult('foo'))

  t.pass()
})

test('get()', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(20)

  t.strictEqual(pipeline.get('foo'), true)

  t.pass()
})

test('get() with array of task names', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    return true
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(20)

  t.same(pipeline.get(['foo']).get('foo'), true)

  t.pass()
})
