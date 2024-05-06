<template>
  <div class="screen">
    <div class="personApplication">
      <!-- 左侧按钮 -->
      <div class="left">
        <div
          @click="vehicleControl"
          :class="{
            faceControlAcive: btnActive,
            faceControlUnacive: !btnActive,
          }"
          style="cursor: pointer"
        >
          车辆布控
        </div>
        <div
          @click="vehicleSearch"
          :class="{
            faceControlAcive: !btnActive,
            faceControlUnacive: btnActive,
          }"
          style="cursor: pointer"
        >
          车辆检索
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <vehicle-control v-show="btnActive"></vehicle-control>
        <vehicle-search v-show="!btnActive"></vehicle-search>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleControl from '../vehicleApplications/vehicleControl'
import vehicleSearch from '../vehicleApplications/vehicleSearch'
import { AllcamMap } from '@/utils/map/AllcamMap'

export default {
  components: {
    vehicleControl,
    vehicleSearch,
  },
  data() {
    return {
      // 控制人脸布控、人员检索激活状态
      btnActive: true,
    }
  },
  created() {
    if (AllcamMap.map) {
      AllcamMap.map.clearAllPlots()
    }
  },
  destroyed() {
    if (AllcamMap.map) {
      AllcamMap.map.removeTrack('222')
    }
  },
  mounted() {
    // web-pc交互
    try {
      window.webkitProc(
        'switch_page_by_url',
        JSON.stringify({
          url: 'main-window',
          dialogIdList: ['vehicleApplications'],
        })
      )
    } catch (err) {
      console.log(123)
    }
    // this.vehicleControl()
  },
  methods: {
    vehicleControl() {
      this.btnActive = true
    },
    vehicleSearch() {
      this.btnActive = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import url('../personnelApplication/common.scss');
.personApplication {
  position: relative;
  width: 100%;
  min-height: 988px;
  height: calc(100vh - 70px);
  font-size: 20px;
  .left {
    pointer-events: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 200px;
    position: absolute;
    left: 50px;
    margin-top: 360px;
    transform: translateY(-50%);
    .faceControlUnacive {
      position: relative;
      padding: 10px 15px;
      border-radius: 8px;
      box-sizing: border-box;
      background-color: rgba(3, 63, 108, 0.65);
      font-size: 20px;
      text-align: center;
      color: #e0e4e7;
    }
  }
  .right {
    pointer-events: auto;
    width: 520px;
    min-height: 70%;
    height: 89.8vh;
    position: absolute;
    right: 19px;
    margin-top: 16px;
  }
}
.faceControlAcive {
  position: relative;
  padding: 15px 25px;
  border-radius: 8px;
  box-sizing: border-box;
  background: url('../../../../assets/faceSearch/btnAcive.png') no-repeat center center;
  background-size: 100% 100%;
  color: rgba(255, 255, 255, 1) !important;
  text-align: center;
  font-size: 20px;
}
</style>
