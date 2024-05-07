<template>
  <div class="main-wrapper">
    <Header v-if="cuType != 1"></Header>
    <!-- map -->
    <template v-if="isShowMap">
      <component
        :is="activeItem"
        :componentProp="mapBg"
        :mapIp="mapIp"
        :mapState="mapState"
        :latitude="latitude"
        :longitude="longitude"
        :altitude="altitude"
        :roll="roll"
        :heading="heading"
        :pitch="pitch"
        :offlineMapId="offlineMapId"
        :focus="focus"
        :alarmTime="alarmTime"
        style="height: 100%"
      />
      <!-- 页面 -->
      <router-view />
    </template>
    <div class="no-map-wrapper" :class="[cuType == 1 ? 'full' : '']" v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from './Header'
import MapPage from './Map'
import { mapConfigInfo, getWatermaskConfig } from '@/utils/api'
import Watermask from '@/utils/watermask'
export default {
  components: {
    Header,
    MapPage,
    threeDmap: () => import('./Map'), //3d在线
    secondDmap: () => import('./aMap'), //2d在线地图
    // noNeedMap: () => import('./noNeedMap'), //不需要地图-原基线
    // noNeedMap: () => import('./noNeedMap_2'), //不需要地图-轨迹
    noNeedMap: () => import('./noNeedMap_4'), //不需要地图-轨迹-放大-缩小-拖曳-聚合
    twoPointDmap: () => import('./twoPointDmap.vue'), //2.5D地图
  },
  data() {
    return {
      showComponent: [],
      mapConfigInfo: {},
      // mapFlag: 0, //0需要地图 1不需要地图 //用于2d卫星影像
      mapState: 0, // 0是在线 1是离线
      mapType: 1, //1 3D地图 0是2D地图
      activeItem: '', //组件
      mapBg: '', //背景图
      mapIp: '', //地图IP
      latitude: '', //纬度
      longitude: '', //经度
      pitch: '', //偏向角（倾斜角度）
      roll: '', //滚转角（模型高度）
      altitude: '', //高度（z值）
      heading: '', //偏航角(方向)
      offlineMapId: '', //离线地图ID
      focus: null, //是否开启模型视角
      isAlarm: true,
      alarmTime: 30,
      cuType: sessionStorage.getItem('cuType'),
      watermask: new Watermask(),
    }
  },
  created() {
    this.getMapInfo()
    this.handleGetAlarmPropertyInfo()
    // 客户端使用自己的水印
    if (sessionStorage.getItem('cuType') != 1) this.maskOnPage()
  },
  computed: {
    isShowMap() {
      let noShowMap = [
        '/carpage',
        '/personpage',
        '/requirepage',
        '/patrol/history',
        '/guard',
        '/alarm/info',
        '/alarm/statistics',
        '/visitor',
        '/alarmpage',
        '/orderApproval',
        '/realtime-play',
        '/record-playback',
        '/record-replay',
        '/avs/live-browse',
        '/avs/record-play',
        '/avs/realtime-play',
        '/avs/record-playback',
        '/avs/record-replay',
        '/download-center',
        '/tvwall-setting',
        '/tvwall-play',
        '/carpass',
        '/facepass',
        '/traffic-statistics',
        '/myTask',
        '/gatewayCluster/manage',
        '/accessPlatform/manage',
        '/vPaasAccessPlatform/manage',
        '/accessCamera/allocate'
      ]
      return noShowMap.indexOf(this.$route.path) == -1
    },
  },
  methods: {
    //获取告警配置信息
    async handleGetAlarmPropertyInfo() {
      let res = await this.$api.alarmPropertyInfo()
      if (res.resultCode == 0) {
        let alarmShowProperty = res.systemConfigInfo.alarmShowProperty
          ? res.systemConfigInfo.alarmShowProperty
          : {
              autoShow: 1,
              time: 30,
              recordTime: 30,
            }
        this.isAlarm = alarmShowProperty.autoShow == 1 ? true : false
        this.alarmTime = alarmShowProperty.time
        sessionStorage.setItem('recordTime', alarmShowProperty.recordTime ? alarmShowProperty.recordTime : 30)
        sessionStorage.setItem('alarmTime', this.alarmTime ? this.alarmTime : 30)
      }
    },
    //从接口获取地图参数
    async getMapInfo() {
      let res = await mapConfigInfo({})
      if (res.resultCode == 0) {
        this.mapConfigInfo = res.mapConfigInfo
        // this.mapFlag = this.mapConfigInfo.mapFlag
        this.mapState = this.mapConfigInfo.mapState
        this.mapType = this.mapConfigInfo.mapType
        this.mapIp = this.mapConfigInfo.ip
        // this.mapIp = 'http://121.37.136.149:10000'
        if (this.mapConfigInfo.isMapping == 1) {
          this.mapIp = location.origin
        }
        // 设置为卫星地图
        if (this.mapConfigInfo.mapFlag == 1) {
          this.$store.commit('mapSet/set_layerType', [2])
        }
        if (this.mapType == 3) {
          // 图片 不需要地图
          this.activeItem = 'noNeedMap'
          this.mapBg = this.mapConfigInfo.mapBgUrl
        } else {
          //需要地图
          this.mapBg = ''
          //在线地图
          if (this.mapConfigInfo.mapType == 1) {
            this.activeItem = 'threeDmap'
          } else if (this.mapConfigInfo.mapType == 2) {
            this.activeItem = 'twoPointDmap'
          } else {
            this.activeItem = 'secondDmap'
          }
        }
        sessionStorage.setItem('mapState', this.mapConfigInfo.mapState)
        sessionStorage.setItem('mapType', this.mapConfigInfo.mapType)
        this.$store.commit('mapState', this.mapConfigInfo.mapState)
        this.$store.commit('mapType', this.mapConfigInfo.mapType)

        this.longitude = this.mapConfigInfo.longitude || 116.39698170516397
        this.latitude = this.mapConfigInfo.latitude || 39.91768997666212
        if (this.mapConfigInfo.altitude) {
          //高度
          this.altitude = this.mapConfigInfo.altitude
        }
        if (this.mapConfigInfo.pitch) {
          //俯仰角
          this.pitch = this.mapConfigInfo.pitch
        }
        if (this.mapConfigInfo.roll) {
          //滚转角
          this.roll = this.mapConfigInfo.roll
        }
        if (this.mapConfigInfo.heading) {
          //偏航角
          this.heading = this.mapConfigInfo.heading
        }
        if (this.mapConfigInfo.offlineMapId) {
          //离线地图ID
          this.offlineMapId = this.mapConfigInfo.offlineMapId
        }
        if (this.mapConfigInfo.focus) {
          //开启模型视角
          this.focus = this.mapConfigInfo.focus
        }
        console.log(this.activeItem)
      }
    },
    maskOnPage() {
      getWatermaskConfig({ systemType: 1 }).then((res) => {
        if (res.resultCode == 0) {
          let info = res.watermarkInfoList?.[0]
          if (info && info.status == 1) {
            let data = {
              content: '', //水印文字内容
              color: '#000000', // 水印文字颜色
              alpha: info.clarityLevel, //水印文字透明度
              size: info.size, //水印文字大小
              position: info.position, //位置
            }
            if (sessionStorage.getItem('userId') == '00000000000000000201000000000000') {
              data.content = sessionStorage.getItem('username')
            } else {
              if (info.watermarkType == 1) {
                data.content = [sessionStorage.getItem('organizationName'), sessionStorage.getItem('username')]
              } else if (info.watermarkType == 2) {
                let account = sessionStorage.getItem('account')
                data.content = [sessionStorage.getItem('username'), account.slice(0, 3) + '****' + account.substring(7)]
              }
            }
            if (info.watermarkType == 0) {
              data.content = info.content
            }
            this.watermask.create(document.body, data)
          }
        }
      })
    },
  },
  beforeDestroy() {
    this.watermask.removeWaterMask(document.body)
  },
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  background:#051b2c;
  background-size: 100% 100%;
  box-sizing: border-box;
  overflow: hidden;
  .no-map-wrapper {
    width: 100%;
    height: calc(100% - 80px);
    position: absolute;
    top: 80px;
    &.full {
      height: 100%;
      position: absolute;
      top: 0px;
    }
  }
}
::-webkit-scrollbar-track {
  background-color: #1e2c45 !important;
}
::-webkit-scrollbar-thumb {
  background-color: #2e4c90 !important;
  border-radius: 3px;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
</style>
