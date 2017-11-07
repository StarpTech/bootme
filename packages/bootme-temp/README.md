# bootme-temp

Task to get a random temporary file or directory path

## Usage

```js
registry.addTask(
  new TempTask('cacheFolder').setConfig({
    type: 'directory'
  })
)
```

## Result

- Return the path to the destination

## Caveats

The operating system will clean up when needed.
