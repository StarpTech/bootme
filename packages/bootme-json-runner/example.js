'use strict'

/**
 * This wil demonstrate how to load the task configuration from JSON and pass them
 * as args to cli tool
 */

const JsonRunner = require('./')
const Bootme = require('bootme')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)

let config = [
  {
    gitclone: [
      {
        url: 'https://github.com/netzkern/eslint-config-netzkern-base',
        path: '/test-checkout'
      },
      {
        url: 'https://github.com/netzkern/eslint-config-netzkern-base',
        path: '/test-checkout2'
      }
    ]
  },
  {
    shell: {
      cmd: 'echo',
      args: ['Hello']
    }
  },
  {
    shell: {
      cmd: 'echo',
      args: ['Hello']
    }
  },
  {
    template: {
      refs: {
        url: 'gitclone-1-1' // Point to result of previous task
      },
      templateData: {
        project: 'Hello BootMe!'
      },
      files: ['README.md']
    }
  }
]

jsonRunner.run(config)
