const knex = require('knex')
const Bookshelf = require('./bookshelf')
const Quote = require('./quote')

function votesSum (value) {
  return knex.raw('SUM(CASE WHEN value = ? THEN 1 ELSE 0 END)', [value])
}

module.exports = Bookshelf.Model.extend({
  tableName: 'votes',
  quote: () => this.belongsTo(Quote),
}, {
  isKosherQuery ({ minCount = 10, threshold = 0.5 } = {}) {
    let kosherSelect = `COUNT(*) < ${minCount} OR ${votesSum('wtf')} > COUNT(*) * ${threshold}`
    return this.query()
      .groupBy('quote_id')
      .select('quote_id', knex.raw(`${kosherSelect} AS is_kosher`))
  },

  positiveVotesQuery () {
    return this.query()
      .groupBy('quote_id')
      .select('quote_id',
              knex.raw(`${votesSum('+')} / COUNT(*)::float AS positive_votes`))
  },
})
