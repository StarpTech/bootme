[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![Build Status](https://travis-ci.org/StarpTech/bootme.svg?branch=master)](https://travis-ci.org/StarpTech/bootme)
[![Build status](https://ci.appveyor.com/api/projects/status/58ldk1x962nviv03?svg=true)](https://ci.appveyor.com/project/StarpTech/bootme)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![NPM version](https://img.shields.io/npm/v/bootme.svg?style=flat)](https://www.npmjs.com/package/bootme)

# BootMe

Configurable and extendable Task pipeline. BootMe help you to run a list of tasks as a transaction and provide an api to hook into lifecycle events.
We use it to scaffold complete environments, projects or other useful parts without fuss. It comes with a minimal API. When size matters _~10KB_.

```
npm install bootme
```

## Core features

- **Hooks**: define `Init`, `Before`, `After`, `Rollback` Hooks in the Task or with the Registry.
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
  .addHook('onRollback', async (state) => ...)
  .addHook('onBefore', async (state) => ...)
  .addHook('onAfter', async (state) => ...)
)

registry.addHook('sample', 'onRollback', async (state) => ...)
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
  async rollback(state) {}
}
```

## Examples

* [Simple](/examples/simple.js)
* [Config](/examples/config.js)
* [Restore](/examples/restore.js)
* [Rollback](/examples/rollback.js)
* [Hooks](/examples/hooks.js)
* [Task template](/examples/task-template.js)
* [Advanced](/examples/template.js)

## API

  * <a href="#task"><code>bootme.<b>Task()</b></code></a>
  * <a href="#config"><code>bootme.Task#<b>config</b></code></a>
  * <a href="#setName"><code>bootme.Task#<b>setName()</b></code></a>
  * <a href="#addHook"><code>bootme.Task#<b>addHook()</b></code></a>
  * <a href="#setAction"><code>bootme.Task#<b>setAction()</b></code></a>
  * <a href="#setConfig"><code>bootme.Task#<b>setConfig()</b></code></a>
  * <a href="#setInit"><code>bootme.Task#<b>setInit()</b></code></a>
  * <a href="#setRollback"><code>bootme.Task#<b>setRollback()</b></code></a>

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
  * <a href="#restore"><code>bootme.Pipeline#<b>restore()</b></code></a>
  * <a href="#hasError"><code>bootme.Pipeline#<b>hasError()</b></code></a>
  * <a href="#hasResult"><code>bootme.Pipeline#<b>hasResult()</b></code></a>
  * <a href="#onTaskStart"><code>bootme.Pipeline#<b>onTaskStart()</b></code></a>
  * <a href="#onTaskEnd"><code>bootme.Pipeline#<b>onTaskEnd()</b></code></a>
  * <a href="#onRollback"><code>bootme.Pipeline#<b>onRollback()</b></code></a>

  * <a href="#State"><code>bootme.<b>State()</b></code></a>
  * <a href="#addJob"><code>bootme.State#<b>addJob()</b></code></a>
  * <a href="#addTask"><code>bootme.State#<b>addTask()</b></code></a>
  * <a href="#StateGetValue"><code>bootme.State#<b>getValue()</b></code></a>

-------------------------------------------------------

## Task

Represent a task object

### Config : __Object__

Return the current task config

### setName(__string:__ name) : __Task__

Set the task name

### addHook(__string:__ ['onInit', 'onBefore', 'onAfter'], __async function:__ handler) : __Task__

Create a new hook

### setAction(__async function:__ handler) : __Task__

Set the main task action

### setConfig(__[Object, async function]:__ config) : __Task__

Set the task config

### setInit(__async function:__ handler) : __Task__

Set the initialization function. It's one-time shortcut for `addHook('onInit', fn)`

### setRollback(__async function:__ handler) : __Task__

Set the initialization function. It's one-time shortcut for `addHook('onRollback', fn)`

## Registry

Represent the centric task registry

### addTask(__Task:__ task): void

Add a new task to the registry.

### setRef(__String:__ taskName, __String:__ key, __Any:__ value): void

Set the `refs` property of the task config to configure task dependencies

### setConfig(__String:__ taskName, __Object:__ value)

Merge the value to the task config

### shareConfig(__Object:__ value)

Configure a shared config from which all tasks inherit

### addHook(__String:__ taskName, __string:__ ['onInit', 'onBefore', 'onAfter'], __async function:__ handler) : __Task__

Add a hook to the task

## Pipeline

Represent pipeline to execute all tasks

### execute()

Run the pipeline

### getValue(__String:__ taskName)

Try to get the value from the result of this task, otherwise the value is taken from the task config. That's the reason to provide always a default value in the task config.

```json
{
  "a": 1,
  "refs": {
    "a": "previousTaskName"
  }
}
```

### rollback() : __Promise__

The whole pipeline is rollbacked and all `onRollback` hooks from all tasks are called.

### restore() : __Promise__

The whole pipeline is restored and all `onRollback` hooks from all tasks are called. The difference between a `rollback` and `restore` is that a restore is intentional and therefore no `onBefore`, `onAfter` hooks are called only `onInit`.

### hasError(__String:__ taskName) : __Boolean__

Check if a task has thrown an error

### hasResult(__String:__ taskName) : __Boolean__

Check if a task has respond with a truthy value

### onTaskStart(__async function:__ handler)

Add a global `onTaskStart` hook. This hook is executed before a task is executed.

### onTaskEnd(__async function:__ handler)

Add a global `onTaskEnd` hook. This hook is executed after a task was executed.

### onRollback(__async function:__ handler)

Add a global `onRollback` hook. This hook is executed after a task has thrown an error.

## State

State provide an api to add additional tasks and access to the current pipeline instance.

### addJob(__async function:__ handler)

Execute a job. A job is a single function and is excuted in creation order. The parent task is waiting before all sub-jobs are done.

### addTask(__Task:__ handler)

Execute a task. The task is excuted in creation order. The parent task is waiting before all sub-tasks are done.

### getValue(__String:__ taskName)

This is shortcut for `getValue(String: taskName)`

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
| [bootme-delay](https://github.com/starptech/bootme/tree/master/packages/bootme-delay) | [![npm](https://img.shields.io/npm/v/bootme-delay.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-delay) | Include a delay |

## Share Project Templates
| General | Version | Description |
|--------|-------|-------|
| [bootme-projectx](https://github.com/starptech/bootme/tree/master/packages/bootme-projectx) | [![npm](https://img.shields.io/npm/v/bootme-projectx.svg?maxAge=3600)](https://www.npmjs.com/package/bootme-projectx) | Example of how to share a JSON pipeline definition |

## FAQ

### What's the difference between BootMe and Gulp ?
[Gulp](https://gulpjs.com/) is a tookit to work with streams, transform or move bytes from one place to another. While you can parallize stuff in Gulp, in BootMe you can't, we don't want! Bootstrapping an environment from scratch or setup projects are error-prone this means we should be able to define a rollback mechanism to come back in a clear state and try it again. BootMe Task-Pipeline is ordered and as soon a task fail, the pipeline is trying to recover itself. You can hook into many lifecycle events. In Gulp you can pipe streams to other tasks this is quite useful because you can build modules which are composable. In BootMe it's quite different. We don't agree on streams, we respond native Javascript Objects. A task can rely on the output of another task. This is possible, because a Task can define `refs` which is part of the task configuration and defines a relation between them. When the value can not be found we trying to fallback to the default configuration. We are also able to validate the config and the result of a task. In Gulp you don't want it because the correctnes of the stream data could be reached only near the end.

BootMe is no replacement for Gulp, we use Gulp e.g in `bootme-template` to manipulate files and replace them with the orginal content.

### What's the difference between BootMe and Grunt ?
[Grunt](https://gruntjs.com) is more similiar to BootMe as Gulp because in Grunt you have a sequential execution order of you tasks. Grunt don't rely on streams you can do everything inside a task but Grunt don't respect transactionality, a task can fail or another task can succeed. Therefore grunt don't provide an easy way to handle errors or hooks into specific lifecycle events. Grunt don't handle config and output validation for you, you have to extend it manually. The goal of grunt is to provide a general solution of running any kind of task but that's not exact our goal with BootMe. BootMe was designed to provide an elegant API to handle a list of tasks as a transaction and rollback the tasks of the pipeline when an error occur. Another big difference related to the technology is that BootMe is written in ES7. You can have fun!

BootMe is no replacement for Grunt, grunt is a great tool to automate your asset build pipeline.

### Can I define my pipeline in a JSON file?

Yes, we provide a JSON runner [bootme-json-runner](https://github.com/starptech/bootme/tree/master/packages/bootme-json-runner). If you pass a Javascript Object you can even hook into the lifecycle.

### Can I run a single Task with the command-line?

Yes, we provide great tooling with [bootme-cli](https://github.com/starptech/bootme/tree/master/packages/bootme-cli)

### Can I create project templates?

Yes, look at example project [bootme-projectx](https://github.com/starptech/bootme/tree/master/packages/bootme-projectx) there we defined the pipeline in Javascript and published it to NPM (As convention all packages has to started with `bootme-*`). After you have successfully published your package you can execute your pipeline with one command with [bootme-cli](https://github.com/starptech/bootme/tree/master/packages/bootme-cli).

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
