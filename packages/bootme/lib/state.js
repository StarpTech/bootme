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

    this.pipeline.registry.addTask(task)

    await this.pipeline.executeTask(task, state)
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
      if (this.pipeline.rollbacked) {
        debug(
          'Task <%s:%s> cancel next Job due to pipeline cancellation',
          this.task.constructor.name,
          this.task.name
        )
        return
      }

      try {
        await fn(new State(child, this.task, this.pipeline))
      } catch (err) {
        debug(
          'Task <%s:%s> execute rollback routines due to (Job) error',
          this.task.constructor.name,
          this.task.name
        )

        // avoid error bubbling otherwise we rollback a second time
        try {
          await this.pipeline.rollback(err)
        } catch (err) {
          error(
            'Task <%s:%s> error during (Job) rollback routine',
            this.task.constructor.name,
            this.task.name
          )
        }
      }
    })
  }
}

module.exports = State
