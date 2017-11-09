'use strict'

const inquirer = require('inquirer')
const execa = require('execa')
const Chalk = require('chalk')

module.exports = async function wizard() {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'cmd',
      message: 'How can I help you?',
      choices: [
        {
          name: 'Show me all available Bootme modules',
          value: 'allModules'
        }
      ]
    }
  ])

  switch (result.cmd) {
    case 'allModules':
      const keywords = ['bootme', 'task']
      const searchResult = await execa(
        'npm',
        ['search', '--json', '--parseable'].concat(keywords)
      )

      const modules = JSON.parse(searchResult.stdout)
      modules.forEach(m =>
        console.log(Chalk.blue(m.name) + ' - ' + m.description)
      )
      console.log()
      console.log(Chalk.yellow('Just "npm i -s <name>" to install a package'))
      break

    default:
      break
  }

  return result
}
