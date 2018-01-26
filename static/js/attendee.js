var socket = io({
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 50
});

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

socket.on('disconnect', function(){
  confirm("You lost connection, please refresh page to interact again...");
})

$(document).ready(function(){

  console.log("Connected as attendee...");

  attendeeButtonContainer = $("#attendee-button-container");
  attendeeSubmission = $("#attendee-submission");
  attendeeComment = $("#attendee-comment");
  attendeeName = $("#attendee-name");

  if (window.localStorage.getItem("attendee-name")) {
    attendeeName.val(window.localStorage.getItem("attendee-name"));
  }
  attendeeName.change(function(){
    window.localStorage.setItem("attendee-name", attendeeName.val());
  })

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