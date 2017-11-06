'use strict'

const inquirer = require('inquirer')
const Joi = require('joi')
const Bootme = require('./../packages/bootme')

const task = new Bootme.Task('foo')

task.validateConfig = function(value) {
  return Joi.object()
    .keys({
      size: Joi.string().required(),
      theme: Joi.string().required()
    })
    .validate(value)
}

task.setConfig(async () => {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Order a pizza',
        'Make a reservation',
        new inquirer.Separator(),
        'Ask for opening hours',
        {
          name: 'Contact support',
          disabled: 'Unavailable at this time'
        },
        'Talk to the receptionist'
      ]
    },
    {
      type: 'list',
      name: 'size',
      message: 'What size do you need?',
      choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
      filter: function(val) {
        return val.toLowerCase()
      }
    }
  ])

  return result
})

task.action(async function(state) {
  console.log('Do something!')
  console.log('Config', this.config)
})

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.addTask(task)

registry.addHook('foo', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})

registry.addHook('foo', 'onAfter', async function() {
  console.log(`After ${this.name}`)
})

pipeline.execute()
