# bootme-githook

Task to create Cross-platform [git hooks](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks).
It will create a sym link from `./git_hooks/<name>` to `./git/hooks/<name>` and allows you to execute any script on the hook. Your hooks are now versionable!

## Usage

```js
const task = new GitHookTask('hookme')
task.setConfig({
  name: ['precommit'],
  hookDir: 'git_hooks'
})
```

1. Remove the suffix `.sample` from default hook files in `.git/hooks`
2. Place your files under `./git_hooks/<name>`
3. Execute Task

## Rollback

- Unlink
