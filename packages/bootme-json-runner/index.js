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
    this.hooks = ['onInit', 'onError', 'onBefore', 'onAfter']
    this.taskCounter = {}
  }
  /**
 *
 *
 * @param {any} TaskType
 * @param {any} name
 * @param {any} settings
 * @param {any} config
 * @returns
 * @memberof JSONRunner
 */
  loadTask(TaskType, name, settings, config) {
    const newTask = new TaskType(name, settings.info).setConfig(config)
    this.hooks.forEach(hook => {
      if (settings[hook] && Array.isArray(settings)) {
        settings[hook].forEach(h => newTask.addhook(hook, h))
      } else if (typeof settings[hook] === 'function') {
        newTask.addHook(hook, settings[hook])
      }
    })

    return newTask
  }
  /**
   *
   *
   * @param {any} config
   * @memberof JSONRunner
   */
  run(config) {
    config.forEach((task, i) => {
      for (var key in task) {
        const taskConfig = config[i][key]

        // Task config is an object everything else is task configuration
        if (typeof taskConfig === 'object' && !Array.isArray(taskConfig)) {
          const taskSettings = {
            info: config[i]['info']
          }

          this.hooks.forEach(hook => {
            taskSettings[hook] = config[i][hook]
          })

          // Remove from object because we don't want to validate in the task
          // config schema
          delete config[i]['info']
          this.hooks.forEach(hook => {
            delete config[i][hook]
          })

          let Task
          try {
            // Convention
            Task = require(`bootme-${key}`)
          } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
              console.log(
                `Module "bootme-${key}" could not be found. Please try "npm i -s bootme-${key}"`
              )
            }
          }

          // create unique suffix
          if (this.taskCounter[key]) {
            this.taskCounter[key] += 1
          } else {
            this.taskCounter[key] = 1
          }

          if (Array.isArray(taskConfig)) {
            taskConfig.forEach((value, i) => {
              const name = key + '-' + this.taskCounter[key] + '-' + i
              this.registry.addTask(
                this.loadTask(Task, name, taskSettings, taskConfig)
              )
            })
          } else {
            const name = key + '-' + this.taskCounter[key]
            this.registry.addTask(
              this.loadTask(Task, name, taskSettings, taskConfig)
            )
          }

          break
        }
      }
    })

    this.pipeline.execute()
  }
}

module.exports = JSONRunner
