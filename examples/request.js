'use strict'

/**
 * This pipeline will execute a simple HTTP Request
 */

const Bootme = require('./../packages/bootme')
const HttpRequestTask = require('./../packages/bootme-request')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new HttpRequestTask('iss_position').setConfig({
    method: 'GET',
    url: 'http://api.open-notify.org/iss-now.json'
  })
)

registry.addHook('iss_position', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('iss_position', 'onAfter', async function(state) {
  console.log(`After ${this.name} result`)
  console.log(await state.getValue(`${this.name}`))
})

pipeline.execute()
