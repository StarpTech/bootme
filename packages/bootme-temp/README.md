# bootme-temp

Task to get a random temporary file or directory path

## Usage

```js
const task = new TempTask('cacheFolder')
task.setConfig({
  type: 'directory'
})
registry.addTask(task)
```

## Result

- Return the path to the destination

## Caveats

The operating system will clean up when needed.
