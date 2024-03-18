const fs = require('fs')
const path = require('path')
const {marked} = require('marked')

function renderContent(page) {
  const {file, attachments} = page
  let result = {}

  switch (path.extname(file)) {
    case '.md':
      return {
        html: renderMarkdown(file),
        attachments: attachments
      }
    default:
      throw(`Unsupported file type: '${file}'`)
  }
  return result
}

function renderMarkdown(file) {
  let content = fs.readFileSync(file, 'utf8')
  let html = marked.parse(content)
  return html
}

module.exports = { renderContent }
