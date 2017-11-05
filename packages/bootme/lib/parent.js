const debug = require('debug')('job')

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
