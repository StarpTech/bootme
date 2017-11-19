# BootMe

## Task Lifecycle

- <code>bootme.Task<b>()</b></code>
- Load configuration
- <code>bootme.Task#<b>validateConfig()</b></code>
- Fire `onBefore` hooks
- Fire `onInit` hooks (`init` is also a hook)
- Fire `action`
- <code>bootme.Task#<b>validateResult()</b></code>
- Fire `onAfter` hooks

  _An error in the cycle will abort the complete pipeline and execute the `onRollback` (`rollback` is also a hook) handlers of all Tasks._

### Rollback Lifecycle

- Fire global `onRollback` hooks
- Fire all `onRollback` hooks from all Tasks in **reverse order**

### Restore Lifecycle

- Fire global `onTaskStart` hooks
- Fire `onInit` hooks (`init` is also a hook)
- Fire global `onTaskEnd` hooks
- Execute [Rollback lifecycle](#rollback_lifecycle)
