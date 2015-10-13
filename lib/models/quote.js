const Bookshelf = require('./bookshelf')

module.exports = Bookshelf.Model.extend({
  tableName: 'quotes',
}, {
  randomOffset () {
    return this.query((qb) => {
      let countSql = qb.clone().count().toString()
      let randomSql = this.asRandomSql(0, countSql)
      qb.offset(Bookshelf.knex.raw(randomSql))
    })
  },

  asRandomSql (min, max) {
    return `(random() * ((${max}) - (${min})) + (${min}))`
  },
})
