process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const _ = require('lodash')
const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  expect: chai.expect,
  _: _,
  co: require('co'),
  Promise: require('bluebird'),
  db: require('./db'),
  request: require('supertest'),
  app: _.once(() => require('lib/app').callback()),
}
