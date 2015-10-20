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

  describe('.withVotes', () => {
    db.sync()

    beforeEach(Promise.coroutine(function * () {
      let quote = new Quote()
      this.quote = yield quote.save()
    }))

    describe('#get("positive_votes")', () => {
      it('= null by default', Promise.coroutine(function * () {
        let quote = yield Quote.withVotes().fetch()
        expect(quote.get('positive_votes')).to.be.null()
      }))

      it('= 0.5 with votes', Promise.coroutine(function * () {
        let votes = this.quote.related('votes')
        this.plusVote = yield votes.create({ value: '+' })
        this.minusVote = yield votes.create({ value: '-' })

        let quote = yield Quote.withVotes().fetch()
        expect(quote.get('positive_votes')).to.eq(0.5)
      }))
    })
  })

  describe('.kosher', () => {
    db.sync()

    beforeEach(Promise.coroutine(function * () {
      let quote = new Quote()
      this.quote = yield quote.save()
    }))

    it('is kosher by default', Promise.coroutine(function * () {
      let quote = yield Quote.kosher().fetch()
      expect(quote).to.not.be.null()
      expect(quote.get('id')).to.equal(this.quote.get('id'))
    }))

    describe('with 50% "wtf" vote', function () {
      beforeEach(Promise.coroutine(function * () {
        let votes = this.quote.related('votes')
        this.plusVote = yield votes.create({ value: '+' })
        this.wtfVote = yield votes.create({ value: 'wtf' })
      }))

      it('is not kosher if over minCount and under threshold', Promise.coroutine(function * () {
        let quote = yield Quote.kosher({ minCount: 2, threshold: 1 }).fetch()
        expect(quote).to.be.null()
      }))

      it('is kosher if under minCount', Promise.coroutine(function * () {
        let quote = yield Quote.kosher({ minCount: 3, threshold: 1 }).fetch()
        expect(quote).to.not.be.null()
      }))

      it('is kosher if over threshold', Promise.coroutine(function * () {
        let quote = yield Quote.kosher({ minCount: 2, threshold: 0.4 }).fetch()
        expect(quote).to.not.be.null()
      }))
    })
  })
})
