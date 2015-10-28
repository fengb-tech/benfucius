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
    let wtfs = sql.sumCase({ value: 'wtf' })
//    return this.query().select({
//      is_kosher: knex.raw(`${wtfs} < GREATEST(${minCount}, COUNT(*) * ${threshold})`),
//    })
    let col = `${wtfs} < GREATEST(${minCount}, COUNT(*) * ${threshold})`
    return this.query().select(knex.raw(`${col} AS is_kosher`))
  },
})
