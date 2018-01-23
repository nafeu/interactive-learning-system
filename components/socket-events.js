// ---------------------------------------------------------------------------
// Socket Events
// ---------------------------------------------------------------------------

module.exports = {

  "use": (io) => {
    io.on('connection', (socket) => {

      socket.emit('new connection', {id: socket.id, connected: socket.connected})
      console.log(`[ socket-events.js ] ${socket.id} connected...`)

      socket.on('disconnect', () => {
        console.log(`[ socket-events.js ] ${socket.id} disconnected...`)
      });

      socket.on('attendee-comment', (data) => {
        io.emit("new-comment", data);
      })

      socket.on('instruction', (data) => {
        console.log(`[ socket-events.js ] recieved instruction: ${data.command}`)
        switch (data.command) {
          case "approve-comment":
            console.log("emitting approved comment: ", data.comment);
            io.emit('publicize-comment', data.comment);
            break;
          default:
            io.emit(data.command);
        }
      })

    });
  }

};