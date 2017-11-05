'use strict'

const Bootme = require('./../packages/bootme')
const HttpRequestTask = require('./../packages/bootme-request')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(
  new HttpRequestTask().setName('iss_position').setConfig({
    method: 'GET',
    url: 'http://api.open-notify.org/iss-now.json',
    options: {
      headers: {}
    }
  })
)

registry.addHook('iss_position', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})
registry.addHook('iss_position', 'onAfter', async function() {
  console.log(`After ${this.name} result`)
  console.log(await pipeline.getResult(this.name).json)
})

pipeline.execute()
