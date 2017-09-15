#!/usr/bin/env node

const rpio = require('rpio')

rpio.open(12, rpio.OUTPUT)
rpio.write(12, rpio.HIGH)
process.exit(0)
