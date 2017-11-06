# bootme-request

Task to fire a HTTP Request

## Usage

```js
registry.addTask(
  new HttpRequestTask().setName('iss_position').setConfig({
    method: 'GET',
    contentType: 'json',
    url: 'http://api.open-notify.org/iss-now.json'
  })
)
```

## Result

- Based on the `contentType` property.
