/* eslint-disable no-param-reassign */

const bindAll = require('lodash/fp/bindAll')
const Gpio = require('./Gpio')

class Motor {
  constructor({ backwardPin, forwardPin }) {
    bindAll(Object.getOwnPropertyNames(Motor.prototype), this)

    this.backwardGpio = new Gpio(backwardPin, { mode: Gpio.OUTPUT })
    this.forwardGpio = new Gpio(forwardPin, { mode: Gpio.OUTPUT })
  }

  go(speed) {
    let absoluteSpeed = Math.abs(speed)

    if (absoluteSpeed > 255) absoluteSpeed = 255

    if (speed > 0) {
      this.backwardGpio.pwmWrite(0)
      this.forwardGpio.pwmWrite(absoluteSpeed)
    } else {
      this.backwardGpio.pwmWrite(absoluteSpeed)
      this.forwardGpio.pwmWrite(0)
    }
  }

  stop() {
    this.go(0)
  }
}

module.exports = Motor
