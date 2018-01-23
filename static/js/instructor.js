var socket = io({'reconnection': false});

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

function nextPage() {
  socket.emit('instruction', {
    command: "next-page",
  });
  logCommand("next-page");
}

function prevPage() {
  socket.emit('instruction', {
    command: "prev-page",
  });
  logCommand("prev-page");
}

function upScale() {
  socket.emit('instruction', {
    command: "up-scale",
  });
  logCommand("up-scale");
}

function downScale() {
  socket.emit('instruction', {
    command: "down-scale",
  });
  logCommand("down-scale");
}

function logCommand(command) {
  var dt = new Date();
  var utcDate = dt.toUTCString();
  $("#command-log").text("You pressed " + command + " at " + utcDate);
}

$(document).ready(function(){
  console.log("Connected as instructor...");

  var body = $("body");
  body.keydown(function(event){

    if (event.which == "221") // "]"
    {
      nextPage();
    }

    if (event.which == "219") // "["
    {
      prevPage();
    }

    if (event.which == "187") // "+"
    {
      upScale();
    }

    if (event.which == "189") // "-"
    {
      downScale();
    }

  })
})