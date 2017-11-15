'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')
const delayMs = 100

test('Restore', async t => {
  t.plan(6)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  let initCalled = false
  let onBeforeCalled = false
  let onAfterCalled = false

  const task = new Bootme.Task('foo')
  task.setInit(async function() {
    initCalled = true
  })
  task.addHook('onBefore', async function() {
    onBeforeCalled = true
  })
  task.addHook('onAfter', async function() {
    onAfterCalled = true
  })
  task.setRollback(async function(state) {
    t.type(state, Bootme.State)
    return true
  })

  registry.addTask(task)

  await pipeline.restore()

  await delay(delayMs)

  t.ok(!pipeline.error)
  t.ok(initCalled)
  t.ok(!onBeforeCalled)
  t.ok(!onAfterCalled)

  t.pass()
})
