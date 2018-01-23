var socket = io({'reconnection': false});
var url = '../assets/example.pdf';
var attendeeButtonContainer,
    attendeeSubmission,
    attendeeComment,
    attendeeName;

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
  attendeeName = $("#attendee-name");
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
  var name = attendeeName.val();
  var comment = attendeeComment.val();
  if (comment.length > 0) {
    var commentString = name + ": " + comment;
    if (name.length < 1) {
      commentString = comment;
    }
    socket.emit('attendee-comment', commentString);
    attendeeComment.val("");
  } else {
    attendeeComment.focus();
  }
}