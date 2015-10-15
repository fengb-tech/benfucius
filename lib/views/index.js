const coViews = require('co-views')

let coRender = coViews(__dirname, {
  default: 'jade',
})

function * render (view, locals) {
  this.body = yield coRender(view, locals)
}

module.exports = function * (next) {
  this.render = render
  yield next
}
