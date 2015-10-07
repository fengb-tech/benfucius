const { request, app, Promise } = require('./support')

describe('func/quotes', () => {
  it('creates a quote', (done) => {
    let id = null

    request(app)
      .post('/quotes')
      .send({ quote: 'This is the beginning of the end' })
      .expect(200)
      .expect((res) => {
        id = res.body.id
      })
      .end((err, res) => {
        if (err) throw err

        request(app)
          .get(`/quotes/${id}`)
          .expect(200, { quote: 'This is the beginning of the end' })
          .end(done)
      })
  })
})
