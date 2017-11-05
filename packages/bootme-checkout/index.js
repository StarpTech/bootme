'use strict'

const SimpleGit = require('simple-git/promise')
const Path = require('path')
const del = require('del')
const Task = require('bootme').Task

class CheckoutTask extends Task {
  constructor() {
    super()
    this.git = SimpleGit()
  }
  async init() {
    this.path = Path.join(this.config.bootme.basePath, this.config.path)
    this.addHook('onError', async () => del([this.path]))
  }
  async action() {
    await this.git.silent(true).clone(this.config.url, this.path)
    return this.path
  }
}

module.exports = CheckoutTask
