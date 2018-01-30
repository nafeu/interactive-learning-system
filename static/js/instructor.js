// var socket = io({
//   'reconnection': true,
//   'reconnectionDelay': 100,
//   'reconnectionAttempts': 50
// });

// ---------------------------------------------------------------------------
// Socket Event handlers
// ---------------------------------------------------------------------------
// socket.on('disconnect', function(){
//   confirm("You lost connection, please refresh page to interact again...");
// })

// socket.on('new connection', function(data){
//   console.log("connected with id: " + data.id);
// })

// socket.on('test', function(data){
//   alert('test payload: ' + JSON.stringify(data));
// });

var body,
    unapprovedComments,
    approvedComments;

// ---------------------------------------------------------------------------
// Event Emitters
// ---------------------------------------------------------------------------
function emitNextPage() {
  instructorAction("next-page");
}

function emitPreviousPage() {
  instructorAction("previous-page");
}

function emitZoomIn() {
  instructorAction("zoom-in");
}

function emitZoomOut() {
  instructorAction("zoom-out");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
$(document).ready(function(){
  console.log("[ instructor.js ] Document ready...");

  // DOM Selectors
  body = $("body");

  // DOM Event Handlers
  body.keydown(function(event){
    switch(event.which) {
      case "221": // "]"
        emitNextPage();
        break;
      case "219": // "["
        emitPrevPage();
        break;
      case "187": // "+"
        emitUpScale();
        break;
      case "189": // "-"
        emitDownScale();
        break;
    }
  })

  function main() {
    // Code block
  }

  main();
})