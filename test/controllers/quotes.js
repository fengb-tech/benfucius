const { expect, request, app, db, resourceParse } = require('test/support')
const Quote = require('lib/models/quote')

describe('func/quotes', () => {
  db.sync()

  describe('GET :id', () => {
    it('gets a quote', function * () {
      let quote = new Quote({ text: 'I am the walrus' })
      yield quote.save()

      yield request(app())
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
      let res = yield request(app())
        .post('/quotes')
        .send({ text: 'This is the beginning of the end' })
        .expect(302)

      let { id } = resourceParse(res.headers.location)
      expect(id).to.exist()

      let quote = yield Quote.where({ id }).fetch()
      expect(quote.get('text')).to.equal('This is the beginning of the end')
    })
  })
})
