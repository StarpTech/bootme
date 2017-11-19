'use strict'

/**
 * This pipeline will list all available containers on your machine and will
 * log the informations about your selected container
 */

const inquirer = require('inquirer')
const Bootme = require('./../packages/bootme')
const DockerTask = require('./../packages/bootme-docker')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const listTask = new DockerTask('list')
listTask.setConfig({ cmd: 'listContainers' })

const inspectTask = new DockerTask('inspect')
inspectTask
  .setConfig(async state => {
    const result = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Select a container',
        choices: async function(val) {
          const containers = await state.getValue('list')
          return containers.map(x => {
            if (x.Names.length) {
              return x.Names[0]
            } else {
              return x.Id
            }
          })
        }
      }
    ])

    return {
      name: result.name.slice(1),
      cmd: 'inspectContainer'
    }
  })
  .addHook('onAfter', async state => {
    const infos = await state.getValue('inspect')
    console.log(infos.State)
  })

registry.addTask(listTask)
registry.addTask(inspectTask)

pipeline.execute()
