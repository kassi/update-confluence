const core = require('@actions/core')
const config = require('./config')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const configFile = core.getInput('config', {required: true})
    const token = core.getInput('token', {required: true})

    let config = config.load(configFile)
    let pages = config.pagesToBeDeployed()

    pages.forEach((page) => {
      // render
      // upload
    })

    changed_pages(config).forEach(page => {
      handle_page(page)
    });
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
