var Promise = require('bluebird')

exports.up = Promise.coroutine(function * (knex, _Promise) {
  yield knex.schema.table('quotes', (table) => {
    table.string('user_uuid')
  })

  yield knex.schema.table('votes', (table) => {
    table.string('user_uuid')
  })
})

exports.down = Promise.coroutine(function * (knex, _Promise) {
  yield knex.schema.table('quotes', (table) => {
    table.dropColumn('user_uuid')
  })

  yield knex.schema.table('votes', (table) => {
    table.dropColumn('user_uuid')
  })
})
