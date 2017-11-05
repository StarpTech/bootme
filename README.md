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
- Define Before, After, Failure Hooks in the Task or via Registry.
- Define recover routine which is triggered as soon as a Hook or a Job fails.
- Share configuration across all Tasks.
- Access to Task results in hooks or jobs.

## Usage

```js
// Create a Task
const task = new Bootme.Task().setName('foo').setConfig({})
task.addHook('onBefore', async function() {})
task.addHook('onAfter', async function() {})
task.addHook('onFailure', async function(err) {})

task.action(async function(parent) {
  // Nested Jobs
  parent.addJob(async function(parent) {
    parent.addJob(async function(parent) {
      // Get result from Task
      console.log(parent.pipeline.getResult('foo'))
    })
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
registry.addHook('foo', 'onBefore', () => console.log('Before foo'))
registry.addHook('foo', 'onAfter', () => console.log('After foo'))

// Get result from Task
pipeline.getResult('foo')
pipeline.getResult('foo:onBefore')
pipeline.getResult('foo:onAfter')

// Get error from Task
pipeline.getResult('foo:error')
pipeline.getResult('foo:onBefore:error')
pipeline.getResult('foo:onAfter:error')

// Execute
pipeline.execute()
```

### Task Template

```js
const Task = require('bootme').Task

class HttpRequestTask extends Task {
  constructor() {
    super()
    // add before, after, failure hooks
  }
  async action(parent) {
    // Do something!
  }
}
```
