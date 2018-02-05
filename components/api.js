const express = require('express')
const router = express.Router()

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

module.exports = (io, questionsState, quizState, ticketState) => {

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
    switch (req.body.type) {
      case "submission":
        questionsState.unapprovedQuestions.push({
          id: questionsState.getId(),
          text: req.body.data.question,
          votes: 0,
        })
        io.emit("update-questions-state", questionsState);
        res.status(200).send('OK')
        break
      default:
        res.status(500).send('Invalid request.')
    }
    // console.log(`[ socket-events.js ] Updated questionsState -> ${JSON.stringify(questionsState)}`);
  })

  router.post('/quiz', (req, res) => {
    switch (req.body.type) {
      case "submission":
        quizState.data[req.body.data.answerIndex]++
        io.emit("update-quiz-state", quizState)
        res.json(quizState)
        break
      case "start-quiz":
        quizState.setQuizMode(req.body.data.labels)
        io.emit('update-quiz-state', quizState)
        res.status(200).send('OK')
        break
      case "end-quiz":
        quizState.active = false;
        io.emit('update-quiz-state', quizState)
        res.status(200).send('OK')
        break
      default:
        res.status(500).send('Invalid request.')
    }
  })

  router.post('/video', (req, res) => {
    switch (req.body.type) {
      case "open-video":
        io.emit(req.body.type, {
          videoId: req.body.data.videoId,
          startSeconds: req.body.data.startSeconds
        })
        res.status(200).send('OK')
        break
      case "pause-play-video":
        io.emit(req.body.type)
        res.status(200).send('OK')
        break
      case "close-video":
        io.emit(req.body.type)
        res.status(200).send('OK')
        break
      default:
        res.status(500).send('Invalid request.')
    }
  })

  router.post('/ticket', (req, res) => {
    switch (req.body.type) {
      case "start-ticket":
        ticketState.active = true
        io.emit('update-ticket-state', ticketState)
        res.status(200).send('OK')
        break;
      case "end-ticket":
        ticketState.active = false
        io.emit('update-ticket-state', ticketState)
        res.status(200).send('OK')
        break;
      default:
        res.status(500).send('Invalid request.')
    }
  })

  return router
}