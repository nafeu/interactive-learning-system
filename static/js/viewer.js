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
    url = '../assets/example.pdf';

// ---------------------------------------------------------------------------
// Socket Event Handlers
// ---------------------------------------------------------------------------
socket.on('disconnect', function(){
  confirm("You lost connection, please refresh page to interact again...");
})

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------
function handleNewScale(newScale) {
  scale = newScale;
  queueRenderPage(pageNum);
}

function handlePrevPage() {
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

function handleDownScale() {
  if (scale <= scaleLowerLimit) {
    return;
  }
  scale -= scaleIncrement;
  queueRenderPage(pageNum);
}

function handleUpScale() {
  if (scale >= scaleUpperLimit) {
    return;
  }
  scale += scaleIncrement;
  queueRenderPage(pageNum);
}

function handleClearComments() {
  interaction.empty();
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
  interaction = $("#interaction");
  body = $("body");

  // DOM Events
  $(window).resize(function(){
    interaction.css('height', $(window).height());
    body.keydown(function(event){
      switch (event.which) {
        case "39": // "right"
          handleNextPage();
          break;
        case "37": // "left"
          handlePrevPage();
          break;
        case "187": // "+"
          handleUpScale();
          break;
        case "189": // "-"
          handleDownScale();
          break;
        case "38": // "up"
          handleScrollUp();
          break;
        case "40": // "down"
          handleScrollDown();
          break;
      }
    });

    function main() {
      interaction.css('height', $(window).height());
    }

    main();
  });
});