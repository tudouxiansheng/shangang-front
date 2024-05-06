<template>
  <div
    id="noNeedMap"
    class="noNeedMap"
    :style="{
      backgroundImage: `url(${componentProp})`,
      '--x': bgx + 'px',
      '--y': bgy + 'px',
      '--scale': scale,
    }"
  >
    <!-- 轨迹线 -->
    <div v-if="fullPath === '/trail'" class="routeLine" :style="{ backgroundImage: `url(${lineBase64})` }"></div>

    <!-- 后台取点与前台展现点位些许差异为切图问题 -->
    <img
      :src="setIconImage(item)"
      class="single_1"
      :style="{
        '--x': setIconPos(item, 'x') + 'px',
        '--y': setIconPos(item, 'y') + 'px',
        '--scale': 1 / scale,
      }"
      v-for="(item, index) of scsDeviceInfoList"
      :key="index"
      @click="iconClick(item)"
    />

    <!-- details -->
    <div
      class="detailsPopup"
      v-show="popupVisible"
      :style="{
        '--x': curDevice.left + 'px',
        '--y': curDevice.top + 'px',
        '--scale': 1 / scale,
      }"
    >
      <div class="title">
        <span>设备详情</span>
        <i class="el-icon-close" @click="detailsPopupClose"></i>
      </div>
      <div class="infoItem">
        <span>设备名称：</span>
        <p :title="curDevice.deviceName">{{ curDevice.deviceName }}</p>
      </div>
      <div class="infoItem line">
        <span>设备位置：</span>
        <p>未知</p>
      </div>
      <div class="infoItem line">
        <span>设备状态：</span>
        <p :class="curDevice.status == 1 ? 'online' : 'offline'">{{ curDevice.status == 1 ? '在线' : '离线' }}</p>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="playLive">实时视频</el-button>
        <el-button type="primary" size="small" @click="playRecord">录像回放</el-button>
      </div>
    </div>

    <!-- alarm -->
    <div
      class="alarmPopup"
      v-show="alarmVisible"
      :style="{
        '--x': alarmDevice.left + 'px',
        '--y': alarmDevice.top + 'px',
        '--scale': 1 / scale,
      }"
    >
      <div class="title">
        <span>告警详情</span>
        <i class="el-icon-close" @click="alarmPopupClose(false)"></i>
      </div>
      <div class="info">
        <div class="left">
          <img :src="alarmDevice.alarmSnapUrl" alt="" v-viewer />
          <p>
            <el-button type="text" @click="toAlarmLinkPage">查看详情</el-button>
          </p>
        </div>
        <div class="right">
          <div class="infoItem">
            <span>告警类型：</span>
            <p>{{ alarmDevice.alarmTypeName }}</p>
          </div>
          <div class="infoItem line">
            <span>告警设备：</span>
            <p :title="alarmDevice.alarmDevName">{{ alarmDevice.alarmDevName }}</p>
          </div>
          <div class="infoItem line">
            <span>告警位置：</span>
            <p>未知</p>
          </div>
          <div class="infoItem line">
            <span>告警时间：</span>
            <p>{{ alarmDevice.alarmTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlarmCamera, getIotDevList } from '@/utils/api'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
import Drag from '@/mixin/drag'

export default {
  props: ['componentProp'],
  mixins: [VideoScreen, Drag],
  data() {
    return {
      scsDeviceInfoList: [],
      imgUrl: {
        cameraOn: require('../assets/gis/camera.png'),
        cameraOff: require('../assets/gis/camera-offline.png'),
        cameraAlarm: require('../assets/gis/camera-alarm.png'),
        doorOn: require('../assets/gis/door-online.png'),
        doorOff: require('../assets/gis/door-offline.png'),
        doorAlarm: require('../assets/gis/door-alarm.png'),
        gateOn: require('../assets/gis/gate-online.png'),
        gateOff: require('../assets/gis/gate-offline.png'),
        gateAlarm: require('../assets/gis/gate-alarm.png'),
        car: require(`../../public/static/images/track-car.png`),
        person: require(`../../public/static/images/track-staff.png`),
      },
      bgWidth: 1920,
      bgHeight: 1080,

      popupVisible: false,
      curDevice: {},

      alarmVisible: false,
      alarmDevice: {},
      alarmData: {},

      lineBase64: '', //轨迹线
      trackType: 1,
    }
  },
  computed: {
    fullPath() {
      return this.$route.path
    },
    iw() {
      return window.innerWidth
    },
    ih() {
      return window.innerHeight
    },
    iconW() {
      // 摄像机icon img宽度
      return 40
    },
    iconH() {
      // 摄像机icon img高度
      return 50
    },
    popupW() {
      // 详情弹框 宽度
      return 300
    },
    popupH() {
      // 详情弹框 高度
      return 200
    },
    alarmW() {
      // 告警弹框 宽度
      return 340
    },
    alarmH() {
      // 告警弹框 高度
      return 200
    },
  },
  watch: {
    '$route.path': async function (newVal, oldVal) {
      this.scsDeviceInfoList = []
      this.lineBase64 = ''
      this.alarmPopupClose(false)
      this.detailsPopupClose()

      if (newVal === '/homepage') {
        const res = await this.getBgImgWH()
        if (res.type === 'load') {
          this.bgWidth = res.width
          this.bgHeight = res.height
          this.getDeviceData()
        }
      }
      if (newVal === '/trail') {
        const res = await this.getBgImgWH()
        if (res.type === 'load') {
          this.bgWidth = res.width
          this.bgHeight = res.height
        }
      }
      if (newVal === '/alarmpage') {
        console.log('告警')
      }
      if (newVal == '/eneragepage') {
        console.log('物联应用图标渲染')
      }
    },
  },

  async mounted() {
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$on('closeAlarmPopup', this.alarmPopupClose)
    this.$EventBus.$on('drawLine', this.drawLineWithArrow)

    if (this.fullPath == '/homepage') {
      const res = await this.getBgImgWH()
      if (res.type === 'load') {
        this.bgWidth = res.width
        this.bgHeight = res.height
        this.getDeviceData()
      }
    } else if (this.fullPath == '/trail') {
      const res = await this.getBgImgWH()
      if (res.type === 'load') {
        this.bgWidth = res.width
        this.bgHeight = res.height
      }
    }
  },
  methods: {
    async getDeviceData() {
      const params = { deviceType: 1, mapType: 2 }
      const res = await getAlarmCamera(params)
      if (res.resultCode != 0) return
      this.scsDeviceInfoList = res.resultList.filter((item) => {
        item.deviceType = 1
        item.isAlarm = false
        return item.xeightyAxis && item.yeightyAxis
      })

      const res2 = await getIotDevList({})
      if (res2.resultCode != 0) return
      res2.deviceList = res2.deviceList.filter((d) => d.xEightyAxis && d.yEightyAxis)

      this.scsDeviceInfoList = this.scsDeviceInfoList.concat(
        res2.deviceList.map((d) => {
          return {
            xeightyAxis: d.xEightyAxis,
            yeightyAxis: d.yEightyAxis,
            deviceId: d.deviceId,
            deviceName: d.name,
            status: d.connect, //在离线
            subStatus: d.status, //设备开关
            deviceType: d.module == 1 ? 2 : 3, //门禁或者道闸
            platType: d.platType,
            platId: d.platId,
            productId: d.productId,
            isAlarm: false,
          }
        })
      )

      console.log(this.scsDeviceInfoList)
      //   this.drawLineWithArrow(this.scsDeviceInfoList)
    },
    getBgImgWH() {
      const img = new Image()
      img.setAttribute('crossorigin', 'anonymous')
      img.src = this.componentProp

      return new Promise((resolve, reject) => {
        img.onload = function (e) {
          resolve({ type: 'load', width: this.width, height: this.height })
        }
        img.onerror = function (e) {
          resolve({ type: 'error' })
        }
      })
    },
    setIconImage(obj) {
      if (this.fullPath === '/homepage') {
        if (obj.deviceType == 1) {
          if (obj.isAlarm) {
            return this.imgUrl.cameraAlarm
          }
          if (obj.status == 1) {
            return this.imgUrl.cameraOn
          } else {
            return this.imgUrl.cameraOff
          }
        }
        if (obj.deviceType == 2) {
          if (obj.isAlarm) {
            return this.imgUrl.doorAlarm
          }
          if (obj.status == 1) {
            return this.imgUrl.doorOn
          } else {
            return this.imgUrl.doorOff
          }
        }
        // 中控的道闸没有在离线状态
        if (obj.deviceType == 3) {
          if (obj.isAlarm) {
            return this.imgUrl.gateAlarm
          }
          if (obj.status == 1 || obj.platType == 63) {
            return this.imgUrl.gateOn
          } else {
            return this.imgUrl.gateOff
          }
        }
      }
      // 轨迹
      if (this.fullPath === '/trail') {
        if (this.trackType === 1) {
          return this.imgUrl.car
        } else {
          return this.imgUrl.person
        }
      }
    },
    getDevicePos(val, type) {
      if (type === 'x') {
        return (val.xeightyAxis / this.bgWidth) * this.iw
      } else if (type === 'y') {
        return (val.yeightyAxis / this.bgHeight) * this.ih
      }
    },
    setIconPos(val, type) {
      if (type === 'x') {
        return this.getDevicePos(val, type) - this.iconW / 2
      } else if (type === 'y') {
        return this.getDevicePos(val, type) - this.iconH
      }
    },

    iconClick(val) {
      if (val.isAlarm) {
        // 告警
        this.detailsPopupClose()
        this.setAlarmPos(val)
        this.alarmVisible = true
      } else if (val?.isTrack) {
        // 轨迹
        this.$EventBus.$emit('trackInfo', val)
      } else {
        // 详情
        this.alarmVisible = false
        this.setDetailsPos(val)
        this.popupVisible = true
      }
    },
    setDetailsPos(val) {
      this.curDevice = {
        ...val,
        left: this.getDevicePos(val, 'x') - this.popupW / 2,
        top: this.getDevicePos(val, 'y') - this.popupH - this.iconH / this.scale,
      }
    },
    detailsPopupClose() {
      this.popupVisible = false
      this.curDevice = {}
    },
    playLive() {
      const { deviceId, deviceName } = this.curDevice
      this.goToLive({ deviceId, deviceName })
    },
    playRecord() {
      const { deviceId, deviceName } = this.curDevice
      this.goToVideo({ deviceId, deviceName })
    },

    setAlarmPos(val) {
      this.alarmDevice = {
        ...this.alarmData,
        left: this.getDevicePos(val, 'x') - this.alarmW / 2,
        top: this.getDevicePos(val, 'y') - this.alarmH - this.iconH / this.scale,
      }
    },
    /**
     * type:true-处理后回调，false-告警小弹框关闭
     */
    alarmPopupClose(val = false) {
      this.alarmVisible = false
      this.alarmDevice = {}

      if (!val) return
      if (val?.id != this.alarmData.alarmId) return

      this.alarmData = {}
      const cur = this.scsDeviceInfoList.filter((v) => v.isAlarm)
      cur[0].isAlarm = false
    },
    toAlarmLinkPage() {
      this.$EventBus.$emit('linkage', this.alarmData)
    },

    /**
     * type 人-0 车-1
     * data 轨迹数据
     */
    drawLineWithArrow(type, data) {
      this.trackType = type
      // 格式化数据
      data.forEach((v) => {
        v.xeightyAxis = v.latitude
        v.yeightyAxis = v.longitude
        v.isTrack = true
      })
      // 加载轨迹点位
      this.scsDeviceInfoList = data

      const arr = new Array(data.length - 1)
      for (let i = 0; i < data.length; i++) {
        if (data[i + 1]) {
          arr[i] = {
            fx: this.getDevicePos(data[i], 'x'),
            fy: this.getDevicePos(data[i], 'y'),
            tx: this.getDevicePos(data[i + 1], 'x'),
            ty: this.getDevicePos(data[i + 1], 'y'),
          }
        }
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = this.iw
      canvas.height = this.ih
      canvas.getContext('2d')

      arr.forEach((v) => this.draw(ctx, v.fx, v.fy, v.tx, v.ty, 20, 20))

      ctx.strokeStyle = '#00F8FF'
      ctx.lineWidth = 3
      ctx.stroke()

      this.lineBase64 = canvas.toDataURL('image/png')
    },
    /**
     * theta 箭头与线段的夹角
     * l     箭头长度
     */
    draw(ctx, fromX, fromY, toX, toY, theta = 20, l = 20) {
      // line
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      // arrow
      const { p1x, p1y, p2x, p2y } = this.getArrowPoint(fromX, fromY, toX, toY, theta, l)
      ctx.moveTo(p1x, p1y)
      ctx.lineTo(toX, toY)
      ctx.lineTo(p2x, p2y)
    },
    getArrowPoint(fromX, fromY, toX, toY, theta = 30, l = 20) {
      const a = Math.atan2(toY - fromY, toX - fromX)

      const p1x = toX - l * Math.cos(a + (theta * Math.PI) / 180)
      const p1y = toY - l * Math.sin(a + (theta * Math.PI) / 180)

      const p2x = toX - l * Math.cos(a - (theta * Math.PI) / 180)
      const p2y = toY - l * Math.sin(a - (theta * Math.PI) / 180)

      return { p1x, p1y, p2x, p2y }
    },

    //webSocket
    handleWebSocketMessage(data) {
      if (this.$route.path != '/homepage') return
      if (data.type != 'alarm') return

      const alarmData = JSON.parse(Base64.decode(data.content))
      console.log(alarmData)

      // 告警未处理且两次告警为同一个设备
      // if (this.isAlarm && alarmData.deviceId != this.alarmData.deviceId) return

      if (alarmData.showStatus == 0) return

      const cur = this.scsDeviceInfoList.filter((v) => v.deviceId === alarmData.deviceId)
      if (cur.length < 1) return

      this.alarmData = alarmData
      this.$store.commit('alarmItem', alarmData)

      this.scsDeviceInfoList.forEach((v) => (v.isAlarm = false))
      cur[0].isAlarm = true
      this.iconClick(cur[0])
    },
  },
}
</script>

<style lang="scss" scoped>
.noNeedMap {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  background-position: 0 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //   overflow: hidden;
  .routeLine {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .single_1 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 40px;
    height: 50px;
    object-fit: contain;
    transform-origin: bottom center;
    transform: translate(var(--x), var(--y)) scale(var(--scale));
    // border: 1px solid #f00;
  }
  .detailsPopup {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 200px;
    padding: 10px 20px 20px;
    transform-origin: bottom center;
    transform: translate(var(--x), var(--y)) scale(var(--scale));
    color: #fff;
    background-image: url('~@/assets/bigScreen/wrapper.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    .title {
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      > span {
        color: #0cd8fa;
      }
      > i {
        cursor: pointer;
      }
    }

    .infoItem {
      position: relative;
      padding: 8px 0;
      display: flex;
      align-items: center;
      font-size: 14px;
      > span {
        flex-shrink: 0;
        width: 72px;
      }
      > p {
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .line {
      border: 1px solid;
      border-color: #458acf transparent transparent transparent;
    }
    .online {
      color: #67c23a;
    }
    .offline {
      color: #ff6b6b;
    }
    .btns {
      padding-top: 8px;
      text-align: center;
    }
  }
  .alarmPopup {
    position: absolute;
    top: 0;
    left: 0;
    width: 340px;
    height: 200px;
    padding: 10px 20px 20px;
    transform-origin: bottom center;
    transform: translate(var(--x), var(--y)) scale(var(--scale));
    color: #fff;
    background-image: url('~@/assets/bigScreen/wrapper.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    .title {
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      > span {
        color: #0cd8fa;
      }
      > i {
        cursor: pointer;
      }
    }
    .info {
      display: flex;
      width: 100%;
      height: calc(100% - 20px);
      .left {
        width: 40%;
        padding-top: 10px;
        > img {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }
        > p {
          margin: 0;
          padding-top: 12px;
        }
      }
      .right {
        flex: 1;
        .infoItem {
          position: relative;
          padding: 8px 0;
          display: flex;
          align-items: center;
          font-size: 14px;
          > span {
            flex-shrink: 0;
            width: 72px;
          }
          > p {
            margin: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
