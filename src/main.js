import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import { ElMessage as Message } from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/style/common/white.scss'
import '@/assets/font/font.css'
import '@/assets/icons'
import '@/assets/style/tailwind.css'
import '@/assets/style/index.scss'
import customDirectives from '@/directive/index'
import { selectDictLabel, selectDictLabels, resetForm } from '@/utils/common/utils'
import SvgIcon from '@/assets/icons/index.js'
import Pagination from '@/components/pagination'
import noTable from '@/components/no-table'
import PwdInput from '@/components/pwd-input'
import api from '@/api'
import { formFetch, postFetch } from '@/api/service'
import loadash from 'lodash'
import mixin from '@/mixin'
import { i18n, getDefaultLang } from '@/i18n'
import eventBus from 'vue3-eventbus'
import { lStorage, sStorage } from './utils/common/store'
import xss from 'xss'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { componentPligin } from './components/pl-table'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale(getDefaultLang())
window.DD = dayjs
const app = createApp(App)
// 注册自定义指令
Object.keys(customDirectives).forEach(directiveName => {
  const directive = customDirectives[directiveName]
  app.directive(directiveName, directive)
})
app.use(ElementPlus, {
  size: 'small'
})
app.use(VXETable)
app.use(componentPligin)
// 全局分页组件挂载
app.component('Pagination', Pagination)
app.component('noTable', noTable)
app.component('PwdInput', PwdInput)
app.component('svg-icon', SvgIcon)
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}
// Message只显示在固定位置
let messageInstance = null
const overrideMessage = options => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
;['error', 'success', 'info', 'warning'].forEach(type => {
  overrideMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return overrideMessage(options)
  }
})
app.config.globalProperties.$t = i18n.global.t
app.config.globalProperties.$api = api
app.config.globalProperties.$message = overrideMessage
app.config.globalProperties.$formFetch = formFetch
app.config.globalProperties.$fetch = postFetch
app.config.globalProperties.$bus = eventBus
app.config.globalProperties.$bus.$on = eventBus.on
app.config.globalProperties.$bus.$emit = eventBus.emit
app.config.globalProperties.$loadash = loadash
app.config.productionTip = false
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.$resetForm = resetForm
app.config.globalProperties.$projectEnv = process.env.VUE_APP_ENV_NAME
app.config.globalProperties.$clientType = process.env.VUE_APP_CLIENT_TYPE
app.config.globalProperties.$xss = xss
app.config.globalProperties.$maxPageSize = 500

// 判断前端是否是ipv6地址访问
const isIpv6 = /^\[/.test(location.host)
app.config.globalProperties.$getNetType = () => {
  if (sStorage.get('netType')) {
    return sStorage.get('netType')
  }

  return isIpv6 ? 1 : 0
}

// 浏览器内核提供的调用方法
app.config.globalProperties.$webkitProc = (fun, message) => {
  typeof window.webkitProc === 'function' && window.webkitProc(fun, message)
}
app.config.globalProperties.dayjs = dayjs
window.addEventListener('beforeunload', () => {
  const accessToken = store.state.auth.accessToken
  const refreshToken = store.state.auth.refreshToken
  const clientNonce = store.state.auth.clientNonce
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken)
  }
  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken)
  }
  if (clientNonce) {
    sessionStorage.setItem('clientNonce', clientNonce)
  }
})

// 检查sessionStorage是否有token，并在需要时恢复它
const accessToken = sessionStorage.getItem('accessToken')
if (accessToken) {
  store.dispatch('auth/setAccessToken', accessToken)
  // 清除sessionStorage中的accessToken
  sessionStorage.removeItem('accessToken')
}
const refreshToken = sessionStorage.getItem('refreshToken')
if (refreshToken) {
  store.dispatch('auth/setRefreshToken', refreshToken)
  // 清除sessionStorage中的refreshToken
  sessionStorage.removeItem('refreshToken')
}
const clientNonce = sessionStorage.getItem('clientNonce')
if (clientNonce) {
  store.dispatch('auth/setClientNonce', clientNonce)
  // 清除sessionStorage中的clientNonce
  sessionStorage.removeItem('clientNonce')
}
function mount() {
  app.use(router)
  app.use(store)
  app.mount('#app')
}
let isPcENV = typeof window.webkitProc === 'function'
if (isPcENV) {
  window.webkitNotify = function (func, message) {
    if (func && func == 'token_receive') {
      const res = JSON.parse(message)
      if (res.isRefresh == 0) {
        // 首次
        sStorage.set('cuType', res.cuType)
        store.dispatch('auth/setClientNonce', res.clientNonce)
        store.dispatch('auth/setRefreshToken', res.refreshToken)
        store.dispatch('auth/setAccessToken', res.token)
        lStorage.set('locale', res.locale)

        // 如果有netType字段, 设置网络类型
        if ('netType' in res) {
          sStorage.set('netType', res.netType)
        }

        i18n.locale = res.locale
        mount()
        if (!sStorage.get('userPermList')) {
          api.selectUserPermissions({}).then(res => {
            if (res.resultCode == 0) {
              sStorage.set('userPermList', JSON.stringify(res.permList))
            }
          })
        }
        if (!sStorage.get('organizationId')) {
          api.getLoginUserInfo({}).then(res => {
            if (res.resultCode == 0) {
              sStorage.set('organizationId', res.userInfo.organizationId)
              sStorage.set('account', res.userInfo.account)
              sStorage.set('username', res.userInfo.userName)
              sStorage.set('userId', res.userInfo.userId)
              sStorage.set('belongTenantId', res.userInfo.belongTenantId)
            }
          })
        }
      }
    }
  }
  window.webkitProc(
    'token_reget',
    JSON.stringify({
      isRefresh: 0
    })
  )
} else {
  mount()
  document.title = i18n.global.t('login.loginTitle')
}

import { setDialogCssMixin } from './mixin/setDialogCss'

app.mixin(setDialogCssMixin)

export default app
