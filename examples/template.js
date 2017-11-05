'use strict'

const Bootme = require('./../packages/bootme')
const CheckoutTask = require('./../packages/bootme-checkout')
const TemplateTask = require('./../packages/bootme-template')

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

registry.addTask(
  new TemplateTask().setName('replace').setConfig({
    deps: ['checkout']
  })
)

pipeline.execute()
