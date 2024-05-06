<template>
  <!-- 框选设备 -->
  <div class="drawTools">
    <div v-show="closeFlag || resultList.length == 0">
      <div class="title">{{ $t('gis.spatialQuery') }}</div>
      <ul class="draw-ul">
        <li
          v-for="(item, index) in drawTools"
          :key="index"
          class="drawTool"
          @click="drawClick(item.value)"
        >
          <svg-icon
            :icon-class="item.name"
            :class-name="drawType != item.value ? item.name : 'actived'"
          />
        </li>
        <li class="drawTool" @click="clearDrawObj">
          <svg-icon icon-class="draw-clear" class-name="draw-clear" />
        </li>
      </ul>
    </div>
    <div v-show="!closeFlag && resultList.length != 0" class="draw-result">
      <div class="title">{{ $t('gis.spatialQueryResults') }}</div>
      <i class="el-icon-close closeIcon" @click="closeBox" />
      <camera-result
        ref="cameraResult"
        v-show="resultList.length != 0"
        class="cameraResult"
        :result-list="resultList"
        @getDetail="handleClusterDetail"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const cameraResult = () => import('./camera-result.vue')
export default {
  components: {
    'camera-result': cameraResult
  },
  props: {
    map: {
      type: Object,
      default: () => {}
    },
    mouseTool: {
      type: Object,
      default: () => {}
    },
    cameraMarkers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawTools: [
        {
          name: 'draw-circle',
          value: 'circle'
        },
        {
          name: 'draw-center-circle',
          value: 'centerCircle'
        },
        {
          name: 'draw-rectangle',
          value: 'rectangle'
        },
        {
          name: 'draw-polygon',
          value: 'polygon'
        },
        {
          name: 'draw-polyline',
          value: 'polyline'
        }
      ],
      drawType: '', // 绘制图形类型
      resultList: [],
      closeFlag: true,
      centerCircle: null,
      circleEditor: null,

      peripheryCircle: null, // 周边
      peripheryCircleEditor: null,
      overlays: [],
      drawObj: null
    }
  },
  computed: {
    ...mapState({
      toolbarIndex: state => state.mapSet.toolbarIndex
    })
  },
  methods: {
    async drawClick(val) {
      this.removePeriphery()
      let flag = await this.clearDrawObj(val)
      if (!flag) return
      this.drawType = val
      this.resultList = []

      if (val == 'circle') {
        this.drawCircle()
      } else if (val == 'rectangle') {
        this.drawRect()
      } else if (val == 'polygon') {
        this.drawPolygon()
      } else if (val == 'polyline') {
        this.drawPolyline()
      }
    },
    // 画圆
    drawCircle() {
      this.mouseTool.circle({
        fillColor: 'rgb(44, 109, 210)',
        fillOpacity: 0.1,
        strokeColor: '#2C6DD2',
        strokeWeight: 2,
        strokeOpacity: 1,
        cursor: 'move',
        extData: {
          type: 'circle'
        }
      })
    },
    drawCircle1(center) {
      this.centerCircle = new this.$AMap.Circle({
        center,
        radius: 1, //半径
        borderWeight: 1,
        strokeColor: '#2C6DD2',
        strokeWeight: 2,
        strokeOpacity: 1,
        // 线样式还支持 'dashed'
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: 'rgb(44, 109, 210)',
        fillOpacity: 0.1,
        zIndex: 50
      })
      this.centerCircle.setMap(this.map)

      this.circleEditor = new this.$AMap.CircleEditor(this.map, this.centerCircle)
      this.circleEditor.open()
    },
    drawCircle2(center, radius = 1000, cameraId = '') {
      this.peripheryCircle = new this.$AMap.Circle({
        center,
        radius, //半径
        borderWeight: 1,
        strokeColor: '#2C6DD2',
        strokeWeight: 2,
        strokeOpacity: 1,
        // 线样式还支持 'dashed'
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: 'rgb(44, 109, 210)',
        fillOpacity: 0.1
        // zIndex: 50,
      })
      this.peripheryCircle.setMap(this.map)

      this.map.setFitView([this.peripheryCircle]) // 自动适配到合适视野范围

      this.peripheryCircleEditor = new this.$AMap.CircleEditor(this.map, this.peripheryCircle)
      this.peripheryCircleEditor.open()
      this.peripheryCircleEditor.on('adjust', () => {
        this.closeFlag = false
        this.map.setFitView([this.peripheryCircle])
        this.testIsInDrawObj(this.peripheryCircle, cameraId)
      })
    },
    // 画矩形
    drawRect() {
      this.mouseTool.rectangle({
        fillColor: 'rgb(44, 109, 210)',
        fillOpacity: 0.1,
        strokeColor: '#2C6DD2',
        strokeWeight: 2,
        strokeOpacity: 1,
        extData: {
          type: 'polygon'
        }
        //同Polygon的Option设置
      })
    },
    // 画多边形
    drawPolygon() {
      this.mouseTool.polygon({
        fillColor: 'rgb(44, 109, 210)',
        fillOpacity: 0.1,
        strokeColor: '#2C6DD2',
        strokeWeight: 2,
        strokeOpacity: 1,
        extData: {
          type: 'polygon'
        }
      })
    },
    //划线
    drawPolyline() {
      this.mouseTool.polyline({
        isOutline: true,
        outlineColor: '#2C6DD2',
        borderWeight: 1,
        strokeColor: 'rgb(44, 109, 210)',
        strokeWeight: 15,
        strokeOpacity: 1,
        // 折线样式还支持 'dashed'
        strokeStyle: 'solid',
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
        extData: {
          type: 'polyline'
        }
      })
    },
    // 清除按钮
    async clearDrawObj(drawType = '') {
      if (this.overlays.length > 0 || this.centerCircle) {
        const res = await this.$confirm(this.$t('gis.cleraDrawPrompt'), this.$t('gis.prompt'), {
          confirmButtonText: this.$t('gis.confirm'),
          cancelButtonText: this.$t('gis.cancel'),
          closeOnClickModal: false,
          type: 'warning'
        }).catch(() => {
          this.mouseTool.close()
          this.$message({
            type: 'info',
            message: this.$t('gis.canceledClera')
          })
        })
        if (res == 'confirm') {
          this.removeDraw()
          this.drawType = drawType
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    // 清除覆盖物
    removeDraw(flag = 1) {
      if (this.overlays) this.map.remove(this.overlays)
      if (this.centerCircle) this.map.remove(this.centerCircle)
      if (this.circleEditor) this.circleEditor.close()

      this.overlays = []
      this.centerCircle = null
      this.circleEditor = null

      if (flag) {
        this.resultList = []
        this.removePeriphery()
      }
    },
    // 清除周边画圆
    removePeriphery() {
      if (this.peripheryCircle) this.map.remove(this.peripheryCircle)
      if (this.peripheryCircleEditor) this.peripheryCircleEditor.close()
      this.peripheryCircle = null
      this.peripheryCircleEditor = null
    },
    // 判断设备是否在区域内
    testIsInDrawObj(drawObj, deviceId = '') {
      let arr = []
      if (this.drawType == 'polyline') {
        arr = this.pointOnSegment(drawObj.getPath())
      } else {
        this.cameraMarkers.forEach(item => {
          let flag = drawObj.contains(new this.$AMap.LngLat(item.longitude, item.latitude))
          if (flag) {
            arr.push(item)
          }
        })
      }
      // 如果是获取周边设备
      if (deviceId) {
        arr = arr
          .filter(item => item.deviceId == deviceId)
          .concat(arr.filter(item => item.deviceId != deviceId).splice(0, 24))
      }
      this.resultList = arr //框选结果设备列表
      this.closeFlag = arr.length != 0 ? false : true
    },
    pointOnSegment(path) {
      let position = []
      for (let i = 0; i < path.length; i++) {
        const item = path[i]
        position.push([item.lng, item.lat])
      }
      // mp = getResolution() 获取指定位置的地图分辨率，单位：米/像素
      let mp = this.map.getResolution()
      // m 为Polyline宽度的米数
      let m = 15 * mp
      let arr = []

      for (let i = 0; i < position.length - 1; i++) {
        let curPt = position[i]
        let nextPt = position[i + 1]
        for (let j = 0; j < this.cameraMarkers.length; j++) {
          const item = this.cameraMarkers[j]
          let pos = [item.longitude, item.latitude]
          // 判断 marker 是否在线段上，最后一个参数为 m米 的误差
          let inLine = this.$AMap.GeometryUtil.isPointOnSegment(pos, curPt, nextPt, m)
          if (inLine) {
            arr.push(item)
          }
        }
      }
      const res = new Map()
      arr = arr.filter(arr => !res.has(arr.deviceId) && res.set(arr.deviceId, 1))
      return arr
    },
    closeBox() {
      this.closeFlag = true
      this.$store.commit('mapSet/set_toolbarIndex', this.toolbarIndex == 1 ? 1 : -1)
    },
    handleClusterDetail(data) {
      this.$emit('mapOfCamera', data)
    }
  }
}
</script>

<style lang="scss">
.drawTools {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  z-index: 999;
  .title {
    height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #232c3b;
    padding: 16px 20px 20px;
    border-bottom: 1px solid #ebecf0;
    box-sizing: content-box;
  }
  .draw-ul {
    padding: 20px;
    .drawTool {
      display: inline-block;
      padding-right: 28px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      color: #7a869a;
      &:last-child {
        padding-right: 0;
      }
      .actived {
        color: #2c6dd2;
      }
    }
  }
  .draw-result {
    min-width: 250px;
    .closeIcon {
      position: absolute;
      cursor: pointer;
      right: 20px;
      top: 16px;
      font-size: 16px;
    }
    .cameraResult {
      padding: 20px;
      .result-ul {
        max-height: 315px;
      }
    }
  }
}
</style>
