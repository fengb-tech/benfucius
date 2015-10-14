const { expect, _, db, Promise } = require('test/support')
const Quote = require('lib/models/quote')

describe('Quote', () => {
  describe('.asRandomSql', () => {
    it('wraps values into random-sql snippet', () => {
      expect(Quote.asRandomSql(1, 10))
        .to.equal('(random() * ((10) - (1)) + (1))')
    })

    it('wraps strings into random-sql snippet', () => {
      expect(Quote.asRandomSql(1, 'count(*)'))
        .to.equal('(random() * ((count(*)) - (1)) + (1))')
    })
  })

  describe('.fetchRandom', () => {
    db.sync()

    beforeEach(Promise.coroutine(function * () {
      let quotes = _.times(10, () => new Quote())
      yield * _.map(quotes, (q) => q.save())
    }))

    it('returns random quotes', Promise.coroutine(function * () {
      let quotes = yield * _.times(3, () => Quote.fetchRandom())
      let uniqQuoteIds = _(quotes)
                           .map((q) => q.get('id'))
                           .uniq()
                           .value()

      expect(uniqQuoteIds).to.not.have.length(1)
    }))
  })
})
