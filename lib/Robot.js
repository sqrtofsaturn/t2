/* eslint-disable no-param-reassign */

const bindAll = require('lodash/fp/bindAll')
const Motor = require('./Motor')

class Robot {
  constructor() {
    bindAll(Object.getOwnPropertyNames(Robot.prototype), this)
    this.leftMotor = new Motor({ forwardPin: 23, backwardPin: 18 })
    this.rightMotor = new Motor({ forwardPin: 22, backwardPin: 17 })
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
