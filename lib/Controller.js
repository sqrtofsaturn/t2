const debug = require('debug')('t2:Controller')
const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const once = require('lodash/fp/once')
const WebSocket = require('ws')

class Controller extends EventEmitter {
  constructor() {
    super()
    bindAll(Object.getOwnPropertyNames(Controller.prototype), this)
  }

  connect(callback) {
    const callbackOnce = once(callback)

    this.ws = new WebSocket('ws://192.168.86.35:3000')
    this.ws.once('open', () => callbackOnce())
    this.ws.once('error', error => callbackOnce(error))
    this.ws.on('message', (data) => {
      debug('message', data)
      try {
        const [action, options] = JSON.parse(data)
        this.emit(action, options)
      } catch (error) {
        console.error(`Invalid JSON: ${error.message}`) // eslint-disable-line no-console
      }
    })
  }

  sendDistance(distance) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify(['distance', { distance }]))
  }
}

module.exports = Controller
