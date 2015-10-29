const _ = require('lodash')
const chai = require('chai')
               .use(require('dirty-chai'))

module.exports = {
  _: _,
  expect: chai.expect,
  Promise: require('bluebird'),
  get db () {
    return require('./db')
  },
  get app () {
    return require('./app')
  },
  resourceParse (path) {
    let [resource, id, action] = _(path).trim('/').split('/')
    return { resource, id, action }
  },
}
