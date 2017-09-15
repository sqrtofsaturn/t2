/* eslint-disable no-console */
const Debug = require('debug')

class MockGpio {
  constructor(pin, { mode } = {}) {
    this.pin = pin
    this.debug = Debug(`gpio[${pin}]`)

    this.debug(`new Gpio(${pin}, { mode: ${mode} })`)
  }

  digitalWrite(value) {
    this.debug(`${this.pin}.digitalWrite(${value})`)
  }

  pwmWrite(dutyCycle) {
    this.debug(`${this.pin}.pwmWrite(${dutyCycle})`)
  }
}

MockGpio.OUTPUT = 'Gpio.OUTPUT'

try {
  module.exports = require('pigpio').Gpio // eslint-disable-line global-require, import/no-unresolved
} catch (error) {
  console.warn('pigpio not detected, running in mock Gpio mode. Use DEBUG=gpio* to see commands') // eslint-disable-line no-console
  module.exports = MockGpio
}
