const _ = require('lodash')
const supertest = require('supertest')
const app = require('lib/app')

let nodeServer = app.callback()

module.exports = {
  request () {
    return supertest(nodeServer)
  },

  agent () {
    return _.assign(supertest.agent(nodeServer), agentMethods)
  },
}

function asHeader (attrs) {
  return _(attrs)
           .map((val, key) => val === true ? key : `${key}=${val}`)
           .join('; ')
}

let agentMethods = {
  withCookies (...args) {
    for (let attrs of args) {
      _.defaults(attrs, {
        path: '/',
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toGMTString(),
        httponly: true,
      })

      this.jar.setCookie(asHeader(attrs))
    }
    return this
  },

  withValidSession () {
    // TODO: encrypt actual values instead of using magic cookies
    // let sessionCookie = encrypt({ uuid: 'de305d54-75b4-431b-adb2-eb6b9e546014' })
    // return this.withCookies(
    //   { 'koa:sess': sessionCookie },
    //   { 'koa:sess.sig': signed(sessionCookie) }
    // )
    return this.withCookies(
      { 'koa:sess': 'eyJ1dWlkIjoiM2NlZDhhMzUtY2E1ZC00Y2MyLWFkOWQtYTI4NWRkMzAwN2VkIiwiX2V4cGlyZSI6MTQ3ODEyODk2NjcyOSwiX21heEFnZSI6MzE1MzYwMDAwMDB9' },
      { 'koa:sess.sig': 'v7oPCVHTtuBKffPjho1qCrlbqnU' }
    )
  },
}
