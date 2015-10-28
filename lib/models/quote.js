const _ = require('lodash')
const knex = require('knex')
const sql = require('lib/utils/sql')
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

  aggrJoin ({ subquery, alias = 'aggr_join', foreignKey = 'quote_id' } = {}) {
    subquery = subquery.clone().groupBy(foreignKey).select(foreignKey).as(alias)
    return this.query((qb) => {
      qb.leftJoin(subquery, `${alias}.${foreignKey}`, `${this.tableName}.id`)
    })
  },

  kosher (opts) {
    return this.aggrJoin({ subquery: Vote.isKosherQuery(opts), alias: 'kosher' })
      .query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },

  withVotes () {
//    let subquery = Vote.query().select({
//      positive_votes: knex.raw(sql.sumCase({ value: '+' })),
//      negative_votes: knex.raw('COUNT(*)'),
//    })
//    return this.aggrJoin({ subquery })
//      .query('select', [
//        'quotes.*', {
//          positive_votes: knex.raw('COALESCE(positive_votes, 0)'),
//          negative_votes: knex.raw('COALESCE(total_votes - positive_votes, 0)'),
//        }
//      ])
    let subquery = Vote.query().select(
      knex.raw(`${sql.sumCase({ value: '+' })} AS positive_votes`),
      knex.raw('COUNT(*) AS total_votes')
    )
    return this.aggrJoin({ subquery })
      .query('select', [
        'quotes.*',
        knex.raw('COALESCE(positive_votes, 0) AS positive_votes'),
        knex.raw('COALESCE(total_votes - positive_votes, 0) AS negative_votes'),
      ])
  },
})
