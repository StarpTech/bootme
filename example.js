'use strict'

const Bootme = require('./')

const task = new Bootme.Task().setName('test')

task.before(async function() {})
task.action(async function() {})
task.recover(async function() {})
task.after(async function() {})

const registry = new Bootme.Registry()
registry.addTask(task)

const pipeline = new Bootme.Pipeline(registry)
pipeline.execute()
