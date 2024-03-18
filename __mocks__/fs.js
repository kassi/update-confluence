'use strict';

const path = require('path');

const fs = jest.createMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFileContent = undefined

function __setMockContent(newMockContent) {
  mockFileContent = newMockContent
}

// A custom version of `readFileSync` that reads from the special mocked out
// file set via __setMockFile
function readFileSync(fileName) {
  if (mockFileContent === undefined) {
    throw(`ENOENT: no such file or directory, open '${fileName}'`)
  } else {
    return mockFileContent
  }
}

fs.__setMockContent = __setMockContent
fs.readFileSync = readFileSync

module.exports = fs
