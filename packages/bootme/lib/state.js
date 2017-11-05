'use strict'

const debug = require('debug')('job')
const Task = require('./task')
const Pipeline = require('./pipeline')

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

    if (!(Object.getPrototypeOf(pipeline).isPrototypeOf(pipeline))) {
      throw new TypeError('The Pipeline must be a Pipeline instance')
    }

    this.queue = queue
    this.parentTask = parentTask
    this.pipeline = pipeline
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
          'Job error in Task <%s>, execute recover routine',
          this.parentTask.name
        )
        await this.parentTask.recover(err)
      }
    })
  }
}

module.exports = State
