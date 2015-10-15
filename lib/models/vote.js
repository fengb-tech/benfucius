const Bookshelf = require('./bookshelf')
const Quote = require('./quote')

module.exports = Bookshelf.Model.extend({
  tableName: 'votes',
  quote: () => this.belongsTo(Quote),
})
