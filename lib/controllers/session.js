const recaptcha = require('config/recaptcha')

exports.show = function * (next) {
  yield this.render('session/show', {
    SITE_KEY: recaptcha.SITE_KEY,
  })
}

exports.create = function * (next) {
  console.log(this.request.body)
  let params = { secret: recaptcha.SECRET_KEY }
}
