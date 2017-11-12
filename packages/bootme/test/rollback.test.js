'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Rollback', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.rollback = async function(state) {
    t.type(state.pipeline.error, Error)
    return false
  }
  task.setAction(async function(state) {
    throw new Error('test')
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.pass()
})
