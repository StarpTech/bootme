#! /usr/bin/env node

const Chalk = require('chalk')
const Bootme = require('bootme')
const Fs = require('fs')
const Path = require('path')
const TaskSpinner = require('bootme-task-spinner')
const JsonRunner = require('bootme-json-runner')
const UpdateNotifier = require('update-notifier')
const pkg = require('./package.json')
const parseArgs = require('./parseArgs')
const wizard = require('./wizard')

UpdateNotifier({ pkg }).notify()

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)
new TaskSpinner(pipeline).attach()

async function run(argv) {
  const program = parseArgs(argv)

  let jsonConfig
  let error

  // show wizard when user has no intention to run something
  if (!program.config && !program.template) {
    await wizard()
    return
  }

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

    return
  }

  /**
 * Try to load bootme json config
 */
  if (!error && !jsonConfig) {
    try {
      const configPath = Path.resolve(process.cwd(), program.config)
      if (Path.extname(configPath) !== '.js') {
        const content = Fs.readFileSync(
          Path.resolve(process.cwd(), program.config),
          'utf8'
        )
        jsonConfig = JSON.parse(content)
      } else {
        jsonConfig = require(configPath)
      }
    } catch (err) {
      error = err

      if (err.code === 'ENOENT') {
        console.log(
          Chalk.yellow(
            `Config could not be loaded. Please verify config path "${program.config}"`
          )
        )
      } else {
        console.log(Chalk.bold.red(`Fatal error: ${err.message}`))
      }

      return
    }
  }

  if (program.runner === 'json') {
    jsonRunner.run(jsonConfig)
  }
}

run(process.argv)
