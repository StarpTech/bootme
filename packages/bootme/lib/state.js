'use strict'

const debug = require('debug')('bootme:job')
const error = require('debug')('bootme:job:error')
const Task = require('./task')

/**
 *
 *
 * @class Parent
 */
class State {
  /**
   * Creates an instance of Parent.
   * @param {any} queue
   * @param {any} task
   * @memberof Parent
   */
  constructor(queue, task, pipeline) {
    if (!(task instanceof Task)) {
      throw new TypeError('The Task must be a Task instance')
    }

    this.queue = queue
    this.task = task
    this.pipeline = pipeline
  }
  /**
   *
   *
   * @param {any} name
   * @returns
   * @memberof State
   */
  getValue(name) {
    const res = this.pipeline.results.get(name)

    if (res === undefined) {
      for (var key in this.task.config.refs) {
        if (this.task.config.refs[key] === name) {
          return this.task.config[key]
        }
      }
    }

    return res
  }
  /**
   *
   *
   * @param {any} task
   * @param {any} state
   * @memberof State
   */
  async addTask(task) {
    const state = this

    try {
      this.pipeline.registry.addTask(task)
      await this.pipeline.executeTask(task, state)
    } catch (err) {
      debug(
        'Task <%s:%s> execute rollback routines due to (Task) error %O',
        this.task.constructor.name,
        this.task.name,
        err
      )

      this.pipeline.error = err
      await this.pipeline.rollback()
    }
  }
  /**
   *
   *
   * @param {any} fn
   * @memberof Parent
   */
  addJob(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('The Job handler must be a function')
    }

    this.queue.add(async child => {
      try {
        await fn(new State(child, this.task, this.pipeline))
      } catch (err) {
        debug(
          'Task <%s:%s> execute rollback routines due to (Job) error %O',
          this.task.constructor.name,
          this.task.name,
          err
        )

        this.pipeline.error = err
        await this.pipeline.rollback()
      }
    })
  }
}

module.exports = State
