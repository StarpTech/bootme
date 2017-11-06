'use strict'

const Bootme = require('./../packages/bootme')
const GitcloneTask = require('./../packages/bootme-gitclone')
const TemplateTask = require('./../packages/bootme-template')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(
  new GitcloneTask('gitclone').setConfig({
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
)

registry.addTask(
  new TemplateTask('replace').setConfig({
    refs: {
      url: 'gitclone' // Poiint to result of previous task
    },
    templateData: {
      project: 'Hello BootMe!'
    },
    files: ['README.md']
  })
)

pipeline.execute()
