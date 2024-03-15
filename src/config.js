const fs = require('fs')
const yaml = require('js-yaml')
/**
 * Wait for a number of milliseconds.
 *
 * @param {number} milliseconds The number of milliseconds to wait.
 * @returns {Promise<string>} Resolves with 'done!' after the wait is over.
 */
function loadConfig(configFile) {
  let fileContents = fs.readFileSync(configFile, 'utf8')
  let data = yaml.load(fileContents)

  const mandatoryAttributes = [
    'confluence_endpoint',
    'username',
    'space',
    'pages'
  ]

  mandatoryAttributes.forEach(attribute => {
    if (data[attribute] === undefined) {
      throw `Mandatory attribute '${attribute}' missing`
    }
  });

  return data
}

module.exports = { loadConfig }
