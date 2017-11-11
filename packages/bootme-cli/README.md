# bootme-cli

Tool to run Bootme Tasks from the console

![cli](/media/bootme-cli.gif)

## Usage

```sh
  Usage: cli [options]

  Command line for BootMe©


  Options:

    -V, --version          output the version number
    -c, --config <path>    path to config
    -t, --template [name]  name of your Template
    -r, --restore          restore a pipeline
    -d, --debug            enable debug mode
    -r, --runner [name]    the runner
    -w, --wizard           start interactive cli mode
    -T, --task <name>      execute a single Task
    -c, --config <path>    path to config
    -C, --quick <json>     config as quick JSON syntax
    -h, --help             output usage information
```

## Features
- Load the pipeline definition from JSON file
- Load the pipeline definition from JS file (Hooks can be defined)
- Load Project template based on NPM package
- Provide an interactive cli wizard
- Notify at startup about new version
- Rollback on SIGTERM Signal
- Restore a pipeline
- Load single Task with JSON configuration or pass JSON in form of a [quick JSON](https://github.com/mcollina/tinysonic) format.


## Examples

```
// Load config from a JS file
bootme -c ./example/.bootme.js
// Load config from a JSON file
bootme -c ./example/.bootme.json
// Load from a NPM package
bootme -t bootme-projectx
// Load a single task with quick JSON syntax
bootme --task request -C url:http://www.google.de,contentType:text
// Run BootMe without to polutte the workspace
npx bootme-cli -h
// Run specific version of BootMe
npx bootme-cli@0.0.6 -h
```
