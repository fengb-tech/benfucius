const { expect, request, app, Promise, db } = require('./support')
const Quote = require('lib/models/quote')

describe('func/quotes', () => {
  db.sync()

  describe('POST', () => {
    it('creates a quote', Promise.coroutine(function * () {
      let res = yield request(app)
        .post('/quotes')
        .send({ text: 'This is the beginning of the end' })
        .expect(200)

      expect(res.body.id).to.exist()

      let quote = yield Quote.where({ id: res.body.id }).fetch()
      expect(quote.get('text')).to.equal('This is the beginning of the end')
    }))
  })

  describe('GET :id', () => {
    it('gets a quote', Promise.coroutine(function * () {
      let quote = new Quote({ text: 'I am the walrus' })
      yield quote.save()

      yield request(app)
        .get(`/quotes/${quote.get('id')}`)
        .expect(200, quote.toJSON())
    }))
  })
})
