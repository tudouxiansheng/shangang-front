<template>
  <div class="map-wrapper">
    <template v-if="showimg">
      <div ref="map" id="map" v-show="showMap"></div>
      <!-- <iframe
        id="3dIframe"
        class="mapFrame"
        :src="frameUrl"
        frameborder="0"
        width="100%"
        height="100%"
        scrolling="no"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        oallowfullscreen="true"
        msallowfullscreen="true"
      ></iframe>-->
    </template>
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
import { Map, setAllcamMap, AllcamMap } from '../utils/map/AllcamMap'
import alarmDetail from './alarmSmallCard/alarmDetail'
import alarmSmallCard from './alarmSmallCard/alarmSmallCard.vue'
import eventDetail from '../../src/views/mini/pages/minivisionAlarm/components/eventDetail.vue'
import closeLoop from '../../src/views/mini/pages/minivisionAlarm/components/closeLoop.vue'
import { Cartesian3_to_WGS84 } from '../utils/map/AllcamMap.js'

import { MapConfig } from '../utils/mapConfig'
import { permissions } from '../utils/permissions'
// import Dayjs from '../utils/Dayjs'
import { controlIotDev, getIotDeviceInfo } from '../utils/api'
import AudioPlayer, { audioCtx } from '../utils/audioplayer'
let Base64 = require('js-base64').Base64

let map = null
import VideoScreen from '@/mixin/VideoScreen' //查看视频

export default {
  props: [
    'mapIp',
    'mapState',
    'latitude',
    'longitude',
    'altitude',
    'heading',
    'pitch', //偏向角
    'roll',
    'focus',
    'alarmTime', //多少秒后关闭
  ],
  data() {
    return {
      frameUrl: 'http://124.70.220.19:1662/thing/share/dpe2mfjaecc7k0m1',
      isPlayVoice: false,
      isHandle: true,
      showMap: true,
      alarmDeviceId: null,
      alarmData: {},
      cardVisiable: false,
      bigCardVisiable: false,
      showTab: 0,
      alarmTimer: null,
      border: null,
      isAlarm: false,
      showimg: JSON.parse(localStorage.getItem('showimg')), //true-map,false-img
      isAlarmLinkage: false,
    }
  },
  mixins: [VideoScreen],
  components: {
    alarmDetail,
    alarmSmallCard,
    eventDetail,
    closeLoop,
  },
  created() {
    this.getPermissions()
    this.$EventBus.$on('linkage', this.handleGoLinkage)
    this.$EventBus.$on('reset', this.handleResetMap)
  },
  mounted() {
    if (this.showimg) {
      this.initMap()
      this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    }

    window.closePopUp = function () {
      if (window.popup) {
        window.popup.destroy()
        window.popup = null
      }
    }
    window.goToVideo = (deviceId, deviceName) => {
      this.goToVideo({
        deviceId,
        deviceName,
      })
      // let p = {
      //   pageInfo: {
      //     pageNum: 1,
      //     pageSize: 10,
      //   },
      //   cameraList: [
      //     {
      //       cameraId: deviceId,
      //     },
      //   ],
      //   searchInfo: {
      //     from: 'PLATFORM',
      //     recordMarkSearchTag: 0,
      //     beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
      //     endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //     eventList: [
      //       {
      //         event: 'ALL',
      //       },
      //     ],
      //   },
      // }
      // getVideoRecord(p).then((res) => {
      //   if (res.resultCode == 0) {
      //     if (res.recordList && res.recordList.length) {
      //       let param = {
      //         dialogId: 'equipment1',
      //         cameraId: deviceId,
      //         cameraName: deviceId + 'name',
      //         startTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
      //         endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //         recordMethod: 0,
      //       }
      //       console.log(param)
      //       if (window.webkitProc) {
      //         window.webkitProc('record-playback', JSON.stringify(param))
      //       }
      //     } else {
      //       this.$alert(`${this.$t('public.noVideo')}`, `${this.$t('public.prompt')}`, {
      //         confirmButtonText: `${this.$t('public.confirm')}`,
      //         type: 'warning',
      //       })
      //     }
      //   }
      // })
    }
    window.goToLive = (deviceId, deviceName) => {
      this.goToLive({
        deviceId,
        deviceName,
        // isDragable: true,
        // leftTopX: 600,
        // leftTopY: 200,
        // rightBottomX: 1100,
        // rightBottomY: 500,
      })
      // let param = {
      //   dialogId: 'access_camera' + deviceId,
      //   cameraId: deviceId,
      //   cameraName: deviceId + 'name',
      //   isDragable: true,
      //   leftTopX: 600,
      //   leftTopY: 200,
      //   rightBottomX: 1100,
      //   rightBottomY: 500,
      // }
      // console.log('param', param)
      // try {
      //   window.webkitProc('realtime-play', JSON.stringify(param))
      // } catch (err) {
      //   console.log(err)
      // }
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$off('linkage', this.handleGoLinkage)
    this.$EventBus.$off('reset', this.handleResetMap)
    this.handleClearTimer()
    if (AllcamMap.map) {
      AllcamMap.map.removeModel(1)
      AllcamMap.map.clearAllPlots()
      if (this.$store.state.carOperateId) {
        AllcamMap.map.removeTrack(this.$store.state.carOperateId)
      }

      if (this.$store.state.faceOperateId) {
        AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
      }

      if (this.$store.state.faceOperateId) {
        AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
      }

      AllcamMap.map.removeTrack(this.$store.state.patrolId)
      AllcamMap.map.removeTrack(this.$store.state.personId)

      AllcamMap.map.viewer = null
      AllcamMap.map = null
    }

    // if (window.Cesium) {
    //   window.Cesium = null
    // }

    // if (AllcamMap.map) {
    //   AllcamMap.map = null
    // }
  },
  watch: {
    //算法应用的时候隐藏地图
    '$route.path': function (newVal, oldVal) {
      //地图不是地图，把地图覆盖
      if (newVal.indexOf('/ProductCenter') !== -1) {
        this.showMap = false
      } else {
        this.showMap = true
      }
      //地图停止旋转方法
      if (newVal.indexOf('/homepage') !== -1) {
        wutu3d.point.windingPoint.stop()
        if (AllcamMap.map) {
          AllcamMap.map.clearAllPlots()
          if (this.$store.state.carOperateId) {
            AllcamMap.map.removeTrack(this.$store.state.carOperateId)
          }
          if (this.$store.state.carEventId) {
            AllcamMap.map.removeTrack(this.$store.state.carEventId)
          }
          if (this.$store.state.personId) {
            AllcamMap.map.removeHistoryTrack(this.$store.state.personId)
          }

          if (this.$store.state.faceOperateId) {
            AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
          }

          AllcamMap.map.removeTrack(this.$store.state.patrolId)
          AllcamMap.map.removeTrack(this.$store.state.personId)
        }
      }
      if (newVal.indexOf('/trail') !== -1) {
        this.handleClearTimer()
        if (AllcamMap.map) {
          AllcamMap.map.clearAllPlots()
          if (this.$store.state.carOperateId) {
            AllcamMap.map.removeTrack(this.$store.state.carOperateId)
          }
          if (this.$store.state.carEventId) {
            AllcamMap.map.removeTrack(this.$store.state.carEventId)
          }
          if (this.$store.state.personId) {
            AllcamMap.map.removeHistoryTrack(this.$store.state.personId)
          }

          if (this.$store.state.faceOperateId) {
            AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
          }

          AllcamMap.map.removeTrack(this.$store.state.patrolId)
          AllcamMap.map.removeTrack(this.$store.state.personId)
          if (this.border) {
            AllcamMap.map.removeCircle(this.border)
            this.cardVisiable = false
          }
        }
      }
    },
    '$store.state.alarmpage': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.showTab = newVal
      }
    },
  },
  computed: {
    fullPath() {
      return this.$route.path
    },
    countStatus(status) {
      switch (status) {
        case 0:
          return '未激活'
        case 1:
          return '在线'
        case 2:
          return '离线'
        default:
          return '-'
      }
    },
  },
  methods: {
    handleResetMap() {
      this.isAlarmLinkage = false
      this.isAlarm = false
      if (this.border) {
        AllcamMap.map.removeCircle(this.border)
        let image = MapConfig.images.device_camera
        AllcamMap.map.updatePlotStyle(this.alarmDeviceId, {
          image,
        })
      }
    },
    handleGoLinkage() {
      // if (this.border) {
      //   AllcamMap.map.removeCircle(this.border)
      //   let image = MapConfig.images.device_camera
      //   AllcamMap.map.updatePlotStyle(this.alarmDeviceId, {
      //     image,
      //   })
      // }
      clearTimeout(this.alarmTimer)
      this.isAlarmLinkage = true
    },
    //用户权限判断
    async getPermissions() {
      this.isHandle = await permissions(873) //处理权限
    },
    //地图初始化
    initMap() {
      /**
       * 初始化地图，并设置初始视图位置
       * 在地图使用过程中，在控制台可使用 map.getViewPoint()获取当前地图视图位置值
       */
      const _this = this
      let center = {
        y: this.latitude,
        x: this.longitude,
        z: this.altitude ? this.altitude : 0,
        heading: this.heading ? this.heading : 10,
        pitch: this.pitch ? this.pitch : -38.5,
        roll: 360,
      }
      console.log('center中心', center)
      let Cesium = window.Cesium
      const wgs84 = new Cesium.GeographicTilingScheme({
        ellipsoid: Cesium.Ellipsoid.WGS84,
      })
      map && (map = null)
      let imageryProvider
      if (this.mapState == 1) {
        // 在线
        imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
          //影像底图
          url: 'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=4b9993a0f552a05db2d41d45c9d2be69',
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          layer: 'tdtImgLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible', //使用谷歌的瓦片切片方式
          show: true,
        })
      } else {
        // 离线
        imageryProvider = new Cesium.UrlTemplateImageryProvider({
          url: this.mapIp + '/map-source/tiles/{z}/{x}/{reverseY}.png',
          tilingScheme: wgs84,
          minimumLevel: 1,
          maximumLevel: 14,
        })
      }
      map = new Map(this.$refs.map, {
        // viewpoint: { y: 39.903307, x: 116.391828, z: 349.24, heading: 360, pitch: -28.6, roll: 360 },
        viewpoint: center,
        backgroundColor: 'rgba(5,15,31)',
        showCompass: true,
        currentTime: '08:30',
        // // 最大缩放限制
        // maximumZoomDistance: 400,
        // // 最小缩放限制
        // minimumZoomDistance: 10,
        // 天地图影像底图
        imageryProvider,
      })
      setAllcamMap({ map }) //global_map
      this.addModels(map) //模型
      console.log('中心点', map.getViewPoint())

      map.on('click', (event) => {
        console.log(event)
        let attribute = event.entity && event.entity.attribute
        if (!attribute) return
        let _type = attribute.type
        let attr = attribute.attr
        let isDevice = true
        if (_type == 'billboard') {
          closePopUp()
          if (attr.type == 'device') {
            isDevice = true
          } else {
            _this.$EventBus.$emit('trackInfo', attr)
            return false
          }
          _this.openPopup(map, event, attr, isDevice)
        }
      })
      this.bindClick()
    },
    //添加模型
    addModels(map) {
      let models = [
        {
          link: this.mapIp + '/map-source/B3D/tileset.json',
          name: '',
          visiable: true,
          id: 1,
          maximumScreenSpaceError: 10,
          modifyZ: typeof this.roll !== 'undefined' ? this.roll : 80,
          focus: this.focus == 1 ? true : false, // 模型是否聚焦
        },
      ]

      models.map((model) => {
        map.addModel(model)
      })
      //设置图层透明图
      map.viewer.imageryLayers.get(0).brightness = 0.5
    },
    handleClearTimer() {
      // if (this.border) {
      //   AllcamMap.map.removeCircle(this.border)
      //   let image = MapConfig.images.device_camera
      //   AllcamMap.map.updatePlotStyle(this.alarmDeviceId, {
      //     image,
      //   })
      // }
      // clearTimeout(this.alarmTimer)
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
    closeCard(type, obj) {
      this.cardVisiable = false
      if (type == 1) {
        this.isAlarm = true
      } else {
        this.isAlarm = false
      }
      if (type == 2) {
        this.alarmData = { ...obj }
        this.bigCardVisiable = true
      }
    },
    //webSocket
    handleWebSocketMessage(data) {
      const that = this
      if (this.$route.path != '/homepage') {
        return
      }
      if (data.type == 'alarm') {
        let alarmData = JSON.parse(Base64.decode(data.content))
        if (this.isAlarm && alarmData.deviceId != this.alarmDeviceId) {
          // if (this.isAlarm) {
          return
        }
        this.$nextTick(() => {
          if (this.$store.state.alarmpage == 0) {
            this.alarmData = alarmData
            this.$store.commit('alarmItem', alarmData)
            console.log(alarmData, this.isAlarm, alarmData.showStatus)
            if (alarmData.showStatus == 0) {
              return
            }
            if (alarmData.deviceId !== '') {
              console.log('AllcamMap.map', AllcamMap.map, alarmData.deviceId)
              if (AllcamMap.map) {
                // AllcamMap.map.deviceAlarm(alarmData.deviceId, alarmData.alarmLevel)
                //
                let entitys = AllcamMap.map.getPlotById(alarmData.deviceId)
                if (entitys) {
                  let image = entitys.attribute.style.image
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
                  if (this.border) {
                    // entitys.attribute.style.image = MapConfig.device_camera_alarm
                    AllcamMap.map.removeCircle(this.border)
                    image = MapConfig.images.device_camera
                    AllcamMap.map.updatePlotStyle(this.alarmDeviceId, {
                      image,
                    })
                    this.border = null
                  }
                  if (this.alarmTimer) {
                    clearTimeout(this.alarmTimer)
                  }
                  this.alarmDeviceId = alarmData.deviceId
                  AllcamMap.map.flyToIcon(alarmData.deviceId)
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
                    height: position.z + 2,
                    minR: 1,
                    maxR: 6,
                    step: 0.1,
                  }

                  image = MapConfig.images.device_camera_alarm
                  AllcamMap.map.updatePlotStyle(alarmData.deviceId, {
                    image,
                  })
                  // AllcamMap.map.updatePlotAttribute(alarmData.deviceId, {
                  //   alarmStatus: 2,
                  // })
                  this.border = AllcamMap.map.createHandle(params)
                  this.bigCardVisiable = false
                  this.cardVisiable = true
                  let alarm = alarmData.disappearTime ? alarmData.disappearTime : this.alarmTime
                  if (this.isAlarmLinkage) return
                  this.alarmTimer = setTimeout(() => {
                    this.closeCard()
                    image = MapConfig.images.device_camera
                    AllcamMap.map.updatePlotStyle(alarmData.deviceId, {
                      image,
                    })
                    AllcamMap.map.removeCircle(this.border)
                  }, alarm * 1000)
                }
              }
            }
          }
        })
      }
    },
    // 创建弹窗
    async openPopup(map, event, attr, isDevice) {
      let html = await this.createPopupHtml(attr, isDevice)
      closePopUp()
      window.popup = new wutu3d.DivPoint(map.viewer, {
        html: html,
        position: event.entity.position._value,
        anchor: [-150, -90],
      })
    },
    // 根据设备类型创建不同的dom
    // 依赖jquery
    async createPopupHtml(attr, isDevice) {
      let title = this.$t('alarm.deviceInfo')
      let html = ''
      // 摄像机
      const position = attr.installLocation ? attr.installLocation : this.$t('public.unknown')
      if (attr.deviceType == 1) {
        const deviceName = attr.cameraName
        html = `<div class='popup-wrapper mypop'>
                  <div class="popup-title">
                    <span>${title}</span>
                    <i class="el-icon-close myclose" onClick="closePopUp()"></i><br/>
                  </div>
                  <div class="flc">
                    <div class="item-content">
                        <div class="item-label">${this.$t('application.deviceName')}: </div>
                        <div class="item-value" title="${deviceName}">${deviceName}</div>
                      </div>
                      <div class="item-content">
                        <div class="item-label">${this.$t('application.devicePos')}: </div>
                        <div class="item-value" title="${position}">${position}</div>
                      </div>

                    ${
                      isDevice
                        ? `<div class="item-content none">
                              <div class="item-label">${this.$t('application.deviceStatus')}: </div>
                              <div class="item-value ${attr.status == 1 ? 'online' : 'offline'}">${
                            attr.status == 1 ? this.$t('application.online') : this.$t('application.offline')
                          } </div>
                              </div>
                              <div class="popup-button">
                                ${
                                  attr.status == 1
                                    ? `<div class="nowshipin" onClick="goToLive('${
                                        attr.id
                                      }','${deviceName}')">${this.$t('public.live')}</div>`
                                    : ''
                                }
                              <div class="nowshipin huifang" onClick ="goToVideo('${
                                attr.id
                              }','${deviceName}')">${this.$t('public.playback')}</div>
                              </div>`
                        : `<div class="item-content none">
                            <div class="item-label">${this.$t('alarm.alarmTime')}: </div>
                            <div class="item-value">${attr.trackListInfo.hitTime}</div>
                            </div>`
                    }
                    </div>
                </div>`
        return html
      } else {
        // 调用接口获取设备状态和模式，回显设备的操作按钮
        let info = await getIotDeviceInfo({
          deviceId: attr.id,
        })
        if (info.deviceType != 1) {
          // 调用接口获取设备状态和模式，回显设备的操作按钮
          let infos = await getIotDeviceInfo({
            deviceId: info.deviceId,
          })
          if (info.platType == 63 && info.deviceType == 3) {
            //中控的道闸
            info.status = info.status
          } else {
            info.status = infos.connect
            if (info.deviceType == 2) info.workMode = infos.workMode
          }
        }
        // 门禁/道闸
        title = attr.deviceType == 2 ? '门禁设备信息' : '道闸设备信息'
        html = $(`<div class="popup-wrapper mypop" data-attr='${JSON.stringify(attr)}'></div>`)
        // 头部
        html.append(`
                  <div class="popup-title">
                    <span>${title}</span>
                    <i class="el-icon-close myclose" onClick="closePopUp()"></i><br/>
                  </div>
                `)
        if (attr.platType == 63 && attr.deviceType == 3) {
          // 中控的道闸没有在离线状态  默认为在线
          attr.status = 1
          // html.find('.flc').children('.item-content:last-child').remove()
        }
        // 内容
        html.append(`
                  <div class="flc">
                    <div class="item-content">
                      <div class="item-label">${this.$t('application.deviceName')}: </div>
                      <div class="item-value" title="${attr.cameraName}">${attr.cameraName}</div>
                    </div>
                    <div class="item-content">
                      <div class="item-label">${this.$t('application.devicePos')}: </div>
                      <div class="item-value" title="${attr.installLocation}">${position}</div>
                    </div>
                    <div class="item-content">
                      <div class="item-label">${this.$t('application.deviceStatus')}: </div>
                      <div class="item-value" data-show='isOnline'>${
                        attr.status == 1 ? this.$t('application.online') : this.$t('application.offline')
                      }</div>
                    </div>
                  </div>
                `)
        // 根据在线离线 就改变文字颜色
        if (attr.status == 1) html.find('.item-value[data-show=isOnline]').addClass('online')
        else html.find('.item-value[data-show=isOnline]').addClass('offline')
        // 门禁
        if (attr.deviceType == 2) {
          if (attr.status == 1) {
            if (attr.platType == 63) {
              html.find('.flc').append(`
                                <div class="item-content">
                                    <div class="item-label">${this.$t('远程操作')}: </div>
                                    <div>
                                    <span class="button" data-oper="openDoor">远程开门</span>
                                    <span class="button" data-oper="closeDoor">远程关门</span>
                                    </div>
                                </div>
                            `)
            } else if (attr.platType == 64) {
              html.find('.flc').append(`
                              <div class="item-content">
                                <div class="item-label">${this.$t('设备模式')}: </div>
                                <div class="item-value">
                                  <span class="button" data-oper="opening">常开</span>
                                  <span class="button" data-oper="closing">常关</span>
                                  <span class="button" data-oper="normal">正常</span>
                                </div>
                              </div>
                              <div class="item-content">
                                <div class="item-label">${this.$t('远程操作')}: </div>
                                <div class="item-value">
                                  <span class="button" data-oper="openDoor">远程开门</span>
                                </div>
                              </div>
                            `)
              if (attr.workMode == 0) {
                // 正常模式
                html.find('.flc span[data-oper=normal]').addClass('active')
              } else if (attr.workMode == 2) {
                // 常开
                html.find('.flc span[data-oper=opening]').addClass('active')
                html.find('.flc span[data-oper=openDoor]').addClass('disable')
              } else if (attr.workMode == 1) {
                // 常关
                html.find('.flc span[data-oper=closing]').addClass('active')
                html.find('.flc span[data-oper=openDoor]').addClass('disable')
              }
            }
          }
        }
        // 道闸
        if (attr.deviceType == 3) {
          // 中控的道闸没有在离线状态
          if (attr.platType == 63 || (attr.status == 1 && attr.platType == 64)) {
            html.find('.flc').append(`
              <div class="item-content">
                <div class="item-label">${this.$t('远程操作')}: </div>
                <div class="item-value">
                  <span class="button" data-oper="openDoor">远程开闸</span>
                </div>
              </div>
            `)
          }
        }
        return html[0]
      }
    },
    bindClick() {
      const self = this
      $('#map').on('click', '[data-oper]', function (e) {
        const oper = $(this).attr('data-oper')
        const attr = JSON.parse($('.mypop').attr('data-attr'))
        const loading = self.$loading({
          lock: true,
          text: '设备操作中，请等待……',
          spinner: 'el-icon-loading',
        })
        switch (oper) {
          case 'closing': //常关 远程操作不可使用
            // 禁止选择远程操作
            controlIotDev({
              platId: attr.platId,
              productId: attr.productId,
              operateType: 4,
              module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
            }).then((res) => {
              if (res.resultCode == 0) {
                self.$message.success('操作成功！')
                $(this).addClass('active')
                $(this).siblings().removeClass('active')
                // 禁用 远程操作按钮
                $('.mypop')
                  .find('[data-oper=openDoor]')
                  .each((i, e) => {
                    $(e).addClass('disable')
                  })
              }
              loading.close()
            })
            break
          case 'opening': //常开 远程操作不可使用
            // 禁止选择远程操作
            controlIotDev({
              platId: attr.platId,
              productId: attr.productId,
              operateType: 3,
              module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
            }).then((res) => {
              if (res.resultCode == 0) {
                self.$message.success('操作成功！')
                $(this).addClass('active')
                $(this).siblings().removeClass('active')
                // 禁用 远程操作按钮
                $('.mypop')
                  .find('[data-oper=openDoor]')
                  .each((i, e) => {
                    $(e).addClass('disable')
                  })
              }
              loading.close()
            })
            // 禁止选择远程操作
            break
          case 'normal': //正常  //远程操作可使用
            // 放开选择远程操作
            controlIotDev({
              platId: attr.platId,
              productId: attr.productId,
              operateType: 5,
              module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
            }).then((res) => {
              if (res.resultCode == 0) {
                self.$message.success('操作成功！')
                $(this).addClass('active')
                $(this).siblings().removeClass('active')
                // 放开 远程操作按钮
                $('.mypop')
                  .find('[data-oper=openDoor]')
                  .each((i, e) => {
                    $(e).removeClass('disable')
                  })
              }
              loading.close()
            })
            break
          case 'openDoor':
            if ($(this).hasClass('disable')) return
            controlIotDev({
              platId: attr.platId,
              productId: attr.productId,
              operateType: 1,
              module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
            }).then((res) => {
              if (res.resultCode == 0) {
                self.$message.success('操作成功！')
              }
              loading.close()
            })
            break
          case 'closeDoor':
            if ($(this).hasClass('disable')) return
            controlIotDev({
              platId: attr.platId,
              productId: attr.productId,
              operateType: 2,
              module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
            }).then((res) => {
              if (res.resultCode == 0) {
                self.$message.success('操作成功！')
              }
              loading.close()
            })
            break
        }
      })
    },
  },
}
</script>

<style lang="scss">
.map-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  pointer-events: auto;
}
#map {
  width: 100vw;
  height: 100vh;
  z-index: 2;
  position: absolute;
  overflow: hidden;
}

.icon-white-close {
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  color: white;
  top: 10px;
}

.openDoor {
  width: 265px;
  height: 180px;
  background: rgba(12, 25, 44, 0.6);
  border-radius: 8px;
  padding: 20px;
}

.menjin-kong {
  background: rgba(12, 25, 44, 0.6);
  border-radius: 8px;
  padding: 20px;
}

.menjinName {
  color: #1efffc;
  font-size: 14px;
  text-align: center;
  line-height: 28px;
}

.menjin-font {
  color: #ecf7f7;
}

.text-right {
  text-align: right;
  cursor: pointer;
}

.centerItem {
  display: flex;
  align-items: center;
  justify-content: center;
}

.kongMenjin {
  width: 200px;
  height: 151px;
  background: #ffffff;
}

.btnWrapper {
  display: flex;
  margin-top: 10px;
}

.openOrclose {
  width: 90px;
  height: 36px;
  background: #00ccff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.deviceName {
  color: white;
  line-height: 27px;
}

.popup-wrapper {
  background-image: url('../assets/bigScreen/wrapper.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  width: 300px;
  min-height: 200px;
  //height: 200px;
  color: white;
  display: flex;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  .popup-title {
    font-size: 18px;
    height: 30px;
    position: relative;
    span {
      color: #0cd8fa;
    }
  }
  .popup-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -28px;
    left: calc(50% - 15px);
    border: 15px solid;
    border-color: #458acf transparent transparent transparent;
  }
  .online {
    color: #67c23a !important;
  }
  .offline {
    color: #ff6b6b !important;
  }
}

.popup-wrapper2 {
  background-image: url('../assets/pop-wrapper2.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  width: 80px;
  height: 33px;
  color: #ffffff;
  font-size: 18px;
  display: flex;
  justify-content: center;
}

.mypop {
  display: flex;
  flex-direction: column;
}

.cesium-viewer-toolbar {
  display: none !important;
}

.nowshipin {
  width: 69px;
  background: #00ccff;
  border-radius: 5px;
  line-height: 30px;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.huifang {
  margin-left: 20px;
  font-size: 14px;
}

.myclose {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #0cd8fa;
  }
}

.flc {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  font-size: 14px;
  position: relative;
  .popup-button {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
  }
  .item-content {
    display: flex;
    line-height: 30px;
    margin-bottom: 5px;
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #458acf 50%, rgba(0, 0, 0, 0) 100%) 2 2 2 2;
    &.none {
      border-bottom: none;
    }
    .item-label {
      margin-right: 5px;
      white-space: nowrap;
    }
    .item-value {
      color: #ddd;
      overflow: hidden;
      white-space: nowrap;
      /*文字超出宽度则显示ellipsis省略号*/
      text-overflow: ellipsis;
    }
    span.button {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      padding: 0 10px;
      background: #226fbd;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        background: #0774e1;
      }
      &.active {
        background: #20c622;
      }
      &.disable {
        background: gray;
        cursor: no-drop;
        :hover {
          background: gray;
        }
      }
    }
  }
}
</style>
