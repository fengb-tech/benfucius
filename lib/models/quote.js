const Bookshelf = require('./bookshelf')
const Vote = require('./vote')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
  votes () {
    return this.hasMany(Vote)
  },

  aggrJoin (subquery) {
    let joinAlias = 'aggr_join'
    let foreignKey = 'quote_id'
    subquery = subquery.clone().groupBy(foreignKey).select(foreignKey).as(joinAlias)
    return this.query((qb) => {
      qb.leftJoin(subquery, `${joinAlias}.${foreignKey}`, `${this.tableName}.id`)
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
