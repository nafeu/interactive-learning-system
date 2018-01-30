var socket = io({
  'reconnection': true,
});

var attendeeName,
    questionField,
    questionSubmit,
    currState = {},
    submittedVotes = [];

// ---------------------------------------------------------------------------
// Socket Event Handlers
// ---------------------------------------------------------------------------
// socket.on('disconnect', function(){
//   confirm("You lost connection, please refresh page to interact again...");
// })

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
  socket.emit('get-state');
})

socket.on('test', function(data){
  alert('test payload: ' + JSON.stringify(data));
});

socket.on('update-state', function(newState){
  if (stateUpdated(currState, newState)) {
    console.log("[ instructor.js ] Updating state --> " + JSON.stringify(newState))
    currState = newState;
    render(currState);
  }
});

function render(state) {
  userVoting.empty();
  state.approvedQuestions.forEach(function(question){
    userVoting.append(createQuestionElement(question, "display-question"));
  })
}

function createQuestionElement(question, className) {
  var out = $("<div>", {class: className});
  var text = $("<div>", {class: "question-text"}).text(question.text);
  var votes = $("<div>", {class: "question-votes"}).text(question.votes);
  var actions = $("<div>", {class: "question-actions"});

  out.append(text);

  var voteButton = $("<div>", {id: "vote-id-" + question.id, class: "vote-btn"});
  if ($.inArray(question.id, submittedVotes) < 0) {
    var thumbsUp = '<i class="fa fa-thumbs-o-up"></i>';
    voteButton.attr("onclick", "upvoteQuestion(" + question.id + ")");
  } else {
    var thumbsUp = '<i class="fa fa-thumbs-up"></i>';
  }
  voteButton.append(thumbsUp);
  actions.append(voteButton);
  actions.append(votes);
  out.append(actions);
  return out;
}

function upvoteQuestion(id) {
  socket.emit("upvote-question", id);
  submittedVotes.push(id);
}

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
  userVoting = $("#user-voting");

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