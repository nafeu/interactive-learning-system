// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function remoteCall(payload, init, done, fail) {
  $.post( "/api/remote", payload, init)
    .done(done)
    .fail(fail);
}

function attendeeAction(command, data, init, done, fail) {
  remoteCall({
    user: "attendee",
    command: command,
    data: data
  }, init, done, fail);
}

function instructorAction(command, data, init, done, fail) {
  remoteCall({
    user: "instructor",
    command: command,
    data: data
  }, init, done, fail);
}