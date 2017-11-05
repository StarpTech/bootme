'use strict'

const Bootme = require('./../packages/bootme')
const CheckoutTask = require('./../packages/bootme-checkout')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(
  new CheckoutTask().setName('checkout').setConfig({
    method: 'GET',
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
)

registry.addHook('checkout', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})
registry.addHook('checkout', 'onAfter', async function() {
  console.log(`After ${this.name} result`)
  console.log(await pipeline.getResult(this.name))
})

pipeline.execute()
