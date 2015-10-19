const accepts = require('accepts')
const coViews = require('co-views')

module.exports = function * (next) {
  this.render = render
  yield next
}

let coRender = coViews(__dirname, {
  default: 'jade',
})

function * render (view, locals) {
  let accept = accepts(this.request)
  let acceptType = accept.type(['json', 'html'])

  let { type, body } = yield render[acceptType](view, locals)

  this.set('Content-Type', type)
  this.body = body
}

render.json = function * (view, locals) {
  return {
    type: 'application/json',
    body: JSON.stringify(locals),
  }
}

render.html = function * (view, locals) {
  let body = yield coRender(view, locals)
  return {
    type: 'text/html',
    body: body,
  }
}
