module.exports = [
  {
    task: 'request',
    info: 'Retrieve the IIS position',
    config: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    hooks: {
      onInit: async state => {},
      onBefore: async state => {},
      onAfter: async state => {},
      onRollback: async err => {}
    }
  },
  {
    task: 'temp',
    info: 'Create temp file',
    config: {
      type: 'file'
    }
  },
  {
    task: 'delay',
    config: {
      value: 3000
    },
    info: 'Wait 3 second'
  },
  {
    task: 'request',
    info: 'Make request',
    config: {
      url: 'http://google.de',
      contentType: 'text'
    }
  }
]
