/* eslint-disable no-bitwise, no-console */

const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const isNumber = require('lodash/fp/isNumber')

let i2c
try {
  i2c = require('i2c-bus') // eslint-disable-line global-require
} catch (error) {
  console.warn(error.stack);
}

const WHOAMI = 0x0D
const CTRL_REG1 = 0x2A
const GSCALE = 2
const XYZ_DATA_CFG = 0x0E
const OUT_X_MSB = 0x01

class Accelerometer extends EventEmitter {
  constructor({ address, pollInterval }) {
    super()
    bindAll(Object.getOwnPropertyNames(Accelerometer.prototype), this)
    if (!isNumber(address)) throw new Error('Missing required parameter: address')
    if (!isNumber(pollInterval)) throw new Error('Missing required parameter: pollInterval')

    this.address = address
    this.i2c = i2c.openSync(1)
    try {
      if (this.i2c.readByteSync(this.address, WHOAMI) !== CTRL_REG1) throw new Error('Found something, but it was not a MMA8452Q')
    } catch (error) {
      console.error('Could not detect MMA8452Q (accelerometer): ', error.stack)
      return
    }

    this.init()
    setInterval(this.read, pollInterval)
  }

  active() {
    const c = this.i2c.readByteSync(this.address, CTRL_REG1)
    this.i2c.writeByteSync(this.address, CTRL_REG1, c | 0x01)
  }

  init() {
    // set scale
    this.standby()
    const fsr = GSCALE >> 2
    this.i2c.writeByteSync(this.address, XYZ_DATA_CFG, fsr)
    this.active()
  }

  read() {
    this.i2c.readI2cBlock(this.address, OUT_X_MSB, 6, Buffer.alloc(6), (error, bytesRead, buffer) => {
      if (error) return console.error(error.stack)

      const rawValues = []
      for (let i = 0; i < 3; i += 1) {
        let gCount = ((buffer[i * 2] << 8) | buffer[(i * 2) + 1]) >> 4

        if (buffer[i * 2] > 0x7F) {
          gCount -= 0x1000
        }

        rawValues[i] = gCount
      }

      const axis = []
      rawValues.forEach((value) => {
        axis.push(value / ((1 << 12) / (2 * GSCALE)))
      })

      console.log('axis:', axis)
    })
  }

  standby() {
    const c = this.i2c.readByteSync(this.address, CTRL_REG1)
    this.i2c.writeByteSync(this.address, CTRL_REG1, c & ~(0x01))
  }
}

module.exports = Accelerometer
