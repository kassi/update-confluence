'use strict';

const child_process = jest.createMockFromModule('child_process')

// This is a custom function that our tests can use during setup to specify
// what the commands on the "mock" process handler should look like when any of the
// `child_process` APIs are used.
let execSyncMocks = Object.create(null);

function __setExecSyncMocks(newMockCommands) {
  execSyncMocks = Object.create(null);

  for (const command in newMockCommands) {
    execSyncMocks[command] = newMockCommands[command]
  }
}

// A custom version of `execSync` that reads from the special mocked out
// command set via __setExecSyncMocks
function execSync(command) {
  return execSyncMocks[command] || ""
}

child_process.__setExecSyncMocks = __setExecSyncMocks
child_process.execSync = execSync

module.exports = child_process
