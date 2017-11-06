'use strict'

const Bootme = require('./../packages/bootme')
const ShellTask = require('./../packages/bootme-shell')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new ShellTask('echo').setConfig({
    cmd: 'echo',
    args: ['BootMe']
  })
)

registry.addTask(
  new ShellTask('exec').setConfig({
    cmd: 'exec',
    args: ['node -v']
  })
)

registry.addHook(
  'exec',
  'onAfter',
  new ShellTask('list')
    .setConfig({
      cmd: 'ls'
    })
    .addHook('onAfter', async function (state) {
      console.log(await state.pipeline.get(this.name))
    })
)

pipeline.execute()
