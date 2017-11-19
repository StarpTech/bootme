'use strict'

/**
 * This pipeline will execute some simple shell commands
 */

const Bootme = require('./../packages/bootme')
const ShellTask = require('./../packages/bootme-shell')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const sTask1 = new ShellTask('echo')
sTask1.setConfig({
  cmd: 'echo',
  args: ['BootMe']
})

const sTask2 = new ShellTask('exec')
sTask2.setConfig({
  cmd: 'exec',
  args: ['node -v']
})

registry.addTask(sTask1)
registry.addTask(sTask2)

registry.addHook('exec', 'onAfter', async function(state) {
  console.log(await state.getValue(this.name))
})

pipeline.execute()
