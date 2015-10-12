const _ = require('lodash')

const Quote = require('lib/models/quote')

const MAX_LENGTH = 160 // Twitter ought to be enough for everyone

const REDIS_KEY = 'benfucius-quote'

exports.show = function * (next) {
  let quote = yield Quote.where({ id: this.params.id }).fetch()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = quote
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
  let text = this.request.body.text
  if (!text) {
    this.body = 'Quote not specified!'
    this.response.status = 400
    return
  }

  if (text.length > MAX_LENGTH) {
    this.body = `Quote too long! Max length is ${MAX_LENGTH}`
    this.response.status = 422
    return
  }

  let quote = yield Quote.collection().create({ text })
  this.body = quote
}
