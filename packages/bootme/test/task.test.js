'use strict'

const t = require('tap')
const test = t.test
const Bootme = require('./..')

test('Create task', t => {
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

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})

test('Task hooks', t => {
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

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})

test('Use Tasks as hooks', t => {
  t.plan(5)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.addHook(
    'onBefore',
    new Bootme.Task('foo1').setAction(async state =>
      t.type(state, Bootme.State)
    )
  )
  task.addHook(
    'onInit',
    new Bootme.Task('foo2').setAction(async state =>
      t.type(state, Bootme.State)
    )
  )
  task.addHook(
    'onAfter',
    new Bootme.Task('foo3').setAction(async state =>
      t.type(state, Bootme.State)
    )
  )
  task.setAction(async state => t.type(state, Bootme.State))

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})

test('Use Task as init handler', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setInit(
    new Bootme.Task('foo1').setAction(async state => {
      t.type(state, Bootme.State)
    })
  )

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})
