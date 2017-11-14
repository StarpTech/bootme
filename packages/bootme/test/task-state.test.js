'use strict'

const t = require('tap')
const delay = require('delay')
const test = t.test
const Bootme = require('./..')

test('Create job inside task', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addJob(async function(state) {
      t.type(state, Bootme.State)
    })
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.pass()
})

test('Create job inside job', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addJob(async function(state) {
      t.type(state, Bootme.State)
      state.addJob(async function(state) {
        t.type(state, Bootme.State)
      })
    })
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.pass()
})

test('Create task inside task', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addTask(
      new Bootme.Task('foo2').setAction(async state =>
        t.type(state, Bootme.State)
      )
    )
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  t.ok(!pipeline.error)

  await delay(20)

  t.pass()
})

test('Create task inside task inside task', async t => {
  t.plan(4)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addTask(
      new Bootme.Task('foo2').setAction(async state => {
        t.type(state, Bootme.State)
        state.addTask(
          new Bootme.Task('foo3').setAction(async state =>
            t.type(state, Bootme.State)
          )
        )
      })
    )
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  t.ok(!pipeline.error)

  await delay(20)

  t.pass()
})

test('addJob accepts only functions', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addJob('no fn')
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.ok(pipeline.error)
  t.equal(pipeline.error.message, 'The Job handler must be a function')

  t.pass()
})

test('addTask accepts only a task instance', async t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    state.addTask('no task')
    return true
  })

  registry.addTask(task)

  await pipeline.execute()

  await delay(20)

  t.ok(pipeline.error)
  t.equal(pipeline.error.message, 'The Task must be a Task instance')

  t.pass()
})

test('getValue', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task1 = new Bootme.Task('foo1')
  task1.setAction(async function(state) {
    return true
  })

  const task2 = new Bootme.Task('foo2')
  task2.setConfig({
    a: 1,
    refs: {
      a: 'foo1'
    }
  })
  task2.setAction(async function(state) {
    const previousResult = state.getValue(this.config.refs.a)
    t.strictEqual(previousResult, true)
    return true
  })

  registry.addTask(task1)
  registry.addTask(task2)

  await pipeline.execute()

  await delay(20)

  t.pass()
})

test('getValue fallback to config', async t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task2 = new Bootme.Task('foo2')
  task2.setConfig({
    a: 1,
    refs: {
      a: 'foo1'
    }
  })

  task2.setAction(async function(state) {
    const previousResult = state.getValue(this.config.refs.a)
    t.strictEqual(previousResult, 1)
    return true
  })

  registry.addTask(task2)

  await pipeline.execute()

  await delay(20)

  t.pass()
})
