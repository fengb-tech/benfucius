const _ = require('lodash')
const knexCleaner = require('knex-cleaner')
const Bookshelf = require('lib/models/bookshelf')

const CLEAN_OPTIONS = {
  ignoreTables: ['knex_migrations'],
}

module.exports = {
  sync () {
    this.migrate()
    this.clean()
  },
  migrate: _.once(() => {
    before(() => Bookshelf.knex.migrate.latest())
  }),
  clean () {
    beforeEach(() => knexCleaner.clean(Bookshelf.knex, CLEAN_OPTIONS))
  },
}
