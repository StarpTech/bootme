# BootMe

A fully configurable and extendable Task Pipeline

## Installation

```
npx -p bootme
```

## Features

- Handle nested queues, the order of execution is guaranteed thanks to [workq](https://github.com/delvedor/workq) package.
- Define Before, After, Failure Hooks in the Task or after via Registry access.
- Nested erors in jobs triggers the recover routine of the task.
