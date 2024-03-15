/**
 * Unit tests for src/config.js
 */
const fs = require('fs');
const { loadConfig } = require('../src/config')
const {expect} = require('@jest/globals')
require('./string')

function mockFs(excludes) {
  return jest.spyOn(fs, 'readFileSync').mockImplementation(_ => {
    let yaml = `
      ---
      confluence_endpoint: https://example.atlassian.net/wiki
      username: confluence_user@example.com

      # Mapping from files to confluence pages
      space: UTEC

      add_automation_hint: true

      # regexes for files to trigger full deployments instead of tree shaking
      full_deploy:
        - Gemfile
        - Gemfile.lock
        - partials/.+.html.erb

      pages:

      `.strip()

    excludes.forEach(ex => {
      const regex = new RegExp(`^${ex}:.*$`, "mg")
      yaml = yaml.replaceAll(regex, "")
    });
    return yaml
  })
}

describe('config.js', () => {
  it("throws a 'no such file exception' when file does not exist", () => {
    const input = 'nonexistent.file'
    expect(() => {loadConfig(input)}).toThrow("ENOENT: no such file or directory, open 'nonexistent.file'")
  })

  let mandatoryAttributes = [
    'confluence_endpoint',
    'username',
    'space',
    'pages'
  ]

  mandatoryAttributes.forEach((attribute) => {
    it(`throws an invalid data exception when '${attribute}' is missing`, () => {
      mockFs([attribute])
      expect(() => { loadConfig('name') }).toThrow(`Mandatory attribute '${attribute}' missing`)
    })
  })

  it('returns data when all attributes are present', () => {
    mockFs([])
    expect(loadConfig('name')).toMatchObject({})
  })
})
