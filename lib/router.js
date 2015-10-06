const router = require('koa-router')()

const middleware = {
  auth: require('./middleware/auth')
}

const controllers = {
  quote: require('./controllers/quote'),
}

module.exports =
  router
    .get  ('/',             controllers.quote.random)

    .get  ('/quotes',       controllers.quote.random)
    .get  ('/quotes/:id',   controllers.quote.show)

    .use  ('/admin',        middleware.auth)
    .post ('/admin/quotes', controllers.quote.create)
