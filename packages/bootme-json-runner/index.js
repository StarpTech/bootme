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
        const taskInfo = config[i]['info']

        // Remove from object because we don't want to validate in the task
        // config schema
        delete config[i]['info']
        let Task
        try {
          // Convention
          Task = require(`bootme-${taskName}`)
        } catch (err) {
          if (err.code === 'MODULE_NOT_FOUND') {
            console.log(
              `Module "bootme-${taskName}" could not be found. Please try "npm i -s bootme-${taskName}"`
            )
          }
        }

        // create unique suffix
        if (this.taskCounter[taskName]) {
          this.taskCounter[taskName] += 1
        } else {
          this.taskCounter[taskName] = 1
        }

        if (Array.isArray(taskConfig)) {
          taskConfig.forEach((value, i) => {
            const name = taskName + '-' + this.taskCounter[taskName] + '-' + i
            this.registry.addTask(new Task(name, taskInfo).setConfig(value))
          })
        } else {
          const name = taskName + '-' + this.taskCounter[taskName]
          this.registry.addTask(new Task(name, taskInfo).setConfig(taskConfig))
        }
      }
    })

    this.pipeline.execute()
  }
}

module.exports = JSONRunner
