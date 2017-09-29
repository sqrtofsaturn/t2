#!/usr/bin/env node

/* eslint-disable no-console */

const OctoDash = require('octodash')
const Controller = require('./lib/Controller')
const Robot = require('./lib/Robot')

const cliOptions = [{
  names: ['accelerometer-poll-interval', 'a'],
  type: 'integer',
  env: 'ACCELEROMETER_POLL_INTERVAL',
  help: 'Interval at which to poll the accelerometer (in ms). Use DEBUG=t2:Robot to see output',
  default: 1000,
}, {
  names: ['range-finder-poll-interval', 'r'],
  type: 'integer',
  env: 'RANGE_FINDER_POLL_INTERVAL',
  help: 'Interval at which to poll the rangefinder (in ms). Use DEBUG=t2:Robot|t2:RangeFinder to see output',
  default: 1000,
}]

class Command {
  constructor({ argv }) {
    const { accelerometerPollInterval, rangeFinderPollInterval } = new OctoDash({ argv, cliOptions }).parseOptions()

    this.controller = new Controller()
    this.robot = new Robot({ accelerometerPollInterval, rangeFinderPollInterval })
    this.robot.on('distance', this.controller.sendDistance)
    this.robot.on('accelerometer', this.controller.sendAccelerometer)
  }

  run() {
    this.controller.connect((error) => {
      if (error) return console.error(`Error connecting to controller: ${error.message}`)
      console.log('Connected to controller')
    })
    this.controller.on('move', ({ left, right }) => this.robot.move({ left, right }))
  }

  exit() {
    console.log('exiting') // eslint-disable-line no-console
    this.robot.stop()
    process.exit(0)
  }
}

new Command({ argv: process.argv }).run()
