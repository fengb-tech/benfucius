const Quote = require('lib/models/quote')

exports.show = function * (next) {
  let quote = yield Quote.where({ id: this.params.id }).withVotes().fetch()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  yield this.render('quotes/show', { quote })
}

exports.random = function * (next) {
  let quote = yield Quote.forge().kosher().withVotes().fetchRandom()

  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  yield this.render('quotes/show', { quote })
}

exports.new = function * (next) {
  yield this.render('quotes/new')
}

exports.create = function * (next) {
  if (!this.sessionValidate()) {
    return
  }

  let quote = new Quote({ text: this.request.body.text, user_uuid: this.session.uuid })
  yield quote.save()

  this.redirect(`/quotes/${quote.get('id')}`)
}

exports.vote = function * (next) {
  if (!this.sessionValidate()) {
    return
  }

  let quote = yield Quote.where({ id: this.params.id }).fetch()
  if (!quote) {
    this.body = 'Quote not found!'
    this.response.status = 404
    return
  }

  yield quote.related('votes')
    .upsert({
      where: { user_uuid: this.session.uuid },
      update: { value: this.request.body.value },
    })

  this.redirect(`/quotes/${quote.get('id')}`)
}
