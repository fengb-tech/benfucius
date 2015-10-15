exports.up = (knex, Promise) => {
  return knex.schema.createTable('votes', function (table) {
    table.increments('id')
    table.integer('quote_id').references('quotes.id')
    table.string('value')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('votes')
}
