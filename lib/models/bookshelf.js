const config = require('knexfile')
const knex = require('knex')
module.exports = require('bookshelf')(knex(config.current))
