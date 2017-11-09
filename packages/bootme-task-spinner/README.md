# bootme-task-spinner

Tool to provide an elegant terminal spinner when your Tasks are running.
No spinners are displayed when no TTY or when in a CI.

## Usage

```js
const pipeline = new Bootme.Pipeline(registry)
new TaskSpinner(pipeline).attach()
pipeline.execute()
```
