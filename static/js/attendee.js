var socket = io({
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 50
});

// ---------------------------------------------------------------------------
// Socket Event Handlers
// ---------------------------------------------------------------------------
socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

socket.on('test', function(data){
  alert('test payload: ' + JSON.stringify(data));
});

socket.on('disconnect', function(){
  confirm("You lost connection, please refresh page to interact again...");
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
$(document).ready(function(){
  console.log("[ attendee.js ] Document ready...");
  // DOM References

  // DOM Events

  function main() {
    // Code block
  }

  main();
})