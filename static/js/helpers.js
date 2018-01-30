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