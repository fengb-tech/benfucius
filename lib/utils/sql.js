const _ = require('lodash')
const knex = require('knex')

exports.random = function (min, max) {
  return `(random() * ((${max}) - (${min})) + (${min}))`
}

exports.sumCase = function (opts) {
  let whenThen = []
  let params = []
  for (let column in opts) {
    let value = opts[column]
    if (_.isArray(value)) {
      whenThen.push(`WHEN (${column}) IN (?) THEN 1`)
    } else {
      whenThen.push(`WHEN (${column}) = ? THEN 1`)
    }
    params.push(value)
  }

  return knex.raw(`SUM(CASE ${whenThen.join(' ')} ELSE 0 END)::integer`, params)
}
