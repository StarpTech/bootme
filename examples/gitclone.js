'use strict'

const Bootme = require('./../packages/bootme')
const GitcloneTask = require('./../packages/bootme-gitclone')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(
  new GitcloneTask().setName('gitclone').setConfig({
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
)

registry.addHook('gitclone', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('gitclone', 'onAfter', async function() {
  console.log(`After ${this.name} result`)
  console.log(await pipeline.get(`${this.name}`))
})

pipeline.execute()
