<template>
  <div class="child-app">
    <micro-app
      name="avs_web"
      @unmount="handleUnmount"
      :url="`${url}/AVS_WEB`"
      baseroute="/AIV-MP/avs"
      :data="microAppData"
    ></micro-app>
  </div>
</template>

<script>
import microApp, { getActiveApps, removeDomScope } from '@micro-zoe/micro-app'
export default {
  name: 'index',
  computed: {},
  watch: {
    '$route.path': {
      handler(path) {
        // 获取子应用appName
        const appName = getActiveApps()[0]
        // console.log(appName, 'appName')
        this.pushState(appName, path, false, this.$route.query)
      },
    },
  },
  created() {
    console.log('123')
  },
  data() {
    return {
      // url: window.location.origin,
      url: process.env.NODE_ENV == 'production' ? window.location.origin : 'http://localhost:3700',
      microAppData: {
        authData: {
          token: sessionStorage.getItem('token'),
          refreshToken: sessionStorage.getItem('refreshToken'),
          clientNonce: sessionStorage.getItem('clientNonce'),
          cuType: sessionStorage.getItem('cuType'),
          key: sessionStorage.getItem('key'),
          locale: localStorage.getItem('locale'),
        },
      },
    }
  },
  methods: {
    handleUnmount() {
      //卸载
      console.log('unmount')
      removeDomScope()
    },
    // 子应用sidebar通过pushState控制主应用跳转
    pushState(appName, path, hash) {
      /**
       * 当子应用还未渲染，通过基座控制路由跳转，子应用在初始化时会自己根据url渲染对应的页面
       * 当子应用已经渲染，则直接控制子应用进行内部跳转
       *
       * getActiveApps: 用于获取正在运行的子应用
       */
      //获取是否有参数
      if (!getActiveApps().includes(appName)) {
        // child-vite 和 child-react17子应用为hash路由，这里拼接一下hash值
        hash && (path += `/#${hash}`)
        // 主应用跳转
        this.$router.push(path)
      } else {
        let childPath = null
        // child-vite 和 child-react17子应用是hash路由，hash值就是它的页面地址，这里单独处理
        if (hash) {
          childPath = hash
        } else {
          // path的值形式如：/app-vue2/page2，这里/app-vue2是子应用的基础路由，/page2才是页面地址，所以我们需要将/app-vue2部分删除
          childPath = path.replace(/^\/avs+/, '')
          !childPath && (childPath = '/') // 防止地址为空
        }
        let query = this.$route.query
        // 主应用通过下发data数据控制子应用跳转
        if (Object.keys(query).length) {
          microApp.setData(appName, { path: childPath, query, type: 'update-router' })
        } else {
          microApp.setData(appName, { path: childPath })
        }
      }
    },
  },
}
</script>

<style scoped>
.child-app {
  width: 100%;
  height: 100%;
}
</style>
