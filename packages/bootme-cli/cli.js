#! /usr/bin/env node

const Chalk = require('chalk')
const Bootme = require('bootme')
const Fs = require('fs')
const program = require('commander')
const Path = require('path')
const TaskSpinner = require('bootme-task-spinner')
const JsonRunner = require('bootme-json-runner')
const UpdateNotifier = require('update-notifier')
const inquirer = require('inquirer')
const execa = require('execa')
const pkg = require('./package.json')

UpdateNotifier({ pkg }).notify()

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)
new TaskSpinner(pipeline).attach()

async function run() {
  program
    .version(pkg.version)
    .description(pkg.description)
    .option('-c, --config <c>', 'Path to config')
    .option('-t, --template [t]', 'Name of your Template')
    .option('-r, --runner [r]', 'The runner', /^(json)$/i, 'json')
    .parse(process.argv)

  let jsonConfig
  let error

  // show wizard when user has no intention to run something
  if (!program.config && !program.template) {
    const result = await inquirer.prompt([
      {
        type: 'list',
        name: 'cmd',
        message: 'How can I help you?',
        choices: [
          {
            name: 'Show me all available Bootme modules',
            value: 'allModules'
          }
        ]
      }
    ])

    switch (result.cmd) {
      case 'allModules':
        const searchResult = await execa.shell(
          'npm search --json --parseable bootme task'
        )

        const modules = JSON.parse(searchResult.stdout)
        modules.forEach(m =>
          console.log(Chalk.blue(m.name) + ' - ' + m.description)
        )
        console.log()
        console.log(Chalk.yellow('Just "npm i -s <name>" to install a package'))
        break

      default:
        break
    }

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
            `Config could not be loaded. Please verify config path "${program.config}"`
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
}

run()
