'use strict'

/**
 * This pipeline will create a docker container and
 * list all available containers on your machine
 */

const Bootme = require('./../packages/bootme')
const DockerTask = require('./../packages/bootme-docker')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(
  new DockerTask('mongodb').setConfig({
    cmd: 'createContainer',
    name: 'testMongodb',
    image: 'tutum/mongodb'
  })
)

registry.addTask(
  new DockerTask('listContainers').setConfig({
    cmd: 'listContainers'
  })
)

registry.addHook('listContainers', 'onAfter', async function() {
  console.log(`After ${this.name} result`)
  console.log(await pipeline.get(`${this.name}`))
})

pipeline.execute()
