'use strict'

/**
 * This pipeline will clone a sample Git Repository
 */

const Bootme = require('./../packages/bootme')
const GitcloneTask = require('./../packages/bootme-gitclone')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new GitcloneTask('gitclone').setConfig({
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
)

registry.addHook('gitclone', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('gitclone', 'onAfter', async function(state) {
  console.log(`After ${this.name} result`)
  console.log(await state.getValue(`${this.name}`))
})

pipeline.execute()
