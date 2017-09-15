#!/usr/bin/env node

const Robot = require('./lib/Robot')
const ProcessHolder = require('./lib/helpers/ProcessHolder')

new ProcessHolder().hold()
const robot = new Robot()
robot.forward()

process.on('SIGINT', () => {
  robot.stop()
  process.exit(0)
})
