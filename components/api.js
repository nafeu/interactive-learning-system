const express = require('express')
const router = express.Router()

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

module.exports = (io, appState) => {

  router.use((req, res, next) => {
    const time = new Date().toTimeString()
    const {method, url} = req
    const {statusCode} = res

    console.log(`[ api.js - ${statusCode} ] ${method} ${url} : ${time}`)
    next()
  })

  router.get('/test', (req, res) => {
    res.status(200).send('OK')
  })

  router.get('/remote', (req, res) => {
    if (req.query.agent && req.query.command) {
      if (req.query.agent === 'instructor' || req.query.agent === 'attendee') {
        io.emit(req.query.command)
        res.status(200).send('OK')
      } else {
        res.status(500).send('Invalid remote command.')
      }
    } else {
      res.status(500).send('Invalid authorization.')
    }
  })

  router.post('/remote', (req, res) => {
    if (req.query.agent && req.query.command && req.query.payload) {
      if (req.query.agent === 'instructor' || req.query.agent === 'attendee') {
        io.emit(req.query.command, req.query.payload)
        res.status(200).send('OK')
      } else {
        res.status(500).send('Invalid remote command.')
      }
    } else {
      res.status(500).send('Invalid authorization.')
    }
  })

  return router
}