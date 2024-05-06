<template>
  <!-- gis地图 -->
  <div ref="gisIndex" id="gis_index">
    <div v-if="showimg" ref="gisMap" id="gisMap">
      <info-window
        v-show="infoWindowShow"
        @mouse="handleClearTimer"
        @detail="handleDetail"
        ref="infoWindow"
        @closeInfoWindow="closeWindow"
        @devFavorite="favorite"
      />
    </div>
    <img v-else src="../../assets/bigScreen/1.jpg" alt style="width: 100%; height: 100%" />
    <!-- 设备收藏 -->
    <favorite-group @favoriteSuccess="favoriteSuccess" />
  </div>
</template>
<script>
import GDMap from './utils/map'
import MapCluster from './utils/cluseter'
let mapCluster = new MapCluster()
import { mapState, mapActions } from 'vuex'
import {
  getAlarmCamera,
  getIotDevList,
  operFavoriteCamera,
  queryFavoriteCamera,
  getAlarmSnap,
  getIotDeviceInfo,
} from '../../utils/api'
import { Base64 } from 'js-base64'
import PathSimplifier from './utils/PathSimplifier'
import AudioPlayer, { audioCtx } from '../../utils/audioplayer'

const favoriteGroup = () => import('./favorite/favorite-group.vue')
const InfoWindow = () => import('./component/info-window.vue')
export default {
  name: 'gis',
  props: ['alarmTime', 'latitude', 'longitude'],
  components: {
    'favorite-group': favoriteGroup,
    'info-window': InfoWindow,
  },
  mixins: [PathSimplifier],
  data() {
    return {
      isPlayVoice: false,
      showimg: JSON.parse(localStorage.getItem('showimg')), //true-map,false-img
      isAlarm: false,
      cuType: sessionStorage.getItem('cuType'),
      locale: localStorage.getItem('locale'),
      routeParams: {},
      map: {}, // 地图
      maxZoom: 20,
      resultList: [], // 点聚合数组
      mapCenterForm: {},
      mapZoom: null,
      mapCenter: null, // 地图初始化中心点经纬度
      centerMarker: null, // 地图中心点
      cameraList: [], // 镜头列表
      cameraMarkers: [], // 页面展示镜头列表
      mouseTool: {}, // 绘制矢量图形
      favoriteGroupVisible: false, // 设备收藏
      cameraInfo: {}, // 设备详情
      searchShow: false,
      // 告警闪烁
      alarmList: [],
      alarmTimer: null, // 告警闪烁定时器
      infoWindowShow: false,
      infoWindow: undefined, // 自定义信息窗体
      isAlarmLinkage: false,
    }
  },
  computed: {
    ...mapState({
      layerType: (state) => state.mapSet.layerType,
      toolbarIndex: (state) => state.mapSet.toolbarIndex,
      mapCenterShow: (state) => state.mapSet.mapCenterShow,
      checkedType: (state) => state.mapSet.checkedType,
      markerLabelShow: (state) => state.mapSet.markerLabelShow,
      alarmAnimationShow: (state) => state.mapSet.alarmAnimationShow,
      devTypeList: (state) => state.dict['device-type'], // 摄像机类型
    }),
  },
  watch: {
    '$route.path': {
      handler(val) {
        this.handleResetMap()
        this.handleClearMarkers()
        if (val == '/homepage') {
          this.getCameraList()
        }
      },
    },
  },
  created() {
    this.$EventBus.$on('webkit_notify', this.handlePcNotify)
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$on('reset', this.handleResetMap)
    this.$EventBus.$on('linkage', this.handleGoLinkage)
    if (this.showimg) {
      this.getDeviceType()
      this.mapProperty()
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('webkit_notify')
    this.$EventBus.$off('websocketMessage')
    this.$EventBus.$off('reset')
    this.$EventBus.$off('linkage', this.handleGoLinkage)
    this.handleResetMap()
    this.handleClearMarkers()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    handleResetMap() {
      this.isAlarm = false
      this.isAlarmLinkage = false
      this.alarm_Intreval()
    },
    handleGoLinkage() {
      this.isAlarmLinkage = true
    },
    //清空所有点
    handleClearMarkers() {
      this.cameraList = []
      if (this.map.clearMap) {
        this.map.clearMap()
        this.addCluster(1, [])
        let info = {
          longitude: this.longitude,
          latitude: this.latitude,
        }
        this.setMapCenterAndZoom(info, 14)
        this.$EventBus.$emit('clear-markers')
      }
    },
    handleDetail() {
      this.isAlarm = true
    },
    handleClearTimer() {},
    // 客户端进入页面调方法
    handlePcNotify(e) {
      let { func, message } = e
      if (func == 'send_params') {
        this.routeParams.cameraId = message // 返回func==>send_params ==>cameraId
        // if (this.cameraList.length != 0) this.alarmToTree()
      } else if (func == 'AlarmPush') {
        this.addEventListener(message)
      }
    },

    //webSocket
    handleWebSocketMessage(data) {
      if (this.$route.path != '/homepage') {
        return
      }
      if (data.type == 'alarm') {
        let alarmData = JSON.parse(Base64.decode(data.content))
        this.$nextTick(() => {
          if (this.isAlarm && alarmData.deviceId != this.alarmData.deviceId) return
          this.alarmData = alarmData
          this.$store.commit('alarmItem', alarmData)
          if (alarmData.showStatus == 0) {
            return
          }
          if (alarmData.deviceId !== '') {
            this.alarm_Intreval()
            this.loadAlarmPointer(alarmData)
          }
        })
      }
    },
    getDeviceType() {
      this.getSysDictData(['device-type'])
    },

    mapProperty() {
      GDMap.createMap('gisMap').then(async (res) => {
        this.map = res.map
        this.openTileLayer(this.layerType) // 展示地图层级

        // 是否展示地图中心点
        this.centerMarkerShow(this.mapCenterShow)
        this.map.on('moveend', () => this.centerMarkerShow(this.mapCenterShow))
        this.map.on('zoomend', () => this.centerMarkerShow(this.mapCenterShow))

        this.mouseTool = new this.$AMap.MouseTool(this.map)
        if (this.$route.path == '/homepage') {
          await this.getCameraList() // 获取设备
        } else {
          this.handleClearMarkers()
        }
        let info = {
          longitude: this.longitude,
          latitude: this.latitude,
        }
        this.setMapCenterAndZoom(info, 14)
      })
    },

    // 点聚合
    addCluster(tag, markers) {
      mapCluster.addMarkerCluster(tag, markers, this.markerLabelShow, this.map, this.$AMap)
      mapCluster.cluster.on('click', (cluster, a) => {
        // 如果地图放大到最大并且markers长度大于1，说明有相同经纬度镜头，
        // 此处解决方案：建议列表展示该聚合对应所有经纬度相同镜头相关信息
        if (cluster.clusterData.length > 1) {
          if (this.map.getZoom() < this.maxZoom) {
            // 这里是计算所有聚合点的中心点
            let alllng = 0,
              alllat = 0
            for (const mo of cluster.clusterData) {
              alllng += mo.lnglat.lng
              alllat += mo.lnglat.lat
            }
            const lat = alllat / cluster.clusterData.length
            const lng = alllng / cluster.clusterData.length
            // 这里是放大地图，此处写死了每次点击放大的级别，可以根据点的数量和当前大小适应放大，体验更佳
            this.map.setZoomAndCenter(this.map.getZoom() + 2, [lng, lat])
          } else {
            let resultList = []
            for (let i = 0; i < cluster.clusterData.length; i++) {
              const ele = cluster.clusterData[i]
              resultList.push(ele)
            }
            this.resultList = resultList
            this.$store.commit('mapSet/set_toolbarIndex', 1)
          }
        } else {
          if (cluster.clusterData.length) {
            let obj = cluster.clusterData[0]
            this.setDeviceInfo(obj)
            // 此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
          } else {
            let obj = cluster.marker.getExtData()
            this.setDeviceInfo(obj)
          }
          this.resultList = []
        }
      })
    },

    // 获取镜头列表
    async getCameraList() {
      const res = await getAlarmCamera({
        deviceType: 1,
        mapType: 2,
      })
      res.resultList = res.resultList.filter((item) => {
        item.deviceType = 1
        return item.latitude && item.longitude
      })
      let cameraList = res.resultList || []
      cameraList.forEach((item1) => {
        Object.assign(item1, {
          visible: true,
          anglesShow: false, // 可视域
          customLayer: null, // 可视域
          deviceType: 1, //临时添加类型字段
        })
      })
      this.cameraList = cameraList.concat(this.cameraList)
      const Iotres = await getIotDevList({})
      if (Iotres.resultCode == 0) {
        this.cameraList = this.cameraList.concat(
          Iotres.deviceList.map((d) => {
            return {
              visible: true,
              anglesShow: false, // 可视域
              customLayer: null, // 可视域
              latitude: d.latitude,
              longitude: d.longitude,
              altitude: d.altitude,
              deviceId: d.deviceId,
              deviceName: d.name,
              status: d.platType == 63 && d.module == 2 ? 1 : d.connect, //在离线 // 中控的道闸没有在离线状态
              subStatus: d.status, //设备开关
              deviceType: d.module == 1 ? 10 : 11, //门禁或者道闸
              platType: d.platType,
              platId: d.platId,
              productId: d.productId,
            }
          })
        )
      }
      console.log(1111111111111, this.cameraList)
      if (this.cameraList.length == 0) return
      this.cameraIfVisible(this.checkedType, false) // 展示对应图层设备展示类型
    },

    // 处理设备展示到地图
    async createMarkersFun(cameraList) {
      this.cameraMarkers = cameraList
      let points = []
      for (let i = 0; i < cameraList.length; i++) {
        const item = cameraList[i]
        points.push({
          lnglat: [item.longitude, item.latitude],
          ...item,
        })
      }
      console.log('points', points)
      this.addCluster(1, points)
    },
    /*
     * 如果设备未在地图渲染，则添加点标记；
     * 否则更新经纬度（页面采用keep-alive，存在用户在镜头管路页面修改经纬度后切换到电子地图）
     */
    ifNoRenderToMap(cameraInfo) {
      let index = this.cameraList.findIndex((item) => item.deviceId == cameraInfo.deviceId && item.visible)

      if (index != -1) {
        if (cameraInfo.longitude) {
          Object.assign(this.cameraList[index], { ...cameraInfo })
          this.cameraIfVisible(this.checkedType, true, false)
          this.setDeviceInfo(cameraInfo)
        } else {
          this.closeWindow()
          this.cameraList.splice(index, 1)
          this.cameraIfVisible(this.checkedType, true, false)
        }
      } else {
        if (cameraInfo.longitude) {
          this.cameraList.push(cameraInfo)
          this.cameraIfVisible(this.checkedType, true, false)
          this.setDeviceInfo(cameraInfo)
        }
      }
    },
    // 镜头详情窗体
    async setDeviceInfo(info) {
      if (!info) return
      let obj = this.cameraList.find((item) => item.deviceId == info.deviceId)
      if (!obj.visible) return

      Object.assign(info, {
        anglesShow: obj.anglesShow,
        longitude: obj.longitude,
        latitude: obj.latitude,
      })
      this.cameraInfo = info
      console.log('11111info', info)
      let snapUrl = ''
      // 如果是告警则展示告警图片
      if (info.alarmId) {
        const res = await getAlarmSnap({
          alarmId: info.alarmId,
          alarmTime: info.alarmTime,
        })
        snapUrl = res ? res.snapUrl : require('./images/background.png')
      }
      // 判断节点是否收藏
      const res1 = await queryFavoriteCamera({
        cameraId: info.deviceId,
      })
      let collected = false
      if (res1.favoriteId) {
        info.favoriteId = res1.favoriteId
        info.favoriteName = res1.favoriteName
        collected = true
      }
      if (info.deviceType != 1) {
        // 调用接口获取设备状态和模式，回显设备的操作按钮
        let infos = await getIotDeviceInfo({
          deviceId: info.deviceId,
        })
        if (info.platType == 63 && info.deviceType == 11) {
          //中控的道闸
          info.status = info.status
        } else {
          info.status = infos.connect
          if (info.deviceType == 10) info.workMode = infos.workMode
        }
      }
      // 调用组件方法，初始化组件页面的infoWindow等数据
      console.log(this.$refs.infoWindow)
      this.$refs.infoWindow.initialize({
        deviceInfo: info,
        anglesShow: info.anglesShow,
        snapUrl,
        collected,
      })
      this.infoWindow = new this.$AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        autoMove: true,
        anchor: 'bottom-center',
        content: this.$refs.infoWindow.$el, // 只有当组件渲染完毕后，通过$el才能拿到原生的dom对象
        offset: new this.$AMap.Pixel(0, -25), // 设置定位偏移量
        retainWhenClose: true,
      })
      if (this.routeParams.cameraId && this.openIndex >= 0) {
        this.getPeripheryDevList()
      } else {
        this.setMapCenterAndZoom(info, 19)
        let timeOut = setTimeout(() => {
          this.setMapCenterAndZoom(info, this.maxZoom)
          this.infoWindowShow = true
          this.infoWindow.open(this.map, [info.longitude, info.latitude])
          clearTimeout(timeOut)
        }, 600)
      }
    },
    // 获取周边设备
    getPeripheryDevList() {
      this.openIndex = -1
      this.searchShow = false
      this.closeWindow()
      this.clearMap() // 清空覆盖物
      const drawTools = this.$refs.drawTools
      drawTools.drawCircle2([this.cameraInfo.longitude, this.cameraInfo.latitude], 1000, this.cameraInfo.deviceId)
      drawTools.testIsInDrawObj(drawTools.peripheryCircle, this.cameraInfo.deviceId)
      this.$store.commit('mapSet/set_toolbarIndex', 1)
    },
    // 关闭详情窗体
    closeWindow() {
      this.infoWindowShow = false
      this.infoWindow && this.infoWindow.close()
      clearTimeout(this.alarmTimer)
    },
    // 设备收藏
    favorite(flag) {
      if (!flag) {
        this.favoriteGroupVisible = true
        return
      }
      this.$confirm(this.$t('favorite.cancelFavorite'), this.$t('gis.prompt'), {
        confirmButtonText: this.$t('gis.confirm'),
        cancelButtonText: this.$t('gis.cancel'),
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(async () => {
          const res = await operFavoriteCamera({
            cameraId: this.cameraInfo.deviceId,
            operType: '0',
          })
          if (res.resultCode == 0) {
            this.$refs.infoWindow.collected = false
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('gis.cancelled'),
          })
        })
    },
    // 收藏成功后收藏夹刷新
    favoriteSuccess() {
      this.$refs.infoWindow.collected = true
    },
    // 显示图层----------------
    // 摄像头的显示与隐藏
    cameraIfVisible(cameraType, flag = true, flag1 = true) {
      flag1 && this.closeWindow() // 关闭详情弹框
      // flag && this.handleClearMarkers() // 清除页面
      let cameraList = this.cameraList
      // .filter((item) => cameraType.indexOf(item.deviceType.toString()) > -1)
      console.log(cameraList)
      this.createMarkersFun(cameraList)
      // for (let j = 0; j < this.cameraList.length; j++) {
      //   const item = this.cameraList[j]
      //   if (cameraType.indexOf(item.deviceType.toString()) > -1) {
      //     Object.assign(item, {
      //       visible: true,
      //     })
      //   } else {
      //     // 关闭可视域
      //     if (item.customLayer) {
      //       item.customLayer.setMap(null)
      //     }
      //     Object.assign(item, {
      //       visible: false,
      //       anglesShow: false,
      //       customLayer: null,
      //     })
      //   }
      // }
    },
    // 显示隐藏不同类型点标记标注
    showMarkerLabel() {
      this.cameraIfVisible(this.checkedType, false)
    },
    // 显示隐藏地图中心点
    centerMarkerShow(flag) {
      this.centerMarker && this.map.remove(this.centerMarker)
      if (flag) {
        let position = this.map.getCenter()
        this.centerMarker = new this.$AMap.Marker({
          position,
          content: `<div class="center-marker" />`,
          zIndex: 1200,
        })
        this.map.add(this.centerMarker)
      }
    },
    // 展示地图层级
    openTileLayer(arr, flag = false) {
      let layers = []
      let rejectTileLayer = new this.$AMap.TileLayer({ rejectMapMask: true }) // 地图
      let Satellite = new this.$AMap.TileLayer.Satellite() // 卫星
      let RoadNet = new this.$AMap.TileLayer.RoadNet() // 路网
      let Traffic = new this.$AMap.TileLayer.Traffic() // 路况
      // 卫星地图
      let index2 = arr.findIndex((item) => item == 2)
      if (index2 != -1) {
        if (flag) {
          const loading = this.$loading({
            lock: true,
            text: this.$t('gis.satelliteLoading'),
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          let layerTimer = setTimeout(() => {
            layers.push(Satellite, RoadNet)
            this.map.setLayers(layers)
            loading.close()
            clearTimeout(layerTimer)
          }, (Math.random() * 2 + 1) * 1000)
        } else {
          // 添加图层
          layers.push(Satellite, RoadNet)
        }
        //加载地理编码插件 绘制中心点所在市
        this.$AMap.plugin(['AMap.Geocoder'], () => {
          //加载地理编码插件
          var geocoder = new this.$AMap.Geocoder({
            // radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
            // extensions: 'all', //返回地址描述以及附近兴趣点和道路信息，默认“base”
          })
          //逆地理编码
          geocoder.getAddress([this.longitude, this.latitude], (status, info) => {
            if (status == 'complete' && info.info == 'OK') {
              try {
                // 获取区域编码
                let adcode = info.regeocode.addressComponent.citycode || info.regeocode.addressComponent.adcode
                // 根据区域编码获取区域边界
                // 根据经纬度获取所在城市，根据城市获取区域数据
                this.$AMap.plugin('AMap.DistrictSearch', () => {
                  var districtSearch = new this.$AMap.DistrictSearch({
                    extensions: 'all', //返回行政区边界坐标组等具体信息
                    // 关键字对应的行政区级别，country表示国家
                    level: 'district',
                    //  显示下级行政区级数，1表示返回下一级行政区
                    subdistrict: 0,
                  })
                  // 搜索所有省/直辖市信息
                  districtSearch.search(adcode, (status2, result) => {
                    // 查询成功时，result即为对应的行政区信息
                    if (status2 == 'complete' && result.info == 'OK') {
                      var bounds = result.districtList[0].boundaries
                      if (bounds) {
                        var polygons = []
                        for (var i = 0, l = bounds.length; i < l; i++) {
                          //生成行政区划polygon
                          var polygon = new this.$AMap.Polygon({
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.4,
                            fillColor: '#80d8ff',
                            strokeColor: '#0091ea',
                          })
                          polygons.push(polygon)
                        }
                      }
                      this.map.add(polygons)
                      // this.map.setFitView(polygons) //视口自适应
                    }
                  })
                })
              } catch (error) {
                throw new Error('获取中心点所在城市失败')
              }
            }
          })
        })
      } else {
        layers.push(rejectTileLayer)
      }

      let index3 = arr.findIndex((item) => item == 3)

      if (index3 != -1) {
        layers.push(Traffic)
      }
      this.map.setLayers(layers)
    },

    // 地图搜索
    mapSearch() {
      this.$store.commit('mapSet/set_toolbarIndex', -1)
      this.searchShow = !this.searchShow
      this.$refs.cameraSearch.cameraName = ''
      this.$refs.cameraSearch.resultList = []
      this.$refs.cameraSearch.searchFlag = false
    },

    // 告警闪烁========
    addEventListener(e) {
      // 如果关闭告警动画则不展示，默认不展示
      if (!this.alarmAnimationShow) return
      let alarmInfo = JSON.parse(this.cuType == 1 ? e : e.newValue)
      this.loadAlarmPointer(alarmInfo)
    },
    // 添加告警闪烁
    loadAlarmPointer(alarmInfo) {
      // 如果告警设备有经纬度
      let index = this.cameraList.findIndex((item) => item.deviceId == alarmInfo.deviceId && item.visible)
      if (index != -1) {
        if (alarmInfo.systemVoiceUrl) {
          // console.log(audioCtx);
          if (!this.isPlayVoice) {
            this.isPlayVoice = true
            AudioPlayer.getBuffer(alarmInfo.systemVoiceUrl).then((buffer) => {
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
        this.alarmList = { ...alarmInfo }
        let obj = this.cameraList[index]
        Object.assign(this.cameraList[index], { ...alarmInfo })

        this.cameraIfVisible(this.checkedType)
        this.setMapCenterAndZoom(obj, this.maxZoom)
        let timer = setTimeout(() => {
          this.cameraInfo = this.cameraList[index]
          this.setDeviceInfo(this.cameraInfo)
          clearTimeout(timer)
        }, 30)
        let alarm = alarmInfo.disappearTime ? alarmInfo.disappearTime : this.alarmTime
        console.log(alarm)
        if (this.alarmTimer) {
          clearTimeout(this.alarmTimer)
        }
        if (this.isAlarmLinkage) return
        this.alarmTimer = setTimeout(() => {
          this.alarm_Intreval()
        }, alarm * 1000)
      }
    },
    alarm_Intreval() {
      let index = this.cameraList.findIndex((item1) => item1.deviceId == this.alarmList.deviceId)
      if (index != -1) {
        let cameraObj = this.cameraList[index]
        delete cameraObj.alarmId
        cameraObj.visible = true
        this.cameraIfVisible(this.checkedType)
      }
      this.isAlarm = false
      clearTimeout(this.alarmTimer)
    },

    // 地图定位中心点以及层级
    setMapCenterAndZoom(info, zoom) {
      if (!info.longitude) return
      let position = new this.$AMap.LngLat(info.longitude, info.latitude)
      this.map.setZoom(zoom)
      this.map.setCenter(position)
    },
  },
}
</script>

<style lang="scss">
#gis_index {
  width: 100%;
  height: 100%;
  position: relative;
  color: #000;
  #gisMap {
    width: 100%;
    height: 100%;
    // 地图中心点
    .center-marker {
      width: 12px;
      height: 12px;
      background: #ffffff;
      border: 4px solid #2c6dd2;
      border-radius: 50%;
    }
    .amap-marker-label {
      border: none;
      background: transparent;
    }
    .amap-indoormap-floorbar-control {
      right: 75px !important;
    }
    // 缩放按钮样式
    .amap-touch-toolbar {
      bottom: 280px !important;
      right: 20px !important;
      .amap-zoomcontrol {
        width: 30px;
        padding: 10px;
        border-radius: 4px;
        border: none;
        box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
      }
      .amap-zoomcontrol {
        right: 0;
        &:after {
          height: 0;
        }
      }

      .amap-zoom-touch-plus {
        padding-bottom: 10px;
        border-bottom: 1px solid #c1c7d0;
      }

      .amap-zoom-touch-minus {
        height: 30px;
        margin: 0;
      }

      .amap-zoom-touch-plus > div,
      .amap-zoom-touch-minus > div {
        font-size: 18px;
        line-height: 30px;
        color: #42526e;
      }
    }
  }

  .mapCenterRefresh {
    position: absolute;
    right: 20px;
    bottom: 125px;
    background: #ffffff;
    box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
    border-radius: 4px;
    padding: 6px;
    font-size: 18px;
    line-height: 18px;
    cursor: pointer;
    i {
      color: #42526e;
    }
  }

  // 告警闪烁
  @keyframes warn {
    0% {
      transform: scale(1);
      -webkit-transform: scale(1);
      opacity: 1;
    }

    25% {
      transform: scale(1.5);
      -webkit-transform: scale(1.5);
      opacity: 0.8;
    }

    50% {
      transform: scale(2);
      -webkit-transform: scale(2);
      opacity: 0.6;
    }

    75% {
      transform: scale(2.5);
      -webkit-transform: scale(2.5);
      opacity: 0.4;
    }

    100% {
      transform: scale(3);
      -webkit-transform: scale(3);
      opacity: 0;
    }
  }

  .pulse {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 0px;
    top: 0px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn 1s ease-out;
    -moz-animation: warn 1s ease-out;
    animation: warn 1s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    background-image: radial-gradient(red, transparent);
  }

  .pulse1 {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 0px;
    top: 0px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn 1s ease-out;
    -moz-animation: warn 1s ease-out;
    animation: warn 1s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    animation-delay: 0.5s;
    -webkit-animation-delay: 0.5s;
    background-image: radial-gradient(#ff0000, transparent);
  }

  .mapSearch {
    position: absolute;
    right: 20px;
    top: 20px;
    background: #ffffff;
    box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
    border-radius: 4px;
    padding: 17px;
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    i {
      color: #7a869a;
    }
    .active {
      color: #2c6dd2;
    }
  }
  @keyframes slide-down {
    0% {
      transform: scale(1, 0);
    }
    25% {
      transform: scale(1, 1.2);
    }
    50% {
      transform: scale(1, 0.85);
    }
    75% {
      transform: scale(1, 1.05);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  .select-open {
    animation: slide-down 0.5s ease-in;
    transition: 0.3s ease-in;
    transform-origin: 50% 0;
  }
  .select-close {
    transform: scaleY(0);
    transition: transform 0.2s;
    transform-origin: top center;
  }

  .trajectory-control {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40px;
    margin: auto;
    border-radius: 4px;
    width: 45%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    .control {
      display: flex;
      justify-content: space-between;
      height: 20px;
      line-height: 20px;
      padding: 20px;
      .playIcon {
        margin-right: 5px;
        font-size: 18px;
      }
      .el-slider {
        display: inline-block;
        width: 80%;
        padding: 0 10px;
        .el-slider__runway {
          height: 4px;
          margin: 8px 0;
          background: rgba(255, 255, 255, 0.5);
        }
        .el-slider__bar {
          width: 4px;
          background: #fff;
        }
        .el-slider__button-wrapper {
          width: 16px;
          height: 16px;
          top: -7px;
          .el-slider__button {
            bottom: none;
          }
        }
      }
      .el-select {
        width: 50px;
        margin-left: 10px;
        .el-input__inner {
          background: transparent;
          border: none;
          height: 20px;
          line-height: 20px;
          // text-align: right;
          padding: 0;
        }
        .el-input__icon {
          width: 16px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
