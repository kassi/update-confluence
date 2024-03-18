'use strict';

const path = require('path');

const fs = jest.createMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockedFileContents = Object.create(null)

function __setFileContents(newContents) {
  mockedFileContents = Object.create(null)
  for (const [file, content] of Object.entries(newContents)) {
    mockedFileContents[file] = content
  }
}

// A custom version of `readFileSync` that reads from the special mocked out
// file set via __setMockFile
function readFileSync(fileName) {
  if (mockedFileContents[fileName]) {
    return mockedFileContents[fileName]
  } else {
    throw(`ENOENT: no such file or directory, open '${fileName}'`)
  }
}

fs.__setFileContents = __setFileContents
fs.readFileSync = readFileSync

module.exports = fs
