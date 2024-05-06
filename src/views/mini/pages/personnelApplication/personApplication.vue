<template>
  <div class="screen">
    <div class="personApplication">
      <!-- 左侧按钮 -->
      <div class="left">
        <div
          @click="faceControl"
          :class="{
            faceControlAcive: btnActive,
            faceControlUnacive: !btnActive,
          }"
          style="cursor: pointer"
        >
          人脸布控
        </div>
        <div
          @click="personSearch"
          :class="{
            faceControlAcive: !btnActive,
            faceControlUnacive: btnActive,
          }"
          style="cursor: pointer"
        >
          人员检索
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <face-control v-if="btnActive" @activeSearch="personSearch"></face-control>
        <face-search v-else :imgUrl="toSearhImgUrl"></face-search>
      </div>
      <div class="trackDetail" v-show="trackDetail"></div>
    </div>
  </div>
</template>
<script>
import faceControl from '../personnelApplication/faceControl'
import faceSearch from '../personnelApplication/personSearch'
// import { AllcamMap } from '@/utils/map/AllcamMap'
// import maps from '@/utils/secondMapConfig'
export default {
  components: {
    faceControl,
    faceSearch,
  },
  data() {
    return {
      // 控制人脸布控、人员检索激活状态
      btnActive: true,
      toSearhImgUrl: '',
      trackDetail: false,
    }
  },

  mounted() {
    // this.faceControl()
  },

  created() {
    console.log(1213123)
  },
  methods: {
    faceControl() {
      this.btnActive = true
    },
    personSearch(e) {
      this.btnActive = false
    },
  },
  destroyed() {
    if (this.$store.state.personId) {
      if (AllcamMap.map) {
        AllcamMap.map.removeTrack(this.$store.state.personId)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
// @import url("./common.scss");
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
.trackDetail {
  background: url('./images/645.png');
  width: 645px;
  height: auto;
}
</style>
