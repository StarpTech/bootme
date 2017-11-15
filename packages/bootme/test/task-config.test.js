'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')
const delayMs = 100

test('Task config as object', async t => {
  t.plan(3)

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

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})

test('Task config as function', async t => {
  t.plan(3)

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

  pipeline.execute()

  await delay(delayMs)

  t.ok(!pipeline.error)

  t.pass()
})
