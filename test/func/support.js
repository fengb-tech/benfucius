var support = require('../support.js')
var _ = require('lodash')

module.exports = _.defaults(support, {
  request: require('supertest'),
  app: require('lib/app').callback(),
})
