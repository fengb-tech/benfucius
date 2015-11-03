const _ = require('lodash')
const sinon = require('sinon')
const axios = require('axios')
const supertest = require('supertest')
const app = require('lib/app')

let nodeServer = app.callback()

module.exports = {
  request () {
    return supertest(nodeServer)
  },

  agent () {
    return _.assign(supertest.agent(nodeServer), { withValidSession })
  },
}

// TODO: mock this test side only
function * withValidSession () {
  let postStub = sinon.stub(axios, 'post', () => {
    return Promise.resolve({ data: { success: true } })
  })

  let res = yield this
    .post('/session')
    .send({ 'g-recaptcha-response': 'success' })
    .expect(302)

  postStub.restore()

  return this
}
