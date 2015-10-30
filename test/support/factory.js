const { _ } = require('.')
const uuid = require('node-uuid')

const Quote = require('lib/models/quote')
const Vote = require('lib/models/vote')

class Factory {
  constructor (Model, defaults = {}) {
    this.Model = Model
    this.defaults = defaults
  }

  attrs (attrs = {}) {
    _.forOwn(this.defaults, (value, key) => {
      if (!attrs.hasOwnProperty(key)) {
        attrs[key] = _.isFunction(value) ? value() : value
      }
    })

    return attrs
  }

  build (attrs = {}) {
    attrs = this.attrs(attrs)
    return new this.Model(attrs)
  }

  create (attrs = {}) {
    return this.build(attrs).save()
  }
}

module.exports = {
  quote: new Factory(Quote, {
    user_uuid: uuid.v4,
    text: 'Narp',
  }),

  vote: new Factory(Vote, {
    user_uuid: uuid.v4,
    value: '+',
  }),
}
