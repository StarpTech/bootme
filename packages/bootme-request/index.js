'use strict'

const Task = require('bootme').Task

class HttpRequestTask extends Task {
  async action() {
    console.log('Do HTTP Request')
  }
}

module.exports = HttpRequestTask
