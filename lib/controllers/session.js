const querystring = require('querystring')
const axios = require('axios')
const uuid = require('node-uuid')
const recaptcha = require('config/recaptcha')

function successRedirect (ctx) {
  ctx.redirect(ctx.session.redirectUrl || '/')
}

exports.show = function * (next) {
  if (this.sessionIsValid()) {
    successRedirect(this)
  }

  yield this.render('session/show', {
    recaptcha: { SITE_KEY: recaptcha.SITE_KEY },
  })
}

exports.create = function * (next) {
  if (this.sessionIsValid()) {
    successRedirect(this)
  }

  let url = 'https://www.google.com/recaptcha/api/siteverify'
  let recaptchaResponse = yield axios.post(url, querystring.stringify({
    secret: recaptcha.SECRET_KEY,
    response: this.request.body['g-recaptcha-response'],
    remoteip: this.request.ip,
  }))

  if (recaptchaResponse.data.success) {
    this.session.uuid = uuid.v4()
    successRedirect(this)
  } else {
    this.status = 401
    yield this.render('session/show', {
      recaptcha: { SITE_KEY: recaptcha.SITE_KEY },
    })
  }
}
