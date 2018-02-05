var socket = io({
  'reconnection': true,
});

var attendeeName,
    questionField,
    questionSubmit,
    userVoting,
    userQuiz,
    ticketModal,
    currQuestionsState = {},
    currTicketState = {},
    currQuizState = {},
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

socket.on('update-questions-state', function(newState){
  if (stateUpdated(currQuestionsState, newState)) {
    console.log("[ instructor.js ] Updating questions state --> " + JSON.stringify(newState))
    currQuestionsState = newState;
    renderQuestions(currQuestionsState);
  }
});

socket.on('update-quiz-state', function(newState){
  if (stateUpdated(currQuizState, newState)) {
    if (currQuizState.active == false && newState.active == true) {
      window.localStorage.removeItem("attendee-submitted-response");
    }
    console.log("[ instructor.js ] Updating quiz state --> " + JSON.stringify(newState))
    currQuizState = newState;
    renderQuiz(currQuizState);
  }
});

socket.on('update-ticket-state', function(newState){
  currTicketState = newState;
  if (currTicketState.active) {
    showTicket();
  } else {
    hideTicket();
  }
});

function renderQuestions(state) {
  userVoting.empty();
  if (state.approvedQuestions.length == 0) {
    userVoting.append("<h3>There are no approved questions to vote on.</h3>");
  }
  state.approvedQuestions.forEach(function(question){
    userVoting.append(createQuestionElement(question, "display-question"));
  })
}

function renderQuiz(state) {
  userQuiz.empty();
  if (state.active) {
    var label = window.localStorage.getItem("attendee-submitted-response");
    if (label) {
      userQuiz.append(createQuizResponseConfirmation(label));
    } else {
      state.labels.forEach(function(label, index){
        userQuiz.append(createQuizElement(label, index));
      });
    }
  } else {
    userQuiz.append("<h3>There are no active quizzes running.</h3>");
  }
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

function createQuizElement(label, index) {
  var out = $("<div>", {class: "response-btn", id: "response-id-" + index}).text(label);
  out.attr("onclick", "submitResponse(" + index + ")");
  return out;
}

function createQuizResponseConfirmation(label) {
  var out = $("<div>", {class: "response-confirmation"}).text("You chose: " + label);
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
    $.post("/api/questions", {type: "submission", data: {question: questionString}}, function(data){
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

function submitResponse(answerIndex) {
  $.post("/api/quiz", {type: "submission", data: {answerIndex: answerIndex}}, function(){
    console.log("responding...");
  })
  .done(function(data){
    userQuiz.empty();
    userQuiz.append(createQuizResponseConfirmation(data.labels[answerIndex]));
    window.localStorage.setItem("attendee-submitted-response", data.labels[answerIndex]);
  })
  .fail(function(){
    alert("There was an error submitting your response...");
  })
}

function getName() {
  if (attendeeName.val().length > 0) {
    return attendeeName.val();
  }
  return "Anonymous";
}

function showTicket() {
  ticketModal.show();
}

function hideTicket() {
  ticketModal.hide();
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
  userQuiz = $("#user-quiz");
  ticketModal = $("#modal-container");

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