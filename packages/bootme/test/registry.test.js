'use strict'

const t = require('tap')
const test = t.test
const Bootme = require('./..')

test('add task', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  t.strictEqual(registry.tasks.length, 1)

  t.pass()
})

test('check for duplicate tasks', async t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  try {
    registry.addTask(task)
  } catch (err) {
    t.strictEqual(err.message, 'The Task <Task:foo> already exists')
  }
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

test('addHook', t => {
  t.plan(5)

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

  pipeline.onDrain(async () => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('shareConfig', t => {
  t.plan(3)

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

  pipeline.onDrain(async => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('setRef', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function() {
    t.strictEqual(this.config.refs.a, 1)
  })

  registry.addTask(task)

  registry.setRef('foo', 'a', 1)

  t.strictEqual(registry.tasks.length, 1)

  pipeline.onDrain(async => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('set preConfig', t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setConfig({
    a: 1
  })
  task.setAction(async function() {
    t.strictEqual(this.config.a, 1)
    t.strictEqual(this.config.b, 2)
  })

  registry.addTask(task)

  registry.setConfig('foo', {
    b: 2
  })

  t.strictEqual(registry.tasks.length, 1)

  pipeline.onDrain(async => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('setRef manipulate existing refs', t => {
  t.plan(3)

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

  pipeline.onDrain(async => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})
