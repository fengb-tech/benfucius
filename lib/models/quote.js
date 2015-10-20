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

  aggrJoin (subquery, { as, on }) {
    return this.query((qb) => {
      qb.joinRaw(`LEFT JOIN(${subquery}) AS ${as} ON ${on}`)
    })
  },

  kosher (opts) {
    return this.aggrJoin(Vote.isKosherQuery(opts), {
      as: 'kosher_aggr',
      on: 'kosher_aggr.quote_id = quotes.id',
    }).query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },

  withVotes () {
    return this.aggrJoin(Vote.positiveVotesQuery(), {
      as: 'votes_aggr',
      on: 'votes_aggr.quote_id = quotes.id',
    }).query('select', 'quotes.*', 'votes_aggr.positive_votes')
  },
})
