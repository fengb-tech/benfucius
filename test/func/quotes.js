const { request, app, Promise } = require('./support')

describe('func/quotes', () => {
  it('creates a quote', Promise.coroutine(function * () {
    let res = yield request(app)
      .post('/quotes')
      .send({ quote: 'This is the beginning of the end' })
      .expect(200)

    yield request(app)
      .get(`/quotes/${res.body.id}`)
      .expect(200, { quote: 'This is the beginning of the end' })
  }))
})
