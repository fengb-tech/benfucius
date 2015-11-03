const _ = require('lodash')
const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  _: _,
  expect: chai.expect,
  Promise: require('bluebird'),
  sinon: require('sinon'),
  get db () {
    return require('./db')
  },
  get app () {
    return require('./app')
  },
  get mocha () {
    return require('./mocha')
  },
  get factory () {
    return require('./factory')
  },
  resourceParse (path) {
    let [resource, id, action] = _(path).trim('/').split('/')
    return { resource, id, action }
  },
}
