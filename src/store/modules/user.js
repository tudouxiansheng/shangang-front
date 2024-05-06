import api from '@/api'
import { lStorage, sStorage } from '@/utils/store'
const MD5 = require('@/utils/md5')
import { encryBySha256 } from '@/utils/common/crypto'
const user = {
  namespaced: true,
  state: {
    lastLoginInfo: {},
    version:'',
    userInfo:{}
  },

  mutations: {
    SET_LAST_LOGIN_INFO(state, lastLoginInfo) {
      state.lastLoginInfo = lastLoginInfo
    },
    SET_VERSION(state, version) {
      state.version = version
    },
    SET_USER_INFO(state,userInfo){
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ state, commit }, userInfo) {
      const { username, password, captcha, agentType } = userInfo
      return new Promise((resolve, reject) => {
        api
          .login(
            {
              captcha: userInfo.captcha,
              agentType: agentType,
              username: username,
              password: password
            },
            {
              headers: {
                isToken: false,
                Authorization: `xDigest username=${username}, realm=realm@host.com, qop=auth`,
                'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
              },
            }
          )
          .then(async res => {
            resolve(res)
          })
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
            const response = encryBySha256(
              encryBySha256(username + ':' + 'realm@host.com' + ':' + password) +
                ':' +
                nonce +
                ':' +
                '' +
                ':' +
                '' +
                ':' +
                'auth' +
                ':' +
                encryBySha256('POST:' + url)
            )
            const urlAuth =  header + ',response=' + response + ',username=' + username + ',' + ',uri=' + url + ','
            api
              .login(
                { captcha: captcha, agentType: agentType, username: username, password: password  },
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
    setUserInfo({ commit }, data) {
      commit('SET_USER_INFO', data)
    },
  },
}

export default user
