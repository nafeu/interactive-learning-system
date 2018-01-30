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

  router.post('/remote', (req, res) => {
    if (req.body.user === 'instructor' || req.body.user === 'attendee') {
      io.emit(req.body.command, req.body.data)
      res.status(200).send('OK')
    } else {
      res.status(500).send('Invalid remote command.')
    }
  })

  router.post('/questions', (req, res) => {
    if (req.body.type === "submission") {
      appState.unapprovedQuestions.push(req.body.question)
      res.status(200).send('OK')
    } else {
      res.status(500).send('Invalid request.')
    }
  })

  return router
}