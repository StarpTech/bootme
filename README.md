[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![Build Status](https://travis-ci.org/StarpTech/bootme.svg?branch=master)](https://travis-ci.org/StarpTech/bootme)
[![Build status](https://ci.appveyor.com/api/projects/status/58ldk1x962nviv03?svg=true)](https://ci.appveyor.com/project/StarpTech/bootme)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![NPM version](https://img.shields.io/npm/v/bootme.svg?style=flat)](https://www.npmjs.com/package/bootme)

# BootMe

Configurable and extendable Task pipeline. Bootme help you to run a list of tasks as a transaction and provide an api to hook into lifecycle events.
We use Bootme to scaffold complete projects, services or other useful parts without fuss. It comes with a minimal API. When size matters _~10KB_.

## Installation

- **Requires Node.Js >= 8**

```
npm install bootme
```

## Core features

- **Hooks**: define `Init`, `Before`, `After`, `Error` Hooks in the Task or with the Registry.
- **Rollback**: the pipeline behaves fully transactional. Define rollback routines which are triggered as soon as a `Hook`, `Task` or a `Job` or nested thing fail.
- **Configuration**: configure your Task with JSON or pass an [inquirer](https://github.com/SBoudrias/Inquirer.js) prompt to setup your config at runtime.
- **Composable**: work with results of previous Tasks, pass Tasks to Hooks or add Tasks in Tasks.
- **100% asynchronous**: all the core is implemented with asynchronous code. ES7 allow us to write good readable code.
- **Validation**: you can validate the result and config of your Task with [Joi](https://github.com/hapijs/joi).
- **CLI Wizards**: create beautiful Command-line Wizards with [ease](examples/basic-wizard.js).
- **Queue**: the order of execution is guaranteed thanks to [Workq](https://github.com/delvedor/workq) package.

## Usage

```js
const Bootme = require('bootme')
const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)

registry.shareConfig({
  TOKEN: process.env.TOKEN
})

registry.addTask(
  new Task('sample')
  .setConfig({})
  .addHook('onError', async (err) => ...)
  .addHook('onBefore', async (state) => ...)
  .addHook('onAfter', async (state) => ...)
)

registry.addHook('sample', 'onError', async (err) => ...)
registry.addHook('sample', 'onAfter', new Task('bar'))

pipeline.execute()
```

### Task Template

```js
const Task = require('bootme').Task

class SampleTask extends Task {
  constructor(name) {
    super(name)
  }
  async init(state) {}
  async action(state) {}
  async validateResult(value) {}
  validateConfig(value) {}
}
```

## Task Lifecycle

- <code>bootme.Task<b>()</b></code>
- Load configuration
- <code>bootme.Task#<b>validateConfig()</b></code>
- Fire `onInit` hooks (`init` is also a hook)
- Fire `onBefore` hooks
- Fire `action`
- <code>bootme.Task#<b>validateResult()</b></code>
- Fire `onAfter` hooks

**An error in the cycle will abort the complete pipeline and execute the `onError` routines of all Tasks.**

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
  * <a href="#rollback"><code>bootme.Task#<b>rollback()</b></code></a>

  * <a href="#registry"><code>bootme.<b>Registry()</b></code></a>
  * <a href="#addTask"><code>bootme.Registry#<b>addTask()</b></code></a>
  * <a href="#setRef"><code>bootme.Registry#<b>setRef()</b></code></a>
  * <a href="#registrySetConfig"><code>bootme.Registry#<b>setConfig()</b></code></a>
  * <a href="#shareConfig"><code>bootme.Registry#<b>shareConfig()</b></code></a>
  * <a href="#addHookRegistry"><code>bootme.Registry#<b>addHook()</b></code></a>

  * <a href="#Pipeline"><code>bootme.<b>Pipeline()</b></code></a>
  * <a href="#execute"><code>bootme.Pipeline#<b>execute()</b></code></a>
  * <a href="#getValue"><code>bootme.Pipeline#<b>getValue()</b></code></a>
  * <a href="#rollback"><code>bootme.Pipeline#<b>rollback()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>hasError()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>hasResult()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>onTaskStart()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>onTaskEnd()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>onRollback()</b></code></a>

  * <a href="#State"><code>bootme.<b>State()</b></code></a>
  * <a href="#addJob"><code>bootme.State#<b>addJob()</b></code></a>
  * <a href="#addTask"><code>bootme.State#<b>addTask()</b></code></a>
  * <a href="#StateGetValue"><code>bootme.State#<b>getValue()</b></code></a>

-------------------------------------------------------

## Tools

| General | Version | Description |
|--------|-------|-------|
| [bootme-cli](https://github.com/starptech/bootme/tree/master/packages/bootme-cli) | [![npm](https://img.shields.io/npm/v/bootme-cli.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-cli) | Run Bootme Tasks from the console |
| [bootme-json-runner](https://github.com/starptech/bootme/tree/master/packages/bootme-json-runner) | [![npm](https://img.shields.io/npm/v/bootme-json-runner.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-json-runner) | Load pipeline configuration from JSON |
| [bootme-task-spinner](https://github.com/starptech/bootme/tree/master/packages/bootme-task-spinner) | [![npm](https://img.shields.io/npm/v/bootme-task-spinner.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-task-spinner) | Elegant terminal spinner when your Tasks are running |

## Tasks
| General | Version | Description |
|--------|-------|-------|
| [bootme-githook](https://github.com/starptech/bootme/tree/master/packages/bootme-githook) | [![npm](https://img.shields.io/npm/v/bootme-githook.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-githook) | Cross-platform git hooks |
| [bootme-request](https://github.com/starptech/bootme/tree/master/packages/bootme-request) | [![npm](https://img.shields.io/npm/v/bootme-request.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-request) | Start HTTP request |
| [bootme-gitclone](https://github.com/starptech/bootme/tree/master/packages/bootme-gitclone) | [![npm](https://img.shields.io/npm/v/bootme-gitclone.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-gitclone) | Clone a Git Repository |
| [bootme-template](https://github.com/starptech/bootme/tree/master/packages/bootme-template) | [![npm](https://img.shields.io/npm/v/bootme-template.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-template) | Mustache Templating |
| [bootme-shell](https://github.com/starptech/bootme/tree/master/packages/bootme-shell) | [![npm](https://img.shields.io/npm/v/bootme-shell.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-shell) | Portable Unix shell commands |
| [bootme-docker](https://github.com/starptech/bootme/tree/master/packages/bootme-docker) | [![npm](https://img.shields.io/npm/v/bootme-docker.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-docker) | Docker commands |
| [bootme-temp](https://github.com/starptech/bootme/tree/master/packages/bootme-temp) | [![npm](https://img.shields.io/npm/v/bootme-temp.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-temp) | Get a random temporary file or directory path |

## Share Project Templates
| General | Version | Description |
|--------|-------|-------|
| [bootme-projectx](https://github.com/starptech/bootme/tree/master/packages/bootme-projectx) | [![npm](https://img.shields.io/npm/v/bootme-projectx.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-projectx) | Example of how to share a JSON pipeline definition |

## FAQ

### What's the difference between Bootme and Gulp ?
[Gulp](https://gulpjs.com/) is a tookit to work with streams, transform or move bytes from one place to another. While you can parallize stuff in Gulp, in Bootme you can't, we won't! Bootstrapping an environment from scratch or setup services are error-prone this means we should be able to define a rollback mechanism to come back in a clear state and try it again. BootMe Task-Pipeline is ordered and as soon a task fail, the pipeline is trying to recover itself. You can hook into many lifecycle events. In Gulp you can pipe streams to other tasks this is quite useful because your can build modules which are composable. In BootMe it's quite different. We don't agree on streams, we respond native Javascript Objects. A task can rely on the output of another task. This is possible, because a Task can define `refs` which is part of the task configuration and defines a relation between them. When the value can not be found we trying to fallback to the default configuration. We are also able to validate the config and the result of an task. In Gulp you don't want it because the correctnes of the stream data could be reached only near the end.

BootMe is no replacement for Gulp, we use Gulp e.g in `gootme-template` to manipulate files and replace them with the orginal content.

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
