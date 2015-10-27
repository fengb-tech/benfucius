const _ = require('lodash')
const supertest = require('supertest')
const supertestSession = require('supertest-session')

const app = module.exports = _.once(() => require('lib/app').callback())
app.request = () => supertest(app())
app.session = () => supertestSession(app())
