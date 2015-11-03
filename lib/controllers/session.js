const querystring = require('querystring')
const axios = require('axios')
const recaptcha = require('config/recaptcha')

exports.show = function * (next) {
  yield this.render('session/show', {
    SITE_KEY: recaptcha.SITE_KEY,
  })
}

exports.create = function * (next) {
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
    this.redirect('/')
  } else {
    yield this.render('session/show', {
      SITE_KEY: recaptcha.SITE_KEY,
    })
  }
}
