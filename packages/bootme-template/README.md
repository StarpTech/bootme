# bootme-template

Task to parse files as mustache templates and replace the original content.

## Usage

```js
registry.addTask(
  new TemplateTask().setName('replace').setConfig({
    refs: {
      url: 'gitclone' // Point to result of previous task
    },
    url: '...', // alternative a fixed value
    templateData: {
      project: 'Hello BootMe!'
    },
    files: ['README.md']
  })
)
```

## Result

- No Result
