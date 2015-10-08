require('./init')

module.exports = {
  client: 'postgresql',
  connection: process.env.BENFUCIUS_DB,
  pool: {
    min: 2,
    max: 10
  },
}
