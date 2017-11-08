module.exports = [
  {
    info: 'Retrieve the IIS position',
    request: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    onInit: async state => {},
    onBefore: async state => {},
    onAfter: async state => {},
    onError: async err => {}
  },
  {
    info: 'Create temp file',
    temp: {
      type: 'file'
    }
  },
  {
    info: 'Start request against google',
    request: {
      url: 'http://google.de',
      contentType: 'text'
    }
  }
]
