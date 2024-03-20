/**
 * Unit tests for src/config.js
 */
const api = require("../src/api")
const {expect} = require('@jest/globals')

describe('api', () => {
  let config = {
    endpoint: 'https://example.com/api',
    username: 'username',
    token: 'token',
    space: 'SPACE',
  }
  let mandatoryKeys = ['endpoint', 'username', 'token', 'space']

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe('.configure', () => {
    for (key of mandatoryKeys) {
      it(`throws an exception when ${key} does not exist in config`, async () => {
        let testConfig = {...config}
        delete testConfig[key]

        await expect(api.configure(testConfig)).rejects.toThrow(`Missing configuration: '${key}'`)
      })
    }

    it('sets provided data', async () => {
      jest.spyOn(global, 'fetch').mockReturnValue({
        "results": [
          {
            "id": "42"
          }
        ]
      })
      await api.configure(config)
      // expect(api.endpoint()).toEqual("https://example.com/api")
      // expect(api.username()).toEqual("username")
      // expect(api.token()).toEqual("token")
      // expect(api.spaceKey()).toEqual("SPACE")
      // expect(api.basicAuth()).toEqual("dXNlcm5hbWU6dG9rZW4=")
      // expect(api.authHeader()).toEqual({Authorization: "Basic dXNlcm5hbWU6dG9rZW4="})
      expect(await api.spaceId()).toEqual(42)
    })

    // it('throws an exception when space does not exist', () => {
    //   let testConfig = {...config, space: "UNKNOWN"}
    //   expect(() => api.configure(testConfig)).toThrow("Space doesn't exist: 'UNKNOWN'")
    // })

  })

  describe('', () => {

  })

})
