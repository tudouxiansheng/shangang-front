import axios from 'axios'
import Vue from 'vue'
import router from '../router'

import i18n from '@/i18n/'
import { get, merge } from 'lodash'
// import store from '@/store'
import { lStorage, sStorage } from '@/utils/store'
import { selectUserPermissions, getLoginUserInfo } from '@/utils/api'
import tokenServer from './tokenServer'
let requests = [],
  showMsg = true
let isShowAlert = false
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 0,
})

function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.hash.split('?')[1].match(reg)
  if (r != null) return unescape(r[2])
  return null
}
// if (window.location.hash.split('?')[1]) {
//   const cuType = GetQueryString('cuType')
//   const token = GetQueryString('token')
//   if (cuType == 1) {
//     const clientNonce = GetQueryString('clientNonce')
//     const key = GetQueryString('key')
//     const language = GetQueryString('language') || 'zh'
//     token && sStorage.set('token', token)
//     sStorage.set('clientNonce', clientNonce)
//     sStorage.set('cuType', cuType)
//     sStorage.set('key', key)
//     lStorage.set('locale', language)
//     i18n.locale = language
//   }
// }

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = localStorage.getItem('locale') == 'zh' ? 'zh-CN,zh;q=0.9' : 'en-US,en;q=0.5'
    // 是否需要设置 token  isToken为true不需要token，false需要token
    const isToken = (config.headers || {}).isToken === false
    const token = sStorage.get('token')
    const refreshToken = sStorage.get('refreshToken')
    const url = get(config, 'url')
    if (token && !isToken && !url.includes('/uas/v1/api/user/token') && !url.includes('/file/fss/upload/permanent')) {
      config.headers.Authorization = 'Bearer ' + token
      config.url = `${url}?token=${token}`
    }
    if (url.includes('/file/fss/upload/permanent')) {
      config.url = url
    }
    if (token && !isToken && url.includes('/uas/v1/api/user/token')) {
      config.headers.Authorization = 'Bearer ' + refreshToken
      config.url = `${url}?token=${refreshToken}`
    }

    const Key = config.method.toLowerCase() === 'post' ? 'data' : 'params'
    config[Key] = merge(config[Key], {
      clientNonce: sessionStorage.getItem('clientNonce'),
      cuType: sessionStorage.getItem('cuType'),
      // cuType: 2,
    })
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = get(res, 'data.resultCode', 0)
    // 获取url
    const url = get(res, 'config.url')

    if (code === 0 || code === '00000000') {
      return res.data
    } else if (code === 500) {
      Vue.prototype.$alert(`${i18n.t('public.serviceError')}`, `${i18n.t('public.prompt')}`, {
        confirmButtonText: `${i18n.t('public.confirm')}`,
        type: 'warning',
      })
      return res.data
    } else if (url.indexOf('?') != -1 && url.split('?')[0] == 'uas/v1/api/uvs/cluster/list') {
      if (code === 8) {
        return res.data
      }
    } else if (
      url.split('?')[0] == '/uas/v1/api/udc/user/import' ||
      url.split('?')[0] == '/uas/v1/api/udc/tenant/import' ||
      url.split('?')[0] == '/uas/v1/api/oba/tenant/import' ||
      url.split('?')[0] == '/uas/v1/api/uvs/main-dev/import' ||
      url.split('?')[0] == '/uas/v1/api/uvs/camera/gis/import' ||
      url.split('?')[0] == '/uas/v1/api/uvs/device/probe' ||
      url.split('?')[0] == '/uas/v1/api/uvs/device/probe/validation' ||
      url.split('?')[0] == '/uas/v1/api/uvs/main-dev/add'
    ) {
      // 批量导入不展示弹框
      return res.data
    } else if (url.split('?')[0] == '/uas/v1/api/alarm/snap/get') {
      if (code == '00000003') {
        return res.data
      }
    } else if (url.split('?')[0] == '/uas/v1/api/uvs/camera/record/enable') {
      if (code == '202006') {
        Vue.prototype.$alert(`${i18n.t('deviceCamera.recordingDisableFailed')}`, `${i18n.t('public.prompt')}`, {
          confirmButtonText: `${i18n.t('public.confirm')}`,
          type: 'warning',
        })
        return res.data
      } else if (code == '202007') {
        Vue.prototype.$alert(`${i18n.t('deviceCamera.recordingEnableFailed')}`, `${i18n.t('public.prompt')}`, {
          confirmButtonText: `${i18n.t('public.confirm')}`,
          type: 'warning',
        })
        return res.data
      }
    } else if (code == '00000002') {
      Vue.prototype.$alert(`${i18n.t('public.operatingFailed')}`, `${i18n.t('public.prompt')}`, {
        confirmButtonText: `${i18n.t('public.confirm')}`,
        type: 'warning',
      })
      return res.data
    } else if (code == '1100021' && window.location.hash == '#/algorithm/device-guard') {
      return res.data
    }
    // else if (store.state.batchNotAlert) {
    //   //批量调接口
    //   return res.data
    // }
    else {
      if (showMsg) {
        showMsg = false
        Vue.prototype.$alert(`${res.data.resultDesc}`, `${i18n.t('public.prompt')}`, {
          confirmButtonText: `${i18n.t('public.confirm')}`,
          type: 'warning',
          callback() {
            showMsg = true
          },
        })
      }

      return res.data
    }
  },
  async (error) => {
    // 未设置状态码则默认成功状态
    const errRes = get(error, 'response')
    // const status = get(error, 'response.status')
    const code = get(error, 'response.data.resultCode')
    // 获取url
    const url = get(error, 'response.config.url')
    if (code == 100003 && url.split('?')[0] != '/uas/v1/api/user/token') {
      try {
        await tokenServer.apiRefreshToken()
        //参数是 Promise 实例，那么Promise.reresolve将不做任何修改、原封不动地返回这个实例
        return Promise.resolve(service(errRes.config._original))
      } catch {
        if (!isShowAlert) {
          Vue.prototype.$alert(`${i18n.t('login.loginExpired')}`, `${i18n.t('public.prompt')}`, {
            confirmButtonText: `${i18n.t('public.confirm')}`,
            type: 'warning',
            callback: () => {
              isShowAlert = false
              router.push({
                path: '/login',
                query: '',
              })
            },
          })
          isShowAlert = true
        }

        return Promise.reject()
      }

      // return doRequest(error)
    } else if (code == 100003 && url.split('?')[0] == '/uas/v1/api/user/token') {
      if (!isShowAlert) {
        Vue.prototype.$alert(`${i18n.t('login.loginExpired')}`, `${i18n.t('public.prompt')}`, {
          confirmButtonText: `${i18n.t('public.confirm')}`,
          type: 'warning',
          callback: () => {
            isShowAlert = false
            router.push({
              path: '/login',
              query: '',
            })
          },
        })
        isShowAlert = true
      }
      return error
    }
    return Promise.reject(error)
  }
)

function doRequest(error) {
  if (!window.tokenLock) {
    window.tokenLock = true
    return getNewToken()
      .then((resNew) => {
        if (resNew.resultCode == 0) {
          sessionStorage.setItem('token', resNew.accessToken)
          requests.length > 0 &&
            requests.map((cb) => {
              cb()
            })
          requests = [] //注意要清空
          let config = error.response.config
          config.url = config.url.split('?')[0]
          config.data = JSON.parse(config.data)
          const res = service(config)
          return res
        }
      })
      .catch((err) => {})
      .finally(() => {
        window.tokenLock = false
      })
  } else {
    return new Promise((resolve) => {
      requests.push(() => {
        let config = error.response.config
        config.url = config.url.split('?')[0]
        config.data = JSON.parse(config.data)
        resolve(service(config))
      })
    })
  }
}
window.tokenLock = false
async function getNewToken() {
  return await postFetch('/uas/v1/api/user/token', {})
}

export const loginRequest = function (config) {
  return service(config)
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

/**
 * @description 请求方法
 * @param {Boolean} loadTip 是否全屏加载
 * @param {Object} config axios config
 */
export const request = async function (loadTip, config) {
  let refreshIsLoading = tokenServer.refreshIsLoading()
  const refreshToken = sStorage.get('refreshToken')
  if (refreshIsLoading && refreshToken) {
    await tokenServer.apiRefreshToken()
  }
  // 保留原始请求的入参 方便再次请求
  config._original = JSON.parse(JSON.stringify(config))
  let loading
  if (loadTip) {
    loading = Vue.prototype.$loading({
      lock: false,
      text: '正在加载中…',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)',
    })
  }
  return service(config)
    .then(
      (res) => {
        if (loadTip) {
          loading.close()
        }
        return Promise.resolve(res)
      },
      (err) => {
        if (err) {
          return Promise.resolve(err.response)
        }
      }
    )
    .catch((error) => {
      if (loadTip) {
        loading.close()
      }
      return Promise.reject(error)
    })
}

/**
 * @description post请求方法
 * @param {String} url apiPath
 * @param {Object} data data
 * @param {Number} timeout timeout
 */
export const postFetch = function (url, data, timeout = 30000) {
  const query = {
    url: url,
    method: 'post',
    data: data,
    timeout,
    headers: {
      'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
    },
  }
  return request(false, query)
}

/**
 * @description post请求方法(带全屏加载提示)
 * @param {String} url apiPath
 * @param {Object} data data
 */
export const postFetchWithLoadTip = function (url, data) {
  const query = {
    url: url,
    method: 'post',
    data: data,
    headers: {
      'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
    },
  }
  return request(true, query)
}

/**
 * @description get请求方法
 * @param {String} url apiPath
 * @param {Object} params params
 */
export const getFetch = function (url, params) {
  const query = {
    url: url,
    method: 'get',
    params: params,
    headers: {
      'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
    },
  }
  return request(false, query)
}

/**
 * @description 表单请求方法
 * @param {String} url apiPath
 * @param {Object} formData formData
 */
export const formFetch = function (url, formData) {
  const query = {
    url: url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      //   'request-ajax': true,
      headers: {
        'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
      },
    },
  }
  return request(false, query)
}

export function fetch(url, param = {}, config = {}, timeout = 30000) {
  param.clientNonce = sStorage.get('clientNonce')
  param.cuType = sStorage.get('cuType')
  const query = {
    url: url,
    method: 'post',
    data: param,
    timeout,
    headers: {
      'Accept-Language': lStorage.get('locale') == 'en' ? 'en-US,en;q=0.5' : 'zh-CN,zh;q=0.9',
    },
  }
  return request(false, query)
}
