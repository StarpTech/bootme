'use strict'

const Bootme = require('./../packages/bootme')
const ShellTask = require('./../packages/bootme-shell')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new ShellTask().setName('echo').setConfig({
    cmd: 'echo',
    args: ['BootMe']
  })
)

registry.addTask(
  new ShellTask().setName('ls').setConfig({
    cmd: 'exec',
    args: ['node -v']
  })
)

pipeline.execute()
