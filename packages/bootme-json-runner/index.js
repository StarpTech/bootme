'use strict'

const Bootme = require('bootme')

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
  async loadTask(task, name) {
    const newTask = new this.classProxy[task.task](name, task.info)
    await newTask.setConfig(task.config)

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
  async run(config, options = {}) {
    for (const task of config) {
      if (task.task instanceof Bootme.Task) {
        this.registry.addTask(task.task)
        return
      }

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

      try {
        const name = task.task + '-' + this.taskCounter[task.task]
        const t = await this.loadTask(task, name)
        this.registry.addTask(t)
      } catch (err) {
        // add task context to error
        throw new Error(
          `Error in Task "${task.task instanceof Bootme.Task
            ? task.task.name
            : task.task}". Reason: ${err.name} -> ${err.message}`
        )
      }
    }

    if (options.restore) {
      await this.pipeline.restore()
    } else {
      await this.pipeline.execute()
    }
  }
}

module.exports = JSONRunner
