const sql = require('lib/utils/sql')
const Promise = require('bluebird')
const checkit = require('checkit')

const config = require('config/knex')
const knex = require('knex')

const Bookshelf = module.exports = require('bookshelf')(knex(config))

Bookshelf.Model.prototype.initialize = function () {
  this.on('saving', this.validate)
}

Bookshelf.Model.prototype.validate = function () {
  if (this.validations) {
    return checkit(this.validations).run(this.attributes)
  }
}

Bookshelf.Model.prototype.fetchRandom = Promise.coroutine(function * () {
  let ids = yield this.query().clone().pluck('id')

  let randomSql = sql.random(0, ids.length)
  let offsetSql = Bookshelf.knex.raw(`FLOOR(${randomSql})`)
  return this.query({ offset: offsetSql }).fetch()
})

Bookshelf.Collection.prototype.upsert = Promise.coroutine(function * ({ where, update }) {
  let record = yield this.query({ where }).fetchOne()
  if (record) {
    record.set(update)
    return record.save()
  } else {
    let attrs = Object.assign({}, where, update)
    return this.create(attrs)
  }
})
