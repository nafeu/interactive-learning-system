const express = require('express')
const router = express.Router()

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

module.exports = (io) => {

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

  return router
}