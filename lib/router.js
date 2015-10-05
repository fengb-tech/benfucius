const router = require('koa-router')()

module.exports =
  router
    .get('/', function * (next) {
      this.body = 'Hello world!'
    })
