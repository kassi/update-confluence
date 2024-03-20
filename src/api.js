let confluence = {}

async function configure(config) {
  let mandatoryKeys = ['endpoint', 'username', 'token', 'space']

  for (key of mandatoryKeys) {
    if (config[key]) {
      confluence[key] = config[key]
    } else {
      throw new Error(`Missing configuration: '${key}'`)
    }
  }
  confluence["basicAuth"] = btoa(`${confluence["username"]}:${confluence["token"]}`)
  confluence["authHeader"] = {Authorization: `Basic ${confluence["basicAuth"]}`}

  confluence["spaceId"] = await getSpaceId()
}

function endpoint() {
  return confluence["endpoint"]
}
function username() {
  return confluence["username"]
}
function token() {
  return confluence["token"]
}
function spaceKey() {
  return confluence["space"]
}
function spaceId() {
  return confluence["spaceId"]
}
function basicAuth() {
  return confluence["basicAuth"]
}
function authHeader() {
  return confluence["authHeader"]
}
let jsonHeader = {Accept: "application/json"}
let jsonPostHeader = {ContentType: "application/json"}

async function getSpaceId() {
  let key = confluence['space']
  let data = await confluenceGet(`/api/v2/spaces?type=global&keys=${key}`)
  if (data['results'].length == 0) {
    throw(`Space does not exist: '${key}'`)
  }

  return data['results'][0]['id']
}

async function confluenceGet(path) {
  const url = `${endpoint()}${path}`

  const params = {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {...confluence.authHeader, ...jsonHeader}
  }
  const response = await fetch(url, params)

  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json()
}

module.exports = {
  configure: configure,
  endpoint: endpoint,
  username: username,
  token: token,
  spaceKey: spaceKey,
  spaceId: spaceId,
  basicAuth: basicAuth,
  authHeader: authHeader
}
