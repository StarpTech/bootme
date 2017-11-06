[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![Build Status](https://travis-ci.org/StarpTech/bootme.svg?branch=master)](https://travis-ci.org/StarpTech/bootme)
[![Build status](https://ci.appveyor.com/api/projects/status/58ldk1x962nviv03?svg=true)](https://ci.appveyor.com/project/StarpTech/bootme)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![NPM version](https://img.shields.io/npm/v/bootme.svg?style=flat)](https://www.npmjs.com/package/bootme)

# BootMe

Configurable and extendable Task pipeline. Bootme help you to scaffold complete projects, services or other useful parts without fuss. It comes with a minimal API, no Framework, no Generator. When size matters _~10KB_.

## Installation

```
npm install bootme
```

## Features

- Handle nested queues, the order of execution is guaranteed thanks to [Workq](https://github.com/delvedor/workq) package.
- Define Before, After, Error Hooks in the Task or via Registry.
- Define recover routines which are triggered as soon as a Hook, Task or a Job fails.
- Share configuration across all Tasks.
- Access Task results in Hooks or Jobs.
- Reference to Task results in other Tasks.
- Task config and result validation with [Joi](https://github.com/hapijs/joi)
- [Easy](examples/basic-wizard.js) integration of CLI Wizard thanks to [Inquirer](https://github.com/SBoudrias/Inquirer.js)

## Usage

```js
const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(
  new GitcloneTask().setName('gitclone')
  .setConfig({
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
  .addHook('onError', async (err) => console.log(err))
  .addHook('onBefore', async () => ...)
  .addHook('onAfter', async () => ...)
)

registry.addTask(
  new TemplateTask().setName('replace')
  .setConfig({
    refs: {
      url: 'gitclone' // Point to the result of named Task
    },
    templateData: {
      project: 'Hello BootMe!'
    },
    files: ['README.md']
  })
  .addHook('onError', async (err) => console.log(err))
  .addHook('onBefore', async () => ...)
  .addHook('onAfter', async () => ...)
)

registry.addHook('gitclone', 'onError', async (err) => console.log(err))

pipeline.execute()
```

### Integrate Commandline prompt

```js
const inquirer = require('inquirer')

const task = new Task().setName('pizza')
  task.setConfig(async () => {
    const result = await inquirer.prompt([
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

registry.addTask(task)
```


### Task Template

```js
const Task = require('bootme').Task

class HttpRequestTask extends Task {
  async init(state) {}
  async action(state) {}
  async validateResult(value) {}
  validateConfig(value) {}
}
```

## Examples

[Here](examples)

## API

  * <a href="#task"><code>bootme.<b>Task()</b></code></a>
  * <a href="#init"><code>bootme.Task#<b>init()</b></code></a>
  * <a href="#setConfig"><code>bootme.Task#<b>setConfig()</b></code></a>
  * <a href="#validateResult"><code>bootme.Task#<b>validateResult()</b></code></a>
  * <a href="#validateConfig"><code>bootme.Task#<b>validateConfig()</b></code></a>
  * <a href="#setName"><code>bootme.Task#<b>setName()</b></code></a>
  * <a href="#addHook"><code>bootme.Task#<b>addHook()</b></code></a>
  * <a href="#action"><code>bootme.Task#<b>action()</b></code></a>
  * <a href="#config"><code>bootme.Task#<b>config</b></code></a>
  * <a href="#executeHooks"><code>bootme.Task#<b>executeHooks()</b></code></a>
  * <a href="#start"><code>bootme.Task#<b>start()</b></code></a>
  * <a href="#recover"><code>bootme.Task#<b>recover()</b></code></a>

  * <a href="#registry"><code>bootme.<b>Registry()</b></code></a>
  * <a href="#addTask"><code>bootme.Registry#<b>addTask()</b></code></a>
  * <a href="#shareConfig"><code>bootme.Registry#<b>shareConfig()</b></code></a>
  * <a href="#addHookRegistry"><code>bootme.Registry#<b>addHook()</b></code></a>

  * <a href="#Pipeline"><code>bootme.<b>Pipeline()</b></code></a>
  * <a href="#execute"><code>bootme.Pipeline#<b>execute()</b></code></a>
  * <a href="#get"><code>bootme.Pipeline#<b>get()</b></code></a>
  * <a href="#rollback"><code>bootme.Pipeline#<b>rollback()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>hasError()</b></code></a>

-------------------------------------------------------

## Packages

| General | Version | Description |
|--------|-------|-------|
| [bootme-request](https://github.com/starptech/bootme/tree/master/packages/bootme-request) | [![npm](https://img.shields.io/npm/v/bootme-request.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-request) | Start HTTP request |
| [bootme-gitclone](https://github.com/starptech/bootme/tree/master/packages/bootme-gitclone) | [![npm](https://img.shields.io/npm/v/bootme-gitclone.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-gitclone) | Clone a Git Repository |
| [bootme-template](https://github.com/starptech/bootme/tree/master/packages/bootme-template) | [![npm](https://img.shields.io/npm/v/bootme-template.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-template) | Mustache Templating |
| [bootme-shell](https://github.com/starptech/bootme/tree/master/packages/bootme-shell) | [![npm](https://img.shields.io/npm/v/bootme-shell.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-shell) | Portable Unix shell commands |

## Contributing

### Run Tests

```
lerna run test
```

### Debugging
We use the excellent [Debug](https://github.com/visionmedia/debug) package.
```
$env:DEBUG = "*,-not_this" // Windows
```
