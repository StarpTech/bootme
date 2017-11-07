'use strict'

/**
 * This pipeline will list all available containers on your machine and
 * logged the informations about your selected container
 */

const inquirer = require('inquirer')
const Bootme = require('./../packages/bootme')
const DockerTask = require('./../packages/bootme-docker')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const listTask = new DockerTask('list').setConfig({ cmd: 'listContainers' })

const inspectTask = new DockerTask('inspect')
  .setConfig(async state => {
    const result = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Select a container',
        choices: async function(val) {
          const containers = await state.pipeline.get('list')
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
  .addHook('onAfter', async () => {
    const infos = await pipeline.get('inspect')
    console.log(infos.State)
  })

registry.addTask(listTask)
registry.addTask(inspectTask)

pipeline.execute()
