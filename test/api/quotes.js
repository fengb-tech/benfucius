const { expect, app, db, factory, resourceParse } = require('test/support')
const Quote = require('lib/models/quote')

describe('API/quotes', () => {
  db.sync()

  describe('#POST', () => {
    it('redirects to session', function * () {
      let res = yield app.request()
        .post('/quotes')
        .send({ text: 'This is the beginning of the end' })
        .expect(302)

      expect(res.headers.location).to.equal('/session')
    })

    it('creates a quote', function * () {
      let agent = app.agent().withValidSession()
      let res = yield agent
        .post('/quotes')
        .send({ text: 'This is the beginning of the end' })
        .expect(302)

      let { resource, id, action } = resourceParse(res.headers.location)
      expect(resource).to.equal('quotes')
      expect(action).to.be.undefined()
      expect(id).to.exist()

      let quote = yield Quote.where({ id }).fetch()
      expect(quote.get('text')).to.equal('This is the beginning of the end')
    })
  })

  describe('/:id', () => {
    beforeEach(function * () {
      this.quote = yield factory.quote.create()
    })

    describe('#GET', () => {
      it('gets a quote', function * () {
        yield app.request()
          .get(`/quotes/${this.quote.get('id')}`)
          .expect(200, {
            quote: {
              id: this.quote.get('id'),
              text: this.quote.get('text'),
              positive_votes: null,
              negative_votes: null,
            },
          })
      })
    })

    describe('/votes#POST', () => {
      it('redirects to session', function * () {
        let res = yield app.request()
          .post(`/quotes/${this.quote.get('id')}/vote`)
          .send({ value: '+' })
          .expect(302)

        expect(res.headers.location).to.equal('/session')
      })

      it('adds a vote to a quote', function * () {
        let agent = app.agent().withValidSession()
        yield agent
          .post(`/quotes/${this.quote.get('id')}/vote`)
          .send({ value: '+' })
          .expect(302)

        let votes = yield this.quote.related('votes').fetch()
        expect(votes.length).to.eq(1)
        expect(votes.at(0).get('value')).to.eq('+')
      })

      it('updates existing vote for same session', function * () {
        let agent = app.agent().withValidSession()
        yield agent
          .post(`/quotes/${this.quote.get('id')}/vote`)
          .send({ value: '+' })

        yield agent
          .post(`/quotes/${this.quote.get('id')}/vote`)
          .send({ value: '-' })

        let votes = yield this.quote.related('votes').fetch()
        expect(votes.length).to.eq(1)
        expect(votes.at(0).get('value')).to.eq('-')
      })
    })
  })
})
