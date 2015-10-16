process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const _ = require('lodash')
const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  _: _,
  expect: chai.expect,
  Promise: require('bluebird'),
  db: require('./db'),
  request: require('supertest'),
  app: _.once(() => require('lib/app').callback()),
  resourceParse (path) {
    let [resource, id, action] = _(path).trim('/').split('/')
    return { resource, id, action }
  },
}
