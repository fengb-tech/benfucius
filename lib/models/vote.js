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
    let col = `COUNT(*) < ${minCount} OR ${votesSum('wtf')} > COUNT(*) * ${threshold}`
    return this.query().select(knex.raw(`${col} AS is_kosher`))
  },

  positiveVotesQuery () {
    let col = `${votesSum('+')} / COUNT(*)::float`
    return this.query().select(knex.raw(`${col} AS positive_votes`))
  },
})
