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

  aggrJoin (subquery) {
    subquery = subquery.clone().groupBy('quote_id').select('quote_id')
    return this.query((qb) => {
      qb.joinRaw(`LEFT JOIN(${subquery}) AS aggr_join ON aggr_join.quote_id = quotes.id`)
    })
  },

  kosher (opts) {
    return this.aggrJoin(Vote.isKosherQuery(opts))
      .query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },

  withVotes () {
    return this.aggrJoin(Vote.positiveVotesQuery())
      .query('select', 'quotes.*', 'positive_votes')
  },
})
