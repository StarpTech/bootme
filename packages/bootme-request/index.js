'use strict'

const r2 = require('r2')
const Task = require('bootme').Task

class HttpRequestTask extends Task {
  async action() {
    const result = await r2[this.config.method.toLowerCase()](
      this.config.url,
      this.config.options
    )
    return result
  }
}

module.exports = HttpRequestTask
