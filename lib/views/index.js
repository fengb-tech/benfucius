const coViews = require('co-views')

exports.render = coViews(__dirname, {
  default: 'jade',
})
