const koa = require('koa')
const bodyParser = require('koa-bodyparser')

const router = require('./router')

module.exports =
  koa()
    .use(bodyParser())
    .use(require('./middleware/redis'))
    .use(router.routes())
    .use(router.allowedMethods())