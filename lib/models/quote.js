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

  validations: {
    user_uuid: ['required', 'uuid'],
    text:      ['required', 'maxLength:160'],
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
//        'quotes.*', 'positive_votes', {
//          negative_votes: knex.raw('total_votes - positive_votes'),
//        }
//      ])
    let subquery = Vote.query().select(
      knex.raw(`${sql.sumCase({ value: '+' })} AS positive_votes`),
      knex.raw('COUNT(*)::integer AS total_votes')
    )
    return this.aggrJoin({ subquery })
      .query('select', ['quotes.*', 'positive_votes', knex.raw('total_votes - positive_votes AS negative_votes')])
  },
})
