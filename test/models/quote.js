const { expect, _, db, factory } = require('test/support')
const Quote = require('lib/models/quote')

describe('Quote', () => {
  describe('#fetchRandom', () => {
    db.sync()

    beforeEach(function * () {
      this.quotes = yield _.times(10, () => factory.quote.create())
    })

    it('returns random quotes', function * () {
      let quotes = yield * _.times(3, () => Quote.forge().fetchRandom())
      let uniqQuoteIds = _(quotes)
                           .map((q) => q.get('id'))
                           .uniq()
                           .value()

      expect(uniqQuoteIds).to.not.have.length(1)
    })
  })

  describe('#withVotes', () => {
    db.sync()

    beforeEach(function * () {
      this.quote = yield factory.quote.create()
    })

    it('has nulls by default', function * () {
      let quote = yield Quote.forge().withVotes().fetch()
      expect(quote.get('positive_votes')).to.eq(null)
      expect(quote.get('negative_votes')).to.eq(null)
    })

    it('counts up votes', function * () {
      let quote_id = this.quote.get('id')
      yield [
        factory.vote.create({ quote_id, value: '+' }),
        factory.vote.create({ quote_id, value: '-' }),
      ]

      let quote = yield Quote.forge().withVotes().fetch()
      expect(quote.get('positive_votes')).to.eq(1)
      expect(quote.get('negative_votes')).to.eq(1)
    })
  })

  describe('#kosher', () => {
    db.sync()

    beforeEach(function * () {
      this.quote = yield factory.quote.create()
    })

    it('is kosher by default', function * () {
      let quote = yield Quote.forge().kosher().fetch()
      expect(quote).to.not.be.null()
      expect(quote.get('id')).to.equal(this.quote.get('id'))
    })

    describe('with 50% "!" vote', function () {
      beforeEach(function * () {
        let quote_id = this.quote.get('id')
        this.votes = yield [
          factory.vote.create({ quote_id, value: '+' }),
          factory.vote.create({ quote_id, value: '!' }),
        ]
      })

      it('is not kosher if over minCount and above threshold', function * () {
        let quote = yield Quote.forge().kosher({ minCount: 1, threshold: 0 }).fetch()
        expect(quote).to.be.null()
      })

      it('is kosher if under minCount', function * () {
        let quote = yield Quote.forge().kosher({ minCount: 2, threshold: 0 }).fetch()
        expect(quote).to.not.be.null()
      })

      it('is kosher if under threshold', function * () {
        let quote = yield Quote.forge().kosher({ minCount: 1, threshold: 0.6 }).fetch()
        expect(quote).to.not.be.null()
      })
    })
  })
})
