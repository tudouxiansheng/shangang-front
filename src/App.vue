<template>
  <div id="app" v-cloak>
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script>
import { genWaterMark } from '@/utils/common/watermark'
import { lStorage, sStorage } from '@/utils/common/store'
import tokenServer from '@/api/tokenServer'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
export default {
  name: 'App',
  created() {
    window.token_received = false
    window.addEventListener('onClientLogout', this.loginOut, true)
    window.webkitNotify = this.webkitNotify
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
  },
  mounted() {
    this.getWatermarkList()
  },
  computed: {
    locale() {
      return localStorage.getItem('locale') === 'zh' ? zhCn : en
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {}
  },
  methods: {
    // 接受客户端信息
    webkitNotify(func, message) {
      if (func) {
        if (func == 'token_receive') {
          this.token_receive(message)
        } else {
          this.$bus.$emit('webkit_notify', { func, message })
        }
      }
    },
    token_receive(message) {
      const res = JSON.parse(message)
      if (res.isRefresh == 1) {
        // 刷新token
        this.$store.dispatch('auth/setAccessToken', res.token)
        let refreshIsLoading = tokenServer.refreshIsLoading()
        if (refreshIsLoading) {
          window.token_received = true
        }

        // 如果有netType字段, 设置网络类型
        if ('netType' in res) {
          sStorage.set('netType', res.netType)
        }
      }
    },
    // 初始化获取水印是否开启
    getWatermarkList() {
      if (sessionStorage.getItem('waterMark')) {
        genWaterMark(JSON.parse(sessionStorage.getItem('waterMark')))
      }
    },
    //提示退签
    loginOut(message) {
      this.$bus.$emit('log_out', message)
    }
  }
}
</script>

<style lang="scss">
[v-cloak] {
  display: none;
}

body,
div,
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body,
html {
  width: 100vw;
  overflow: auto;
  height: 100%;
  font-size: 12px;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
