# bootme-docker

Task to administrate a docker environment

## Usage

```js
registry.addTask(
  new DockerTask('mongodb').setConfig({
    docker: {},
    cmd: 'createContainer',
    name: 'testMongodb',
    image: 'tutum/mongodb'
  })
)
```

## Result

- Look at [dockerode](https://github.com/apocas/dockerode)