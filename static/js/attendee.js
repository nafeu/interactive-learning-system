var socket = io({'reconnection': false});
var url = '../assets/example.pdf';
var attendeeButtonContainer,
    attendeeSubmission,
    attendeeComment;

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

socket.on('new-question', function(){
  resetMultipleChoiceResponses();
})

$(document).ready(function(){
  console.log("Connected as attendee...");

  attendeeButtonContainer = $("#attendee-button-container");
  attendeeSubmission = $("#attendee-submission");
  attendeeComment = $("#attendee-comment");
})

function sendMultipleChoiceResponse(choice) {
  attendeeButtonContainer.hide();
  socket.emit("attendee-response", choice);
  attendeeSubmission.text("You chose " + choice);
  attendeeSubmission.show();
}

function resetMultipleChoiceResponses() {
  attendeeButtonContainer.show();
}

function submitComment() {
  socket.emit('attendee-comment', attendeeComment.val());
  attendeeComment.val("");
}