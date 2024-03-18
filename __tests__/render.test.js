/**
 * Unit tests for src/render.js
 */
const {expect} = require('@jest/globals')
const {renderContent} = require('../src/render')

jest.mock('fs');
const fs = require('fs')

describe('render', () => {
  const fileContents = {
    'file1.md': '# Headline\n\nSome text.\n'
  }

  beforeEach(() => {
    fs.__setFileContents(fileContents)
  })
  describe('.renderContent', () => {
    it('throws an unsupported file type error when extension is not supported.', () => {
      let page = {file: "name.unsupported"}
      expect(() => renderContent(page)).toThrow(`Unsupported file type: 'name.unsupported'`)
    })

    it('returns an object with rendered markdown when extension is .md', () => {
      let page = {file: 'file1.md'}
      expect(renderContent(page)).toMatchObject({
        html: '<h1>Headline</h1>\n<p>Some text.</p>\n'
      })
    })

    it('returns attachments when they are given', () => {
      let page = {file: 'file1.md', attachments: ['/path/to/attachment.pdf']}
      expect(renderContent(page)).toMatchObject({
        attachments: ['/path/to/attachment.pdf']
      })
    })
  })
})
