// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

var modalContainer, modalContent;

function remoteCall(payload) {
  return $.post( "/api/remote", payload)
}

function attendeeAction(command, data) {
  return remoteCall({
    user: "attendee",
    command: command,
    data: data
  });
}

function instructorAction(command, data) {
  return remoteCall({
    user: "instructor",
    command: command,
    data: data
  });
}

function stateUpdated(oldState, newState) {
  if (JSON.stringify(oldState) === JSON.stringify(newState)) {
    return false;
  }
  return true;
}

function openModal() {
  modalContainer.show();
}

function closeModal() {
  modalContainer.hide();
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function add(a, b) {
    return a + b;
}

$(document).ready(function(){
  // DOM Selectors
  modalContainer = $("#modal-container");
  modalContent = $("#modal-content");

  $(window).resize(function(){
    modalContainer.css('height', $(window).height());
    modalContent.css('height', $(window).height() * 0.55);
  });

  modalContainer.css('height', $(window).height());
  modalContent.css('height', $(window).height() * 0.55);
  modalContainer.hide();
});