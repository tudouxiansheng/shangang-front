import { refreshToken } from '../utils/api'

/**
 * token刷新方法，
 * 1、当第一次出现401的时候，立即从api里请求token，并将“异步体”保存为 refreshPromise
 * 2、后续的请求相当于都是给 apiRefreshToken 添加then
 * 3、当token刷新完毕，refreshPromise 应当清空为下次做准备
 */
class RefreshToken {
  constructor() {
    this.refreshPromise = undefined
  }
  apiRefreshToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = new Promise((resolve, reject) => {
        // 获取token，存放到本地缓存
        if (sessionStorage.getItem('cuType') == 1) {
          window.webkitProc('token_reget', JSON.stringify({ isRefresh: 1 }))
          let timer = setInterval(() => {
            if (window.token_received) {
              this.refreshPromise = undefined
              resolve()
              clearInterval(timer)
            }
          }, 1000)
        } else {
          refreshToken({})
            .then((res) => {
              if (res.resultCode == 0) {
                sessionStorage.setItem('token', res.accessToken)
                this.refreshPromise = undefined
                resolve()
              } else {
                this.refreshPromise = undefined
                reject()
              }
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
    }
    return this.refreshPromise
  }
  refreshIsLoading() {
    return Boolean(this.refreshPromise)
  }
}
export default new RefreshToken()
