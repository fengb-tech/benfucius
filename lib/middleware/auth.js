const SECRET = process.env.BENFUCIUS_SECRET

if (process.env.NODE_ENV === 'production') {
  if (!SECRET) {
    throw 'BENFUCIUS_SECRET not defined'
  }
  module.exports = function * (next) {
    // TODO: real permissioning
    if (this.request.get('X-BENFUCIUS-SECRET') !== SECRET) {
      this.response.status = 401
      this.body = 'Nope!'
      return
    }

    yield next
  }
} else {
  module.exports = function * (next) {
    if (SECRET && this.request.get('X-BENFUCIUS-SECRET') !== SECRET) {
      console.log(`X-BENFUCIUS-SECRET !== ${SECRET}`)
    }

    yield next
  }
}
