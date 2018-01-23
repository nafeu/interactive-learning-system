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

function upScale() {
  socket.emit('instruction', {
    command: "up-scale",
  });
}

function downScale() {
  socket.emit('instruction', {
    command: "down-scale",
  });
}

$(document).ready(function(){
  console.log("Connected as instructor...");
})