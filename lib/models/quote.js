const Bookshelf = require('./bookshelf')
const Vote = require('./vote')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
  votes () {
    return this.hasMany(Vote)
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
