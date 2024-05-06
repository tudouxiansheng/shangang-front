<template>
  <div id="app" v-cloak>
    <router-view />
    <div class="alarm-wrapper-global" v-if="showGlobalMessage">
      <div class="close-icon" @click="handleCloseGlobalMessage">
        <i class="el-icon-close"></i>
      </div>
      <div class="alarm-title">
        <div class="alarm-icon">
          <div class="icon iconfont icon-jinggao" :class="setLevelClass(alarmData.alarmLevel)"></div>
        </div>
        <div class="alarm-type">
          <div class="alarm-name">
            {{ isZh ? alarmData.alarmTypeName : alarmData.alarmType || alarmData.alarmTypeName }}
          </div>
          <div class="alarm-level" :class="setLevelClass(alarmData.alarmLevel)">
            {{ setAlarmLevel(alarmData.alarmLevel) }}
          </div>
        </div>
      </div>
      <div class="alarm-content-wrapper">
        <div class="alarm-img" v-if="!!alarmData.alarmSnapUrl">
          <img v-viewer :src="alarmData.alarmSnapUrl" alt="" />
        </div>
        <div class="alarm-content" @click="handleDetail">
          <div class="item">
            <div class="item-label">{{ $t('application.deviceName') }}</div>
            <div class="item-value" :title="alarmData.alarmDevName">{{ alarmData.alarmDevName }}</div>
          </div>
          <div class="item">
            <div class="item-label">{{ $t('alarm.alarmTime') }}</div>
            <div class="item-value">{{ alarmData.alarmTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <alarmDetail v-if="bigCardVisible" :infoObj="alarmInfo" @closeIcon="handleClose"></alarmDetail>
  </div>
</template>

<script>
import '@/style/common/transBlue.scss'
import { Base64 } from 'js-base64'
import alarmDetail from './pages/alarm/component/alarmDetail'
import websocket from '../../mixin/websocket'
import { permissions } from '../../utils/permissions'
import AudioPlayer, { audioCtx } from '../../utils/audioplayer'
import tokenServer from '../../api/tokenServer'
import microApp from '@micro-zoe/micro-app'
import { getSysPlatType, getProductInfo } from '@/utils/api.js'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    alarmDetail,
  },
  mixins: [websocket],
  data() {
    return {
      bigCardVisible: false,
      isCheckAlarm: false,
      showGlobalMessage: false,
      alarmData: {},
      alarmInfo: {},
      timer: null,
      isPlayVoice: false,
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        if (val != '/login') {
          //qt端不需要连接websocket，qt接受到websocket后发信息通知 ,web需要
          if (sessionStorage.getItem('cuType') != 1 && !this.isConnected) {
            this.initWebSocket()
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  created() {
    window.token_received = false
    if (this.$route.path != '/login') {
      this.getPermissions()
    }
    if (sessionStorage.getItem('cuType') == 1) {
      this.getPlatType()
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  mounted() {
    let router = [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/mini/login'),
        alias: '',
        meta: {
          keepAlive: false,
        },
      },
      {
        path: '*',
        name: 'ERROR404',
        component: () => import('@/views/mini/pages/error/error-404'),
      },
    ]
    this.$router.addRoutes(router)
    window.webkitNotify = this.webkitNotify
  },
  methods: {
    ...mapActions(['set_global_platType', 'set_global_type']),
    webkitNotify(func, message) {
      if (func == 'token_receive') {
        this.token_receive(message)
      } else if (func && func == 'page_jump') {
        let item = JSON.parse(message)
        if (item.optType == 'trail') {
          sessionStorage.setItem('trailItem', JSON.stringify(item))
          this.$EventBus.$emit('setTrailItem', item)
        }
        if (item.optType == 'alarmpage') {
          let _tt = setTimeout(() => {
            clearTimeout(_tt)
            this.$EventBus.$emit('setAlarmParam', item)
          }, 1000)
        }
        if (item.optType == 'toLinkage') {
          this.$EventBus.$emit('setLinkageParam', item)
        }
      } else if (func && func == 'alarm_data') {
        //接收qt推送的告警
        this.$EventBus.$emit('websocketMessage', JSON.parse(message))
      } else {
        let msg = JSON.stringify(message).replace(/\s*/g, '')
        sessionStorage.setItem('version', msg)
        if (location.hash.slice(1) === '/login') {
          return
        }
        console.log(func, message)
        if (func != 'client_appSleep') return
        //退出到登录页
        // 清空本地缓存
        try {
          const obj = { notifyType: 0 }
          window.webkitProc('web_notifyClientLogout', JSON.stringify(obj))
        } catch (err) {
          console.log(err)
        }
        sessionStorage.clear()
        this.$router.push({ path: '/login' })
      }
    },
    token_receive(message) {
      const res = JSON.parse(message)
      if (res.isRefresh == 1) {
        // 刷新token
        sessionStorage.setItem('token', res.token)
        let refreshIsLoading = tokenServer.refreshIsLoading()
        if (refreshIsLoading) {
          window.token_received = true
        }
      }
    },
    //用户权限判断
    async getPermissions() {
      this.isCheckAlarm = await permissions(151) //查看权限
      return this.isCheckAlarm
    },
    handleWebSocketMessage(data) {
      // this.$route.path !== '/avs/realtime-play' &&
      // this.$route.path !== '/avs/record-replay'
      if (this.$route.path !== '/login') {
        if (
          localStorage.getItem('showimg') === 'false' ||
          localStorage.getItem('showimg') == null ||
          sessionStorage.getItem('mapType') == 3
        ) {
          if (data.type == 'alarm') {
            clearTimeout(this.timer)
            let alarmData = JSON.parse(Base64.decode(data.content))
            console.log(alarmData)
            this.alarmData = alarmData
            if (sessionStorage.getItem('cuType') == 1) {
              // window.webkitProc('web_AlarmInfo', Base64.decode(data.content))
            } else {
              this.showGlobalMessage = true
              if (alarmData.systemVoiceUrl) {
                // console.log(audioCtx);
                if (!this.isPlayVoice) {
                  this.isPlayVoice = true
                  AudioPlayer.getBuffer(alarmData.systemVoiceUrl).then((buffer) => {
                    const source = audioCtx.createBufferSource()
                    source.buffer = buffer
                    source.connect(audioCtx.destination)
                    // source.connect(analyser);
                    // analyser.connect(gainNode);
                    // gainNode.connect(audioCtx.destination);
                    source.start()
                    source.onended = () => {
                      this.isPlayVoice = false
                    }
                  })
                }
              }
              let alarmTime = sessionStorage.getItem('alarmTime')
              this.timer = setTimeout(() => {
                this.showGlobalMessage = false
              }, alarmTime * 1000)
            }
          }
        } else if (this.$route.path !== '/homepage') {
          if (data.type == 'alarm') {
            clearTimeout(this.timer)
            let alarmData = JSON.parse(Base64.decode(data.content))
            console.log(alarmData)
            this.alarmData = alarmData
            if (sessionStorage.getItem('cuType') == 1) {
              // window.webkitProc('web_AlarmInfo', Base64.decode(data.content))
            } else {
              this.showGlobalMessage = true
              if (alarmData.systemVoiceUrl) {
                // console.log(audioCtx);
                if (!this.isPlayVoice) {
                  this.isPlayVoice = true
                  AudioPlayer.getBuffer(alarmData.systemVoiceUrl).then((buffer) => {
                    const source = audioCtx.createBufferSource()
                    source.buffer = buffer
                    source.connect(audioCtx.destination)
                    // source.connect(analyser);
                    // analyser.connect(gainNode);
                    // gainNode.connect(audioCtx.destination);
                    source.start()
                    source.onended = () => {
                      this.isPlayVoice = false
                    }
                  })
                }
              }
              let alarmTime = sessionStorage.getItem('alarmTime')
              this.timer = setTimeout(() => {
                this.showGlobalMessage = false
              }, alarmTime * 1000)
            }
          }
        }
      }
    },
    async handleDetail() {
      this.isCheckAlarm = await this.getPermissions()
      console.log(this.isCheckAlarm)
      if (!this.isCheckAlarm) {
        this.$alert(`${this.$t('public.noAuth')}`, `${this.$t('public.prompt')}`, {
          confirmButtonText: `${this.$t('public.confirm')}`,
          type: 'warning',
        })
        return
      }
      this.showGlobalMessage = false
      if (this.$route.path !== '/alarmpage') {
        // 根据cutype 区分路由跳转或者发送指令qt跳转
        if (sessionStorage.getItem('cuType') == 1) {
          window.webkitProc(
            'switch_page_by_url',
            JSON.stringify({
              url: '/alarmpage',
              menuName: this.isZh ? '告警信息' : 'Alarm information',
            })
          )
          // qt
        } else {
          this.$router.push('/alarmpage')
        }
      } else {
        this.$EventBus.$emit('update')
      }

      // getGuardHitInfo({ alarmId: this.alarmData.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //     if (res.guardHitInfo && Object.keys(res.guardHitInfo).length) {
      //       this.alarmInfo = { ...this.alarmData, ...res.guardHitInfo, alarmId: this.alarmData.alarmId }
      //       this.bigCardVisible = true
      //       this.showGlobalMessage = false
      //     } else {
      //       this.$message.warning(this.$t('public.empty'))
      //     }
      //     // console.log(item)
      //   }
      // })
    },
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
    },
    setAlarmLevel(val) {
      switch (val) {
        case 1:
          return this.$t('home.level1')
        case 2:
          return this.$t('home.level2')
        case 3:
          return this.$t('home.level3')
        case 4:
          return this.$t('home.level4')
      }
    },
    handleCloseGlobalMessage() {
      this.showGlobalMessage = false
    },
    handleClose() {
      this.bigCardVisible = false
      this.alarmInfo = {}
    },
    // 获取平台
    async getPlatType() {
      // 获取对接的是1800还是3800
      let res = await getSysPlatType({})
      if (res && res.resultCode == 0) {
        // 设为全局平台值
        if (typeof res.accessPlat !== 'undefined') this.set_global_platType(res.accessPlat)
      }
      // 获取产品类型是AIS盒子还是spc系列
      let proInfo = await getProductInfo({})
      if (proInfo && proInfo.resultCode == 0) {
        // 设为全局盒子类型值
        // 0 : AIS200 1： AVS500, 2: SPC系列
        if (typeof proInfo.productType !== 'undefined') {
          this.set_global_type(proInfo.productType)
        } else this.$message('获取产品类型数据失败')
      } else this.$message('获取产品类型数据失败')
    },
  },
}
</script>

<style lang="scss">
* {
  font-family: Microsoft YaHei;
}
.level1 {
  color: #ff4d4f;
}
.level2 {
  color: #ff4e00;
}
.level3 {
  color: #ffa900;
}
.level4 {
  color: #00ccff;
}
#app .alarm-wrapper-global {
  position: absolute;
  top: 80px;
  right: 20px;
  width: 350px;
  height: auto;
  max-height: 180px;
  font-size: 14px;
  z-index: 99999;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 6px;
  background-color: #204b74;
  color: #fff;
  .close-icon {
    position: absolute;
    top: 6px;
    right: 10px;
    cursor: pointer;
  }
  .alarm-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    overflow: hidden;
    .alarm-icon {
      width: 16px;
      height: 14px;
      .icon {
        background-color: transparent;
        font-size: 14px;
      }
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .alarm-type {
      flex: 1;
      margin-left: 10px;
      overflow: hidden;
      padding-right: 40px;
      box-sizing: border-box;
      display: flex;
      .alarm-name {
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
        padding-right: 20px;
        box-sizing: border-box;
        overflow: hidden;
      }
      .alarm-level {
        white-space: nowrap;
        padding: 0 3px;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 2px;
        &.level1 {
          color: #ff4d4f;
          background: rgba(255, 77, 79, 0.2);
        }
        &.level2 {
          color: #ff4e00;
          background: rgba(255, 78, 0, 0.2);
        }
        &.level3 {
          color: #ffa900;
          background: rgba(255, 169, 0, 0.2);
        }
        &.level4 {
          color: #00ccff;
          background: rgba(0, 204, 255, 0.2);
        }
      }
    }
  }
  .alarm-content-wrapper {
    display: flex;
    overflow: hidden;
    padding-bottom: 20px;
  }
  .alarm-img {
    width: 80px;
    height: 60px;
    margin-right: 10px;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .alarm-content {
    flex: 1;
    overflow: hidden;
    cursor: pointer;
    .item {
      display: flex;
      margin-bottom: 10px;
      .item-label {
        margin-right: 5px;
        white-space: nowrap;
      }
      .item-value {
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
    }
  }
}
.el_bgc div {
  background-color: #052a3f !important;
}

.el_bgc div span {
  color: rgba(255, 255, 255, 0.3) !important;
}

#app {
  // font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1200px;
  overflow-y: hidden;
  user-select: none;
  position: relative;
}

#app > div {
  width: 100%;
  height: 100%;
}

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
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0;
  padding: 0;
  // background: url("../../assets/homeImg/bg.png") no-repeat;
  overflow-y: hidden;
  overflow-x: hidden;
}

body {
  width: 100vw;
  height: 100%;
  // background: url("../../assets/homeImg/bg.png") no-repeat;
  background-size: cover;
  font-size: 12px;
}

#app {
  // background: url("../../assets/homeImg/bg.png") no-repeat;
  background-size: cover;
  height: 100%;
}

.pulse-icon {
  display: inline-block;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  // background-color: red;
  position: relative;
  // box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.75);
  background-image: url('../../assets/mapIcon/red-camera.png');
  background-repeat: no-repeat;
  background-position: -12px;
}

.pulse-icon:after {
  content: '';
  box-shadow: 0 0 6px 2px red;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  animation-delay: 1.1s;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  height: 300%;
  width: 300%;
  animation: pulsate 2s infinite;
  position: absolute;
  margin: -100% 0 0 -100%;
}

.pulse-icon-green {
  display: inline-block;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  // background-color: red;
  position: relative;
  // box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.75);
  background-image: url('../../assets/mapIcon/green-camera.png');
  background-repeat: no-repeat;
  background-position: -12px;
}

.pulse-icon-green:after {
  content: '';
  box-shadow: 0 0 6px 2px red;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  animation-delay: 1.1s;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  height: 300%;
  width: 300%;
  animation: pulsate 2s infinite;
  position: absolute;
  margin: -100% 0 0 -100%;
}

@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: alpha(opacity=0);
  }

  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }

  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: alpha(opacity=0);
  }
}

.my-div-icon {
  position: absolute;
  top: 0;
  left: 0;
}

.bigemap-popup-content {
  width: 257px;
  // background-color: rgba(20,47,72,.65);
  background: #142f48;
  opacity: 0.65;
  padding: 0 !important;
}

// .bigemap-popup-content-wrapper, .map-legends, .map-tooltip{
//   background-color: rgba(20,47,72,.65);
//}
.cesium-viewer-toolbar {
  display: none;
}

.compass {
  display: none;
}

.navigation-controls {
  display: none;
}

.el-picker-panel__icon-btn {
  color: #f8f8f8 !important;
}
</style>
