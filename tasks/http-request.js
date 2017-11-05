'use strict'

const Task = require('./../').Task

class HttpRequestTask extends Task {
  async action() {
    console.log('Do HTTP Request')
  }
}

module.exports = HttpRequestTask
