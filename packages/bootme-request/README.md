# bootme-request

Task to fire a HTTP Request

## Usage

```js
registry.addTask(
  new HttpRequestTask().setName('iss_position').setConfig({
    method: 'GET',
    url: 'http://api.open-notify.org/iss-now.json'
  })
)
```

## Result

- Instance of R2 (**[R2](https://github.com/mikeal/r2)**)
