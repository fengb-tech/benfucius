const Bookshelf = require('./bookshelf')
const Vote = require('./vote')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
  votes () {
    return this.hasMany(Vote)
  },
}, {
  fetchRandom () {
    let randomOffset = this.query((qb) => {
      let countSql = qb.clone().count().toString()
      let randomSql = this.asRandomSql(0, countSql)
      qb.offset(Bookshelf.knex.raw(randomSql))
    })
    return randomOffset.fetch()
  },

  asRandomSql (min, max) {
    return `(random() * ((${max}) - (${min})) + (${min}))`
  },

  kosher (opts) {
    return this.query((qb) => {
      qb.joinRaw(`LEFT JOIN(${Vote.isKosherQuery(opts)})
                  AS votes_aggregate
                  ON votes_aggregate.quote_id = quotes.id`)
    }).query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },
})
