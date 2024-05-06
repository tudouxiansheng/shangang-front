import api from '@/api'
import { lStorage, sStorage } from '@/utils/store'
const MD5 = require('@/utils/md5')

const user = {
  namespaced: true,
  state: {},

  mutations: {
    SET_LOGIN_NAME: (state, name) => {
      state.username = name
    },

    SET_PASSWORD: (state, password) => {
      state.password = password
    },
  },

  actions: {
    // 登录
    Login({ state, commit }, userInfo) {
      const { username, password, captcha } = userInfo
      return new Promise((resolve, reject) => {
        api
          .login(
            {
              captcha,
            },
            {
              headers: {
                isToken: false,
                Authorization: `xDigest username=${username}, realm=realm@host.com, qop=auth`,
                'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
              },
            }
          )
          .catch((error) => {
            const res = error.response
            const url = res.config.url
            const header = res.headers['www-authenticate']
            if (header == undefined) {
              reject(error)
            }
            const Authenticate = header.split(',')
            const nonces = Authenticate[2].split('=')
            const nonce = nonces[1] // 获取nonce
            // response算法：response = MD5.md5(MD5.md5(userName+":"+realm+":"+password)+":"+nonce+":"+nc+":"+cnonce+":"+qop+":"+MD5.md5("POST:"+url))
            const response = MD5.hexMD5(
              `${MD5.hexMD5(`${username}:realm@host.com:${password}`)}:${nonce}:::auth:${MD5.hexMD5(`POST:${url}`)}`
            )
            const urlAuth = `${header},response=${response},username=${username},,uri=${url},`
            api
              .login(
                { captcha },
                {
                  headers: {
                    isToken: false,
                    Authorization: urlAuth,
                    'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
                  },
                }
              )
              .then(async (res) => {
                resolve(res)
              })
              .catch((error) => {
                reject(error)
              })
          })
      })
    },
  },
}

export default user
