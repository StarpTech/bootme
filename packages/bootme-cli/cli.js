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

/**
 *
 *
 * @param {any} argv
 */
async function run(argv) {
  const program = parseArgs(argv)

  let jsonConfig
  // show wizard when user has no intention to run something
  if (program.wizard) {
    await wizard()
    return
  }

  // Load pipeline config for project from NPM package
  if (program.template) {
    jsonConfig = loadBootmeModule(program.template)
    if (!jsonConfig) {
      return
    }

    jsonRunner.run(jsonConfig)

    return
  }

  // Load specific task from NPM package
  if (program.task) {
    let taskConfig
    const Task = loadBootmeModule(program.task)
    if (!Task) {
      return
    }

    // Load config for task or fallback to quick json syntax
    if (program.config) {
      taskConfig = loadConfigFile(program.config)
      if (!taskConfig) {
        return
      }
    } else if (program.quick) {
      taskConfig = {
        config: program.quick
      }
    }

    const task = Object.assign(
      {
        task: program.task
      },
      taskConfig
    )

    // Build pipeline with single item
    jsonConfig = [task]

    jsonRunner.run(jsonConfig)

    return
  }

  // Load config only when we try to execute an array of tasks
  if (program.config && !program.task) {
    jsonConfig = loadConfigFile(program.config)
    if (!jsonConfig) {
      return
    }

    jsonRunner.run(jsonConfig)
  }
}

/**
 *
 *
 * @param {any} name
 * @returns
 */
function loadBootmeModule(name) {
  let Task
  try {
    // Convention
    Task = require(`bootme-${name}`)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(
        Chalk.bold.red(
          `Module "bootme-${name}" could not be found. Please install "npm i -s bootme-${name}"`
        )
      )
    } else {
      console.log(Chalk.bold.red(`Fatal error: ${err.message}`))
    }
  }
  return Task
}

/**
 *
 *
 * @param {any} configFlag
 * @returns
 */
function loadConfigFile(configFlag) {
  let jsonConfig
  try {
    const configPath = Path.resolve(process.cwd(), configFlag)
    if (Path.extname(configPath) !== '.js') {
      const content = Fs.readFileSync(
        Path.resolve(process.cwd(), configFlag),
        'utf8'
      )
      jsonConfig = JSON.parse(content)
    } else {
      jsonConfig = require(configPath)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(
        Chalk.yellow(
          `Config could not be loaded. Please verify config path "${configFlag}"`
        )
      )
    } else {
      console.log(Chalk.bold.red(`Fatal error: ${err.message}`))
    }
  }
  return jsonConfig
}

run(process.argv)
