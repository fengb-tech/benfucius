require('../init')

var chai = require('chai')
            .use(require('dirty-chai'))

module.exports = {
  expect: chai.expect,
  _: require('lodash'),
}
