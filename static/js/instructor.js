var socket = io({
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 50
});

var body,
    unapprovedComments,
    approvedComments;

// ---------------------------------------------------------------------------
// Socket Event handlers
// ---------------------------------------------------------------------------
socket.on('disconnect', function(){
  confirm("You lost connection, please refresh page to interact again...");
})

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

socket.on('test', function(data){
  alert('test payload: ' + JSON.stringify(data));
});

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
        nextPage();
        break;
      case "219": // "["
        prevPage();
        break;
      case "187": // "+"
        upScale();
        break;
      case "189": // "-"
        downScale();
        break;
    }
  })

  function main() {
    // Code block
  }

  main();
})