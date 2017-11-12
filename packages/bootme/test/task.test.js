'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Create task', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    t.type(this, Bootme.Task)
    t.type(state, 'State')
    t.ok(this.run)
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

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
  task.addHook('onBefore', async state => t.type(state, 'State'))
  task.addHook('onInit', async state => t.type(state, 'State'))
  task.addHook('onAfter', async state => t.type(state, 'State'))
  task.setAction(async function(state) {
    t.equal(this.config.a, config.a)
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.pass()
})
