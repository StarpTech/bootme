# bootme-shell

Task to execute portable Unix shell commands

## Usage

```js
registry.addTask(
  new ShellTask().setName('echo').setConfig({
    cmd: 'echo',
    args: ['BootMe']
  })
)
```

## Result

- Look at [shelljs](https://github.com/shelljs/shelljs)
