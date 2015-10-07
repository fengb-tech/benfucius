module.exports = {
  up (knex, Promise) {
    return Promise.spawn(function * () {
      yield knex.schema.createTable('quotes', function(table) {
        table.increments('id')
        table.string('text')
      })
    })
  },

  down (knex, Promise) {
    return Promise.spawn(function * () {
      yield knex.schema.dropTable('quotes')
    })
  },
}
