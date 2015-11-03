const querystring = require('querystring')
const axios = require('axios')
const uuid = require('node-uuid')
const recaptcha = require('config/recaptcha')

exports.show = function * (next) {
  if (this.sessionIsValid()) {
    this.redirect('/')
  }

  yield this.render('session/show', {
    SITE_KEY: recaptcha.SITE_KEY,
  })
}

exports.create = function * (next) {
  if (this.sessionIsValid()) {
    this.redirect('/')
  }

  let recaptchaResponse = yield axios({
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    data: querystring.stringify({
      secret: recaptcha.SECRET_KEY,
      response: this.request.body['g-recaptcha-response'],
      remoteip: this.request.ip,
    }),
  })

  if (recaptchaResponse.data.success) {
    this.session.uuid = uuid.v4()
    this.redirect('/')
  } else {
    yield this.render('session/show', {
      SITE_KEY: recaptcha.SITE_KEY,
    })
  }
}
