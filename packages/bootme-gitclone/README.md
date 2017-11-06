# bootme-gitclone

Task to clone a Git Repository

## Usage

```js
registry.addTask(
  new GitcloneTask().setName('gitclone').setConfig({
    url: 'https://github.com/netzkern/eslint-config-netzkern-base',
    path: '/test-checkout'
  })
)
```

## Result

- Local path of the repository (**String**)
