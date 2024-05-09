<template>
  <div
    :class="[
      isCamera ||
      currentPath === 1 ||
      fullPath == '/realtime-play' ||
      fullPath == '/record-playback' ||
      fullPath == '/homepage'
        ? 'miniHeader'
        : 'miniHeader',
    ]"
    ref="ref_header"
  >
    <div style class="bgwrapper">
      <div class="systemName" draggable="false">
        <img v-if="logoUrl" class="logoUrl" :src="logoUrl" alt="" @error="handleE" />
        <span>{{ systemName }}</span>
      </div>

      <div class="menuList menuListleft">
        <i
          @click="preMenu()"
          :class="this.menuList.length < 8 || this.currentIndex === 0 ? '' : 'active-arrow'"
          class="el-icon-caret-left arrow"
        ></i>
        <ul>
          <li
            class="menuItemOne"
            v-for="(item, index) in menuLeft"
            :key="item.menuId"
            @click="clickTab(item, index, 'left')"
            :style="{ width: menuList.length == 4 ? '50%' : '25%' }"
            @mouseover="handleMenuMouseOver($event, item)"
            @mouseleave="handleMenuMouseLeave($event, item)"
          >
            <div
              :class="[
                'activeline',
                item.path == fullPath ||
                (item.children &&
                  item.children.length &&
                  item.children.map((item) => item.path).indexOf(fullPath) !== -1)
                  ? 'active'
                  : '',
              ]"
            >
              <span class="menu-name" :title="isZh ? item.menuName : item.menuNameEn">{{
                isZh ? item.menuName : item.menuNameEn
              }}</span>
            </div>
            <ul v-if="item.children" class="menuTwo">
              <template v-for="(item1, index1) in item.children">
                <li
                  v-if="cuType == true && noRenderMenu.indexOf(item1.path) == -1"
                  class="menuItemTwo"
                  :key="index1"
                  @click.stop="clickTab(item1, index1, index)"
                >
                  <span class="menu-name" :title="isZh ? item1.menuName : item1.menuNameEn">{{
                    isZh ? item1.menuName : item1.menuNameEn
                  }}</span>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </div>

      <div class="menuList menuListRight">
        <ul>
          <li
            class="menuItemOne"
            v-for="(item, index) in menuRight"
            :key="item.menuId"
            @click="clickTab(item, index, 'right')"
            @mouseover="handleMenuMouseOver($event, item)"
            @mouseleave="handleMenuMouseLeave($event, item)"
            :style="{ width: menuList.length == 4 ? '50%' : '25%' }"
          >
            <div
              :class="[
                'activeline',
                item.children && item.children.length && item.children.map((item) => item.path).indexOf(fullPath) !== -1
                  ? 'active'
                  : '',
              ]"
            >
              <span class="menu-name" :title="isZh ? item.menuName : item.menuNameEn">{{
                isZh ? item.menuName : item.menuNameEn
              }}</span>
            </div>
            <ul v-if="item.children" class="menuTwo">
              <template v-for="(item1, index1) in item.children">
                <li
                  class="menuItemTwo"
                  v-if="cuType == true && noRenderMenu.indexOf(item1.path) == -1"
                  @click.stop="clickTab(item1, index1, index)"
                  :key="index1"
                >
                  <span class="menu-name" :title="isZh ? item1.menuName : item1.menuNameEn">{{
                    isZh ? item1.menuName : item1.menuNameEn
                  }}</span>
                </li>
              </template>
            </ul>
          </li>
        </ul>
        <i
          class="el-icon-caret-right arrow"
          @click="nextMenu()"
          :class="this.menuList.length < 8 || this.currentIndex === this.menuList.length - 8 ? '' : 'active-arrow'"
        ></i>
      </div>

      <div class="logout">
        <div class="headerLogout" @mouseover="handleLogInfoMouseOver" @mouseleave="handleMenuMouseLeave">
          <div class="navLogout" :title="!isZh && account == '超级管理员' ? 'admin' : account">
            <img src="../assets/homeImg/logoutnew.png" alt />
            <div class="account-name">{{ !isZh && account == '超级管理员' ? 'admin' : account }}</div>
            <div class="down-menu" :class="isZh ? '' : 'en-width'">
              <div class="showMap" v-if="false">
                <label>显示地图</label>
                <el-switch id="sth" name="sth" v-model="showMap" :disabled="disable" @change="switchChange"></el-switch>
                <p v-if="disable">暂无地图，请联系系统管理员</p>
              </div>
              <span @click="handleChangePwd">
                <img class="icon" src="../assets/login/pwd.png" alt="" />
                {{ $t('changePwd.changePwd') }}
              </span>
              <span @click="logout()">
                <img class="icon" src="../assets/login/logout.png" alt="" />
                {{ $t('changePwd.logOut') }}
              </span>
              <!--              <span v-if="this.cuType != true" @click="update()">-->
              <!--                <img class="icon update" src="../assets/login/update.png" alt="" />-->
              <!--                {{ $t('changePwd.update') }}-->
              <!--              </span>-->
              <span v-if="cuType != true" @click="debuggerLogout()">
                <img class="icon" src="../assets/login/logout.png" alt="" />
                {{ $t('changePwd.logOutAndExit') }}
              </span>
              <span @click="downClient" v-if="cuType != true && flag">
                <img class="icon" src="../assets/login/update.png" alt="" />
                <span>{{ checkVersion ? $t('changePwd.update') : `${versionNumber}` }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <changePwd
      @closed="handleMenuMouseLeave"
      @opened="handleLogInfoMouseOver"
      @close="handleCloseChangePwd"
      :visible="changePwdVisible"
    ></changePwd>
  </div>
</template>

<script>
import { selectMenus, getLoginUserInfo } from '@/utils/api.js'
import changePwd from './change-pwd'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    changePwd,
  },
  data() {
    return {
      flag: false,
      checkVersion: 1, //1表示需要更新，0表示已经是最新的
      versionNumber: '1.0.0',
      changePwdVisible: false,
      menuList: [],
      noRenderMenu: ['/tvwall-setting', '/tvwall-play', '/download-center'],
      activeIndex: 0,
      menuLeft: [], //左侧菜单
      menuRight: [], //右侧菜单
      currentIndex: 0, //当前索引
      timer: null,
      isCamera: false,
      headerBgColor2: '#132e47',
      systemName: '智慧园区一体化平台',
      titlePosition: '2',
      length: '',
      logoUrl: '',
      cuType: true,
      firstLogin: sessionStorage.getItem('firstLogin'),
      account: sessionStorage.getItem('username'),
      showMap: localStorage.getItem('showimg') === 'true' ? true : false, //true-map,false-img
    }
  },
  created() {
    this.getName()
    this.getMenuList()
    getLoginUserInfo({}).then((res) => {
      let userInfo = res.userInfo
      sessionStorage.setItem('userId', userInfo.userId)
      sessionStorage.setItem('username', userInfo.userName)
      sessionStorage.setItem('organizationId', userInfo.organizationId)
      sessionStorage.setItem('organizationName', userInfo.organizationName)
      sessionStorage.setItem('roleId', userInfo.roleId)
      sessionStorage.setItem('roleName', userInfo.roleName)
      if (userInfo.avatarFileId) sessionStorage.setItem('avatarFileId', userInfo.avatarFileId)
      this.account = userInfo.userName
    })
  },
  computed: {
    isQt() {
      return window.webkitProc == undefined
    },
    currentPath() {
      return this.$route.meta.activeIndex
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    fullPath() {
      return this.$route.path
    },
  },
  mounted() {
    this.cuType = window.webkitProc == undefined
    this.setVersion()
    microApp.addDataListener('avs_web', this.handleDataChange, true)
  },
  beforeDestroy() {
    microApp.clearDataListener('avs_web')
  },
  methods: {
    handleDataChange(data) {
      if (data.type && data.type === 'update-router') {
        this.$router.push({
          path: `/avs/${data.path}`,
          query: {
            name: data.cameraName,
          },
        })
      }
    },
    handleMenuMouseLeave() {
      let modalDom = document.querySelector('.v-modal')
      if (!modalDom) {
        microApp.setData('avs_web', { isMenuVisible: false })
      }
    },
    handleLogInfoMouseOver() {
      microApp.setData('avs_web', { isMenuVisible: true })
    },
    handleMenuMouseOver(e, item) {
      if (item.children && item.children.length) {
        microApp.setData('avs_web', { isMenuVisible: true })
      } else {
        microApp.setData('avs_web', { isMenuVisible: false })
      }
    },
    // 下载客户端
    downClient() {
      // 如果为最新版本，弹出提示框，告知当前版本，并提示版本号
      if (!this.checkVersion) {
        this.$confirm(this.$t('changePwd.versionTip', { version: this.versionNumber }), '提示', {
          type: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
        })
        return
      }
      // 如果不是最新版本，告诉Qt端开始下载最新的客户端
      try {
        const obj = { update: 1 }
        window.webkitProc('web_notifyClientUpdateClient', JSON.stringify(obj))
        console.log('通知更新')
      } catch (err) {
        console.log(err)
      }
    },
    // 版本赋值
    setVersion() {
      // let flag=JSON.parse(JSON.stringify(sessionStorage.getItem("version")))
      let flag = sessionStorage.getItem('version') ? sessionStorage.getItem('version') : false
      this.flag = flag
      if (flag) {
        console.log(JSON.parse(JSON.parse(flag)), '转换后')
        this.checkVersion = JSON.parse(JSON.parse(flag)).update
        this.versionNumber = JSON.parse(JSON.parse(flag)).curVersion
      }
    },
    update() {
      // 如果为最新版本，弹出提示框，告知当前版本，并提示版本号
      if (!this.checkVersion) {
        this.$confirm(this.$t('changePwd.versionTip', { version: this.versionNumber }), '提示', {
          type: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
        })
        return
      }
      // 如果不是最新版本，告诉Qt端开始下载最新的客户端
      try {
        const obj = { update: 1 }
        window.webkitProc('web_notifyClientUpdateClient', JSON.stringify(obj))
      } catch (err) {
        console.log(err)
      }
    },
    handleE() {
      this.logoUrl = ''
    },
    handleCheckFirst() {
      if (this.firstLogin == 1) {
        //第一次登录
        this.$confirm(this.$t('changePwd.firstLoginTips'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
        })
          .then(() => {
            this.changePwdVisible = true
          })
          .catch(() => {
            // 清空本地缓存
            try {
              sessionStorage.clear()
              const obj = { notifyType: 0 }
              window.webkitProc('web_notifyClientLogout', JSON.stringify(obj))
            } catch (err) {
              console.log(err)
            }
            this.$router.push({ path: '/login' })
          })
      }
    },
    handleCloseChangePwd() {
      this.changePwdVisible = false
    },
    handleChangePwd() {
      this.changePwdVisible = true
    },
    // 点击查看前一个菜单
    preMenu() {
      if (this.menuList.length < 8 || this.currentIndex === 0) {
        return
      }
      this.currentIndex--
      this.getMenu()
    },
    // 点击查看后一个菜单
    nextMenu() {
      if (this.menuList.length < 8 || this.currentIndex === this.menuList.length - 8) {
        return
      }
      this.currentIndex++
      this.getMenu()
    },
    // 得到菜单{
    getMenu() {
      this.menuLeft = this.menuList.slice(this.currentIndex, this.currentIndex + 4)
      this.menuRight = this.menuList.slice(this.currentIndex + 4, this.currentIndex + 8)
    },
    // 获取菜单
    async getMenuList() {
      await selectMenus({
        type: 12,
      }).then((res) => {
        if (res.resultCode === 0) {
          this.menuList = res.menuList
          if (this.menuList.length == 4) {
            this.menuLeft = JSON.parse(sessionStorage.getItem('menuLeft')) || this.menuList.slice(0, 2)
            this.menuRight = JSON.parse(sessionStorage.getItem('menuRight')) || this.menuList.slice(2, 4)
          } else {
            this.menuLeft = JSON.parse(sessionStorage.getItem('menuLeft')) || this.menuList.slice(0, 4)
            this.menuRight = JSON.parse(sessionStorage.getItem('menuRight')) || this.menuList.slice(4, 8)
          }
          this.currentIndex = JSON.parse(sessionStorage.getItem('currentMenuIndex')) || 0
          this.handleCheckFirst()
          //
          // this.menuList.push({
          //     icon: "",
          //     menuId: 99,
          //     menuName: "Map",
          //     menuNameEn: "Map",
          //     parentId: -1,
          //     path: "/map",
          //     type: 2,
          // })
          // console.log(this.menuList)
        }
      })
    },
    //获取名字和title位置
    getName() {
      this.$api.getSysInfo({ systemType: 2 }).then((res) => {
        if (res.resultCode === 0) {
          this.logoUrl = res.logoUrl
          this.systemName = res.systemName
          document.title = res.systemName
          // this.titlePosition = 3
          if (res.titlePosition) {
            this.titlePosition = res.titlePosition
          }
        }
      })
    },
    //点击菜单
    clickTab(item, index, position) {
      console.log(item)
      if (this.titlePosition == 2) {
        // 左右菜单状态及索引保存到本地存储
        if (this.menuList.length == 4) {
          sessionStorage.setItem(
            'menuLeft',
            JSON.stringify(this.menuList.slice(this.currentIndex, this.currentIndex + 2))
          )
          sessionStorage.setItem(
            'menuRight',
            JSON.stringify(this.menuList.slice(this.currentIndex + 2, this.currentIndex + 4))
          )
        } else {
          sessionStorage.setItem(
            'menuLeft',
            JSON.stringify(this.menuList.slice(this.currentIndex, this.currentIndex + 4))
          )
          sessionStorage.setItem(
            'menuRight',
            JSON.stringify(this.menuList.slice(this.currentIndex + 4, this.currentIndex + 8))
          )
        }
        sessionStorage.setItem('currentMenuIndex', JSON.stringify(this.currentIndex))
        switch (position) {
          case 'left':
            this.activeIndex = index

            break
          case 'right':
            this.activeIndex = index + 4
            break
          default:
            this.activeIndex = position
            break
        }
      }
      // 如果有子节点，默认路由到第一个子节点
      // 判断是否是监控
      let path = item.path
      if (item.menuId == 20210 || item.menuId == 20220 || item.menuId == 20200) {
        let url = item.menuId == 20210 || item.menuId == 20200 ? 'realtime-play' : 'record-replay'
        // let p = path.replace(/\/avs/, '')
        // let pathAll = `/avs${path}`//调试
        this.isCamera = true
        if (window.webkitProc) {
          //客户端环境
          this.$router.push(path)
          window.webkitProc(
            'switch_page_by_url',
            JSON.stringify({
              url: url,
              dialogIdList: [],
            })
          )
        } else {
          //处理路径，适配HostSDK
          let url = item.menuId == 20210 || item.menuId == 20200 ? '/avs/realtime-play' : '/avs/record-replay'
          this.$set(item, 'path', url)
          this.$router.push(url)
        }

        return false
      } else {
        // 如果有子节点
        if (item.children) {
          path = item.children[0].path
        }
      }

      // 调用PC端关闭监控屏
      this.isCamera = false
      if (window.webkitProc) {
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: 'main-window',
            dialogIdList: [],
          })
        )
      }
      // 跳转到路由
      this.$router.push(path)
    },
    // 登出
    logout() {
      microApp.setData('avs_web', { isMenuVisible: true })
      this.$confirm(this.$t('changePwd.sureLogOut'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          microApp.setData('avs_web', { isMenuVisible: false })
          // 清空本地缓存
          try {
            sessionStorage.clear()
            const obj = { notifyType: 0 }
            window.webkitProc('web_notifyClientLogout', JSON.stringify(obj))
          } catch (err) {
            console.log(err)
          }
          this.$router.push({ path: '/login' })
        })
        .catch(() => {
          microApp.setData('avs_web', { isMenuVisible: false })
        })
    },
    // 退出客户端
    debuggerLogout() {
      // 清空本地缓存

      try {
        const obj = { notifyType: 1 }
        window.webkitProc('web_notifyClientLogout', JSON.stringify(obj))
        window.webkitProc('client-close', JSON.stringify({}))
      } catch (e) {
        console.log(e)
      }
    },
    // 切换map/img
    switchChange() {
      // 登录页面回显状态
      localStorage.setItem('showimg', this.showMap)
      // 切换map/img
      this.$store.commit('changeMapImg', this.showMap)
    },
    // 获取字符串字节长度
    getbyteLength(s) {
      let l = 0
      const a = s.split('')
      for (let i = 0; i < a.length; i++) {
        if (a[i].charCodeAt(0) < 299) {
          l++
        } else {
          l += 2
        }
      }
      return l
    },
    // 截取字符串前几个字节
    cutStr(str, L) {
      let result = ''
      const strlen = str.length, // 字符串长度
        // eslint-disable-next-line no-control-regex
        chrlen = str.replace(/[^\x00-\xff]/g, '**').length // 字节长度

      if (chrlen <= L) {
        return str
      }

      for (let i = 0, j = 0; i < strlen; i++) {
        const chr = str.charAt(i)
        // eslint-disable-next-line no-control-regex
        if (/[\x00-\xff]/.test(chr)) {
          j++ // ascii码为0-255，一个字符就是一个字节的长度
        } else {
          j += 2 // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if (j <= L) {
          // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
          result += chr
        } else {
          // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
          return result
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.new {
  font-size: 15px;
  color: #2afeff;
  border-radius: 50%;
  font-weight: 600;
  border: 2px solid #2afeff;
}
.menu-name {
  white-space: nowrap;
  display: block;
  overflow: hidden;
  /*文字超出宽度则显示ellipsis省略号*/
  text-overflow: ellipsis;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 10000;
}
.activeline {
  width: 100%;
  overflow: hidden;
}
.menuItemOne {
  padding: 0 10px;
  box-sizing: border-box;
}
.miniHeader {
  width: 100%;
  height: 80px;
  display: flex;
  color: #ffffff;
  font-size: 30px;
  position: absolute;
  z-index: 1005;
  background: linear-gradient(180deg, #132e47 0%, rgba(0, 130, 72, 0) 100%);
  justify-content: center;
  font-weight: 500;
}
.miniHeader2 {
  // background: #132e47;
  width: 100%;
  height: 80px;
  display: flex;
  color: #ffffff;
  font-size: 30px;
  position: absolute;
  z-index: 1005;
  justify-content: center;
  font-weight: 600;
  background: url('../assets/aiScreen/bg2.png') no-repeat;
  background-size: 100% 100%;
}

@media (max-width: 1600px) {
  .logo {
    height: 65px;
    line-height: 65px;
    position: absolute;
    // left: 43%;
    color: #1efffc;
    font-size: 30px;
    font-weight: bold;
    // left: 50%;
    // margin-left: -131px;
  }
}
@media (max-width: 1500px) {
  .logo {
    font-size: 24px;
  }
}
@media (max-width: 1400px) {
  .logo {
    font-size: 20px;
  }
}
@media (max-width: 1300px) {
  .logo {
    font-size: 20px;
  }
}

ul li {
  list-style: none; /* 去掉元素前的小圆点 */
}

.active {
  height: 40px;
  color: #00d8ff;
  border-bottom: 3px solid #00d8ff;
  font-weight: bold;
}

.active2 {
  height: 40px;
  color: #00d8ff;
  border-bottom: 3px solid #00d8ff;
  font-weight: bold;
}

.menuList {
  color: #ffffff;
  height: 50px;
  line-height: 50px;
  width: 560px;
  position: absolute;
  top: 30px;
  ul {
    display: flex;
    width: 100%;
  }
}

.menuList2 {
  color: #ffffff;
  height: 35px;
  width: 100%;
  position: absolute;
  top: 26px;
}

.menuListleft {
  display: flex;
  left: 100px;
  align-items: center;
}
.menuListleft2 {
  left: 25%;
}

.menuListleft3 {
  left: 15%;
}
.menuListRight {
  right: 170px;
  display: flex;
  align-items: center;
  .menuItemOne {
    text-align: center;
    font-size: 16px;
    width: 25%;
    display: flex;
    position: relative;
  }
}

/*一级菜单样式*/
.menuItemOne {
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  width: 25%;
  display: flex;
  justify-content: center;
  position: relative;
}

.menuItemOne2 {
  float: left;
  // width: 120px;
  height: 30px;
  text-align: center;
  font-size: 16px;
  // cursor: pointer;
  margin-left: 25px;
  width: 100px;
  line-height: 30px;
  display: flex;
  justify-content: center;
  position: relative;
}

ul.menuTwo {
  padding-top: 20px;
  position: absolute;
  width: 120px;
  top: 20px;
  z-index: 9999;
  flex-direction: column;
}

.menuTwo2 {
  padding-top: 20px;
  position: absolute;
  width: 120px;
  top: 20px;
}

/*二级菜单样式*/
.menuItemOne .menuItemTwo {
  color: #ffffff;
  display: none; /* 隐藏二级菜单 */
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: rgba(0, 63, 122, 0.65);
  position: relative;
  font-size: 14px;
  cursor: pointer;
  z-index: 9999;
}

/*二级菜单样式*/
.menuItemOne2 .menuItemTwo2 {
  color: #ffffff;
  display: none; /* 隐藏二级菜单 */
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: rgba(0, 63, 122, 0.65);
  position: relative;
  font-size: 14px;
  cursor: pointer;
  z-index: 9999;
}

.menuItemOne:hover {
  font-weight: bold;
  color: #1efffc;
}

.menuItemOne2:hover {
  font-weight: bold;
  color: #1efffc;
}

.menuItemTwo:hover {
  font-weight: bold;
  color: #1efffc;
}
.menuItemTwo2:hover {
  font-weight: bold;
  color: #1efffc;
}

.menuItemOne:hover .menuItemTwo {
  display: block; /* 二级菜单转化为块级元素,使其独占一行 */
}

.menuItemOne2:hover .menuItemTwo2 {
  display: block; /* 二级菜单转化为块级元素,使其独占一行 */
}

.logout {
  display: flex;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  right: 14px;
  top: 42px;
  cursor: pointer;
  width: 140px;
  .account-name {
    margin-left: 10px;
    width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .headerLogout {
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
    width: 100%;
    .navLogout {
      font-size: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      a {
        font-weight: bold;
        outline: 0;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.5s;
        margin-top: -4px;
      }
      &:hover {
        .down-menu {
          visibility: visible !important;
          max-height: 200px;
          opacity: 1;
        }
      }
      .down-menu {
        color: #fff;
        visibility: hidden;
        padding: 10px 15px;
        border-radius: 3px;
        background-color: #1c4d6c;
        width: 135px;
        position: absolute;
        top: 20px;
        right: 1px;
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        max-height: 0;
        transition: all 0.5s;
        overflow: hidden;
        text-align: left;
        border: 0.5px solid #44cee5;
        &.en-width {
          width: 200px;
        }
        .icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          &.update {
            width: 20px;
            height: 20px;
          }
        }
        span {
          white-space: nowrap;
          cursor: pointer;
          margin: 6px 0;
          transition: all 0.5s linear;
          font-size: 14px;
          display: flex;
          width: 100%;
          align-items: center;
        }
        span:hover {
          color: #1d8dff;
          text-shadow: 1px 0px 1px #333;
          // background: #132e47;
        }
        .showMap {
          p {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
    .navLogout:hover {
      color: #1d8dff;
    }
  }
}

.logout2 {
  display: flex;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  left: 20px;
  top: 35px;
  cursor: pointer;
}

.toIndex {
  display: flex;
  font-size: 14px;
  color: #e6e6e6;
  position: absolute;
  right: 20px;
  top: 27px;
  cursor: pointer;
}
.bgwrapper {
  background: url('../assets/bigScreen/BigIcon/header2.png') no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 68px;
  .bgimgaa {
    position: fixed;
  }
  .systemName {
    text-align: center;
    line-height: 68px;
    font-size: 24px;
    display: flex;
    align-items: center;
    .logoUrl {
      width: 40px;
      height: 38px;
      margin-right: 10px;
      img {
        width: 40px;
        height: 38px;
      }
    }
  }
}
.arrow {
  color: rgba(255, 255, 255, 0.4);
  &.active-arrow {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
