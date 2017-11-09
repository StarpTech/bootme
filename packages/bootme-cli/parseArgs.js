'use strict'

const program = require('commander')
const tinysonic = require('tinysonic')
const pkg = require('./package.json')

module.exports = function(argv) {
  program.version(pkg.version).description(pkg.description)

  program
    .option('-c, --config <c>', 'Path to config')
    .option('-t, --template [t]', 'Name of your Template')
    .option('-r, --runner [r]', 'The runner', /^(json)$/i, 'json')

  program.option('-w, --wizard', 'Start interactive cli mode')

  program
    .option('-T, --task <name>', 'Execute a single Task')
    .option('-c, --config <c>', 'Path to config')
    .option('-C, --quick <q>', 'Config as quick JSON syntax', parseAsQuickJson)

  return program.parse(argv)
}

function parseAsQuickJson(value) {
  return tinysonic(value)
}
