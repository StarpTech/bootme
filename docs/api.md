# BootMe

## API

  * <a href="#task"><code>bootme.<b>Task()</b></code></a>
  * <a href="#config--object"><code>bootme.Task#<b>config</b></code></a>
  * <a href="#setnamestring-name--task"><code>bootme.Task#<b>setName()</b></code></a>
  * <a href="#addhookstring-oninit-onbefore-onafter-async-function-handler--task"><code>bootme.Task#<b>addHook()</b></code></a>
  * <a href="#setactionasync-function-handler--task"><code>bootme.Task#<b>setAction()</b></code></a>
  * <a href="#setconfigobject-async-function--function-config--task"><code>bootme.Task#<b>setConfig()</b></code></a>
  * <a href="#setinitasync-function-handler--task"><code>bootme.Task#<b>setInit()</b></code></a>
  * <a href="#setrollbackasync-function-handler--task"><code>bootme.Task#<b>setRollback()</b></code></a>

  * <a href="#registry"><code>bootme.<b>Registry()</b></code></a>
  * <a href="#addtasktask-task-void"><code>bootme.Registry#<b>addTask()</b></code></a>
  * <a href="#setrefstring-taskname-string-key-any-value"><code>bootme.Registry#<b>setRef()</b></code></a>
  * <a href="#setconfigstring-taskname-object-value"><code>bootme.Registry#<b>setConfig()</b></code></a>
  * <a href="#shareconfigobject-value"><code>bootme.Registry#<b>shareConfig()</b></code></a>
  * <a href="#addhookstring-taskname-string-oninit-onbefore-onafter-async-function-handler--task"><code>bootme.Registry#<b>addHook()</b></code></a>

  * <a href="#Pipeline"><code>bootme.<b>Pipeline()</b></code></a>
  * <a href="#execute"><code>bootme.Pipeline#<b>execute()</b></code></a>
  * <a href="#getvaluestring-taskname"><code>bootme.Pipeline#<b>getValue()</b></code></a>
  * <a href="#rollback"><code>bootme.Pipeline#<b>rollback()</b></code></a>
  * <a href="#restore"><code>bootme.Pipeline#<b>restore()</b></code></a>
  * <a href="#haserrorstring-taskname--boolean"><code>bootme.Pipeline#<b>hasError()</b></code></a>
  * <a href="#hasresultstring-taskname--boolean"><code>bootme.Pipeline#<b>hasResult()</b></code></a>
  * <a href="#ontaskstartasync-function-handler"><code>bootme.Pipeline#<b>onTaskStart()</b></code></a>
  * <a href="#ontaskendasync-function-handler"><code>bootme.Pipeline#<b>onTaskEnd()</b></code></a>
  * <a href="#ontaskrollbackasync-function-handler"><code>bootme.Pipeline#<b>onTaskRollback()</b></code></a>

  * <a href="#State"><code>bootme.<b>State()</b></code></a>
  * <a href="#addjobasync-function-handler"><code>bootme.State#<b>addJob()</b></code></a>
  * <a href="#addtasktask-handler"><code>bootme.State#<b>addTask()</b></code></a>
  * <a href="#getvaluestring-taskname-1"><code>bootme.State#<b>getValue()</b></code></a>

-------------------------------------------------------

## Task

Represent a task object

### Config : __Object__

Return the current task config

### setName(__string:__ name) : __Task__

Set the task name

### addHook(__string:__ ['onInit', 'onBefore', 'onAfter'], __async function:__ handler) : __Task__

Create a new hook

### setAction(__async function:__ handler) : __Task__

Set the main task action

### setConfig(__[Object, async function, function]:__ config) : [__Task__, Promise]

Set the task config

### setInit(__async function:__ handler) : __Task__

Set the initialization function. It's one-time shortcut for `addHook('onInit', fn)`

### setRollback(__async function:__ handler) : __Task__

Set the initialization function. It's one-time shortcut for `addHook('onRollback', fn)`

## Registry

Represent the centric task registry

### addTask(__Task:__ task): void

Add a new task to the registry.

### setRef(__String:__ taskName, __String:__ key, __Any:__ value)

Set the `refs` property of the task config to configure task dependencies

### setConfig(__String:__ taskName, __Object:__ value)

Merge the value to the task config

### shareConfig(__Object:__ value)

Configure a shared config from which all tasks inherit

### addHook(__String:__ taskName, __string:__ ['onInit', 'onBefore', 'onAfter'], __async function:__ handler) : __Task__

Add a hook to the task

## Pipeline

Represent pipeline to execute all tasks

### execute()

Run the pipeline. We don't provide a finish callback because it's a queue and is changed at runtime.

### getValue(__String:__ taskName)

Try to get the value from the result of this task, otherwise the value is taken from the task config. That's the reason to provide always a default value in the task config.

```json
{
  "a": 1,
  "refs": {
    "a": "previousTaskName"
  }
}
```

### rollback() : __Promise__

The whole pipeline is rollbacked and all `onRollback` hooks from all tasks are called.

### restore() : __Promise__

The whole pipeline is restored and all `onRollback` hooks from all tasks are called. The difference between a `rollback` and `restore` is that a restore is intentional and therefore no `onBefore`, `onAfter` hooks are called only `onInit`.

### hasError(__String:__ taskName) : __Boolean__

Check if a task has thrown an error

### hasResult(__String:__ taskName) : __Boolean__

Check if a task has respond with a truthy value

### onTaskStart(__async function:__ handler)

Add a global `onTaskStart` hook. This hook is executed before a task is executed.

### onTaskEnd(__async function:__ handler)

Add a global `onTaskEnd` hook. This hook is executed after a task was executed.

### onTaskRollback(__async function:__ handler)

Add a global `onTaskRollback` hook. This hook is executed after a complete rollback was proceed.

## State

State provide an api to add additional tasks and access to the current pipeline instance.

### addJob(__async function:__ handler)

Execute a job. A job is a single function and is excuted in creation order. The parent task is waiting before all sub-jobs are done.

### addTask(__Task:__ handler)

Execute a task. The task is excuted in creation order. The parent task is waiting before all sub-tasks are done.

### getValue(__String:__ taskName)

This is shortcut for `getValue(String: taskName)`
