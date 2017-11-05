'use strict'

const Task = require('bootme').Task

class TemplateTask extends Task {
  async init(state) {
    const results = await state.pipeline.get(this.config.deps)
    console.log(results)
  }
  async action() {}
}

module.exports = TemplateTask
