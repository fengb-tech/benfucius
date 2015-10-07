const _ = require('lodash')

const MAX_LENGTH = 160 // Twitter ought to be enough for everyone

const REDIS_KEY = 'benfucius-quote'

exports.show = function * (next) {
  let quote = yield this.redisCo.hget(REDIS_KEY, this.params.id)

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = { quote }
}

exports.random = function * (next) {
  let fields = yield this.redisCo.hkeys(REDIS_KEY)

  let randomField = _.sample(fields)
  let quote = yield this.redisCo.hget(REDIS_KEY, randomField)

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = { quote }
}

exports.create = function * (next) {
  let quote = this.request.body.quote
  if (!quote) {
    this.body = 'Quote not specified!'
    this.response.status = 400
    return
  }

  if (quote.length > MAX_LENGTH) {
    this.body = `Quote too long! Max length is ${MAX_LENGTH}`
    this.response.status = 422
    return
  }

  let hlength = yield this.redisCo.hlen(REDIS_KEY)
  let nextField = hlength
  yield this.redisCo.hset(REDIS_KEY, nextField, quote)
  this.body = { id: nextField }
}
