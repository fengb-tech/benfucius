const _ = require('lodash')

module.exports = {
  beforeAll (callback) {
    beforeAllCallbacks.push(callback)
  },

  afterAll (callback) {
    afterAllCallbacks.push(callback)
  },
}

let beforeAllCallbacks = []
before(() => runCallbacks(beforeAllCallbacks))

let afterAllCallbacks = []
after(() => runCallbacks(afterAllCallbacks))

function runCallbacks (callbacks) {
  let results = _.map(callbacks, (cb) => cb())
  return Promise.all(results)
}
