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
  loadTask(TaskType, task, name) {
    const newTask = new TaskType(name, task.info).setConfig(task.config)
    console.log(newTask, TaskType)
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
   * @memberof JSONRunner
   */
  run(config) {
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

      // create unique suffix
      if (this.taskCounter[task.task]) {
        this.taskCounter[task.task] += 1
      } else {
        this.taskCounter[task.task] = 1
      }

      const name = task.task + '-' + this.taskCounter[task.task]
      this.registry.addTask(this.loadTask(Task, task, name))
    })

    this.pipeline.execute()
  }
}

module.exports = JSONRunner
