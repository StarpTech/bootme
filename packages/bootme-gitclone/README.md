# bootme-gitclone

Task to clone a Git Repository

## Usage

```js
const task = new GitcloneTask('gitclone')
task.setConfig({
  url: 'https://github.com/netzkern/eslint-config-netzkern-base',
  path: '/test-checkout'
})
```

## Result

- Local path of the repository (**String**)

## Rollback

- Remove the repository
