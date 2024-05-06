import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

import Print from 'vue-print-nb'
import VueClipboard from 'vue-clipboard2'
import vueSeamlessScroll from 'vue-seamless-scroll'
import '@/assets/icons' // icon
import echarts from 'echarts'
import flvjs from 'flv.js'
import '@/style/date.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import App from './App'
import router from '@/router'
import '@/style/allcam.css'
import directive from '@/directive/index'
import '@/utils/directives' //弹框拖拽
import api from '@/api'
import store from '@/store'
import 'amfe-flexible'
import i18n from '@/i18n/'
import VideoPlay from '@/utils/VideoPlay'
import { fetch, postFetch, formFetch } from '@/api/service'
import CusDialog from '@/components/CusDialog'
Vue.use(ElementUI, {
  size: 'small',
})
Vue.use(flvjs)
Vue.use(HappyScroll)
Vue.use(Print)
Vue.use(directive)
Vue.use(VueClipboard)
Vue.use(vueSeamlessScroll)
Viewer.setDefaults({
  zIndex: 8888,
  navbar: true,
  button: true,
  toolbar: {
    zoomIn: false,
    zoomOut: false,
    oneToOne: false,
    reset: false,
    prev: {
      show: true,
      size: 'large',
    },
    play: {
      show: true,
      size: 'large',
    },
    next: {
      show: true,
      size: 'large',
    },
    rotateLeft: false,
    rotateRight: false,
    flipHorizontal: false,
    flipVertical: false,
  },
  title: false,
})
Vue.use(Viewer)
Vue.prototype.$formFetch = formFetch
Vue.prototype.$postFetch = postFetch
Vue.prototype.$api = api
Vue.prototype.$fetch = fetch
Vue.prototype.$echarts = echarts
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$VideoPlay = new VideoPlay()
Vue.config.productionTip = false
Vue.component('CusDialog', CusDialog)
import { getLoginUserInfo, selectUserPermissions } from '../../utils/api'
import microApp from '@micro-zoe/micro-app'
microApp.start({
  shadowDOM: false, // 默认值false
  plugins: {
    modules: {
      avs_web: [
        {
          loader(code, url) {
            // console.log(url);
            // if (url === 'xxx.js') {
            //   code = code.replace('var xx_dll=', 'window.xx_dll=')
            // }
            return code
          },
        },
      ],
    },
  },
})
// 浏览器内核提供的调用方法
Vue.prototype.vuewebkitProc = function (fun, message) {
  // 浏览器内核提供的调用方法
  window.webkitProc(fun, message)
}
function mount() {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: {
      App,
    },
    template: '<App/>',
  })
}
let isPcENV = typeof window.webkitProc === 'function'
if (isPcENV) {
  if (sessionStorage.getItem('isShowIframe')) {
    mount()
  } else {
    window.webkitNotify = function (func, message) {
      const res = JSON.parse(message)
      if (func && func == 'token_receive') {
        if (res.isRefresh == 0) {
          // 首次
          sessionStorage.setItem('cuType', res.cuType)
          sessionStorage.setItem('token', res.token)
          sessionStorage.setItem('refreshToken', res.refreshToken)
          sessionStorage.setItem('clientNonce', res.clientNonce)
          sessionStorage.setItem('key', res.key)
          localStorage.setItem('locale', res.locale)
          localStorage.setItem('showimg', res.mapShow)
          i18n.locale = res.locale
          mount()
          if (!sessionStorage.getItem('userPermList')) {
            selectUserPermissions({}).then((res) => {
              if (res.resultCode == 0) {
                sessionStorage.setItem('userPermList', JSON.stringify(res.permList))
              }
            })
          }
          if (!sessionStorage.getItem('organizationId')) {
            getLoginUserInfo({}).then((res) => {
              if (res.resultCode == 0) {
                sessionStorage.setItem('organizationId', res.userInfo.organizationId)
                sessionStorage.setItem('account', res.userInfo.account)
                sessionStorage.setItem('username', res.userInfo.userName)
                sessionStorage.setItem('userId', res.userInfo.userId)
                sessionStorage.setItem('roleId', res.userInfo.roleId)
              }
            })
          }
        }
      }
    }
    window.webkitProc(
      'token_reget',
      JSON.stringify({
        isRefresh: 0,
      })
    )
  }
} else {
  mount()
}
