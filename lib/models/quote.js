const Bookshelf = require('./bookshelf')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
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
})
