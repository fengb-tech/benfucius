module.exports = {
  up (knex, Promise) {
    return knex.schema.createTable('quotes', function (table) {
      table.increments('id')
      table.string('text')
    })
  },

  down (knex, Promise) {
    return knex.schema.dropTable('quotes')
  },
}
