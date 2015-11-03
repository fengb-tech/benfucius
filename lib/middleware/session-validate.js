module.exports = function * (next) {
  this.sessionIsValid = sessionIsValid
  this.sessionValidate = sessionValidate
  yield next
}

function sessionIsValid () {
  return this.session.uuid != null
}

function sessionValidate () {
  if (!this.sessionIsValid()) {
    this.redirect('/session')
    return false
  }

  return true
}
