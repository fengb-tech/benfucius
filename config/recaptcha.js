var env = require('./env')

module.exports = {
  SITE_KEY:   env.BENFUCIUS_RECAPTCHA_SITE_KEY,
  SECRET_KEY: env.BENFUCIUS_RECAPTCHA_SECRET_KEY,
}
