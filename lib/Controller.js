const { EventEmitter } = require('events')
const once = require('lodash/fp/once')
const WebSocket = require('ws')

class Controller extends EventEmitter {
  connect(callback) {
    const callbackOnce = once(callback)

    this.ws = new WebSocket('ws://192.168.86.35:3000')
    this.ws.once('open', () => callbackOnce())
    this.ws.once('error', error => callbackOnce(error))
    this.ws.on('message', (data) => {
      try {
        const [action, options] = JSON.parse(data)
        this.emit(action, options)
      } catch (error) {
        console.error(`Invalid JSON: ${error.message}`) // eslint-disable-line no-console
      }
    })
  }
}

module.exports = Controller
