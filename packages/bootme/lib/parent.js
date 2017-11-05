'use strict'

const debug = require('debug')('job')
const Task = require('./task')

/**
 *
 *
 * @class Parent
 */
class Parent {
  /**
   * Creates an instance of Parent.
   * @param {any} queue
   * @param {any} parentTask
   * @memberof Parent
   */
  constructor(queue, parentTask) {
    if (!(parentTask instanceof Task)) {
      throw new TypeError('The ParentTask must be a Task instance')
    }

    this.queue = queue
    this.parentTask = parentTask
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
        await fn(new Parent(child, this.parentTask))
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

module.exports = Parent
