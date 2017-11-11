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
    this.hooks = ['onInit', 'onRollback', 'onBefore', 'onAfter']
    this.taskCounter = {}
    this.classProxy = {}
  }
  /**
   *
   *
   * @param {any} task
   * @param {any} name
   * @returns
   * @memberof JSONRunner
   */
  loadTask(task, name) {
    const newTask = new this.classProxy[task.task](name, task.info).setConfig(
      task.config
    )
    this.hooks.forEach(hook => {
      if (task.hooks && task.hooks[hook] && Array.isArray(task.hooks[hook])) {
        task.hooks[hook].forEach(h => newTask.addhook(hook, h))
      } else if (task.hooks && typeof task.hooks[hook] === 'function') {
        newTask.addHook(hook, task.hooks[hook])
      }
    })

    return newTask
  }
  /**
   *
   *
   * @param {any} config
   * @param {any} [options={}]
   * @memberof JSONRunner
   */
  run(config, options = {}) {
    config.forEach((task, i) => {
      let Task
      try {
        // Convention
        Task = require(`bootme-${task.task}`)
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.log(
            `Module "bootme-${task.task}" could not be found. Please install "npm i -s bootme-${task.task}"`
          )
        }
        return
      }

      this.classProxy[task.task] = Task

      // create unique suffix
      if (this.taskCounter[task.task]) {
        this.taskCounter[task.task] += 1
      } else {
        this.taskCounter[task.task] = 1
      }

      const name = task.task + '-' + this.taskCounter[task.task]
      this.registry.addTask(this.loadTask(task, name))
    })

    if (options.restore) {
      this.pipeline.restore()
    } else {
      this.pipeline.execute()
    }
  }
}

module.exports = JSONRunner
