const q = require('workq')()
q.add(async function(queue) {
  console.log('Foo')
  queue.add(async function() {
    console.log('Boo')
  })
})

q.add(async function(queue) {
  console.log('Bar')
})
