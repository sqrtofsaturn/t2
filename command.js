#!/usr/bin/env node

/* eslint-disable no-console */

require('readline').emitKeypressEvents(process.stdin)
const Controller = require('./lib/Controller')
const Robot = require('./lib/Robot')

class Command {
  constructor() {
    process.stdin.setRawMode(true)
    this.controller = new Controller()
    this.robot = new Robot()
  }

  run() {
    console.log(`press "escape" to quit (PID: ${process.pid})`) // eslint-disable-line no-console

    process.stdin.on('keypress', (ignored, { name }) => {
      if (name === 'up') this.robot.forward()
      if (name === 'left') this.robot.left()
      if (name === 'right') this.robot.right()
      if (name === 'down') this.robot.stop()

      if (name === 'escape') this.exit()
    })

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

new Command().run()
