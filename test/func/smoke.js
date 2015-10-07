const { request, app } = require('./support')

describe('func/smoke', () => {
  it('loads the index page', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done)
  })
})
