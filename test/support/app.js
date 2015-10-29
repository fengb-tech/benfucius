const _ = require('lodash')
const supertest = require('supertest')

const app = module.exports = _.once(() => require('lib/app').callback())
app.request = () => supertest(app())
app.agent = () => supertest.agent(app())
