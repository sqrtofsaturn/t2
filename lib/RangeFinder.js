const debug = require('debug')('t2:RangeFinder')
const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const isNumber = require('lodash/fp/isNumber')

const Gpio = require('./Gpio')

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECONDS_PER_CM = 1e6 / 34321;

class RangeFinder extends EventEmitter {
  constructor({ echoPin, pollInterval, triggerPin }) {
    super()
    bindAll(Object.getOwnPropertyNames(RangeFinder.prototype), this)
    if (!isNumber(echoPin)) throw new Error('Missing required parameter: echoPin')
    if (!isNumber(pollInterval)) throw new Error('Missing required parameter: pollInterval')
    if (!isNumber(triggerPin)) throw new Error('Missing required parameter: triggerPin')

    this.echo = new Gpio(echoPin, { mode: Gpio.INPUT, alert: true })
    this.trigger = new Gpio(triggerPin, { mode: Gpio.OUTPUT })

    setInterval(this.ping, pollInterval)

    this.echo.on('alert', this.onPong)
  }

  onPong(level, tick) {
    if (level === 1) return this.startTick = tick // eslint-disable-line no-return-assign
    debug('pong')

    // Unsigned 32 bit arithmetic
    const diff = (tick >> 0) - (this.startTick >> 0) // eslint-disable-line no-bitwise
    const distance = (diff / 2 / MICROSECONDS_PER_CM)
    if (distance < 1) return
    this.emit('distance', distance)
  }

  ping() {
    debug('ping')
    this.trigger.trigger(10, 1)
  }
}

module.exports = RangeFinder
//
//
// trigger.digitalWrite(0); // Make sure trigger is low
//
// (function () {
//   var startTick;
//
//   echo.on('alert', function (level, tick) {
//     var endTick,
//       diff;
//
//     if (level == 1) {
//       startTick = tick;
//     } else {
//       endTick = tick;
//       diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
//       console.log(diff / 2 / MICROSECONDS_PER_CM);
//     }
//   });
// }());
//
// // Trigger a distance measurement once per second
// setInterval(function () {
//   trigger.trigger(10, 1); // Set trigger high for 10 microseconds
// }, 1000);
