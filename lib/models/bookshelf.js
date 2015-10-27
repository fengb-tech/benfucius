const sql = require('lib/utils/sql')
const config = require('config/knex')
const knex = require('knex')
const Promise = require('bluebird')
const Bookshelf = module.exports = require('bookshelf')(knex(config))

Bookshelf.Model.prototype.fetchRandom = Promise.coroutine(function * () {
  let ids = yield this.query().clone().pluck('id')

  let randomSql = sql.random(0, ids.length)
  let offsetSql = Bookshelf.knex.raw(`FLOOR(${randomSql})`)
  return this.query({ offset: offsetSql }).fetch()
})
