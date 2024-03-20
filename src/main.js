const core = require('@actions/core')
const config = require('./config')
const {renderContent} = require("./render")
const confluenceApi = require("./api")
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const configFile = core.getInput('config', {required: true})
    const token = core.getInput('token', {required: true})

    let config = config.load(configFile)

    // let { confluence_endpoint, username, space } = config.data
    // confluenceApi.configure({
    //   endpoint: confluence_endpoint,
    //   username: username,
    //   token: token,
    //   space: space
    // })

    let pages = config.pagesToBeDeployed()

    pages.forEach((page) => {
      content = renderContent(page)
      // if (confluence.pageExists(page)) {
      //   confluence.updatePage(page)
      // } else {
      //   const parent
        // confluence.createPage(page)
      // }
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
