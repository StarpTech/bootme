'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Execute pipeline', async t => {
  t.plan(1)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.pass()
})

test('Hooks', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  registry.addTask(task)

  pipeline.onTaskStart(async state => t.type(state, 'State'))
  pipeline.onTaskEnd(async state => t.type(state, 'State'))

  await pipeline.execute()

  await delay(20)

  t.pass()
})

test('Rollback hook', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')

  task.setAction(async function() {
    throw new Error('test')
  })

  registry.addTask(task)

  pipeline.onRollback(async (state) => {
    t.type(state, 'State')
    t.type(state.pipeline.error, Error)
  })

  pipeline.execute()

  await delay(20)

  t.pass()
})
