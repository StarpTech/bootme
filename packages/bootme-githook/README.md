# bootme-githook

Task to create a [Git-Hook](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks)
It will create a sym link from `./git_hooks/<name>` to `./git/hooks/<name>` and allows you execute any script.

## Usage

```js
registry.addTask(
  new GitHookTask('hookme').setConfig({
    name: ['precommit'],
    hookDir: 'git_hooks'
  })
)
```
