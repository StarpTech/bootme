# bootme-shell

Task to execute portable Unix shell commands

## Usage

```js
const task = new TaskShell('shell')
task.setConfig({
  cmd: 'echo',
  args: ['BootMe']
})
```

## Result

- Look at [shelljs](https://github.com/shelljs/shelljs)

## Caveats

Don't forget to register your `onRollback` hook to rollback the operation.
