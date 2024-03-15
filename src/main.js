const core = require('@actions/core')
const { loadConfig } = require('./config')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const configFile = core.getInput('config', {required: true})
    const token = core.getInput('token', {required: true})

    let config = loadConfig(configFile)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
