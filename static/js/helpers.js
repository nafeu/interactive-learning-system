// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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