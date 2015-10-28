const _ = require('lodash')
const knexCleaner = require('knex-cleaner')
const Bookshelf = require('lib/models/bookshelf')

module.exports = {
  sync () {
    this.migrate()
    this.clean()
  },

  migrate: _.once(() => {
    before(() => Bookshelf.knex.migrate.latest())
  }),

  clean () {
    beforeEach(() => {
      return knexCleaner.clean(Bookshelf.knex, {
        ignoreTables: ['knex_migrations'],
      })
    })
  },
}
