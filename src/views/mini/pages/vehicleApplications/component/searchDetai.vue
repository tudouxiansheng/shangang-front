<template>
  <div class="searchDetail">
    <!-- 头部 -->
    <div class="title">
      <span>检索详情</span>
      <el-button type="primary" style="width: 80px" @click="goBack"
        >返<span style="display: inline-block; width: 12px"></span>回</el-button
      >
    </div>
    <!-- 主体 -->
    <div class="mainBox">
      <div class="mainTop">
        <!-- 左侧 -->
        <div style="flex: 1">
          <div class="pDiv">
            <div class="vedio">
              <img
                :src="vehicleDetail.picFileUrl"
                alt=""
                style="
                  width: 100%;
                  height: 100%;
                  margin-left: 50%;
                  transform: translateX(-50%);
                "
              />
            </div>
          </div>
          <div class="pDiv">
            <div class="vedioBtn">
              <div @click="shikuang">
                <img
                  src="../../../../../assets/faceSearch/shikuang.png"
                  alt=""
                  style="vertical-align: middle"
                />
                <span style="padding-left: 5px">实况</span>
              </div>
              <div class="hiufang" @click="huifang">
                <img
                  src="../../../../../assets/faceSearch/huifang.png"
                  alt=""
                  style="vertical-align: middle"
                />
                <span style="padding-left: 5px">回放</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div style="flex: 1">
          <!-- 图片对比部分 -->
          <div class="pDiv">
            <div class="imgs" style="margin-top: 20px">
              <div style="width: 110px">
                <img
                  :src="vehicleDetail.picFileUrl"
                  alt=""
                  style="height: 83px; width: 110px"
                />
                <div
                  style="width: 110px; text-align: center; padding-top: 10px"
                >
                  检索图
                </div>
              </div>
              <div style="width: 110px; margin-left: 15px">
                <img
                  :src="vehicleDetail.thumPicFileUrl"
                  alt=""
                  style="height: 83px; width: 110px"
                />
                <div
                  style="width: 110px; text-align: center; padding-top: 10px"
                >
                  抓拍图
                </div>
              </div>
            </div>
          </div>
          <!-- 抓拍信息 -->
          <div class="pDiv" style="margin-left: 60px; font-size: 14px">
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >抓拍时间:
                <span class="white">{{
                  vehicleDetail.imageTimestamp
                }}</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >抓拍设备名称:
                <span class="white">{{ vehicleDetail.cameraName }}</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >抓拍设备ID:
                <span class="white">{{ vehicleDetail.cameraId }}</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >抓拍图片质量分: <span class="white">80</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >车主姓名:
                <span class="white">{{ vehicleDetail.ownerName }}</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >颜色: <span class="white">白色</span></span
              >
            </div>
            <div style="margin-top: 15px">
              <span class="alarmDetails"
                >车辆类型: <span class="white">轿车</span></span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 特征值 -->
      <!-- <div class="mainBottom">
        <span class="character">女</span>
      </div> -->
    </div>
  </div>
</template>
<script>
import { formatDateTime } from '@/utils/mutil.js'
export default {
  data() {
    return {
      // 告警详情
      alarmDetail: { captureUrl: '', idPhotoUrl: '', hitTime: '' },
    }
  },
  props: {
    vehicleDetail: {
      type: Object,
    },
  },
  mounted() {},
  methods: {
    goBack() {
      this.$root.$emit('isResultExpansionVisiable')
    },
    // 实况视频
    shikuang() {
      let param = {
        dialogId: 'faceControlShikuang',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
      }
      console.log('打开视频窗...', param)
      window.webkitProc('realtime-play', JSON.stringify(param))
    },
    huifang() {
      let param = {
        dialogId: 'faceControlDetailRecord',
        cameraId: this.alarmDetail.deviceId,
        cameraName: this.alarmDetail.deviceName,
        startTime: formatDateTime(new Date()).substring(0, 10) + ' 00:00:00',
        endTime: formatDateTime(new Date()),
        recordMethod: 0,
      }
      console.log(param, '回放参数')
      window.webkitProc('record-playback', JSON.stringify(param))
    },
    toFaceSearch() {},
  },
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.searchDetail {
  padding: 20px;
  width: 870px;
  position: absolute;
  background: rgba(20, 47, 72, 0.65);
  font-size: 14px;
  top: 0;
  right: 460px;
  .title {
    display: flex;
    justify-content: space-between;
    color: #1efffc;
    height: 35px;
  }
  .mainBox {
    .mainTop {
      display: flex;
      .pDiv {
        margin-top: 10px;
        box-sizing: border-box;
        width: 100%;
        color: #ffffff;
        .vedio {
          width: 400px;
          height: 300px;
          margin-left: 50%;
          transform: translateX(-50%);
        }
        .vedioBtn {
          width: 380px;
          height: 20px;
          margin-left: 50%;
          transform: translateX(-50%);
          div {
            display: inline-block;
            cursor: pointer;
            &:nth-child(2) {
              margin-left: 50px;
            }
          }
        }
        .imgs {
          // display: flex;
          text-align: center;
          width: 380px;
          margin-top: 45px;
          margin-left: 50%;
          transform: translateX(-50%);
          div {
            display: inline-block;
          }
        }
        .alarmDetails {
          color: #1efffc;
          .jinji {
            display: inline-block;
            width: 48px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border: 1px solid #ff0000;
            color: #ff0000;
          }
          .white {
            color: #edf6f7;
          }
        }
      }
    }
    .mainBottom {
      padding-top: 20px;
      box-sizing: border-box;
      width: 100%;

      .character {
        box-sizing: content-box;
        display: inline-block;
        border: 1px solid #00ccff;
        border-radius: 4px;
        height: 24px;
        line-height: 24px;
        padding: 0px 13px;
        color: #00ccff;
        margin-right: 10px;
      }
    }
  }
}
</style>
