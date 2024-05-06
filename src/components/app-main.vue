<template>
  <el-container class="main-container" id="appMain">
    <left-nav
      v-if="cuType == 4"
      :menus="menus"
      :mainLogo="flavorObj.mainLogo"
      @third_menu="get_third_menu"
      ref="leftNav"
      style="position: fixed; z-index: 2"
    ></left-nav>

    <el-container id="el-container">
      <el-header
        id="main-header"
        v-if="cuType == 4"
        :style="
          longNav ? 'width:calc(100% - 64px);left:64px' : 'width:calc(100% - 200px);left:200px'
        "
      >
        <div class="template-tabs">
          <el-tabs
            v-model="activeIndex"
            type="border-card"
            @tab-click="tabClick"
            @tab-remove="tabRemove"
          >
            <el-tab-pane
              :key="item.name"
              v-for="(item, index) in options"
              :closable="index === 0 ? false : true"
              :label="item.name"
              :name="item.id"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <el-dropdown class="el-dropdown-main" @command="handleCommand">
          <span class="el-dropdown-link">
            <span>{{ loginName }}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="about">{{ $t('changePwd.about') }}</el-dropdown-item>
              <el-dropdown-item command="changePsw">
                {{ $t('changePwd.changePwd') }}
              </el-dropdown-item>
              <el-dropdown-item command="uploadLogo">
                <span v-has-permi="[54]">{{ $t('public.uploadLogo') }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="logOut">{{ $t('changePwd.logOut') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <el-main id="main-center">
        <div
          @click="pageRefresh"
          :class="cuType == 4 ? 'pageRefresh refresh1' : 'pageRefresh refresh2'"
        >
        <i class="el-icon-refresh"></i>
        </div>
        <div
          v-if="thirdMenuList.length"
          class="thirdMenuList"
          :style="
            cuType == 1 ? 'left:0px;top: 0px;height:100vh;' : longNav ? 'left:64px' : 'left:200px'
          "
        >
          <ul
            class="third_menu"
            :style="!thirdMenuShow ? 'width: 160px;display:block' : 'width: 0px;display:none'"
          >
            <li
              @click="showName(item)"
              v-for="item in thirdMenuList"
              :key="'id_' + item.menuId"
              class="menu_item"
              :class="{ active: thirdMenu_active == item.path }"
            >
              <div v-title>
                {{ locale == 'en' ? item.menuNameEn : item.menuName }}
              </div>
            </li>
          </ul>

          <div class="ment_openBtn" @click="showThirdMenu">
            <span class="el-icon-caret-right" v-if="thirdMenuShow"></span>
            <span class="el-icon-caret-left" v-else></span>
          </div>
        </div>

        <div
          id="main-content"
          :style="
            thirdMenuList.length == 0
              ? 'width:100%;left:0px;'
              : thirdMenuList.length && !thirdMenuShow
              ? 'width:calc(100% - 166px);left:166px;'
              : 'width:calc(100% - 6px);left:6px;'
          "
        >
          <router-view v-slot="{ Component }">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="$route.path" :ref="$route.meta.ref" />
            </keep-alive>
          </router-view>
        </div>
      </el-main>
      <app-footer
        v-if="cuType == '4'"
        :flavorObj="flavorObj"
        :footerStyle="footerStyle"
      ></app-footer>
    </el-container>

    <!-- 关于 -->
    <about-info :info="aboutInfo"></about-info>
    <!-- 修改密码 -->
    <change-pwd :closeable="changePwdClosable"></change-pwd>
    <!-- 签退提示弹框 -->
    <login-out
      v-if="cuType == 4"
      v-model:logdialogVisible="logdialogVisible"
      :loginOutContent="loginOutContent"
      :loginOut="loginOut"
    ></login-out>

    <!-- 上传logo -->
    <logo-upload v-model:visible="uploadVisible" :tenantId="userId" />
  </el-container>
</template>

<script>
import { CaretBottom, Refresh } from '@element-plus/icons-vue'
import { defineAsyncComponent, h } from 'vue'
import { mapState } from 'vuex'

import leftNav from './left-nav.vue' //侧边菜单
import changePwd from './change-pwd' //修改密码
import appFooter from './app-footer' //底部
import loginOut from '@/components/loginOut' //退签弹框
import aboutInfo from './aboutInfo' // 关于弹框
import logoUpload from '@/views/common/component/userLogo-upload' // 用户管理的上传logo
//防抖引入
import { throttle } from 'lodash'
import { sStorage } from '@/utils/common/store'
import { permissions } from '@/utils/common/permissions'

export default {
  components: {
    'left-nav': leftNav,
    'about-info': aboutInfo,
    'change-pwd': changePwd,
    'app-footer': appFooter,
    'login-out': loginOut,
    'logo-upload': logoUpload,
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      cuType: null,

      loginName: sessionStorage.getItem('username'),

      menus: [],
      menuList: [],
      menuList1: [],
      thirdMenuList: [], //三级菜单
      thirdMenu_active: '',
      thirdMenu_obj: {},
      thirdMenu_obj1: {},
      thirdMenu_active_obj: {},
      thirdMenu_active_storage: [],
      del_thirdMenuList: [],

      aboutVisible: false, // 关于
      changePsdDialogVisible: false, //修改密码弹框
      changePwdClosable: true, // 修改密码是否可关闭
      isAppendToBody: true,

      heartBeatTimer: null,
      timer: null,
      logdialogVisible: false,
      loginOutContent: this.$t('loginOut.loginOutContent'),
      startTime: new Date().getTime(),
      uploadVisible: false, //上传logo对话框
      userId: sStorage.get('userId'),
      PermissionLicenseManage: false,
      path: this.$route.path
    }
  },
  computed: {
    ...mapState({
      flavorObj: state => state.flavor['flavorObj'],
      expireTime: state => state.init_time['expireTime'],
      lastEventTime: state => state.init_time['lastEventTime'],
      heartBeatInterval: state => state.init_time['heartBeatInterval'],
      loginInfo: state => state.user.lastLoginInfo,
      aboutInfo: state => state.app.aboutInfo,
      modifyPasswordInfo: state => state.app.modifyPasswordInfo,
      cachedViews: state => state.menu.cachedViews
    }),
    options() {
      return this.$store.state.menu.options
    },
    //动态设置及获取当前激活的tab页
    activeIndex: {
      get() {
        return this.$store.state.menu.activeIndex
      },
      set(val) {
        this.$store.commit('menu/set_active_index', val)
      }
    },
    longNav: {
      get() {
        return this.$store.state.menu.longNav
      },
      set(val) {
        this.$store.commit('menu/set_longNav', val)
      }
    },
    thirdMenuShow: {
      get() {
        return this.$store.state.menu.thirdMenuShow
      },
      set(val) {
        this.$store.commit('menu/set_thirdMenuShow', val)
      }
    },
    footerStyle() {
      if (this.cuType == 4) {
        return {
          width: this.longNav ? 'calc(100% - 64px)' : 'calc(100% - 200px)',
          left: this.longNav ? '64px' : '200px',
          height: '20px'
        }
      } else {
        return {
          width: '100%',
          left: '0',
          height: '20px'
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      // 滚动条回滚
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      document.getElementById('main-center') &&
        document.getElementById('main-center').scrollTo({ top: 0, behavior: 'smooth' })
      if (to.path === '/') {
        this.third_menu(from.path, from.query)
      } else {
        this.third_menu(to.path, to.query)
      }

      if (from.path === '/login') {
        this.loginName = sessionStorage.getItem('username')
      }

      if (to.path === '/login' || from.path === '/login') return

      let role = this.$store.state.menu.role
      let showName = this.$store.getters['menu/getShowName']
      let id = this.$store.getters['menu/getActiveIndex']

      //判断是否页面中是否已经存在该路由下的tab页
      let flag = this.options.find(option => {
        return option.name === showName
      })
      if (!flag) {
        //如果不存在，则新增tab页，再将新增的tab页设置为active显示在桌面前端
        if (role == 'pass') {
          this.$store.dispatch('menu/addView', {
            route: to.path,
            name: showName,
            id: id
          })
        }
      } else {
        this.$store.commit('menu/set_active_index', id)
      }
    },
    longNav() {
      this.getCuType({ first: false })
    },
    //监听语言切换
    '$i18n.locale': function () {
      this.locale = localStorage.getItem('locale')
    },
    modifyPasswordInfo: {
      handler(val, oldval) {
        this.isAppendToBody = val.isAppendToBody
        this.changePwdClosable = val.changePwdClosable
        this.changePsdDialogVisible = val.changePsdDialogVisible
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  async mounted() {
    await this.getPermissions()
    this.PermissionLicenseManage && this.license()
    this.third_menu(this.$route.path) //三级菜单
    this.getCuType({ first: true })
    this.getMenus()
    this.loginNotify()
  },
  beforeDestroy() {
    // 最后一步，离开页面的时候，清除一下定时器，也解绑点击事件
    this.heartBeatTimer && clearInterval(this.heartBeatTimer)
    this.timer && clearInterval(this.timer)
    window.removeEventListener('click', this.intervalTime)
    window.removeEventListener('mousemove', this.intervalTime)
    window.removeEventListener('beforeunload', this.loginOut)
  },
  methods: {
    loginNotify() {
      if (this.cuType != 4) {
        return false
      }
      if (Object.keys(this.loginInfo).length) {
        this.$notify({
          customClass: 'login-notify',
          title: this.$t('login.loginInfoTitle'),
          message: h('div', [
            h('p', [h('span', `${this.$t('login.lastIP')}:`), this.loginInfo.loginIp]),
            h('p', [h('span', `${this.$t('login.lastTime')}:`), this.loginInfo.loginTime]),
            h('p', [h('span', `${this.$t('login.failTimes')}:`), this.loginInfo.failTimes])
          ]),
          position: 'bottom-right',
          duration: 5000
        })
        this.$store.commit('user/SET_LAST_LOGIN_INFO', {})
      }
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionLicenseManage = await permissions(359)
    },
    listeners() {
      window.addEventListener('click', this.intervalTime)
      window.addEventListener('mousemove', this.intervalTime)
    },
    intervalTime: throttle(function () {
      this.$store.commit('init_time/SET_LASTEVENTTIME', new Date().getTime())
    }, 800),
    //心跳保活
    heartBeat() {
      let time = 60000
      let heartBeatInterval = this.heartBeatInterval
      if (heartBeatInterval && heartBeatInterval != 'undefined' && heartBeatInterval > 0) {
        time = Number(heartBeatInterval) * 1000
      } else {
        return false
      }
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = setInterval(() => {
        this.$api
          .heartbeat({})
          .then(res => {})
          .catch(err => {})
      }, time)
    },
    loginOut() {
      this.$router.push({ path: '/login' })
    },
    isTimeOut() {
      // 使用定时器之前，要清除一下定时器
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        // 把上次点击时候的字符串时间转换成数字时间
        let lastTime = this.lastEventTime ? this.lastEventTime : this.startTime
        let nowTime = new Date().getTime() // 获取当前时间
        // 5分钟不进行点击操作，就提示登录退出(后台控制时间)
        let expireTime = Number(this.expireTime)
        if (nowTime - lastTime > expireTime * 1000) {
          this.logdialogVisible = true
          window.addEventListener('beforeunload', this.loginOut)
          clearInterval(this.heartBeatTimer)
          window.removeEventListener('click', this.intervalTime)
          window.removeEventListener('mousemove', this.intervalTime)
          // 这里要清除定时器，结束任务
          clearInterval(this.timer)
        }
      }, 30000)
    },
    async license() {
      let res = await this.$api.getLicenseInfo({})
      if (res && res.resultCode == 0) {
        let leftDays = res.leftDays || null
        if (leftDays && leftDays <= 7) {
          let timer = setTimeout(() => {
            this.$alert(
              this.$t('license.licenseExpiredPrompt', { num: leftDays }),
              this.$t('public.prompt'),
              {
                confirmButtonText: this.$t('public.confirm'),
                type: 'warning',
                closeOnClickModal: false
              }
            )
            clearTimeout(timer)
          }, 500)
        }
      }
    },
    getMenus() {
      this.menus = JSON.parse(sessionStorage.getItem('menuList'))
      if (this.$store.state.menu.options.length > 0) {
        return
      } else {
        if (this.menus && this.menus.length > 0) {
          let obj = {}
          if (this.menus[0].children) {
            obj = this.menus[0].children[0]
          } else {
            obj = this.menus[0]
          }
          let menuName = this.locale == 'en' ? obj.menuNameEn : obj.menuName
          this.$store.dispatch('menu/addView', {
            route: obj.path,
            name: menuName,
            id: obj.menuId.toString()
          })
          this.$router.push({
            path: obj.path
          })
        }
      }
    },

    getCuType(data) {
      this.cuType = sessionStorage.getItem('cuType')
      const container = document.getElementById('el-container')
      const center = document.getElementById('main-center')
      const orgTree = document.getElementById('orgTree')
      center.style.padding = '0px'

      if (this.cuType == 4) {
        if (this.longNav) {
          container.style.marginLeft = '64px'
        } else {
          container.style.marginLeft = '200px'
        }
        center.style.marginTop = '50px'
        center.classList.add('height1')
        //web端（操作页面+心跳保活）
        if (data && data.first) {
          let expireTime = Number(this.expireTime)
          if (expireTime > 0) {
            this.listeners()
            this.isTimeOut()
            this.heartBeat()
          }
        }
      } else if (this.cuType == 1) {
        center.classList.add('height2')
        if (orgTree) orgTree.classList.add('height3')
      }
    },

    // 菜单数组递归
    menuListRecursion(data, path) {
      data.forEach(item => {
        if (item.path == path) {
          this.thirdMenu_obj = item
        } else {
          if (item.children) {
            this.menuListRecursion(item.children, path)
          }
        }
      })
    },
    menuListRecursion1(data, menuId) {
      data.forEach(item => {
        if (item.menuId == menuId) {
          this.thirdMenu_obj1 = item
        } else {
          if (item.children) {
            this.menuListRecursion1(item.children, menuId)
          }
        }
      })
    },
    menuListRecursion2(data, menuId) {
      data.forEach(item => {
        if (item.menuId == menuId) {
          this.del_thirdMenuList = item.children ? item.children : []
        } else {
          if (item.children) {
            this.menuListRecursion2(item.children, menuId)
          }
        }
      })
    },
    menuListRecursion3(data) {
      data.forEach(item => {
        if (item.path && item.path.indexOf('/AIV-MP/#') != -1) {
          item.path = item.path.substring(9)
        }
        if (item.children) {
          this.menuListRecursion3(item.children)
        }
      })
    },
    menuListRecursion4(data) {
      for (var key in data) {
        this.menuList1.push(data[key].path)
        if (data[key].children) {
          this.menuListRecursion4(data[key].children)
        }
      }
    },
    // 获取菜单
    async getMenuList() {
      let data = {
        type: sessionStorage.getItem('cuType') == 4 ? 1 : 2
      }
      await this.$api.selectMenus(data).then(res => {
        if (res && res.resultCode === 0) {
          this.menuList = res.menuList
          // 如果返回路径有AIV-MP，则做处理
          this.menuListRecursion3(this.menuList)
          sessionStorage.setItem('menuList', JSON.stringify(this.menuList))
        }
      })
    },

    async third_menu(path, query) {
      if (JSON.parse(sessionStorage.getItem('menuList'))) {
        this.menuList = JSON.parse(sessionStorage.getItem('menuList'))
      } else {
        await this.getMenuList()
      }
      this.menuListRecursion3(this.menuList)

      // 判断路由菜单是否存在数组
      this.menuList1 = []
      this.menuListRecursion4(this.menuList, path)
      let isTrue = this.menuList1.find(item => item == path)
      if (isTrue == undefined) {
        this.thirdMenuList = []
        sessionStorage.setItem('thirdMenuList', JSON.stringify(this.thirdMenuList))
        this.thirdMenu_active = ''
        this.$router.push({ path, query })
        return
      }

      this.menuListRecursion(this.menuList, path)
      if (this.thirdMenu_obj.children) {
        this.get_third_menu(this.thirdMenu_obj, query)
      } else {
        this.menuListRecursion1(this.menuList, this.thirdMenu_obj.parentId)
        if (this.thirdMenu_obj1.parentId != -1) {
          this.get_third_menu(this.thirdMenu_obj1)
        } else {
          this.get_third_menu({ path, menuId: this.thirdMenu_obj.menuId })
        }
      }
    },

    // 三级菜单
    get_third_menu(data, query) {
      // 如果有三级菜单
      if (data.children) {
        this.thirdMenuList = data.children
        sessionStorage.setItem('thirdMenuList', JSON.stringify(this.thirdMenuList))
        this.thirdMenuShow = false
        if (JSON.parse(sessionStorage.getItem('thirdMenu_active_storage'))) {
          this.thirdMenu_active_storage = JSON.parse(
            sessionStorage.getItem('thirdMenu_active_storage')
          )
          var res = this.getArrRepeat(this.thirdMenuList, this.thirdMenu_active_storage)
          if (res.length) {
            this.showName(res[0], query)
          } else {
            this.showName(data.children[0], query)
          }
        } else {
          this.showName(data.children[0], query)
        }
      } else {
        this.thirdMenuList = []
        sessionStorage.setItem('thirdMenuList', JSON.stringify(this.thirdMenuList))
        this.thirdMenu_active = ''
        this.$store.commit('menu/set_active_index', data.menuId.toString())
        this.$router.push({
          path: data.path,
          query
        })
      }
    },

    getArrRepeat(arr1, arr2) {
      return arr1.filter(item => {
        return arr2.includes(item.menuId)
      })
    },
    // 删除缓存点击过三级菜单
    del_active_storage(menuId) {
      let index = 0
      for (let item of this.thirdMenu_active_storage) {
        if (item === menuId) {
          break
        }
        index++
      }
      this.thirdMenu_active_storage.splice(index, 1)
    },
    showName(data, query) {
      if (this.thirdMenu_active_storage.length) {
        var res = this.getArrRepeat(this.thirdMenuList, this.thirdMenu_active_storage)
        if (res.length) {
          this.del_active_storage(res[0].menuId)
        }
      }
      this.thirdMenu_active_storage.push(data.menuId) //三级菜单点击缓存区

      sessionStorage.setItem(
        'thirdMenu_active_storage',
        JSON.stringify(this.thirdMenu_active_storage)
      )

      this.$store.commit('menu/set_active_index', data.parentId.toString())
      this.thirdMenu_active = data.path
      this.$router.push({
        path: data.path,
        query
      })
    },
    showThirdMenu() {
      this.thirdMenuShow = !this.thirdMenuShow
      this.setDialogCss()
    },

    // tab切换时，动态的切换路由
    tabClick(tab) {
      this.third_menu(this.options[parseInt(tab.index)].route)
      this.$store.commit('menu/set_role', 'nopass')
    },
    tabRemove(targetName) {
      this.$store.commit('menu/set_role', 'nopass')
      this.$store.dispatch('menu/delView', targetName)
      this.menuListRecursion2(this.menuList, targetName)
      if (this.thirdMenu_active_storage.length && this.del_thirdMenuList.length) {
        var res = this.getArrRepeat(this.del_thirdMenuList, this.thirdMenu_active_storage)
        if (res.length) {
          this.del_active_storage(res[0].menuId)
          sessionStorage.setItem(
            'thirdMenu_active_storage',
            JSON.stringify(this.thirdMenu_active_storage)
          )
        }
      }
      // 如果激活的关闭的tab就是激活的tab
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.$store.commit('menu/set_active_index', this.options[this.options.length - 1].id)
          this.third_menu(this.options[this.options.length - 1].route)
        } else {
          this.$router.push({ path: '/' })
        }
      }
    },

    handleCommand(cmditem) {
      if (!cmditem) {
        this.$message(this.$t('public.menueLackCommand'))
        return
      }
      switch (cmditem) {
        case 'about':
          this.aboutVisible = true
          break
        case 'logOut':
          this.$confirm(this.$t('changePwd.sureLogOut'), this.$t('public.prompt'), {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            customClass: 'logOutWidth',
            type: 'warning',
            closeOnClickModal: false
          })
            .then(() => {
              this.$api.logout({}).then(() => {
                this.$router.push({ path: '/login' })
              })
            })
            .catch(() => {})
          break
        case 'changePsw':
          this.changePwdClosable = true
          this.changePsdDialogVisible = true
          break
        case 'uploadLogo':
          this.uploadVisible = true
          break
      }
    },

    // 页面刷新
    async pageRefresh() {
      let name = this.$route.meta.ref
      if (!this.$refs[name]) return
      let methods = this.$route.meta.methods
      if (name == 'smartSubscriptionSnap') {
        if (this.$refs[name].$data.cameraId) {
          await this.$refs[name].cancelSeach(false)
        }
      }
      Object.assign(this.$refs[name].$data, this.$refs[name].$options.data.call(this))

      this.$refs[name].isRouterAlive = false
      if (methods) {
        this.$nextTick(() => {
          this.$refs[name].isRouterAlive = true
          for (let index = 0; index < methods.length; index++) {
            if (typeof this.$refs[name][methods[index]] === 'function') {
              this.$refs[name][methods[index]]()
            }
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs[name].isRouterAlive = true
        })
      }
    }
  }
}
</script>

<style lang="scss">
#appMain {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;

  #main-center {
    position: relative;

    .pageRefresh {
      width: 20px;
      position: fixed;
      right: 6px;
      z-index: 999;
      cursor: pointer;

      .el-icon {
        color: #fff;
        font-size: 20px;
      }

      &:active {
        animation: myfirst 2s;
      }
    }

    .refresh1 {
      top: 56px;
    }

    .refresh2 {
      top: 6px;
    }

    #vModal {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background: #000;
      display: none;
      z-index: 1999;
    }
  }

  .height1 {
    height: calc(100vh - 70px);
    max-height: calc(100vh - 70px);
  }

  .height2 {
    height: 100vh;
    max-height: 100vh;
  }

  .height3 {
    height: calc(100vh - 40px);
    max-height: calc(100vh - 40px);
  }

  @keyframes myfirst {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(720deg);
    }
  }
}
</style>
<style lang="scss" scoped>
.el-popper {
  .el-scrollbar {
    .el-scrollbar__wrap {
      .el-scrollbar__view {
        .el-dropdown-menu {
          background-color: #595959;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.logOutWidth {
  .el-button {
    width: 80px;
    text-align: center;
  }
}
</style>
