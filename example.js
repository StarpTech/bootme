'use strict'

const Bootme = require('./packages/bootme')
const HttpRequestTask = require('./packages/bootme-request')

const task = new Bootme.Task().setName('foo').setConfig({})

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onFailure', async function(err) {
  console.log(err)
})
task.action(async function(parent) {
  console.log('Foo')
  parent.addJob(async function(parent) {
    console.log('Boo')
    parent.addJob(async function(parent) {
      console.log(parent.pipeline.getResult('foo'))
    })
  })
  return 'finished'
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})
registry.addTask(task)
registry.addTask(
  new HttpRequestTask().setName('iss_position').setConfig({
    method: 'GET',
    url: 'http://api.open-notify.org/iss-now.json',
    options: {
      headers: {}
    }
  })
)
registry.addHook('foo', 'onBefore', async () => console.log('Before foo'))
registry.addHook('foo', 'onAfter', async () => console.log('After foo'))
registry.addHook('iss_position', 'onAfter', async () => {
  console.log('Get IIS position')
  console.log(await pipeline.getResult('iss_position').json)
})

pipeline.execute()
