const router = require('koa-router')()

const controllers = {
  quote: require('./controllers/quote'),
}

module.exports =
  router
     .get('/',                controllers.quote.random)

     .get('/quotes',          controllers.quote.random)
     .get('/quotes/new',      controllers.quote.new)
     .get('/quotes/:id',      controllers.quote.show)
    .post('/quotes/:id/vote', controllers.quote.vote)
    .post('/quotes',          controllers.quote.create)
