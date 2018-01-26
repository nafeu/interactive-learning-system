var socket = io({
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 50
});

socket.on('disconnect', function(){
  confirm("You lost connection, please refresh page to interact again...");
})

var body, unapprovedComments, approvedComments;

// Handlers

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
});

socket.on('new-comment', function(data){
  insertNewComment(data);
});

// Emitters & Helpers

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

function insertNewComment(comment) {
  var out = $("<div>", {
    class: "unapproved-comment",
    onclick: "approveComment(this);"
  })
    .text(comment);
  unapprovedComments.append(out);
}

function approveComment(element) {
  var ref = $(element);
  socket.emit('instruction', {
    command: "approve-comment",
    comment: ref.text(),
  });
  ref.css({
    "background-color": "#2ecc71",
    "color": "white",
  });
}

function clearComments() {
  socket.emit('instruction', {
    command: "clear-comments"
  });
  $(".unapproved-comment").css({
    "background-color": "#3498db"
  });
}

$(document).ready(function(){
  console.log("Connected as instructor...");

  body = $("body");
  unapprovedComments = $("#unapproved-comments");
  approvedComments = $("#approved-comments");
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