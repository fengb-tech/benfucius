const { expect } = require('test/support')
const sql = require('lib/utils/sql')

describe('lib/utils/sql', () => {
  describe('.random', () => {
    it('wraps values into random-sql snippet', () => {
      expect(sql.random(1, 10).toString())
        .to.equal('(random() * ((10) - (1)) + (1))')
    })
  })
})
