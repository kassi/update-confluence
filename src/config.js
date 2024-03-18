const fs = require('fs')
const yaml = require('js-yaml')
const { execSync } = require('child_process');

const configDefaults = {
  version_prefix: 'v',
  add_automation_hint: false
}

/**
 *
 * @param {String} configFile The path to the YAML configuration file.
 * @returns {Object} The configuration loaded.
 */
function load(configFile) {
  let fileContents = fs.readFileSync(configFile, 'utf8')
  config.data = Object.assign({}, configDefaults, yaml.load(fileContents))

  const mandatoryAttributes = [
    'confluence_endpoint',
    'username',
    'space',
    'pages'
  ]

  mandatoryAttributes.forEach(attribute => {
    if (config.data[attribute] === undefined) {
      throw `Mandatory attribute '${attribute}' missing`
    }
  });

  return config.data
}

/**
 * Determines the highest version number set as a git tag using the format v<version>.
 * @returns {Number} The integer value of version.
 *
 * @todo Make the prefix configurable to not mess up with other repo's tags.
 */
async function currentVersion(prefix) {
  let stdout = await execSync('git tag --list').toString()
  let regex = new RegExp(`^${prefix}(\\d+)$`)
  let versions = stdout.split('\n').map((x) => {let m = x.match(regex); return m ? parseInt(m[1], 10) : undefined}).filter(x => !!x)

  return versions.length > 0 ? versions.sort((a, b) => b - a)[0] : undefined
}

/**
 * Deletermines the pages that have changes since last deployment.
 * @returns {Array<Object>} List of page objects.
 */
function pagesToBeDeployed() {
  return config.data['pages'].filter(page => {
    return config.changedFilesSinceLastDeployment().includes(page["file"])
  })
}

/**
 * Determines the files in the current repository that changed since the last version.
 * If no versin could be determined, all files are returned.
 * @returns {Set<String>} List of filenames.
 */
async function changedFilesSinceLastDeployment() {
  let cv = config.currentVersion(config.data["version_prefix"])

  if (cv === undefined) {
    let array = await execSync('git ls-files').split('\n')
    return new Set(array)
  } else {
    let array = await execSync(`git diff --name-only ${config.data["version_prefix"]}${cv}`).split('\n')
    return new Set(array)
  }
}

/**
 * Manage the configuration.
 */
let config = {
  data: configDefaults,

  load: load,
  currentVersion: currentVersion,
  pagesToBeDeployed: pagesToBeDeployed,
  changedFilesSinceLastDeployment: changedFilesSinceLastDeployment
};

module.exports = config
