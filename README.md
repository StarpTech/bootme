[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![Build Status](https://travis-ci.org/StarpTech/bootme.svg?branch=master)](https://travis-ci.org/StarpTech/bootme)
[![Build status](https://ci.appveyor.com/api/projects/status/58ldk1x962nviv03?svg=true)](https://ci.appveyor.com/project/StarpTech/bootme)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![NPM version](https://img.shields.io/npm/v/bootme.svg?style=flat)](https://www.npmjs.com/package/bootme)

# BootMe

A fully configurable and extendable Task Pipeline

## Installation

```
npm install bootme
```

## Features

- Handle nested queues, the order of execution is guaranteed thanks to [workq](https://github.com/delvedor/workq) package.
- Define Before, After, Error Hooks in the Task or via Registry.
- Define recover routine which is triggered as soon as a Hook or a Job fails.
- Share configuration across all Tasks.
- Access to Task results in hooks or jobs.

## Usage

```js
// Create a Task
const task = new Bootme.Task().setName('foo').setConfig({})

task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onError', async function(err) {})

task.action(async function(parent) {
  // Nested Jobs
  parent.addJob(async function(parent) {
    console.log(parent.pipeline.getResult('foo'))
  })

  return 'finished'
})

// Collect and manipulate
const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

// Share config across all Tasks
registry.shareConfig({
  basePath: process.cwd()
})

registry.addTask(task)
registry.addHook('foo', 'onBefore', async function() {
  console.log(`Before ${this.name}`)
})
registry.addHook('foo', 'onAfter', async function() {
  console.log(`After ${this.name}`)
})

// Get result from Task
pipeline.getResult('foo')

// Get error from Task
pipeline.getResult('foo:error')

// Execute
pipeline.execute()
```

### Task Template

```js
const Task = require('bootme').Task

class HttpRequestTask extends Task {
  constructor() {
    super()
  }
  async init() {
    // add before, after, failure hooks
  }
  async action(parent) {
    // Do something!
  }
}
```

## API

  * <a href="#task"><code>bootme.<b>Task()</b></code></a>
  * <a href="#setConfig"><code>bootme.Task#<b>init()</b></code></a>
  * <a href="#setConfig"><code>bootme.Task#<b>setConfig()</b></code></a>
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
  * <a href="#getResult"><code>bootme.Pipeline#<b>getResult()</b></code></a>

-------------------------------------------------------

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
