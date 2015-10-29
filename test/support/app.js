const supertest = require('supertest')
const app = require('lib/app')

let nodeServer = app.callback()

module.exports = {
  request () {
    return supertest(nodeServer)
  },

  agent () {
    return supertest.agent(nodeServer)
  },
}
