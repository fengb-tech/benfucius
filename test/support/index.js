process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  expect: chai.expect,
  _: require('lodash'),
  Promise: require('bluebird'),
  db: require('./db'),
}
