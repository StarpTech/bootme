'use strict'

// Ora will gracefully not do anything when there's no TTY or when in a CI.
const Ora = require('ora')

/**
 *
 *
 * @class TaskSpinner
 */
class TaskSpinner {
  /**
   * Creates an instance of TaskSpinner.
   * @param {any} pipeline
   * @memberof TaskSpinner
   */
  constructor(pipeline) {
    this.pipeline = pipeline
    this.spinners = new Map()
    return this
  }
  /**
   *
   *
   * @memberof TaskSpinner
   */
  attach() {
    this.pipeline.onTaskStart(state => {
      let spinnerMsg = state.task.name
      if (state.task.info) {
        spinnerMsg += `: ${state.task.info}`
      }
      this.spinners.set(
        state.task.name,
        new Ora({
          text: spinnerMsg,
          stream: process.stdout
        }).start()
      )
    })

    this.pipeline.onRollback(state => {
      const spinner = this.spinners.get(state.task.name)
      if (spinner) {
        spinner.info(`Rollback ${state.task.name}`)
      }
    })

    this.pipeline.onTaskEnd(state => {
      if (state.pipeline.error) {
        this.spinners.get(state.task.name).fail()
        this.spinners
          .get(state.task.name)
          .fail(`${state.task.name}: Error: ${state.pipeline.error.message}`)
        this.spinners.get(state.task.name).stop()
      } else {
        if (state.pipeline.restored) {
          this.spinners.get(state.task.name).warn()
        } else {
          this.spinners.get(state.task.name).succeed()
        }
      }
    })
  }
}

module.exports = TaskSpinner
