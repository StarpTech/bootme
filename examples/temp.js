'use strict'

/**
 * This pipeline will create a temp path
 */

const Bootme = require('./../packages/bootme')
const TempTask = require('./../packages/bootme-temp')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const task = new TempTask('cacheDir')
task.setConfig({
  type: 'directory'
})
task.addHook('onAfter', async function(state) {
  console.log(await state.getValue(this.name))
})

registry.addTask(task)

pipeline.execute()
