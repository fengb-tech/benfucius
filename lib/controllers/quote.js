const _ = require('lodash')
const views = require('lib/views')
const Quote = require('lib/models/quote')

const MAX_LENGTH = 160 // Twitter ought to be enough for everyone

exports.show = function * (next) {
  let quote = yield Quote.where({ id: this.params.id }).fetch()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = yield views.render('quotes/show', { quote })
}

exports.random = function * (next) {
  let quote = yield Quote.fetchRandom()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  this.body = yield views.render('quotes/show', { quote })
}

exports.new = function * (next) {
  this.body = yield views.render('quotes/new')
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

  let quote = new Quote({ text })
  yield quote.save()

  this.body = quote
}

const VALID_VOTES = ['+', '-', 'wtf']

exports.vote = function * (next) {
  let value = this.request.body.value
  if (!value || !_.includes(VALID_VOTES, value)) {
    this.response.status = 400
    return
  }

  let quote = yield Quote.where({ id: this.params.id }).fetch()
  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  let vote = yield quote.related('votes').create({ value })

  this.body = vote
}
