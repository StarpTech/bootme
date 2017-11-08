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
 * @param {any} TaskType
 * @param {any} name
 * @param {any} settings
 * @param {any} config
 * @returns
 * @memberof JSONRunner
 */
  loadTask(TaskType, name, settings, config) {
    const newTask = new TaskType(name, settings.info).setConfig(config)

    if (settings.onInit && Array.isArray(settings)) {
      settings.onInit.forEach(h => newTask.addhook('onInit', h))
    } else if (typeof settings.onInit === 'function') {
      newTask.addHook('onInit', settings.onInit)
    }

    if (settings.onBefore && Array.isArray(settings)) {
      settings.onBefore.forEach(h => newTask.addhook('onBefore', h))
    } else if (typeof settings.onBefore === 'function') {
      newTask.addHook('onBefore', settings.onBefore)
    }

    if (settings.onAfter && Array.isArray(settings)) {
      settings.onAfter.forEach(h => newTask.addhook('onAfter', h))
    } else if (typeof settings.onAfter === 'function') {
      newTask.addHook('onAfter', settings.onAfter)
    }

    if (settings.onError && Array.isArray(settings)) {
      settings.onError.forEach(h => newTask.addhook('onError', h))
    } else if (typeof settings.onError === 'function') {
      newTask.addHook('onError', settings.onError)
    }

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
            info: config[i]['info'],
            onInit: config[i]['onInit'],
            onBefore: config[i]['onBefore'],
            onAfter: config[i]['onAfter'],
            onError: config[i]['onError']
          }

          // Remove from object because we don't want to validate in the task
          // config schema
          delete config[i]['info']
          delete config[i]['onInit']
          delete config[i]['onBefore']
          delete config[i]['onAfter']
          delete config[i]['onError']

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
