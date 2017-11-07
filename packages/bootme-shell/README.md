# bootme-shell

Task to execute portable Unix shell commands

## Usage

```js
registry.addTask(
  new ShellTask('echo').setConfig({
    cmd: 'echo',
    args: ['BootMe']
  })
)
```

## Result

- Look at [shelljs](https://github.com/shelljs/shelljs)

## Caveats

Don't forget to register your `onError` hook to rollback the operation.
