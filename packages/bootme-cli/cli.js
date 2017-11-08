#! /usr/bin/env node

const Ora = require('ora')
const Cli = require('./')
const Bootme = require('bootme')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

let config = [
  {
    request: {
      url: 'http://api.open-notify.org/iss-now.json'
    }
  },
  {
    temp: {
      type: 'file'
    }
  },
  {
    request: {
      url: 'http://invalid'
    }
  }
]

const spinners = new Map()

pipeline.onTaskStart(state => {
  spinners.set(state.task.name, new Ora(state.task.name).start())
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

pipeline.start()
