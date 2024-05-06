<template>
  <div v-show="mapShow" id="alarmMap"></div>
</template>

<script>
import loadMap from '@/utils/common/amap'
import ArcGIS from './utils/arcMap'
const ArcGISMap = new ArcGIS()
import devIcon from '@/utils/common/dev-icon.js'
const { setDevImg } = devIcon()
export default {
  data() {
    return {
      mapShow: false,
      gdMap: null,
      ArcGISMap,
      ArcMainView: null,
      marker: '',
      customLayer: '',
      cameraAnglesData: {},
      gisType: 1
    }
  },
  methods: {
    // 获取预置位
    async get_PresetId(alarmId, cameraId) {
      const res = await this.$api.getPresetId({ alarmId })
      this.getCameraAngles(cameraId, res.presetIndex || '')
    },
    // 方位角
    async getCameraAngles(cameraId, presetId) {
      this.cameraAnglesData = {}
      if (presetId) {
        let obj = {
          presetId,
          cameraId
        }
        const res = await this.$api.getAlarmAzimuth(obj)
        if (res.resultCode == 0) {
          this.cameraAnglesData = res
          this.get_CameraInfo(cameraId, res)
        }
      } else {
        this.get_CameraInfo(cameraId, {})
      }
    },

    async get_CameraInfo(cameraId, res) {
      const res1 = await this.$api.getDeviceInfo({ deviceId: cameraId })
      if (res1.resultCode == 0) {
        let longitude = res.cameraPoint ? res.cameraPoint.longitude : res1.deviceInfo.longitude
        let latitude = res.cameraPoint ? res.cameraPoint.latitude : res1.deviceInfo.latitude
        let routeParams = {
          longitude: longitude || '',
          latitude: latitude || '',
          cameraId,
          cameraName: res1.deviceInfo.deviceName
        }
        this.$emit('getRouterParams', routeParams)

        Object.assign(this.cameraAnglesData, {
          cameraPoint: {
            longitude,
            latitude
          },
          deviceType: res1.deviceInfo.deviceType,
          status: res1.deviceInfo.status,
          cameraName: res1.deviceInfo.deviceName,
          cameraId
        })
        if (
          this.cameraAnglesData.cameraPoint.longitude == undefined ||
          this.cameraAnglesData.cameraPoint.latitude == undefined
        ) {
          this.gdMap = null
          this.ArcMainView = null
          this.mapShow = false
          this.$message.warning("该镜头经纬度存在错误");
          return
        }
        this.mapShow = true
        this.get_gis_config()
      } else {
        let routeParams = {
          longitude: '',
          latitude: '',
          cameraId: '',
          cameraName: ''
        }
        this.$emit('getRouterParams', routeParams)
      }
    },
    async get_gis_config(data = { enable: true }) {
      await this.$store.dispatch('mapConfig/get_gis_config_initial')
      const res = await this.$store.dispatch('mapConfig/get_gis_config', data)
      const { form } = res
      this.gisType = form.type || 1
      this.gisType == 1 ? this.initArcMap() : this.initAMap()
      // this.initAMap()
    },
    // 初始化地图
    async initAMap() {
      if (!this.gdMap) {
        const res = await loadMap()
        const { AMap } = res
        let config = {
          resizeEnable: true,
          zoom: 16
        }
        this.gdMap = new AMap.Map('alarmMap', config)
      }
      this.mapHandle()
    },
    //将镜头加载到地图上面
    loadCameraToMap(data) {
      this.marker && this.gdMap.remove(this.marker)
      // 将 Icon 实例添加到 marker 上:
      this.marker = new this.$AMap.Marker({
        title: data.cameraName,
        position: [data.cameraPoint.longitude, data.cameraPoint.latitude],
        offset: new this.$AMap.Pixel(-16, -16),
        icon: new this.$AMap.Icon({
          size: new this.$AMap.Size(32, 32), // 图标尺寸
          image: setDevImg(data.deviceType, data.status) // Icon的图像
        }) // 添加 Icon 实例
      })
      this.gdMap.add(this.marker)
    },
    mapHandle() {
      this.loadCameraToMap(this.cameraAnglesData)
      this.get_CameraAngles(this.cameraAnglesData)
      const { longitude, latitude } = this.cameraAnglesData.cameraPoint
      const position = new this.$AMap.LngLat(longitude, latitude)
      this.gdMap.setZoom(16)
      this.gdMap.setCenter(position)
    },

    get_CameraAngles(res) {
      this.removeCanvasLayer()
      if (res.pointList && res.pointList.length) {
        let pos1 = [res.cameraPoint.longitude, res.cameraPoint.latitude]
        let pos2 = [res.pointList[0].longitude, res.pointList[0].latitude]
        this.addSector(pos1, pos2, res.leftBorderAngle, res.rightBorderAngle)
      }
    },
    removeCanvasLayer() {
      if (this.customLayer != '') {
        this.gdMap.remove(this.customLayer)
        this.customLayer = ''
      }
    },
    //绘制扇形
    addSector(pos11, pos12, leftBorderAngle, rightBorderAngle) {
      let _this = this
      this.$AMap.plugin('AMap.CustomLayer', () => {
        let canvas = document.createElement('canvas')
        let onRender = function () {
          let size = _this.gdMap.getSize() //resize
          let width = size.width
          let height = size.height
          canvas.style.width = width + 'px'
          canvas.style.height = height + 'px'
          let retina = _this.$AMap.Browser.retina
          if (retina) {
            //高清适配
            width *= 2
            height *= 2
          }
          canvas.width = width
          canvas.height = height //清除画布
          let ctx = canvas.getContext('2d')
          ctx.fillStyle = 'rgba(0,176,255,0.1)'
          ctx.strokeStyle = '#80d8ff'
          ctx.lineWidth = 2
          let pos = _this.gdMap.lngLatToContainer(pos11)
          let pos2 = _this.gdMap.lngLatToContainer(pos12)
          let radius = Math.sqrt(
            (pos2.x - pos.x) * (pos2.x - pos.x) + (pos2.y - pos.y) * (pos2.y - pos.y)
          )
          ctx.beginPath()
          ctx.moveTo(pos.x, pos.y)
          ctx.arc(
            pos.x,
            pos.y,
            radius,
            ((leftBorderAngle - 90) / 180) * Math.PI,
            ((rightBorderAngle - 90) / 180) * Math.PI,
            false
          )
          ctx.lineTo(pos.x, pos.y)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()
        }
        this.customLayer = new this.$AMap.CustomLayer(canvas, {
          alwaysRender: true, //缩放过程中是否重绘，复杂绘制建议设为false
          opacity: 0.6
        })
        this.customLayer.render = onRender
        this.customLayer.setMap(this.gdMap)
        this.customLayer.show()
      })
    },

    async initArcMap() {
      if (this.gdMap) {
        this.gdMap.destroy()
        this.ArcMainView = null
      }
      if (!this.ArcMainView) {
        const res = await this.ArcGISMap.init('alarmMap')
        const { mainView } = res
        this.ArcMainView = mainView
      } else {
        this.ArcGISMap.clearMarker()
      }
      this.arcMarkerShow()
    },
    arcMarkerShow() {
      const { deviceType, status, cameraPoint, pointList, leftBorderAngle, rightBorderAngle } =
        this.cameraAnglesData
      const { longitude, latitude } = cameraPoint
      let data = {
        longitude,
        latitude,
        deviceType,
        status
      }
      this.ArcGISMap.createMarker(data)

      this.ArcGISMap.removeAzimuth()
      if (pointList && pointList.length) {
        let center = [cameraPoint.longitude, cameraPoint.latitude]
        let pos1 = [pointList[0].longitude, pointList[0].latitude]
        this.ArcGISMap.drawAzimuth({ center, pos1, leftBorderAngle, rightBorderAngle })
      }
    }
  }
}
</script>

<style>
#alarmMap {
  height: 200px;
}
</style>
