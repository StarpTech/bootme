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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})
