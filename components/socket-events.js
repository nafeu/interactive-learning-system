// ---------------------------------------------------------------------------
// Socket Events
// ---------------------------------------------------------------------------

module.exports = {

  "use": (io, appState) => {
    io.on('connection', (socket) => {

      socket.emit('new connection', {id: socket.id, connected: socket.connected})
      console.log(`[ socket-events.js ] ${socket.id} connected...`)

      socket.on('disconnect', () => {
        console.log(`[ socket-events.js ] ${socket.id} disconnected...`)
      });

      socket.on('get-state', () => {
        socket.emit('update-state', appState)
      })

      socket.on('approve-question', (id) => {
        console.log(`[ socket-events.js ] approve-question id: ${id}`)
        appState.unapprovedQuestions.forEach(function(item, index){
          if (item.id === id) {
            var approvedQuestion = appState.unapprovedQuestions.splice(index, 1)[0]
            appState.approvedQuestions.push(approvedQuestion)
          }
        })
        io.emit('update-state', appState)
      })

      socket.on('remove-question', (id) => {
        console.log(`[ socket-events.js ] remove-question id: ${id}`)
        appState.approvedQuestions.forEach(function(item, index){
          if (item.id === id) {
            appState.approvedQuestions.splice(index, 1)
            io.emit('update-state', appState)
          }
        })
        appState.unapprovedQuestions.forEach(function(item, index){
          if (item.id === id) {
            appState.unapprovedQuestions.splice(index, 1)
            io.emit('update-state', appState)
          }
        })
      })

      socket.on('upvote-question', (id) => {
        appState.approvedQuestions.forEach(function(item){
          if (item.id === id) {
            item.votes++
            io.emit('update-state', appState)
          }
        });
      })

    });
  }

};