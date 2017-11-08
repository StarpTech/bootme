'use strict'

/**
 * This will demonstrate how to load the pipeline configuration from JSON
 */

const Ora = require('ora')
const JsonRunner = require('./')
const Bootme = require('bootme')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)

let config = [
  {
    request: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    info: 'Get IIS position'
  },
  {
    temp: {
      type: 'file'
    },
    info: 'Create temp file'
  },
  {
    request: {
      url: 'http://invalid'
    },
    info: 'Start invalid request'
  }
]

const spinners = new Map()

pipeline.onTaskStart(state => {
  spinners.set(state.task.name, new Ora(`${state.task.name} / ${state.task.info}`).start())
})

pipeline.onRollback(task => {
  spinners.get(task.name).info(`Rollback ${task.name}`)
})

pipeline.onTaskEnd(state => {
  if (state.pipeline.error) {
    spinners.get(state.task.name).fail()
    spinners.get(state.task.name).stop()
  } else {
    spinners.get(state.task.name).succeed()
  }
})

jsonRunner.run(config)
