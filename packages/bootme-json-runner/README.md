# bootme-json-runner

Tool to use JSON as pipeline definition

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
      onError: async err => {}
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

- The runner try to load `bootme-<name>` module when a task is started.
- Any value inside the task key `<name>` object is used for the task configuration and will be validated.
- You can define hooks inside the task object `onInit`, `onError`, `onBefore`, `onAfter`
- The `info` property is used to describe the task.
