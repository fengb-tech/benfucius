const _ = require('lodash')

const MAX_LENGTH = 160 // Twitter ought to be enough for everyone

let quotes = [] // TODO: delete me!

exports.show = function * (next) {
  this.body = quotes[this.params.id]
}

exports.random = function * (next) {
  this.body = _.sample(quotes)
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

  quotes.push(this.request.body.quote)
  this.body = `Created! id: ${quotes.length - 1}`
}
