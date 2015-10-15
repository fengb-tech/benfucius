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
  let type = accept.type(['json', 'html'])
  let value = render[type](this.response, view, locals)
  this.body = yield Promise.resolve(value)
}

render.json = (res, view, locals) => {
  res.set('Content-Type', 'application/json')
  return JSON.stringify(locals)
}

render.html = (res, view, locals) => {
  res.set('Content-Type', 'text/html')
  return coRender(view, locals)
}
