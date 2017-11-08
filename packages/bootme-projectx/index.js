'use strict'

module.exports = [
  {
    request: {
      url: 'http://api.open-notify.org/iss-now.json'
    },
    info: 'Retrieve the IIS position'
  },
  {
    temp: {
      type: 'file'
    },
    info: 'Create temp file'
  },
  {
    request: {
      url: 'http://google.de',
      contentType: 'text'
    },
    info: 'Start request against google'
  }
]
