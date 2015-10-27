const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const router = require('./router')

const app = module.exports = koa()

app.keys = require('config/session-keys')
app
  .use(session(app))
  .use(require('lib/middleware/session-validate'))
  .use(bodyParser())
  .use(require('lib/views'))
  .use(router.routes())
  .use(router.allowedMethods())
