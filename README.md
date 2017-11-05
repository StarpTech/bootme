# BootMe

A fully configurable and extendable Task Pipeline

## Installation

```
npx -p bootme
```

## Features

- Handle nested queues, the order of execution is guaranteed thanks to [workq](https://github.com/delvedor/workq) package.
- Define Before, After, Failure Hooks in the Task or after via Registry access.
- The recover routine of the task is triggered when nested jobs fail.
