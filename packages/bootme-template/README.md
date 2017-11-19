# bootme-template

Task to parse files as mustache templates and replace the original content.

## Usage

```js
const task = new TemplateTask('template')
task.setConfig({
  refs: {
    url: 'gitclone' // Point to result of previous task
  },
  url: '', // alternative a relative path to the directory
  templateData: {
    project: 'Hello BootMe!'
  },
  files: ['README.md']
})
registry.addTask(task)
```

## Result

- No Result

## Rollback

- Not implemented
