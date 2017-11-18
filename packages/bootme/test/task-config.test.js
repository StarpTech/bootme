'use strict'

const t = require('tap')
const test = t.test
const Bootme = require('./..')

test('Task config as object', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = {
    a: 1
  }

  const task = new Bootme.Task('foo')
  task.setConfig(config)
  task.setAction(async function(state) {
    t.equal(this.config.a, config.a)
    return true
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('Task config as function', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const lazyFunc = async function() {
    return { a: 1 }
  }

  const task = new Bootme.Task('foo')
  task.setConfig(lazyFunc)
  task.setAction(async function(state) {
    t.equal(this.config.a, (await lazyFunc()).a)
    return true
  })

  registry.addTask(task)

  pipeline.onDrain(async () => {
    t.ok(!pipeline.error)
  })

  pipeline.execute()
})

test('Async Task config validation', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = { a: 1 }

  const task = new Bootme.Task('foo')
  task.validateConfig = async () => {
    throw new Error('invalid')
  }

  task.setConfig(config).catch(err => {
    t.strictEqual(err.message, 'invalid')
  })
})

test('Respond with invalid Task config', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = { a: 1 }

  const task = new Bootme.Task('foo')
  task.validateConfig = () => {
    return 33
  }

  try {
    task.setConfig(config)
  } catch (err) {
    t.strictEqual(err.message, 'Respond with an invalid config construct')
  }
})

test('Respond with object', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = { a: 1 }

  const task = new Bootme.Task('foo')
  task.validateConfig = () => {
    return { b: 2 }
  }

  task.setConfig(config)

  t.same(task.config, { a: 1, b: 2 })
})

test('Sync Task config validation', t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = { a: 1 }

  const task = new Bootme.Task('foo')
  task.validateConfig = () => {
    throw new Error('invalid')
  }
  try {
    task.setConfig(config)
  } catch (err) {
    t.strictEqual(err.message, 'invalid')
  }
})

test('Sync Task config validation at runtime', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = () => {
    return { a: 1 }
  }

  const task = new Bootme.Task('foo')
  task.validateConfig = () => {
    throw new Error('invalid')
  }

  task.setConfig(config)

  registry.addTask(task)

  pipeline.onRollbackFinish(async () => {
    t.ok(pipeline.error)
    t.strictEqual(pipeline.error.message, 'invalid')
  })

  pipeline.execute()
})

test('Async Task config validation at runtime', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const lazyFunc = async function() {
    throw new Error('invalid')
  }

  const task = new Bootme.Task('foo')
  task.setConfig(lazyFunc)
  task.setAction(async function(state) {
    return true
  })

  registry.addTask(task)

  pipeline.onRollbackFinish(async () => {
    t.ok(pipeline.error)
    t.strictEqual(pipeline.error.message, 'invalid')
  })

  pipeline.execute()
})
