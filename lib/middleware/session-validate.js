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
    this.session.redirectUrl = this.request.url
    this.redirect('/session')
    return false
  }

  return true
}
