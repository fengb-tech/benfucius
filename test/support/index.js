process.env.NODE_ENV = 'test'
require('../../init')

const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  expect: chai.expect,
  _: require('lodash'),
  Promise: require('bluebird'),
  db: require('./db'),
}
