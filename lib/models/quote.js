const _ = require('lodash')
const Bookshelf = require('./bookshelf')
const Vote = require('./vote')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
  votes () {
    return this.hasMany(Vote)
  },

  serialize (options) {
    return _.omit(this.attributes, 'user_uuid')
  },

  aggrJoin (subquery, { alias = 'aggr_join', foreignKey = 'quote_id' } = {}) {
    subquery = subquery.clone().groupBy(foreignKey).select(foreignKey).as(alias)
    return this.query((qb) => {
      qb.leftJoin(subquery, `${alias}.${foreignKey}`, `${this.tableName}.id`)
    })
  },

  kosher (opts) {
    return this.aggrJoin(Vote.isKosherQuery(opts), { alias: 'kosher' })
      .query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },

  withVotes () {
    return this.aggrJoin(Vote.positiveVotesQuery())
      .query({ select: ['quotes.*', Bookshelf.knex.raw('COALESCE(positive_votes, 0) AS positive_votes')] })
  },
})
