# bootme-request

Task to fire a HTTP Request

## Usage

```js
const task = new HttpRequestTask('iss_position')
task.setConfig({
  method: 'GET',
  contentType: 'json',
  url: 'http://api.open-notify.org/iss-now.json'
})
```

## Result

- Based on the `contentType` property.

## Caveats

Don't forget to register your `onRollback` hook to rollback the operation.
