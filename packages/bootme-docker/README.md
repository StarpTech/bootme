# bootme-docker

Task to administrate a docker environment

## Usage

```js
registry.addTask(
  new DockerTask('mongodb').setConfig({
    docker: {
      host: '127.0.0.1',
      port: 2375
    },
    cmd: 'createContainer',
    name: 'testMongodb',
    image: 'tutum/mongodb'
  })
)
```

## Result

- Look at [dockerode](https://github.com/apocas/dockerode)

## Caveats

- Expose your Docker daemon
- Don't forget to register your `onRollback` hook to rollback the operation.
