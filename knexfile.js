// Shim to appease knex cli
exports.development = exports.test = exports.production = require('./config/knex')
