var socket = io({
  'reconnection': true,
});

var body,
    unapprovedQuestions,
    approvedQuestions,
    quizResults,
    currQuestionsState = {},
    currQuizState = {};

// ---------------------------------------------------------------------------
// Socket Event handlers
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
    console.log("[ instructor.js ] Updating state --> " + JSON.stringify(newState))
    currQuestionsState = newState;
    renderQuestions(currQuestionsState);
  }
});

socket.on('update-quiz-state', function(newState){
  if (stateUpdated(currQuizState, newState)) {
    console.log("[ instructor.js ] Updating state --> " + JSON.stringify(newState))
    currQuizState = newState;
    renderQuiz(currQuizState);
  }
});

function renderQuestions(state) {
  unapprovedQuestions.empty();

  if (state.unapprovedQuestions.length < 1) {
    unapprovedQuestions.append("<h3>There are no questions or comments awaiting approval.</h3>");
  } else {
    state.unapprovedQuestions.forEach(function(question){
      unapprovedQuestions.append(createQuestionElement(question, "unapproved-question"));
    })
  }

  approvedQuestions.empty();

  if (state.approvedQuestions.length < 1) {
    approvedQuestions.append("<h3>There are currently no active questions.</h3>");
  } else {
    state.approvedQuestions.sort(function(a, b) {
      return b.votes - a.votes;
    })
  }
  state.approvedQuestions.forEach(function(question){
    approvedQuestions.append(createQuestionElement(question, "approved-question"));
  })
}

function renderQuiz(state) {
  quizResults.empty();
  if (state.active) {
    quizResults.append("<h3>You have an active quiz running.</h3>");
  } else {
    quizResults.append("<h3>There are no active surveys or quizzes running.</h3>");
  }
  state.data.forEach(function(item, index){
    quizResults.append("<p class='quiz-response-info'>" + state.labels[index] + ": " + item + "</p>")
  })
}

function createQuestionElement(question, className) {
  var out = $("<div>", {class: className});
  var text = $("<div>", {class: "question-text"}).text(question.text);
  var votes = $("<div>", {class: "question-votes"}).text("Votes: " + question.votes);
  var actions = $("<div>", {class: "question-actions"});

  out.append(text);

  if (className === "unapproved-question") {
    var approveButton = $("<div>", {class: "approve-btn"}).html('<i class="fa fa-check"></i>');
    approveButton.attr("onclick", "approveQuestion(" + question.id + ")");
    var rejectButton = $("<div>", {class: "reject-btn"}).html('<i class="fa fa-close"></i>');
    rejectButton.attr("onclick", "removeQuestion(" + question.id + ")");
    actions.append(approveButton);
    actions.append(rejectButton);
  } else {
    var removeButton = $("<div>", {class: "remove-btn"}).html('<i class="fa fa-close"></i>');
    removeButton.attr("onclick", "removeQuestion(" + question.id + ")");
    actions.append(removeButton);
    out.append(votes);
  }

  out.append(actions);
  return out;
}

function approveQuestion(id) {
  socket.emit("approve-question", id);
}

function removeQuestion(id) {
  if (confirm("Confirm question removal.")) {
    socket.emit("remove-question", id);
  }
}

// ---------------------------------------------------------------------------
// Event Emitters
// ---------------------------------------------------------------------------
function emitNextPage(ref) {
  sendRemoteInstructorCommand("next-page", ref);
}

function emitPreviousPage(ref) {
  sendRemoteInstructorCommand("previous-page", ref);
}

function emitZoomIn(ref) {
  sendRemoteInstructorCommand("zoom-in", ref);
}

function emitZoomOut(ref) {
  sendRemoteInstructorCommand("zoom-out", ref);
}

function emitToggleInteraction(ref) {
  sendRemoteInstructorCommand("toggle-interaction", ref);
}

function emitStartQuiz(ref, type) {
  switch (type) {
    case "abcd":
      sendQuizInstructorCommand("start-quiz", {labels: ["A", "B", "C", "D"]}, ref);
      break;
    case "yn":
      sendQuizInstructorCommand("start-quiz", {labels: ["Yes", "No"]}, ref);
      break;
    case "abcd":
      sendQuizInstructorCommand("start-quiz", {labels: ["True", "False"]}, ref);
      break;
  }
}

function emitEndQuiz(ref) {
  sendQuizInstructorCommand("end-quiz", {}, ref);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sendRemoteInstructorCommand(command, ref) {
  element = $(ref);
  action = element.attr("onclick");
  $.post( "/api/remote", {user: "instructor", command: command}, function(){
    element
      .addClass("button-down")
      .attr("onclick", "");
  }).done(function(){
    setTimeout(function(){
      element
        .removeClass("button-down")
        .attr("onclick", action);
    }, 300)
  }).fail(function(){
    alert("An error occured...");
  });
}

function sendQuizInstructorCommand(type, data, ref) {
  element = $(ref);
  action = element.attr("onclick");
  $.post( "/api/quiz", {type: type, data: data}, function(){
    element
      .addClass("button-down")
      .attr("onclick", "");
  }).done(function(){
    setTimeout(function(){
      element
        .removeClass("button-down")
        .attr("onclick", action);
    }, 300)
  }).fail(function(){
    alert("An error occured...");
  });
}

$(document).ready(function(){
  console.log("[ instructor.js ] Document ready...");

  // DOM Selectors
  body = $("body");
  unapprovedQuestions = $("#unapproved-questions");
  approvedQuestions = $("#approved-questions");
  quizResults = $("#quiz-results");

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

  }

  main();
})