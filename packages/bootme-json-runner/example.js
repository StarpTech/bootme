'use strict'

/**
 * This will demonstrate how to load the pipeline configuration from JSON
 */

const TaskSpinner = require('bootme-task-spinner')
const JsonRunner = require('./')
const Bootme = require('bootme')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)
new TaskSpinner(pipeline).attach()

let config = [
  {
    task: 'request',
    info: 'Retrieve the IIS position',
    config: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    hooks: {
      onInit: async state => {},
      onBefore: async state => {},
      onAfter: async state => {},
      onError: async err => {}
    }
  },
  {
    task: 'temp',
    info: 'Create temp file',
    config: {
      type: 'file'
    }
  },
  {
    task: 'request',
    info: 'Make request',
    config: {
      url: 'http://google.de',
      contentType: 'text'
    }
  }
]

jsonRunner.run(config)
