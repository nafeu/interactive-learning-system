const chai = require("chai")
const {expect} = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

describe('/GET api/test', () => {
  it('should return a 200 status and OK', (done) => {
    chai.request(server)
      .get('/api/test')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.text).to.equal("OK")
        done()
      })
  })
})