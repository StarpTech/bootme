'use strict'

/**
 * This pipeline will create a docker container and
 * list all available containers on your machine
 */

const Bootme = require('./../packages/bootme')
const DockerTask = require('./../packages/bootme-docker')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

const createContainerTask = new DockerTask('mongodb')
createContainerTask.setConfig({
  cmd: 'createContainer',
  name: 'testMongodb',
  image: 'tutum/mongodb'
})

registry.addTask(createContainerTask)

const listContainerTask = new DockerTask('listContainers')
listContainerTask.setConfig({
  cmd: 'listContainers'
})

registry.addTask(listContainerTask)

registry.addHook('listContainers', 'onAfter', async function(state) {
  console.log(`After ${this.name} result`)
  console.log(await state.getValue(`${this.name}`))
})

pipeline.execute()
