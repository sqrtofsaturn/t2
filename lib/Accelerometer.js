const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')

let i2c
try {
  i2c = require('i2c-bus') // eslint-disable-line global-require
} catch (error) {
  console.warn(error.stack);
}

class Accelerometer extends EventEmitter {
  constructor({ address }) {
    super()
    bindAll(Object.getOwnPropertyNames(Accelerometer.prototype), this)

    if (!i2c) return
    this.i2c = i2c.openSync(0)
  }
}

module.exports = Accelerometer
