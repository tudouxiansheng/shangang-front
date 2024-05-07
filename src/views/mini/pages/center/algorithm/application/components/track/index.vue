<template>
  <div id="track" ref="track" v-if="isRouterAlive">
    <div id="container"></div>
    <snapshot-resource
      ref="snapshotResource"
      @startAnimation="startAnimation"
      @pauseAnimation="pauseAnimation"
      @resumeAnimation="resumeAnimation"
      @trackDrectionChange="trackDrectionChange"
      :deviceList="deviceList"
      :deviceListGroup="deviceListGroup"
      :isMarkerMoving="isMoving"
    ></snapshot-resource>
    <info-window ref="infoWindow" v-show="visible" :location="location" :count="count" />
  </div>
</template>

<script>
import loadMap from '@/utils/common/amap'
import InfoWindow from './info-window.vue'
import SnapshotResource from './snapshot-resource'
import devIcon from '@/utils/common/dev-icon'
const { setDevImg } = devIcon()
const person = require('@/assets/img/amap/person.png')
const car = require('@/assets/img/amap/car.png')

export default {
  name: 'TrajectoryAnalysis',
  components: { InfoWindow, SnapshotResource },
  data() {
    return {
      isRouterAlive: true,
      map: null,
      trackMark: null,
      lineArr: [], //回放轨迹
      visible: false,
      infoWindow: undefined,
      deviceListCopy: [],
      deviceList: [], //原始数据
      mapDeviceList: [], //地图摄像机标记list
      deviceListGroup: [], //左侧分组数据
      location: undefined,
      count: 0,
      type: undefined,
      isMoving: false,
      lineObj: null,
      markerList: [],
      // 新加
      ArcGISMap: null,
      ArcMap: null
    }
  },

  watch: {
    isMoving(newVal) {
      if (newVal) {
        this.lineObj.index != undefined
          ? (this.deviceListGroup[this.lineObj.index].isMoving = true)
          : (this.$refs['snapshotResource'].isMoving = true)
      } else {
        if (this.lineObj.index === undefined) {
          this.$refs['snapshotResource'].isMoving = false
        } else {
          this.deviceListGroup[this.lineObj.index].isMoving = false
        }
      }
    }
  },
  mounted() {
    this.deviceList = JSON.parse(this.$route.params.deviceList)
    this.deviceListCopy = JSON.parse(JSON.stringify(this.deviceList))
    this.type = this.$route.params.type
    this.deviceListFormattered()
    this.get_gis_config()
  },
  beforeDestroy() {
    this.map && this.map.destroy()
  },
  methods: {
    deviceListFormattered(trackDrection = 1) {
      this.deviceList = JSON.parse(JSON.stringify(this.deviceListCopy))
      this.deviceList.sort((item1, item2) => {
        if (trackDrection == 1) {
          return parseInt(item1.recordTime) - parseInt(item2.recordTime)
        } else {
          return parseInt(item2.recordTime) - parseInt(item1.recordTime)
        }
      })
      let obj1 = {}
      let obj2 = []
      this.lineArr = []
      this.deviceList.forEach(item => {
        item.recordTime = parseInt(item.recordTime)
        item.recordTimeDate = this.dayjs(item.recordTime).format('YYYY-MM-DD')
        if (item?.longitude && item?.latitude) this.lineArr.push([item?.longitude, item?.latitude])
        obj1[item.cameraId] = obj1[item.cameraId] || item
        obj1[item.cameraId]?.count ? ++obj1[item.cameraId].count : (obj1[item.cameraId].count = 1)
        obj2[item.recordTimeDate]
          ? ''
          : (obj2[item.recordTimeDate] = {
              recordTimeDate: item.recordTimeDate,
              isMoving: false,
              deviceList: []
            })
        obj2[item.recordTimeDate].deviceList.push(item)
      })
      this.mapDeviceList = Object.values(obj1)
      this.deviceListGroup = Object.values(obj2)
    },
    async initMap() {
      await loadMap()
      this.map = new this.$AMap.Map('container', {
        resizeEnable: true,
        zoom: 17
      })
      if (this.lineArr.length > 0) {
        this.map.setCenter(this.lineArr[0])
      }
      if (this.deviceList.length > 0) {
        this.renderCameraMarkers()
        this.renderTrackMark()
      }
      this.map.setFitView()
      this.startAnimation({ trackList: this.lineArr })
    },
    renderCameraMarkers() {
      if (this.gisType == 1) {
        // arcmap
        // 获取镜头列表
        this.mapDeviceList.filter(item => item.latitude && item.longitude)
        this.mapDeviceList.forEach(item1 => {
          Object.assign(item1, {
            visible: true,
            anglesShow: false,
            azimuth: null,
            devicePlay: false
          })
        })
        this.ArcGISMap.createMarkersFun(this.mapDeviceList)
        this.mainView.on('click', event => {
          this.markerClickNum = 0
          this.mainView.hitTest(event, { include: this.ArcGISMap.markerLayer }).then(res => {
            this.markerClickNum++
            if (this.markerClickNum > 1) return
            const results = res.results || []
            if (results.length) {
              let obj = results.find(item => item.graphic.attributes).graphic.attributes || null
              if (!obj) return
              this.closeWindow() // 关闭详情弹框
              this.visible1 = true
              this.count = obj.count
              this.location = obj.cameraName
              this.ArcGISMap.openInfoWindow(
                {
                  latitude: obj.latitude,
                  longitude: obj.longitude
                },
                this.$t('gis.devDetail'),
                this.$refs.infoWindow1.$el
              )
            }
          })
        })
      } else if (this.gisType == 2) {
        // 高德
        this.markerList = []
        this.mapDeviceList.forEach(item => {
          if (item.longitude && item.latitude) {
            let marker = new this.$AMap.Marker({
              map: this.map,
              position: [item.longitude, item.latitude],
              offset: new this.$AMap.Pixel(-10, -10),
              icon: setDevImg(item.ptzType, item.status),
              autoRotation: true,
              zIndex: 9,
              extData: {
                longitude: item.longitude,
                latitude: item.latitude,
                location: item.cameraName,
                count: item.count
              }
            })
            this.markerList.push(marker)
            marker.on('click', e => {
              this.visible = true
              this.location = e.target.getExtData()['location']
              this.count = e.target.getExtData()['count']
              this.createInfoWindow()
              this.infoWindow.open(this.map, [
                e.target.getExtData()['longitude'],
                e.target.getExtData()['latitude']
              ])
            })
            marker.setLabel({
              direction: 'top',
              offset: new this.$AMap.Pixel(0, -15), //设置文本标注偏移量
              content:
                "<div class='mark-label'><div class='mark-label-left'><div>" +
                item.count +
                "</div></div><div class='arrow'></div></div>" //设置文本标注内容
            })
          }
        })
      }
    },
    renderTrackMark() {
      if (this.gisType == 1) {
        // arcmap
        if (this.mapDeviceList.length > 1) {
          // this.ArcGISMap.createTrack(this.mapDeviceList, this.type == 0 ? person : car, this.type == 0 ? [10, 0] : [0, 0], this.type == 0 ? 20 : 30, this.type == 0 ? 30 : 20)
        } else {
          if (this.isMoving === false)
            this.$alert(this.$t('retrieval.onlyOneCamera'), this.$t('public.prompt'))
        }
      } else if (this.gisType == 2) {
        this.trackMark = new this.$AMap.Marker({
          map: this.map,
          icon: this.type == 0 ? person : car,
          offset: this.type == 0 ? new this.$AMap.Pixel(-23, -45) : new this.$AMap.Pixel(-23, -15),
          autoRotation: this.type == 0 ? false : true,
          angle: this.type == 0 ? 0 : 45
        })

        let passedPolyline = new this.$AMap.Polyline({
          map: this.map,
          strokeColor: '#00B1FF', //线颜色
          strokeWeight: 6 //线宽
        })

        this.trackMark.on('moving', e => {
          this.isMoving = true
          passedPolyline.setPath(e.passedPath)
        })
        this.trackMark.on('movealong', () => {
          if (this.isMoving === false)
            return this.$alert(this.$t('retrieval.onlyOneCamera'), this.$t('public.prompt'))
          this.isMoving = false
        })
      }
    },
    createInfoWindow() {
      this.infoWindow = new this.$AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: this.$refs.infoWindow.$el,
        offset: new this.$AMap.Pixel(0, -5)
      })
    },
    startAnimation(obj) {
      if (this.gisType == 1) {
        // arcmap
        this.lineObj = obj
        this.lineArr = obj.trackList
        if (this.lineArr.length > 1) {
          this.ArcGISMap.createTrack(
            this.lineArr,
            this.type == 0 ? person : car,
            this.type,
            this.type == 0 ? 20 : 30,
            this.type == 0 ? 30 : 20
          )
          this.ArcGISMap.move(0, () => {
            this.isMoving = false
          })
          this.isMoving = true
        } else {
          if (this.isMoving === false)
            this.$alert(this.$t('retrieval.onlyOneCamera'), this.$t('public.prompt'))
        }
      } else if (this.gisType == 2) {
        // 高德
        this.renderCameraMarkers()
        this.map.setFitView()
        const zoom = this.map.getZoom()
        this.lineObj = obj
        this.lineArr = obj.trackList
        this.trackMark.moveAlong(this.lineArr, Math.floor(50000 / zoom))
      }
    },
    stopAnimation() {
      this.isMoving = false
      if (this.gisType == 1) {
        // arcmap
        this.ArcGISMap.stopMove()
      } else if (this.gisType == 2) {
        // 高德
        this.trackMark.stopMove()
      }
    },
    pauseAnimation() {
      this.isMoving = false
      if (this.gisType == 1) {
        // arcmap
        this.ArcGISMap.stopMove()
      } else if (this.gisType == 2) {
        // 高德
        this.trackMark.pauseMove()
      }
    },
    resumeAnimation() {
      this.isMoving = true
      if (this.gisType == 1) {
        // arcmap
        this.ArcGISMap.move(1, () => {
          this.isMoving = false
        })
      } else if (this.gisType == 2) {
        // 高德
        this.trackMark.resumeMove()
      }
    },
    // arcgis
    async initArcMap() {
      if (this.map) {
        this.map.destroy()
        this.ArcMap = null
      }
      if (!this.ArcMap) {
        this.ArcGISMap = new ArcGIS({
          mapId: 'container'
        })
        this.ArcGISMap.init().then(async res => {
          this.ArcMap = res.map
          this.mainView = res.mainView
          this.ArcMap.basemap = this.ArcGISMap.baseLayer
          // 自动扩充到点全部显示
          this.ArcGISMap.setFitView(this.mapDeviceList.map(item => [item.longitude, item.latitude]))
          if (this.deviceList.length > 0) {
            this.renderCameraMarkers()
          }
          this.startAnimation({ trackList: this.lineArr })
        })
      } else {
      }
    },
    async trackDrectionChange(trackDrection) {
      await this.stopAnimation()
      this.deviceListFormattered(trackDrection)
      this.initMap()
    }
  }
}
</script>

<style lang="scss">
#track {
  height: 100%;
  width: 100%;
  #container {
    height: 100%;
    width: 100%;
  }
  .esri-popup__content {
    overflow: hidden !important;
  }
}

.amap-marker-label {
  position: relative;
  height: 50px;
  padding: 5px;
  border: none;
  background-color: #fff;
  .mark-label-left {
    display: inline-block;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #3085cb;
    color: #fff;
    font-size: 32px;
    font-family: Arial;
    box-shadow: 0px 3px 6px rgba(48, 133, 203, 0.32);
    border-radius: 8px;
    padding: 0 10px;
  }

  .arrow {
    position: absolute;
    bottom: -24px;
    left: 15px;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-top-color: #fff;
  }
}
</style>
