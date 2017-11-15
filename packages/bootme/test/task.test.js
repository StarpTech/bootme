'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')
const delayMs = 20

test('Create task', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    t.type(this, Bootme.Task)
    t.type(state, Bootme.State)
    return true
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(delayMs)

  t.pass()
})

test('Task hooks', async t => {
  t.plan(5)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const config = {
    a: 1
  }

  const task = new Bootme.Task('foo')
  task.setConfig(config)
  task.addHook('onBefore', async state => t.type(state, Bootme.State))
  task.addHook('onInit', async state => t.type(state, Bootme.State))
  task.addHook('onAfter', async state => t.type(state, Bootme.State))
  task.setAction(async function(state) {
    t.equal(this.config.a, config.a)
    return true
  })

  registry.addTask(task)

  pipeline.execute()

  await delay(delayMs)

  t.pass()
})

test('Use Tasks as hooks', async t => {
  t.plan(5)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.addHook('onBefore', new Bootme.Task('foo1').setAction(async state => t.type(state, Bootme.State)))
  task.addHook('onInit', new Bootme.Task('foo2').setAction(async state => t.type(state, Bootme.State)))
  task.addHook('onAfter', new Bootme.Task('foo3').setAction(async state => t.type(state, Bootme.State)))
  task.setAction(async state => t.type(state, Bootme.State))

  registry.addTask(task)

  pipeline.execute()

  await delay(delayMs)

  t.pass()
})

test('Use Task as init handler', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setInit(
    new Bootme.Task('foo1').setAction(async state => {
      t.type(state, Bootme.State)
    })
  )

  registry.addTask(task)

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})
