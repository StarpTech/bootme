'use strict'

const SimpleGit = require('simple-git/promise')
const Task = require('bootme').Task

class CheckoutTask extends Task {
  constructor() {
    super()
    this.git = SimpleGit()
    this.repoUrl = this.config.repoUrl
    this.localUrl = this.config.localUrl
  }
  async action() {
    await this.git()
      .silent(true)
      .clone(this.repoUrl, this.localUrl)
  }
}

module.exports = CheckoutTask
