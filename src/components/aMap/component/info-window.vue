<template>
  <div class="camera-info-content" @mouseover="handleMouseover">
    <div class="title">
      {{ deviceInfo.alarmId ? $t('gis.alarmDetail') : getTitle() }}
    </div>
    <i class="el-icon-close" @click="closeWindow" />
    <!-- 设备详情 -->
    <div
      v-if="!deviceInfo.alarmId"
      class="camera-info-detail"
      :style="locale == 'en' ? 'width: 485px;' : 'width: 380px;'"
    >
      <!-- 设备名称 -->
      <div class="camera-info-detail-item">
        <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
          {{ $t('gis.devName') + '：' }}
        </span>
        <span class="item-text" :title="deviceInfo.deviceName">
          {{ deviceInfo.deviceName }}
        </span>
      </div>
      <!-- 设备位置 -->
      <div class="camera-info-detail-item">
        <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
          {{ $t('application.devicePos') + '：' }}
        </span>
        <span class="item-text" :title="deviceInfo.installLocation">
          {{ deviceInfo.installLocation || '未知' }}
        </span>
      </div>
      <!-- 设备状态 -->
      <div class="camera-info-detail-item">
        <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
          {{ $t('gis.devStatus') + '：' }}
        </span>
        <span class="item-text" :class="deviceInfo.status == 1 ? 'success' : 'danger'">
          {{ setStatus(deviceInfo.status) }}
        </span>
      </div>
      <template v-if="deviceInfo.status == 1 && [63, 64].includes(deviceInfo.platType)">
        <template v-if="deviceInfo.deviceType == 10">
          <!-- 大华64的设备拥有设备模式 -->
          <div class="camera-info-detail-item" v-if="deviceInfo.platType == 64">
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
              {{ '设备模式：' }}
            </span>
            <span class="item-text" :title="deviceInfo.installLocation">
              <el-button :type="deviceInfo.workMode == 2 ? 'success' : 'primary'" @click="handleControl('opening')"
                >常开</el-button
              >
              <el-button :type="deviceInfo.workMode == 1 ? 'success' : 'primary'" @click="handleControl('closing')"
                >常关</el-button
              >
              <el-button :type="deviceInfo.workMode == '0' ? 'success' : 'primary'" @click="handleControl('normal')"
                >正常</el-button
              >
            </span>
          </div>
          <div class="camera-info-detail-item">
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
              {{ '远程操作：' }}
            </span>
            <span class="item-text" :title="deviceInfo.installLocation">
              <el-button type="primary" @click="handleControl('openDoor')" :disabled="disableCtrl">远程开门</el-button>
              <!-- 中控63的设备有远程开门 -->
              <el-button
                type="primary"
                v-if="deviceInfo.platType == 63"
                @click="handleControl('closeDoor')"
                :disabled="disableCtrl"
                >远程关门</el-button
              >
            </span>
          </div>
        </template>
        <template v-if="deviceInfo.deviceType == 11">
          <div class="camera-info-detail-item">
            <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
              {{ '远程操作：' }}
            </span>
            <span class="item-text" :title="deviceInfo.installLocation">
              <el-button type="primary" @click="handleControl('openDoor')">远程开闸</el-button>
            </span>
          </div>
        </template>
      </template>
    </div>
    <!-- 告警详情 -->
    <div v-else class="camera-info-detail alarm-wrapper" :style="locale == 'en' ? 'width: 485px;' : 'width: 380px;'">
      <div class="left" v-if="!!snapUrl">
        <div class="left-img">
          <img :src="snapUrl" v-viewer style="" />
        </div>
        <!--        <div v-if="snapUrl" class="camera-info-detail-item">-->
        <!--          <span class="item-label">{{ $t('gis.alarmImg') + '：' }}</span>-->
        <!--          <el-image style="height: 100px; display: inline-block" :src="snapUrl" :preview-src-list="[snapUrl]" />-->
        <!--        </div>-->
      </div>
      <div class="right">
        <div class="camera-info-detail-item">
          <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
            {{ $t('gis.alarmType') + '：' }}
          </span>
          <span class="item-text" :title="deviceInfo.alarmTypeName || ''">
            {{ isZh ? deviceInfo.alarmTypeName : deviceInfo.alarmType || deviceInfo.alarmTypeName }}
          </span>
        </div>
        <div class="camera-info-detail-item">
          <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
            {{ $t('gis.alarmDev') + '：' }}
          </span>
          <span class="item-text" :title="deviceInfo.deviceName || ''">
            {{ deviceInfo.deviceName || '' }}
          </span>
        </div>
        <div class="camera-info-detail-item">
          <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
            {{ $t('application.devicePos') + '：' }}
          </span>
          <span class="item-text" :title="deviceInfo.alarmLocate || deviceInfo.installLocation">
            {{ deviceInfo.alarmLocate || deviceInfo.installLocation }}
          </span>
        </div>
        <div class="camera-info-detail-item">
          <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">
            {{ $t('gis.alarmTime') + '：' }}
          </span>
          <span class="item-text" :title="deviceInfo.alarmTime || ''">
            {{ deviceInfo.alarmTime || '' }}
          </span>
        </div>
        <!--        <div class="camera-info-detail-item">-->
        <!--          <span class="item-label" :style="locale == 'en' ? 'width: 215px;' : ''">-->
        <!--            {{ $t('gis.alarmLevel') + '：' }}-->
        <!--          </span>-->
        <!--          <span class="item-text" :title="setAlarmLevel(deviceInfo.alarmLevel || '')">-->
        <!--            {{ setAlarmLevel(deviceInfo.alarmLevel || '') }}-->
        <!--          </span>-->
        <!--        </div>-->
      </div>
    </div>

    <ul class="camera-operator" v-if="deviceInfo.deviceType == 1">
      <li v-if="!deviceInfo.alarmId && deviceInfo.status == 1" @click="goToRealtime">
        <svg-icon icon-class="realtime-play" />
        <span>{{ $t('public.live') }}</span>
      </li>
      <li v-if="!deviceInfo.alarmId" @click="goToReplay">
        <svg-icon icon-class="record-playback" />
        <span>{{ $t('public.playback') }}</span>
      </li>
      <!--      <li @click="getPeripheryDevList">-->
      <!--        <svg-icon icon-class="periphery" />-->
      <!--        <span>{{ $t('gis.periphery') }}</span>-->
      <!--      </li>-->
      <li @click="favorite" v-if="false">
        <svg-icon :icon-class="collected ? 'collected' : 'favorite'" />
        <span>{{ $t('gis.collect') }}</span>
      </li>
      <li v-if="deviceInfo.alarmId" @click="goToDetail">
        <!--        <svg-icon icon-class="record-playback" />-->
        <span>{{ $t('alarm.checkDetail') }}</span>
      </li>
    </ul>

    <div class="popper__arrow" />
  </div>
</template>
<script>
import devDict from '@/mixin/dev-dict.js'

import { getPresentAzimuth, controlIotDev } from '../../../utils/api'
// import QTPlayer from '../../../utils/video-play'
// import Dayjs from '../../../utils/Dayjs'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  name: 'InfoWindow',
  mixins: [devDict, VideoScreen],
  data() {
    return {
      cuType: sessionStorage.getItem('cuType'),
      locale: localStorage.getItem('locale'),
      deviceInfo: {},
      anglesShow: false,
      snapUrl: '',
      collected: false,

      getDevFlag: false,
      disableCtrl: false,
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  methods: {
    getTitle() {
      if (this.deviceInfo.deviceType == 1) {
        return '摄像机信息'
      }
      if (this.deviceInfo.deviceType == 10) {
        return '门禁设备信息'
      }
      if (this.deviceInfo.deviceType == 11) {
        return '道闸设备信息'
      }
    },
    goToDetail() {
      this.$EventBus.$emit('linkage', this.deviceInfo)
      this.$emit('detail', this.deviceInfo)
      this.$emit('closeInfoWindow')
    },
    initialize(e) {
      this.disableCtrl = false
      this.deviceInfo = e.deviceInfo
      this.anglesShow = e.anglesShow
      this.snapUrl = e.snapUrl
      this.collected = e.collected
      if (this.deviceInfo.platType == 64) {
        if (this.deviceInfo.workMode != 0) {
          this.disableCtrl = true
        }
      }
    },
    handleControl(type) {
      let attr = this.deviceInfo
      const loading = this.$loading({
        lock: true,
        text: '设备操作中，请等待……',
        spinner: 'el-icon-loading',
      })
      switch (type) {
        case 'closing': //常关 远程操作不可使用
          // 禁止选择远程操作
          controlIotDev({
            platId: attr.platId,
            productId: attr.productId,
            operateType: 4,
            module: 1, //门禁为1 对应deviceType映射为2 ，道闸为2 对应deviceType映射为2映射为3
          }).then((res) => {
            if (res.resultCode == 0) {
              this.$message.success('操作成功！')
              this.disableCtrl = true
              this.deviceInfo.workMode = 1
              this.$forceUpdate()
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
              this.$message.success('操作成功！')
              this.disableCtrl = true
              this.deviceInfo.workMode = 2
              this.$forceUpdate()
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
              this.$message.success('操作成功！')
              this.disableCtrl = false
              this.deviceInfo.workMode = 0
              this.$forceUpdate()
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
              this.$message.success('操作成功！')
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
              this.$message.success('操作成功！')
            }
            loading.close()
          })
          break
      }
    },

    setAlarmLevel(val) {
      let name = ''
      if (val == 1) {
        name = this.$t('home.level1')
      } else if (val == 2) {
        name = this.$t('home.level2')
      } else if (val == 3) {
        name = this.$t('home.level3')
      } else {
        name = this.$t('home.level4')
      }
      return name
    },
    handleMouseover() {
      this.$emit('mouse')
    },
    // 关闭窗口
    closeWindow() {
      this.$emit('closeInfoWindow')
      this.$EventBus.$emit('reset')
    },
    anglesChange(val) {
      val ? this.getCameraAngles() : this.removeCanvasLayer()
    },
    // 方位角
    //获取方位角
    async getCameraAngles() {
      const res = await getPresentAzimuth({ cameraId: this.deviceInfo.deviceId })

      if (res.pointList && res.pointList.length) {
        let pos1 = [res.cameraPoint.longitude, res.cameraPoint.latitude]
        let pos2 = [res.pointList[0].longitude, res.pointList[0].latitude]
        this.addSector(pos1, pos2, res.leftBorderAngle, res.rightBorderAngle)
      } else {
        this.removeCanvasLayer()
      }
    },
    removeCanvasLayer() {
      const cameraList = this.$parent.cameraList
      let index = cameraList.findIndex((item) => item.deviceId == this.deviceInfo.deviceId)
      cameraList[index] = { ...cameraList[index], anglesShow: this.anglesShow }

      if (cameraList[index].customLayer) {
        cameraList[index].customLayer.setMap(null)
        cameraList[index].customLayer = null
      }
    },
    //绘制扇形
    addSector(pos11, pos12, leftBorderAngle, rightBorderAngle) {
      let _this = this
      this.$parent.map.plugin('AMap.CustomLayer', () => {
        var canvas = document.createElement('canvas')
        var onRender = function () {
          let size = _this.$parent.map.getSize() //resize

          let width = size.width
          let height = size.height
          canvas.style.width = width + 'px'
          canvas.style.height = height + 'px'
          canvas.width = width
          canvas.height = height //清除画布
          var ctx = canvas.getContext('2d')
          ctx.fillStyle = 'rgba(0,176,255,0.1)'
          ctx.strokeStyle = '#80d8ff'
          ctx.lineWidth = 2
          let pos = _this.$parent.map.lngLatToContainer(pos11)
          let pos2 = _this.$parent.map.lngLatToContainer(pos12)
          let radius = Math.sqrt((pos2.x - pos.x) * (pos2.x - pos.x) + (pos2.y - pos.y) * (pos2.y - pos.y))
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

        const cameraList = this.$parent.cameraList
        let index = cameraList.findIndex((item) => item.deviceId == this.deviceInfo.deviceId)
        cameraList[index] = {
          ...cameraList[index],
          anglesShow: true,
          customLayer: new this.$AMap.CustomLayer(canvas, {
            // zooms: [3, 20],
            alwaysRender: true, //缩放过程中是否重绘，复杂绘制建议设为false
            opacity: 0.6,
            // render: onRender
            // zIndex: 111
          }),
        }
        cameraList[index].customLayer.render = onRender
        cameraList[index].customLayer.setMap(this.$parent.map)
        cameraList[index].customLayer.show()
      })
    },
    // 实时浏览
    goToRealtime() {
      this.goToLive({
        deviceId: this.deviceInfo.deviceId,
        deviceName: this.deviceInfo.deviceName,
        // isDragable: true,
        // leftTopX: 600,
        // leftTopY: 200,
        // rightBottomX: 1100,
        // rightBottomY: 500,
      })

      // this.$store.commit('mapSet/set_playDevId', this.deviceInfo.deviceId)
      // let params = {
      //   cameraId: this.deviceInfo.deviceId,
      //   cameraName: this.deviceInfo.deviceName,
      //   // isDragable: true,
      //   // leftTopX: 600,
      //   // leftTopY: 200,
      //   // rightBottomX: 900,
      //   // rightBottomY: 500,
      // }
      // QTPlayer.realtimePlay(params)
    },
    // 录像回放
    goToReplay() {
      this.goToVideo({
        deviceId: this.deviceInfo.deviceId,
        deviceName: this.deviceInfo.deviceName,
      })
      // let params = {
      //   cameraId: this.deviceInfo.deviceId,
      //   cameraName: this.deviceInfo.deviceName + 'name',
      //   startTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
      //   endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
      //   recordMethod: 0,
      // }
      // QTPlayer.recordPlayback(params)
    },
    // 获取周边
    getPeripheryDevList() {
      this.$emit('getPeriphery')
    },
    // 是否收藏
    favorite() {
      this.$emit('devFavorite', this.collected)
    },
  },
}
</script>

<style lang="scss">
.camera-info-content {
  background: #ffffff;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  border-radius: 4px;
  position: relative;
  .title {
    height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #232c3b;
    padding: 16px 20px 20px;
    border-bottom: 1px solid #ebecf0;
    box-sizing: content-box;
  }
  .el-icon-close {
    position: absolute;
    right: 20px;
    top: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #232c3b;
    cursor: pointer;
  }
  .camera-info-detail {
    margin: 0 20px;
    padding: 10px 0px;
    border-bottom: 1px solid #ebecf0;
    &.alarm-wrapper {
      display: flex;
      align-items: center;
      overflow: hidden;
      .left {
        width: 110px;
        height: 110px;
        margin-right: 15px;
        .left-img {
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        flex: 1;
        overflow: hidden;
        .camera-info-detail-item {
          font-size: 14px;
          font-weight: 400;
          color: #232c3b;
          padding: 10px 0;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          .item-label {
            width: auto;
            display: inline-block;
          }
          .item-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            overflow: hidden;
            flex: 1;
            vertical-align: bottom;
          }
        }
        .flex {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    &-item {
      font-size: 14px;
      font-weight: 400;
      color: #232c3b;
      padding: 10px 0;
      .item-label {
        width: 90px;
        display: inline-block;
      }
      .item-text {
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        width: 270px;
        display: inline-block;
        vertical-align: bottom;
      }
    }
    .flex {
      display: flex;
      justify-content: flex-end;
    }
    .success {
      color: #85ce61;
    }
    .danger {
      color: #d12c2c;
    }
  }
  .camera-operator {
    display: flex;
    justify-content: flex-start;
    padding: 10px 20px;
    li {
      margin-right: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #2c6dd2;
      cursor: pointer;
      .svg-icon {
        margin-right: 8px;
        display: inline-block;
      }
    }
  }

  .popper__arrow,
  .popper__arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }
  .popper__arrow {
    left: 0;
    right: 0;
    margin: auto;
    bottom: -22px;
    border-top-color: #fff;
    border-bottom-width: 0;
    border-width: 12px;
    filter: drop-shadow(3px 2px 9px 0px rgba(108, 108, 108, 0.18));
    &:after {
      content: ' ';
      border-width: 12px;
      bottom: 1px;
      margin-left: -12px;
      border-top-color: #fff;
      border-bottom-width: 0;
    }
  }
}
</style>
