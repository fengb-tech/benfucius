const knex = require('knex')

const Bookshelf = require('./bookshelf')
const Vote = require('./vote')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
  votes () {
    return this.hasMany(Vote)
  },
}, {
  fetchRandom () {
    let randomOffset = this.query((qb) => {
      let countSql = qb.clone().count().toString()
      let randomSql = this.asRandomSql(0, countSql)
      qb.offset(Bookshelf.knex.raw(randomSql))
    })
    return randomOffset.fetch()
  },

  asRandomSql (min, max) {
    return `(random() * ((${max}) - (${min})) + (${min}))`
  },

  kosher ({ minCount = 10, threshold = 0.5 } = {}) {
    return this.query((qb) => {
      let kosherSelect = `COUNT(*) < ${minCount} OR SUM(CASE WHEN value = 'wtf' THEN 1 ELSE 0 END) > COUNT(*) * ${threshold}`
      let subQuery = Bookshelf.knex
        .select('quote_id', knex.raw(`${kosherSelect} AS is_kosher`))
        .from('votes')
        .groupBy('quote_id')
        .toString()

      qb.joinRaw(`LEFT JOIN(${subQuery}) AS votes_aggregate ON votes_aggregate.quote_id = quotes.id`)
    }).query({ where: { is_kosher: true }, orWhere: { is_kosher: null } })
  },
})
