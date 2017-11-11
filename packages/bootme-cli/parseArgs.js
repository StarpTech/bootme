'use strict'

const program = require('commander')
const tinysonic = require('tinysonic')
const Chalk = require('chalk')
const pkg = require('./package.json')

module.exports = function(argv) {
  program.version(pkg.version).description(pkg.description)

  program
    .option('-c, --config <path>', 'Path to config')
    .option('-t, --template [name]', 'Name of your Template')
    .option('-r, --restore', 'Restore a pipeline')
    .option('-r, --runner [name]', 'The runner', /^(json)$/i, 'json')

  program.option('-w, --wizard', 'Start interactive cli mode')

  program
    .option('-T, --task <name>', 'Execute a single Task')
    .option('-c, --config <path>', 'Path to config')
    .option(
      '-C, --quick <json>',
      'Config as quick JSON syntax',
      parseAsQuickJson
    )

  return program.parse(argv)
}

function parseAsQuickJson(value) {
  const parsed = tinysonic(value)
  if (parsed === null) {
    console.log(Chalk.bold.red(`Invalid quick JSON syntax error: "${value}"`))
    return
  }
  return parsed
}
