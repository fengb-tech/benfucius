exports.up = (knex, _Promise) => {
  return knex.schema
    .table('quotes', (table) => {
      table.string('user_uuid')
    })
    .table('votes', (table) => {
      table.string('user_uuid')
    })
}

exports.down = (knex, _Promise) => {
  return knex.schema
    .table('quotes', (table) => {
      table.dropColumn('user_uuid')
    })
    .table('votes', (table) => {
      table.dropColumn('user_uuid')
    })
}
