exports.random = function (min, max) {
  return `(random() * ((${max}) - (${min})) + (${min}))`
}
