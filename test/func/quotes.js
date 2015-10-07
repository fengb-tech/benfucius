const { expect, request, app, Promise, db } = require('./support')

describe('func/quotes', () => {
  db.sync()

  it('creates a quote', Promise.coroutine(function * () {
    let res = yield request(app)
      .post('/quotes')
      .send({ text: 'This is the beginning of the end' })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).to.exist()
      })

    yield request(app)
      .get(`/quotes/${res.body.id}`)
      .expect(200, {
        id: res.body.id,
        text: 'This is the beginning of the end',
      })
  }))
})
