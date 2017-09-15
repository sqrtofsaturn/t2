const bindAll = require('lodash/fp/bindAll')

class ProcessHolder {
  constructor() {
    bindAll(Object.getOwnPropertyNames(ProcessHolder.prototype), this)
  }

  hold() {
    setTimeout(this.hold, 10)
  }
}

module.exports = ProcessHolder
