'use strict'

const t = require('tap')
const test = t.test
const Bootme = require('./..')

test('Create job inside task', t => {
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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})

test('Create job inside job', t => {
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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})

test('Create task inside task', t => {
  t.plan(2)

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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})

test('Create task inside task inside task', t => {
  t.plan(3)

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

  pipeline.queue.drain(done => {
    t.ok(!pipeline.error)
    done()
  })

  pipeline.execute()
})

test('addJob accepts only functions', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    t.pass()
    state.addJob('no fn')
    return true
  })

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.ok(pipeline.error)
    t.equal(pipeline.error.message, 'The Job handler must be a function')
    done()
  })

  pipeline.execute()
})

test('addTask accepts only a task instance', t => {
  t.plan(3)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task = new Bootme.Task('foo')
  task.setAction(async function(state) {
    t.pass()
    state.addTask('no task')
    return true
  })

  registry.addTask(task)

  pipeline.queue.drain(done => {
    t.ok(pipeline.error)
    t.equal(pipeline.error.message, 'The Task must be a Task instance')
    done()
  })

  pipeline.execute()
})

test('getValue', t => {
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

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})

test('getValue fallback to config', t => {
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

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})

test('getValue throw error when config could not be found', t => {
  t.plan(2)

  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)

  const task2 = new Bootme.Task('foo2')
  task2.setConfig({
    a: undefined,
    refs: {
      a: 'foo1'
    }
  })

  task2.setAction(async function(state) {
    t.throws(
      function() {
        state.getValue(this.config.refs.a)
      },
      Error,
      'Config property "a" in Task <Task:foo2> not available. Provide a default value or check the previous tasks'
    )
  })

  registry.addTask(task2)

  pipeline.queue.drain(done => {
    t.pass()
    done()
  })

  pipeline.execute()
})
