'use strict'

const program = require('commander')
const pkg = require('./package.json')

module.exports = function(argv) {
  return program
    .version(pkg.version)
    .description(pkg.description)
    .option('-c, --config <c>', 'Path to config')
    .option('-t, --template [t]', 'Name of your Template')
    .option('-r, --runner [r]', 'The runner', /^(json)$/i, 'json')
    .parse(argv)
}
