'use strict'

const Bootme = require('./')

const task = new Bootme.Task().setName('test')

task.before(async function() {})
task.action(async function() {})
task.restore(async function() {})
task.after(async function() {})

task.start()
