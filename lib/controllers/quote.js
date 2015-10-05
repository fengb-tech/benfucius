const _ = require('lodash')

let quotes = [] // TODO: delete me!

exports.show = function * (next) {
  this.body = quotes[this.params.id]
}

exports.create = function * (next) {
  let quote = this.request.body.quote
  if (quote) {
    quotes.push(this.request.body.quote)
    this.body = `Created! id: ${quotes.length - 1}`
  } else {
    this.body = 'Quote not specified!'
    this.response.status = 400
  }
}

exports.random = function * (next) {
  this.body = _.sample(quotes)
}
