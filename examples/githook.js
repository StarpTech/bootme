'use strict'

/**
 * This pipeline will create a sym link from ./git_hooks/<name> to ./git/hooks/<name>
 */

const Bootme = require('./../packages/bootme')
const GitHookTask = require('./../packages/bootme-githook')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new GitHookTask('precommit').setConfig({
    hooks: ['pre-commit'],
    hookDir: 'git_hooks'
  })
)

registry.addHook('precommit', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('precommit', 'onAfter', async function(state) {
  console.log(`After ${this.name} result`)
  console.log(await state.getValue(`${this.name}`))
})

pipeline.execute()
