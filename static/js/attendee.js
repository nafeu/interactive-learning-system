var socket = io({'reconnection': false});
var url = '../assets/example.pdf';

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

$(document).ready(function(){
  console.log("Connected as attendee...");
})
