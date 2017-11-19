'use strict'

/**
 * This pipeline will checkout a sample respository, parse files as mustach and replace the original content.
 */

const Bootme = require('./../packages/bootme')
const GitcloneTask = require('./../packages/bootme-gitclone')
const TemplateTask = require('./../packages/bootme-template')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const cloneTask = new GitcloneTask('gitclone')
cloneTask.setConfig({
  url: 'https://github.com/netzkern/eslint-config-netzkern-base',
  path: '/test-checkout'
})

registry.addTask(cloneTask)

const replaceTask = new TemplateTask('replace')
replaceTask.setConfig({
  refs: {
    url: 'gitclone' // Point to result of previous task
  },
  templateData: {
    project: 'Hello BootMe!'
  },
  files: ['README.md']
})

registry.addTask(replaceTask)

pipeline.execute()
