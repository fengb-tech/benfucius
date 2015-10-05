exports.index = exports.random = exports.show = function * (next) {
  this.body = 'Hello world!'
}

exports.create = function * (next) {
  this.body = 'Testing create!'
}
