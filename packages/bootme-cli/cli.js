#! /usr/bin/env node

/**
 * Ora will gracefully not do anything when there's no TTY or when in a CI.
 */

const Ora = require('ora')
const Bootme = require('bootme')
const Fs = require('fs')
const Minimist = require('minimist')
const Path = require('path')
const JsonRunner = require('bootme-json-runner')
const UpdateNotifier = require('update-notifier')
const pkg = require('./package.json')

UpdateNotifier({ pkg }).notify()

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)

const spinners = new Map()

pipeline.onTaskStart(state => {
  let spinnerMsg = state.task.name
  if (state.task.info) {
    spinnerMsg += `: ${state.task.info}`
  }
  spinners.set(state.task.name, new Ora(spinnerMsg).start())
})

pipeline.onRollback(task => {
  spinners.get(task.name).info(`Rollback ${task.name}`)
})

pipeline.onTaskEnd(state => {
  if (state.pipeline.error) {
    spinners.get(state.task.name).fail()
    spinners
      .get(state.task.name)
      .fail(`${state.task.name}: Error ${state.pipeline.error.message}`)
    spinners.get(state.task.name).stop()
  } else {
    spinners.get(state.task.name).succeed()
  }
})

const argv = Minimist(process.argv.slice(2))
const configFile = argv.config || '.bootme.json'

try {
  const config = Fs.readFileSync(
    Path.resolve(process.cwd(), configFile),
    'utf8'
  )
  const jsonConfig = JSON.parse(config)
  jsonRunner.run(jsonConfig)
} catch (err) {
  new Ora().start().fail(`Config could not be loaded. Error ${err.message}`)
}
