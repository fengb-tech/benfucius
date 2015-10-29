const supertest = require('supertest')
const app = require('lib/app')

module.exports = {
  request () {
    return supertest(app.callback())
  },

  agent () {
    return supertest.agent(app.callback())
  },
}
