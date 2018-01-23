var socket = io({'reconnection': false});
var url = '../assets/example.pdf';

socket.on('new connection', function(data){
  console.log("connected with id: " + data.id);
})

socket.on('next-page', function(){
  handleNextPage();
})

socket.on('prev-page', function(){
  handlePrevPage();
})

socket.on('up-scale', function(){
  handleUpScale();
})

socket.on('down-scale', function(){
  handleDownScale();
})

// The workerSrc property shall be specified.
// PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    scaleLimit = 3,
    scaleIncrement = 0.1,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

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
  if (scale <= 1) {
    return;
  }
  scale -= scaleIncrement;
  queueRenderPage(pageNum);
}

function handleUpScale() {
  if (scale >= scaleLimit) {
    return;
  }
  scale += scaleIncrement;
  queueRenderPage(pageNum);
}

PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;

  renderPage(pageNum);
});

$(document).ready(function(){

  // DOM References
  var interaction = $("#interaction");

  // DOM Events
  $(window).resize(function(){
    interaction.css('height', $(window).height());
  });

  // main()
  interaction.css('height', $(window).height());

});