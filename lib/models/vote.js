const knex = require('knex')
const Bookshelf = require('./bookshelf')
const Quote = require('./quote')

const sql = require('lib/utils/sql')

module.exports = Bookshelf.Model.extend({
  tableName: 'votes',
  quote () {
    return this.belongsTo(Quote)
  },
}, {
  isKosherQuery ({ minCount = 10, threshold = 0.5 } = {}) {
    let col = `COUNT(*) < ${minCount} OR ${sql.sumCase({ value: 'wtf' })} > COUNT(*) * ${threshold}`
    return this.query().select(knex.raw(`${col} AS is_kosher`))
  },

  positiveVotesQuery () {
    let col = `${sql.sumCase({ value: '+' })} / COUNT(*)::float`
    return this.query().select(knex.raw(`${col} AS positive_votes`))
  },
})
