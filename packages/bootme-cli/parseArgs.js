'use strict'

const program = require('commander')
const tinysonic = require('tinysonic')
const Chalk = require('chalk')
const pkg = require('./package.json')

module.exports = function(argv) {
  program.version(pkg.version).description(pkg.description)

  program
    .option('-c, --config <path>', 'path to config')
    .option('-t, --template [name]', 'name of your Template')
    .option('-r, --restore', 'restore a pipeline')
    .option('-r, --runner [name]', 'the runner', /^(json)$/i, 'json')

  program.option('-w, --wizard', 'start interactive cli mode')

  program
    .option('-T, --task <name>', 'execute a single Task')
    .option('-c, --config <path>', 'path to config')
    .option(
      '-C, --quick <json>',
      'config as quick JSON syntax',
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
