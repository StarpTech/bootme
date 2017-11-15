'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')
const delayMs = 20

test('add task', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  t.strictEqual(registry.tasks.length, 1)

  t.pass()
})

test('addTask should only support tasks objects', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  t.throws(
    function() {
      registry.addTask('string')
    },
    Error,
    'The Task must be a Task instance'
  )

  t.strictEqual(registry.tasks.length, 0)

  t.pass()
})

test('addHook', async t => {
  t.plan(6)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)
  registry.addHook('foo', 'onInit', async state => t.type(state, Bootme.State))
  registry.addHook('foo', 'onBefore', async state =>
    t.type(state, Bootme.State)
  )
  registry.addHook('foo', 'onAfter', async state => t.type(state, Bootme.State))

  t.strictEqual(registry.tasks.length, 1)

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})

test('shareConfig', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function() {
    t.strictEqual(this.config.bootme.foo, 'bar')
  })

  registry.addTask(task)

  registry.shareConfig({
    foo: 'bar'
  })

  t.strictEqual(registry.tasks.length, 1)

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})

test('setRef', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function() {
    t.strictEqual(this.config.refs.a, 1)
  })

  registry.addTask(task)

  registry.setRef('foo', 'a', 1)

  t.strictEqual(registry.tasks.length, 1)

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})

test('setRef manipulate existing refs', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setConfig({
    refs: {}
  })
  task.setAction(async function() {
    t.strictEqual(this.config.refs.a, 1)
  })

  registry.addTask(task)

  registry.setRef('foo', 'a', 1)

  t.strictEqual(registry.tasks.length, 1)

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})
