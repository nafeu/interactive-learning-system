var socket = io({
  'reconnection': true,
});

var body,
    unapprovedQuestions,
    approvedQuestions,
    currState = {};

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

socket.on('update-state', function(newState){
  if (stateUpdated(currState, newState)) {
    console.log("[ instructor.js ] Updating state --> " + JSON.stringify(newState))
    currState = newState;
    render(currState);
  }
});

function render(state) {
  unapprovedQuestions.empty();
  state.unapprovedQuestions.forEach(function(question){
    unapprovedQuestions.append(createQuestionElement(question, "unapproved-question"));
  })
  approvedQuestions.empty();
  state.approvedQuestions.forEach(function(question){
    approvedQuestions.append(createQuestionElement(question, "approved-question"));
  })
}

function createQuestionElement(question, className) {
  var out = $("<div>", {class: className});
  var text = $("<div>", {class: "question-text"}).text(question.text);
  var votes = $("<div>", {class: "question-votes"}).text(question.votes);
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
function emitNextPage() {
  instructorAction("next-page");
}

function emitPreviousPage() {
  instructorAction("previous-page");
}

function emitZoomIn() {
  instructorAction("zoom-in");
}

function emitZoomOut() {
  instructorAction("zoom-out");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// function pollQuestions(){
//   $.get('/api/questions?type=unapproved', function(data) {
//     console.log("Poll data: ", data);
//     unapprovedQuestions.text(JSON.stringify(data));
//     setTimeout(pollQuestions, 3000);
//   });
// }

$(document).ready(function(){
  console.log("[ instructor.js ] Document ready...");

  // DOM Selectors
  body = $("body");
  unapprovedQuestions = $("#unapproved-questions");
  approvedQuestions = $("#approved-questions");

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