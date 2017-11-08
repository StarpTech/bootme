#! /usr/bin/env node

const Chalk = require('chalk')
const Bootme = require('bootme')
const Fs = require('fs')
const program = require('commander')
const Path = require('path')
const TaskSpinner = require('bootme-task-spinner')
const JsonRunner = require('bootme-json-runner')
const UpdateNotifier = require('update-notifier')
const pkg = require('./package.json')

UpdateNotifier({ pkg }).notify()

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)
new TaskSpinner(pipeline).attach()

program
  .version(pkg.version)
  .option('-c, --config <c>', 'Path to config', '.bootme.json')
  .option('-t, --template [t]', 'Name of your Template')
  .option('-r, --runner [r]', 'The runner', /^(json)$/i, 'json')
  .parse(process.argv)

let jsonConfig
let error

/**
 * Try to load project package
 */
try {
  if (program.template) {
    jsonConfig = require(program.template)
  }
} catch (err) {
  error = err

  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(
      Chalk.bold.yellow(
        `Template "${program.template}" could not be found. Please try "npm i -s ${program.template}"`
      )
    )
  } else {
    console.log(Chalk.bold.red(`Fatal error: ${err.message}`))
  }
}

/**
 * Try to load bootme json config
 */
if (!error && !jsonConfig) {
  try {
    const configPath = Fs.readFileSync(
      Path.resolve(process.cwd(), program.config),
      'utf8'
    )
    jsonConfig = JSON.parse(configPath)
  } catch (err) {
    error = err

    if (err.code === 'ENOENT') {
      console.log(
        Chalk.yellow(
          `Config could not be loaded. Please verify path ${program.config}`
        )
      )
    } else {
      console.log(Chalk.bold.red(`Fatal error: ${err.message}`))
    }
  }
}

if (!error) {
  if (program.runner === 'json') {
    jsonRunner.run(jsonConfig)
  }
}
