const support = require('../support')
const _ = require('lodash')

module.exports = _.defaults(support, {
  request: require('supertest'),
  app: require('lib/app').callback(),
})
