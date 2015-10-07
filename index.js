require('./init')

var server = require('lib/app')

var port = Number(process.env.PORT || 5000)

server.listen(port, function () {
  console.log('benfucius started on', port) // eslint-disable-line no-console
})
