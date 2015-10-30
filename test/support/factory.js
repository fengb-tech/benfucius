const uuid = require('node-uuid')
const Quote = require('lib/models/quote')
const Vote = require('lib/models/vote')

module.exports = {
  quote: factoryize(Quote, (attrs = {}) => {
    attrs.user_uuid = attrs.user_uuid || uuid.v4()
    attrs.text = attrs.text || 'Narp'
    return attrs
  }),

  vote: factoryize(Vote, (attrs = {}) => {
    attrs.user_uuid = attrs.user_uuid || uuid.v4()
    attrs.value = attrs.value || '+'
    return attrs
  }),
}

function factoryize (Model, attrFn) {
  return {
    attrs: attrFn,
    build (attrs) {
      attrs = this.attrs(attrs)
      return new Model(attrs)
    },
    create (attrs) {
      attrs = this.attrs(attrs)
      return new Model(attrs).save()
    },
  }
}
