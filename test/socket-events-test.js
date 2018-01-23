const chai = require("chai")
const {expect} = chai
const io = require('socket.io-client');
const socketURL = 'http://0.0.0.0:8080';
const server = require('../server')
const options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Socket connection', () => {

  before(() => {
    clientA = io.connect(socketURL, options);
  })

  it('should connect and return a unique user id', (done) => {
    clientA.on('new connection', (data) => {
      expect(data.id).to.be.a('string')
      expect(data.connected).to.be.true
      done()
    });
  })

  after(() => {
    server.close()
  })

})