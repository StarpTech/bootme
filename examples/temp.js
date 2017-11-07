'use strict'

/**
 * This pipeline will create a temp path
 */

const Bootme = require('./../packages/bootme')
const TempTask = require('./../packages/bootme-temp')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new TempTask('cacheDir')
    .setConfig({
      type: 'directory'
    })
    .addHook('onAfter', async function(state) {
      console.log(await state.getValue(this.name))
    })
)

pipeline.execute()
