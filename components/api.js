const express = require('express')
const router = express.Router()

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

module.exports = (io, questionsState, quizState) => {

  router.use((req, res, next) => {
    const time = new Date().toTimeString()
    const {method, url, body} = req
    const {statusCode} = res

    console.log(`[ api.js - ${statusCode} ] ${method} ${url} ${JSON.stringify(body)}: ${time}`)
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
      questionsState.unapprovedQuestions.push({
        id: questionsState.getId(),
        text: req.body.question,
        votes: 0,
      })
      console.log(`[ socket-events.js ] Updated questionsState -> ${JSON.stringify(questionsState)}`);
      io.emit("update-questions-state", questionsState);
      res.status(200).send('OK')
    } else {
      res.status(500).send('Invalid request.')
    }
  })

  router.get('/questions', (req, res) => {
    if (req.query.type === 'unapproved') {
      res.status(200).json(questionsState.unapprovedQuestions);
    }
    res.status(500).send('Invalid request.')
  })

  router.post('/quiz', (req, res) => {
    if (req.body.type === 'submission') {
      quizState.data[req.body.answerIndex];
      io.emit("update-quiz-state", quizState);
      res.status(200).send('OK')
    }
    res.status(500).send('Invalid request.')
  })

  return router
}