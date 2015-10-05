const koa = require('koa')

const router = require('./router')

module.exports =
  koa()
    .use(router.routes())
    .use(router.allowedMethods())
