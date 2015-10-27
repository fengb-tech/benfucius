const { expect, app, db, resourceParse } = require('test/support')
const Quote = require('lib/models/quote')

describe('func/quotes', () => {
  db.sync()

  describe('GET :id', () => {
    it('gets a quote', function * () {
      let quote = new Quote({ text: 'I am the walrus' })
      yield quote.save()

      yield app.request()
        .get(`/quotes/${quote.get('id')}`)
        .expect(200, {
          quote: {
            id: quote.get('id'),
            text: quote.get('text'),
            positive_votes: 0,
          },
        })
    })
  })

  describe('POST', () => {
    it('creates a quote', function * () {
      let res = yield app.request()
        .post('/quotes')
        .send({ text: 'This is the beginning of the end' })
        .expect(302)

      let { id } = resourceParse(res.headers.location)
      expect(id).to.exist()

      let quote = yield Quote.where({ id }).fetch()
      expect(quote.get('text')).to.equal('This is the beginning of the end')
    })
  })

  describe('/votes#POST', () => {
    beforeEach(function * () {
      let quote = new Quote({ text: 'I am the walrus' })
      this.quote = yield quote.save()
    })

    it('adds a vote to a quote', function * () {
      yield app.request()
        .post(`/quotes/${this.quote.get('id')}/vote`)
        .send({ value: '+' })
        .expect(302)

      let votes = yield this.quote.related('votes').fetch()
      expect(votes.length).to.eq(1)
      expect(votes.at(0).get('value')).to.eq('+')
    })

    it('updates existing vote for same session', function * () {
      let session = app.session()
      yield session
        .post(`/quotes/${this.quote.get('id')}/vote`)
        .send({ value: '+' })

      yield session
        .post(`/quotes/${this.quote.get('id')}/vote`)
        .send({ value: '-' })

      let votes = yield this.quote.related('votes').fetch()
      expect(votes.length).to.eq(1)
      expect(votes.at(0).get('value')).to.eq('-')
    })
  })
})
