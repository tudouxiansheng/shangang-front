<template>
  <div id="boxs">
    <div v-if="showimg" id="map"></div>
    <img v-else src="../assets/bigScreen/1.jpg" alt style="width: 100%; height: 100%" />
    <alarmDetail
      v-if="(Object.keys(alarmData).length !== 0 && bigCardVisiable) || showTab == 1"
      :infoObj="alarmData"
      @closeIcon="closeIconMethod"
    ></alarmDetail>
    <alarmSmallCard
      ref="alarmSmallCard"
      @closeCard="closeCard"
      @mouse="handleClearTimer"
      v-show="cardVisiable"
      :alarmData="alarmData"
    ></alarmSmallCard>
    <event-detail v-if="showTab == 2"></event-detail>
    <closeLoop v-if="showTab == 3"></closeLoop>
  </div>
</template>

<script>
import maps from '@/utils/secondMapConfig'
import alarmDetail from '../../src/views/mini/pages/minivisionAlarm/components/alarmDetail.vue'
import alarmSmallCard from './alarmSmallCard/alarmSmallCard.vue'
import eventDetail from '../../src/views/mini/pages/minivisionAlarm/components/eventDetail.vue'
import closeLoop from '../../src/views/mini/pages/minivisionAlarm/components/closeLoop.vue'
import { Base64 } from 'js-base64'
import { AllcamMap, Cartesian3_to_WGS84 } from '../utils/map/AllcamMap'
import { getLoginUserInfo } from '@/utils/api'
let BM
let map

export default {
  props: ['mapIp', 'latitude', 'longitude', 'offlineMapId', 'isAlarm', 'alarmTime'],
  components: {
    alarmDetail,
    alarmSmallCard,
    eventDetail,
    closeLoop,
  },
  data() {
    return {
      map: '',
      marker: [],
      alarmData: {},
      cardVisiable: false,
      bigCardVisiable: false,
      showTab: 0,
      alarmTimer: null,
      border: null,
      showimg: JSON.parse(localStorage.getItem('showimg')), //true-map,false-img
    }
  },
  mounted() {
    if (this.showimg) {
      this.initMap()
      this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
  },
  methods: {
    initMap() {
      maps.then(() => {
        BM = window.BM
        // BM.Config.HTTP_URL = 'http://' + this.mapIp + ':3000' //http://124.71.174.84:3000
        BM.Config.HTTP_URL = 'http://124.71.174.84:3000'
        // 在ID为map的元素中实例化一个地图，并设置地图的ID号为 bigemap.googlemap-streets，ID号程序自动生成，无需手动配置，并设置地图的投影为百度地图 ，中心点，默认的级别和显示级别控件
        if (this.offlineMapId) {
          map = BM.map('map', this.offlineMapId, {
            center: [this.latitude, this.longitude], //[33.04483,111.84926] [30.620267395060758, 104.01446700096132]
            zoom: 18,
            zoomControl: false,
            attributionControl: false,
          })
        } else {
          map = BM.map('map', 'bigemap.amap-map', {
            center: [this.latitude, this.longitude], //[33.04483,111.84926] [30.620267395060758, 104.01446700096132]
            zoom: 18,
            zoomControl: false,
            attributionControl: false,
            // crs: BM.CRS.Baidu,
          })
        }
        window.map = map
        BM.marker([this.latitude, this.longitude], {
          icon: BM.icon({
            iconUrl: require('@/assets/mapIcon/icon.png'),
            iconSize: [40, 40],
          }),
        }).addTo(window.map)
      })
    },
    //实时播放
    goToLive(obj) {
      let param = {
        dialogId: 'access_camera' + obj.deviceId,
        cameraId: obj.deviceId,
        cameraName: obj.cameraName,
        isDragable: true,
        leftTopX: 600,
        leftTopY: 200,
        rightBottomX: 900,
        rightBottomY: 500,
      }
      try {
        console.log(param)
        window.webkitProc('realtime-play', JSON.stringify(param))
      } catch (err) {
        console.log(err)
      }
    },
    handleClearTimer() {
      if (this.border) {
        AllcamMap.map.removeCircle(this.border)
      }
      clearTimeout(this.alarmTimer)
    },
    //关闭推送的告警
    closeIconMethod(type) {
      this.alarmData = {}
      this.bigCardVisiable = false
      //到事件处理 ，不是0直接关掉
      if (type == 0) {
        this.$store.commit('alarmPage', 2)
      }
    },
    //关闭卡片
    closeCard(type) {
      this.cardVisiable = false
      if (type == 2) {
        this.bigCardVisiable = true
      }
    },
    //webSocket
    handleWebSocketMessage(data) {
      if (data.type == 'alarm') {
        let alarmData = JSON.parse(Base64.decode(data.content))
        this.$nextTick(() => {
          if (this.$store.state.alarmpage == 0) {
            this.alarmData = alarmData
            this.$store.commit('alarmItem', alarmData)
            console.log(alarmData)
            if (!this.isAlarm) {
              return
            }
            if (alarmData.deviceId !== '') {
              if (AllcamMap.map) {
                // AllcamMap.map.deviceAlarm(alarmData.deviceId, alarmData.alarmLevel)
                //
                AllcamMap.map.flyToIcon(alarmData.deviceId)
                let entitys = AllcamMap.map.getPlotById(alarmData.deviceId)
                if (entitys) {
                  AllcamMap.map.viewer.scene.preRender.addEventListener(function () {
                    if (!that.cardVisiable) {
                      return
                    }
                    // 笛卡尔坐标
                    // console.log(pointCollect[index].position._value)
                    // 笛卡尔坐标转屏幕坐标
                    // console.log(Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pointCollect[index].position._value));
                    let pos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                      AllcamMap.map.viewer.scene,
                      entitys.position._value
                    )
                    if (Cesium.defined(pos)) {
                      that.$refs.alarmSmallCard.$refs.alarm.style.left = `${pos.x}px`
                      that.$refs.alarmSmallCard.$refs.alarm.style.top = `${pos.y}px`
                    }
                  })
                  let position = entitys && entitys.position ? Cartesian3_to_WGS84(entitys.position._value) : ''
                  console.log('告警点位', entitys, position)
                  let params = {
                    coord: [position.x, position.y],
                    height: this.altitude + 1,
                    minR: 1,
                    maxR: 6,
                    step: 0.1,
                  }
                  // console.log(params);
                  if (this.border) {
                    AllcamMap.map.removeCircle(this.border)
                  }
                  if (this.alarmTimer) {
                    clearTimeout(this.alarmTimer)
                  }
                  this.border = AllcamMap.map.createHandle(params)
                  this.bigCardVisiable = false
                  this.cardVisiable = true

                  this.alarmTimer = setTimeout(() => {
                    this.closeCard()
                    AllcamMap.map.removeCircle(this.border)
                  }, this.alarmTime * 1000)
                }
              }
            }
          }
        })
      }
    },
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/homepage') {
        window.map.panTo([this.latitude, this.longitude])
      }
    },
  },
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
#main-center {
  height: 100vh;
}
#boxs {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
}
.bigemap-logo {
  display: none;
}
/* 实时告警弹窗 */
#boxs .webSocketDialog {
  width: 874px;
  height: 400px;
  background: #083753;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
#map {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
#map .my_tooltip {
  color: white;
  background: transparent;
  border: none;
  text-shadow: 0 0 2px 2px red;
  font-size: 18px;
}

.my_tooltip::before {
  display: none;
}
</style>
