/* eslint-disable no-param-reassign */

const debug = require('debug')('t2:Robot')
const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const isNumber = require('lodash/fp/isNumber')
const Accelerometer = require('./Accelerometer')
const Motor = require('./Motor')
const RangeFinder = require('./RangeFinder')

class Robot extends EventEmitter {
  constructor({ pollInterval }) {
    super()
    bindAll(Object.getOwnPropertyNames(Robot.prototype), this)
    if (!isNumber(pollInterval)) throw new Error('Missing required parameter: pollInterval')

    this.leftMotor = new Motor({ forwardPin: 18, backwardPin: 23 })
    this.rightMotor = new Motor({ forwardPin: 17, backwardPin: 22 })
    this.rangeFinder = new RangeFinder({ echoPin: 4, pollInterval, triggerPin: 27 })
    this.rangeFinder.on('distance', (distance) => {
      this.emit('distance', distance)
      debug('distance', distance)
    })
    this.accelerometer = new Accelerometer({ address: 0x1D, pollInterval })
    this.accelerometer.on('data', data => this.emit('accelerometer', data))
  }

  backward() {
    this.leftMotor.go(-255)
    this.rightMotor.go(-255)
  }

  forward() {
    this.leftMotor.go(255)
    this.rightMotor.go(255)
  }

  left() {
    this.leftMotor.go(-255)
    this.rightMotor.go(255)
  }

  move({ left, right }) {
    this.leftMotor.go(left)
    this.rightMotor.go(right)
  }

  right() {
    this.leftMotor.go(255)
    this.rightMotor.go(-255)
  }

  stop() {
    this.leftMotor.stop()
    this.rightMotor.stop()
  }
}

module.exports = Robot
