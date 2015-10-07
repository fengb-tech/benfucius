const _ = require('lodash')
const Promise = require('bluebird')
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
  migrate: _.once(function () {
    before(Promise.coroutine(function * () {
      yield Bookshelf.knex.migrate.latest()
    }))
  }),
  clean () {
    beforeEach(Promise.coroutine(function * () {
      yield knexCleaner.clean(Bookshelf.knex, CLEAN_OPTIONS)
    }))
  },
}
