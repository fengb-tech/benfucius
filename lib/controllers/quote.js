const Quote = require('lib/models/quote')

const MAX_LENGTH = 160 // Twitter ought to be enough for everyone

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
  let quote = yield Quote.randomOffset().fetch()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = quote
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
