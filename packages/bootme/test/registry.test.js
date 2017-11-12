'use strict'

const t = require('tap')
const delay = require('delay')
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

test('addTask should only support tasks objects', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  t.throws(function() {
    registry.addTask('string')
  }, Error, 'The Task must be a Task instance')

  t.strictEqual(registry.tasks.length, 0)

  t.pass()
})

test('addHook', async t => {
  t.plan(5)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)
  registry.addHook('foo', 'onInit', async (state) => t.type(state, 'State'))
  registry.addHook('foo', 'onBefore', async (state) => t.type(state, 'State'))
  registry.addHook('foo', 'onAfter', async (state) => t.type(state, 'State'))

  t.strictEqual(registry.tasks.length, 1)

  pipeline.execute()

  await delay(20)

  t.pass()
})
