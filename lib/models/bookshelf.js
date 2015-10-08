const config = require('config/knex')
const knex = require('knex')
module.exports = require('bookshelf')(knex(config))
