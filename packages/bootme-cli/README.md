# bootme-cli

Tool to run Bootme Tasks from the console

## Usage

```sh
  Usage: cli [options]

  Command line for BootMe©


  Options:

    -V, --version       output the version number
    -c, --config <c>    Path to config
    -t, --template [t]  Name of your Template
    -r, --runner [r]    The runner
    -h, --help          output usage information
```

## Features
- Load the pipeline definition from JSON file
- Load the pipeline definition from Js file (Hooks can be defined)
- Load Project template based on NPM package
- Provide an interactive cli wizard
- Notify at startup about new version
