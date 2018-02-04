// ---------------------------------------------------------------------------
// Socket Events
// ---------------------------------------------------------------------------

module.exports = {

  "use": (io, questionsState, quizState) => {
    io.on('connection', (socket) => {

      socket.emit('new connection', {id: socket.id, connected: socket.connected})
      console.log(`[ socket-events.js ] ${socket.id} connected...`)

      socket.on('disconnect', () => {
        console.log(`[ socket-events.js ] ${socket.id} disconnected...`)
      });

      socket.on('get-state', () => {
        socket.emit('update-questions-state', questionsState)
        socket.emit('update-quiz-state', quizState)
      })

      socket.on('approve-question', (id) => {
        console.log(`[ socket-events.js ] approve-question id: ${id}`)
        questionsState.unapprovedQuestions.forEach(function(item, index){
          if (item.id === id) {
            var approvedQuestion = questionsState.unapprovedQuestions.splice(index, 1)[0]
            questionsState.approvedQuestions.push(approvedQuestion)
          }
        })
        io.emit('update-questions-state', questionsState)
      })

      socket.on('remove-question', (id) => {
        console.log(`[ socket-events.js ] remove-question id: ${id}`)
        questionsState.approvedQuestions.forEach(function(item, index){
          if (item.id === id) {
            questionsState.approvedQuestions.splice(index, 1)
            io.emit('update-questions-state', questionsState)
          }
        })
        questionsState.unapprovedQuestions.forEach(function(item, index){
          if (item.id === id) {
            questionsState.unapprovedQuestions.splice(index, 1)
            io.emit('update-questions-state', questionsState)
          }
        })
      })

      socket.on('upvote-question', (id) => {
        questionsState.approvedQuestions.forEach(function(item){
          if (item.id === id) {
            item.votes++
            io.emit('update-questions-state', questionsState)
          }
        });
      })

    });
  }

};