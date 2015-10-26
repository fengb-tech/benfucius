var dotenv = require('dotenv')
var path = require('path')

var nodeEnv = process.env.NODE_ENV || 'development'
var file = path.join(__dirname, '..', '.env')

dotenv.load({ silent: true, path: file }) ||
  dotenv.load({ silent: true, path: `${file}.${nodeEnv}` })

module.exports = process.env
