const knex = require('knex')
const Bookshelf = require('./bookshelf')
const Quote = require('./quote')

module.exports = Bookshelf.Model.extend({
  tableName: 'votes',
  quote: () => this.belongsTo(Quote),
}, {
  isKosherQuery ({ minCount = 10, threshold = 0.5 } = {}) {
    let kosherSelect = `COUNT(*) < ${minCount} OR SUM(CASE WHEN value = 'wtf' THEN 1 ELSE 0 END) > COUNT(*) * ${threshold}`
    return this.query()
      .groupBy('quote_id')
      .select('quote_id', knex.raw(`${kosherSelect} AS is_kosher`))
  },
})
