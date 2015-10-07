const router = require('koa-router')()

const controllers = {
  quote: require('./controllers/quote'),
}

module.exports =
  router
    .get  ('/',           controllers.quote.random)

    .get  ('/quotes',     controllers.quote.random)
    .get  ('/quotes/:id', controllers.quote.show)
    .post ('/quotes',     controllers.quote.create)
