'use strict'

const debug = require('debug')('job')
const error = require('debug')('job:error')
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
   * @param {any} parentTask
   * @memberof Parent
   */
  constructor(queue, parentTask, pipeline) {
    if (!(parentTask instanceof Task)) {
      throw new TypeError('The ParentTask must be a Task instance')
    }

    this.queue = queue
    this.parentTask = parentTask
    this.pipeline = pipeline
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
    this.pipeline.executeTask(task, state)
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
        await fn(new State(child, this.parentTask, this.pipeline))
      } catch (err) {
        debug(
          'Task <%s> execute rollback routines cause (Job) error',
          this.parentTask.name
        )

        // avoid error bubbling otherwise we rollback a second time
        try {
          await this.pipeline.rollback(err)
        } catch (err) {
          error(
            'Task <%s> error during (Job) rollback routine',
            this.parentTask.name
          )
        }
      }
    })
  }
}

module.exports = State
