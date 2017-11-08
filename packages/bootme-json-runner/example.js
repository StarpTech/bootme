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
    info: 'Retrieve the IIS position',
    request: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    onInit: async state => {},
    onBefore: async state => {},
    onAfter: async state => {},
    onError: async state => {}
  },
  {
    info: 'Create temp file',
    temp: {
      type: 'file'
    }
  },
  {
    info: 'Start request against google',
    request: {
      url: 'http://google.de',
      contentType: 'text'
    }
  }
]

jsonRunner.run(config)
