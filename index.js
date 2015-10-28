require('./init')

var port = Number(process.env.PORT || 5000)

require('lib/app').listen(port, () => {
  console.log('benfucius started on', port) // eslint-disable-line no-console
})
