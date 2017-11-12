#! /usr/bin/env node

const Chalk = require('chalk')
const Fs = require('fs')
const Path = require('path')
const TaskSpinner = require('bootme-task-spinner')
const JsonRunner = require('bootme-json-runner')
const UpdateNotifier = require('update-notifier')
const pkg = require('./package.json')
const parseArgs = require('./parseArgs')
const wizard = require('./wizard')

UpdateNotifier({ pkg }).notify()

/**
 *
 *
 * @param {any} argv
 */
async function run(argv) {
  const program = parseArgs(argv)

  if (program.debug) {
    process.env.DEBUG = 'bootme:*'
  }

  const Bootme = require('bootme')
  const registry = new Bootme.Registry()
  const pipeline = new Bootme.Pipeline(registry)
  const jsonRunner = new JsonRunner(pipeline)
  new TaskSpinner(pipeline).attach()

  let jsonConfig

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

    runRunner(jsonConfig, program.restore)

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
    } else if (typeof program.quick === 'object') {
      taskConfig = {
        config: program.quick
      }
    } else {
      return
    }

    const task = Object.assign(
      {
        task: program.task
      },
      taskConfig
    )

    // Build pipeline with single item
    jsonConfig = [task]

    await runRunner(jsonConfig, program.restore)

    return
  }

  // Load config only when we try to execute an array of tasks
  if (program.config) {
    jsonConfig = loadConfigFile(program.config)
    if (!jsonConfig) {
      return
    }

    await runRunner(jsonConfig, program.restore)
  }

  async function runRunner(config, restore = false) {
    try {
      if (restore) {
        console.log(Chalk.bold.green(`Restore ...`))
      } else {
        console.log(Chalk.bold.green(`Executing ...`))
      }
      await jsonRunner.run(config, { restore })
    } catch (err) {
      if (restore) {
        console.log(Chalk.bold.red(`Pipeline could not be restored`))
      } else {
        console.log(Chalk.bold.red(`Pipeline could not be excuted`))
      }
      console.log(Chalk.bold.yellow(`"${err.message}"`))
    }
  }

  // rollback when user cancel it with CTRL+C
  process.on('SIGINT', async () => {
    await pipeline.rollback()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    await pipeline.rollback()
    process.exit(0)
  })
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
