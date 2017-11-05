'use strict'

const SimpleGit = require('simple-git/promise')
const Path = require('path')
const Task = require('bootme').Task

class CheckoutTask extends Task {
  constructor() {
    super()
    this.git = SimpleGit()
  }
  async action() {
    const path = Path.join(this.config.bootme.basePath, this.config.path)
    await this.git.silent(true).clone(this.config.url, path)
    return path
  }
}

module.exports = CheckoutTask
