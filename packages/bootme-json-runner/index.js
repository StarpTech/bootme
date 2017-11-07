'use strict'

/**
 *
 *
 * @class JSONRunner
 */
class JSONRunner {
  constructor(pipeline) {
    this.pipeline = pipeline
    this.registry = pipeline.registry
    this.taskCounter = {}
  }
  /**
   *
   *
   * @param {any} config
   * @memberof JSONRunner
   */
  run(config) {
    config.forEach((task, i) => {
      for (var taskName in task) {
        const taskConfig = config[i][taskName]
        const Task = require(`bootme-${taskName}`)

        // create unique suffix
        if (this.taskCounter[taskName]) {
          this.taskCounter[taskName] += 1
        } else {
          this.taskCounter[taskName] = 1
        }

        if (Array.isArray(taskConfig)) {
          taskConfig.forEach((value, i) => {
            this.registry.addTask(
              new Task(
                taskName + '-' + this.taskCounter[taskName] + '-' + i
              ).setConfig(value)
            )
          })
        } else {
          this.registry.addTask(
            new Task(taskName + '-' + this.taskCounter[taskName]).setConfig(
              taskConfig
            )
          )
        }
      }
    })

    this.pipeline.execute()
  }
}

module.exports = JSONRunner
