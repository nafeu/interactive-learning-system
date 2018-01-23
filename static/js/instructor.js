var socket = io({'reconnection': false});

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

function nextPage() {
  socket.emit('instruction', {
    command: "next-page",
  });
}

function prevPage() {
  socket.emit('instruction', {
    command: "prev-page",
  });
}

$(document).ready(function(){
  console.log("Connected as instructor...");
})