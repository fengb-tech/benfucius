const redisClient = require('redis').createClient()
const redisCo = require('co-redis')(redisClient)

module.exports = function * (next) {
  this.redisCo = redisCo
  yield next
}
