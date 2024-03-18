/**
 * Unit tests for src/config.js
 */
// const { execSync } = require('child_process');
const config = require('../src/config')
const {expect} = require('@jest/globals')
require('./string')

jest.mock('child_process');
jest.mock('fs');
const child_process = require('child_process')
const fs = require('fs')

function mockConfigYaml(excludes) {

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
      - file: __tests__/data/01-page.md
        title: Page 1
      - file: __tests__/data/02-page.md
        title: Page 2

    `.strip()

  excludes.forEach(ex => {
    const regex = new RegExp(`^${ex}:.*$`, "mg")
    yaml = yaml.replaceAll(regex, "")
  });
  require('fs').__setMockContent(yaml)
}

describe('config', () => {
  beforeEach(() => {
    fs.__setMockContent(undefined)
  })
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.load()', () => {
    it("throws a 'no such file exception' when file does not exist", () => {
      expect(() => {config.load('mock.file')}).toThrow("ENOENT: no such file or directory, open 'mock.file'")
    })

    let mandatoryAttributes = [
      'confluence_endpoint',
      'username',
      'space',
      'pages'
    ]

    mandatoryAttributes.forEach((attribute) => {
      it(`throws an invalid data exception when '${attribute}' is missing`, () => {
        mockConfigYaml([attribute])

        expect(() => {config.load('name')}).toThrow(`Mandatory attribute '${attribute}' missing`)
      })
    })

    it('returns data when all attributes are present', () => {
      mockConfigYaml([])
      expect(config.load('mocked')).toMatchObject({})
      // expect(config.data).toMatchObject({})
    })
  })

  describe('.currentVersion()', () => {
    it('returns undefined when no versions exist', async () => {
      child_process.__setExecSyncMocks({
        'git tag --list': ''
      })

      expect(await config.currentVersion('v')).toBeUndefined()
    })

    it('returns highest version number when versions exist matching the version prefix', async () => {
      child_process.__setExecSyncMocks({
        'git tag --list': 'v1\nv2\nv3\nv4\nv5\nv9\nv10\nv11\nv6\ns99\nv90.2.3\n'
      })

      expect(await config.currentVersion('v')).toEqual(11)
    })
  })

  describe('.changedFilesSinceLastDeployment', () => {
    beforeEach(() => {
      config.data['version_prefix'] = 'v'
      child_process.__setExecSyncMocks({
        'git ls-files': 'README\nfile1\nfile2\npath/to/page1\npath/to/page2\n',
        'git diff --name-only v1': 'file1\npath/to/page1\n'
      })
    })
    it('returns all files when no version is found', () => {
      jest.spyOn(config, 'currentVersion').mockImplementation(_ => undefined)
      expect(config.changedFilesSinceLastDeployment()).toEqual['README', 'file1', 'file2', 'path/to/page1', 'path/to/page2']
    })

    it('returns changed files only when version is found', () => {
      jest.spyOn(config, 'currentVersion').mockImplementation(_ => 1)
      expect(config.changedFilesSinceLastDeployment()).toEqual['file1', 'path/to/page1']
    })
  })

  describe('.pagesToBeDeployed()', () => {
    beforeEach(() => {
      config.data['full_deploy'] = []
    })

    it('returns empty array when no page has changed since last version', () => {
      jest.spyOn(config, 'changedFilesSinceLastDeployment').mockImplementation(() => [])
      expect(config.pagesToBeDeployed()).toEqual([])
    })

    it('returns all pages when a full deployment is required', () => {
      let page1 = {file: 'path/to/page1'}
      let page2 = {file: 'path/to/page2'}
      let page3 = {file: 'path/to/page3'}
      config.data['pages'] = [page1, page2, page3]

      jest.spyOn(config, 'needsFullDeployment').mockImplementation(() => true)
      expect(config.pagesToBeDeployed()).toEqual([page1, page2, page3])
    })

    it('returns list of pages with changes', () => {
      let page1 = {file: 'path/to/page1'}
      let page2 = {file: 'path/to/page2'}
      let page3 = {file: 'path/to/page3'}
      config.data['pages'] = [page1, page2, page3]

      jest.spyOn(config, 'changedFilesSinceLastDeployment').mockImplementation(() => [
        'path/to/page1', 'path/to/page2', 'other/file1', 'other/file2'
      ])

      expect(config.pagesToBeDeployed()).toEqual([page1, page2])
    })
  })

  describe('.needsFullDeployment', () => {
    beforeEach(() => {
      config.data['full_deploy'] = [
        'simpleFileTriggering',
        'triggering/.+'
      ]
    })
    it('returns false if no file has been changed', () => {
      expect(config.needsFullDeployment([])).toBeFalsy()
    })

    it('returns false if no regular expressions for full_deploy are given', () => {
      config.data["full_deploy"] = []
      expect(config.needsFullDeployment(['file1', 'simpleFile', 'simpleFileTriggering'])).toBeFalsy()
    })

    it('returns false if no changed file matches any regular expression', () => {
      expect(config.needsFullDeployment(['file1', 'simpleFile'])).toBeFalsy()
    })

    it('returns true if a simple file matches', () => {
      expect(config.needsFullDeployment(['file1', 'simpleFileTriggering'])).toBeTruthy()
    })

    it('returns true if a regex expression matches', () => {
      expect(config.needsFullDeployment(['triggering/any'])).toBeTruthy()
    })
  })
})
