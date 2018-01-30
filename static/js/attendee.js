// var socket = io({
//   'reconnection': true,
//   'reconnectionDelay': 100,
//   'reconnectionAttempts': 50
// });

// ---------------------------------------------------------------------------
// Socket Event Handlers
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

var attendeeName, questionField, questionSubmit;

// ---------------------------------------------------------------------------
// Event Emitters
// ---------------------------------------------------------------------------
function submitQuestion() {
  if (questionField.val().length > 0) {
    var questionString = getName() + ": " + questionField.val();
    $.post("/api/questions", {type: "submission", question: questionString}, function(data){
      questionSubmit.text("Posting...");
      questionSubmit.attr("onclick", "");
    })
    .done(function(){
      setTimeout(function(){
        questionSubmit.text("Submit");
        questionSubmit.attr("onclick", "submitQuestion()");
        questionField.val("");
      }, 1000);
    })
    .fail(function(){
      questionSubmit.text("Submit");
      questionSubmit.attr("onclick", "submitQuestion()");
      alert("There was an error submitting your question.");
    })
  } else {
    questionField.focus();
  }
}

function getName() {
  if (attendeeName.val().length > 0) {
    return attendeeName.val();
  }
  return "Anonymous";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
$(document).ready(function(){
  console.log("[ attendee.js ] Document ready...");
  // DOM References
  attendeeName = $("#name-field");
  questionField = $("#question-field");
  questionSubmit = $("#question-submit");

  // DOM Events
  attendeeName.change(function(){
    window.localStorage.setItem("attendee-name", attendeeName.val());
  })

  function main() {
    if (window.localStorage.getItem("attendee-name")) {
      attendeeName.val(window.localStorage.getItem("attendee-name"));
    }
  }

  main();
})