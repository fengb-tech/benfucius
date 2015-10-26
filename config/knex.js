var env = require('./env')

module.exports = {
  client: 'postgresql',
  connection: env.BENFUCIUS_DB,
  pool: {
    min: 2,
    max: 10,
  },
}
