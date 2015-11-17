const router = require('koa-router')
const controllers = require('./controllers')

module.exports =
  router()
     .get('/',                controllers.quotes.random)

     .get('/quotes',          controllers.quotes.random)
    .post('/quotes',          controllers.quotes.create)
     .get('/quotes/new',      controllers.quotes.new)
     .get('/quotes/latest',   controllers.quotes.latest)

     .get('/quotes/:id',      controllers.quotes.show)
    .post('/quotes/:id/vote', controllers.quotes.vote)
     .get('/quotes/:id/vote', controllers.quotes.redirect)

     .get('/session',         controllers.session.show)
    .post('/session',         controllers.session.create)
