# BootMe

A fully configurable and extendable Task Pipeline

## Installation

```
npx -p bootme
```

## Features

- Handle nested queues, the order of execution is guaranteed thanks to [workq](https://github.com/delvedor/workq) package.
- Define Pre and Post hooks
- Define Failure hooks, also nested issues triggers the recover routine.
