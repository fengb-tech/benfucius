const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const path = require('path')
const staticCache = require('koa-static-cache')

const router = require('./router')

const app = module.exports = koa()

app.keys = require('config/session-keys')
app
  .use(session(app, { maxAge: 365 * 24 * 60 * 60 * 1000 }))
  .use(require('lib/middleware/session-validate'))
  .use(bodyParser())
  .use(require('lib/views'))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(staticCache(path.join(__dirname, '..', 'public')))
