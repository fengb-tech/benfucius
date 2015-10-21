const sql = require('lib/utils/sql')
const config = require('config/knex')
const knex = require('knex')
const Bookshelf = module.exports = require('bookshelf')(knex(config))

Bookshelf.Model.prototype.fetchRandom = function () {
  let randomOffset = this.query((qb) => {
    let countSql = qb.clone().count()
    let randomSql = sql.random(0, countSql)
    qb.offset(Bookshelf.knex.raw(`FLOOR(${randomSql})`))
  })
  return randomOffset.fetch()
}
