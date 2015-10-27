const uuid = require('node-uuid')

module.exports = function * (next) {
  this.sessionValidate = sessionValidate
  yield next
}

function sessionValidate() {
  if (!this.session.uuid) {
    this.session.uuid = uuid.v4()
  }

  return true
}
