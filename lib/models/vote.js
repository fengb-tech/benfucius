const knex = require('knex')
const Bookshelf = require('./bookshelf')
const Quote = require('./quote')

const sql = require('lib/utils/sql')

module.exports = Bookshelf.Model.extend({
  tableName: 'votes',
  quote () {
    return this.belongsTo(Quote)
  },

  validations: {
    user_uuid: ['required', 'uuid'],
    value (val) {
      if (!'+-!'.includes(val)) {
        throw new Error('value must be +, -, or !')
      }
    },
  },
}, {
  isKosherQuery ({ minCount = 10, threshold = 0.5 } = {}) {
    let dirty = sql.sumCase({ value: '!' })
//    return this.query().select({
//      is_kosher: knex.raw(`${dirty} < GREATEST(${minCount}, COUNT(*) * ${threshold})`),
//    })
    let col = `${dirty} < GREATEST(${minCount}, COUNT(*) * ${threshold})`
    return this.query().select(knex.raw(`${col} AS is_kosher`))
  },
})
