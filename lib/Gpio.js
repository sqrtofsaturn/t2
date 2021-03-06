/* eslint-disable no-console */
const Debug = require('debug')
const { EventEmitter } = require('events')
const sample = require('lodash/fp/sample')

class MockGpio extends EventEmitter {
  constructor(pin, { mode } = {}) {
    super()
    this.pin = pin
    this.debug = Debug(`t2:Gpio[${pin}]`)

    this.debug(`new Gpio(${pin}, { mode: ${mode} })`)
    setInterval(() => {
      this.emit('alert', sample([1, 2]), Date.now())
    }, 1000)
  }

  digitalWrite(value) {
    this.debug(`${this.pin}.digitalWrite(${value})`)
  }

  pwmWrite(dutyCycle) {
    this.debug(`${this.pin}.pwmWrite(${dutyCycle})`)
  }

  trigger(millis, value) {
    this.debug(`${this.pin}.trigger(${millis}, ${value})`)
  }
}

MockGpio.OUTPUT = 'Gpio.OUTPUT'

try {
  module.exports = require('pigpio').Gpio // eslint-disable-line global-require, import/no-unresolved
} catch (error) {
  console.warn('pigpio not detected, running in mock Gpio mode. Use DEBUG=t2:Gpio* to see commands') // eslint-disable-line no-console
  module.exports = MockGpio
}
