var socket = io({
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 50
});

var publicComments,
    interaction;

// PDF.js Configs
var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    scaleUpperLimit = 3,
    scaleLowerLimit = 0.5,
    scaleIncrement = 0.1,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d'),
    url = '../assets/example.pdf',
    currState = {};

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

socket.on('next-page', function(){
  handleNextPage();
})

socket.on('previous-page', function(){
  handlePreviousPage();
})

socket.on('zoom-in', function(){
  handleZoomIn();
})

socket.on('zoom-out', function(){
  handleZoomOut();
})

socket.on('update-state', function(newState){
  if (stateUpdated(currState, newState)) {
    console.log("[ instructor.js ] Updating state --> " + JSON.stringify(newState))
    currState = newState;
    render(currState)
  }
});

function render(state) {
  interaction.empty();

  state.approvedQuestions.sort(function(a, b) {
    return b.votes - a.votes;
  })
  state.approvedQuestions.forEach(function(question){
    interaction.append(createQuestionElement(question, "display-question"));
  })
}

function createQuestionElement(question, className) {
  var out = $("<div>", {class: className});
  var text = $("<div>", {class: "question-text"}).text(question.text);
  var votes = $("<div>", {class: "question-votes"}).text(question.votes);

  out.append(text);
  out.append(votes);
  return out;
}

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------
function handleNewScale(newScale) {
  scale = newScale;
  queueRenderPage(pageNum);
}

function handlePreviousPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

function handleNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

function handleZoomOut() {
  if (scale <= scaleLowerLimit) {
    return;
  }
  scale -= scaleIncrement;
  queueRenderPage(pageNum);
}

function handleZoomIn() {
  if (scale >= scaleUpperLimit) {
    return;
  }
  scale += scaleIncrement;
  queueRenderPage(pageNum);
}

function handleScrollDown() {
  interaction.scrollTop(interaction.scrollTop() + 100);
}

function handleScrollUp() {
  interaction.scrollTop(interaction.scrollTop() - 100);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;

  renderPage(pageNum);
});

$(document).ready(function(){
  console.log("[ viewer.js ] Document ready...");

  // DOM References
  body = $("body");
  interaction = $("#interaction");

  // DOM Events
  $(window).resize(function(){
    interaction.css('height', $(window).height());
  });

  body.keydown(function(event){
    console.log(event.which);
    switch (event.which) {
      case 39: // "right"
        event.preventDefault();
        handleNextPage();
        break;
      case 37: // "left"
        event.preventDefault();
        handlePreviousPage();
        break;
      case 187: // "+"
        event.preventDefault();
        handleZoomIn();
        break;
      case 189: // "-"
        event.preventDefault();
        handleZoomOut();
        break;
      case 38: // "up"
        event.preventDefault();
        handleScrollUp();
        break;
      case 40: // "down"
        event.preventDefault();
        handleScrollDown();
        break;
    }
  });

  function main() {
    interaction.css('height', $(window).height());
  }

  main();
});