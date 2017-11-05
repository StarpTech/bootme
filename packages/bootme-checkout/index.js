'use strict'

const SimpleGit = require('simple-git/promise')
const Task = require('bootme').Task

class CheckoutTask extends Task {
  constructor() {
    super()
    this.git = SimpleGit()
  }
  async action() {
    await this.git()
      .silent(true)
      .clone(this.config.repoUrl, this.config.bootme.basePath)
  }
}

module.exports = CheckoutTask
