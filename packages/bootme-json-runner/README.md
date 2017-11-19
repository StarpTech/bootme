# bootme-json-runner

Tool to use JSON or Javascript as pipeline definition.

## Usage

```js
const JsonRunner = require('bootme-json-runner')
const Bootme = require('bootme')

const registry = new Bootme.Registry()
const pipeline = new Bootme.Pipeline(registry)
const jsonRunner = new JsonRunner(pipeline)

let config = [
  {
    task: 'request',
    info: 'Retrieve the IIS position',
    config: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    hooks: {
      onInit: async state => {},
      onBefore: async state => {},
      onAfter: async state => {},
      onRollback: async state => {}
    }
  },
  {
    task: 'temp',
    info: 'Create temp file',
    config: {
      type: 'file'
    }
  },
  {
    task: 'request',
    info: 'Start request against google',
    config: {
      url: 'http://google.de',
      contentType: 'text'
    }
  },
  {
    task: new Bootme.Task('test', 'Use task instance')
  }
]

jsonRunner.run(config)

```

## Usage

- The runner is trying to load a NPM module in form `bootme-<task>`.
- You can define any Task hook like `onInit`, `onRollback`, `onBefore`, `onAfter`.
- The `info` property is used to describe the task and is used only for debugging purpose.
- You can pass a Task instance or declare your task with Javascript.
