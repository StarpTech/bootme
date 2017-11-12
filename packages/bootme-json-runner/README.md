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
  }
]

jsonRunner.run(config)

```

## Usage

- The runner try to load a NPM module in form `bootme-<task>`.
- Any value inside the task key `config` property is used for the task configuration and is validated.
- You can define hooks `onInit`, `onRollback`, `onBefore`, `onAfter`.
- The `info` property is used to describe the task and is used for debugging purpose.
