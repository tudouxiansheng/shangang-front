<template>
  <!--人员进出-->
  <div class="screen">
    <div class="facepass" v-if="showAll">
      <!--左边-->
      <left-content v-show="showLeftBox" :searchInfo="searchInfo"></left-content>
      <div :class="[showLeftBox ? 'left470 ' : 'left0 ', 'centerItem']" @click="showCollapse">
        <i :class="[showLeftBox ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right', 'colx']"></i>
      </div>

      <!--右边-->
      <right-content @toAllPeopleComeInList="toAllPeopleComeInList" @searchTime="searchTime"></right-content>
    </div>
    <!--查看更多-->
    <faceAllContent v-if="!showAll" @toPeopleComeInList="toPeopleComeInList"></faceAllContent>
  </div>
</template>

<script>
import leftContent from './leftContent.vue'
import RightContent from './rightContent.vue'
import faceAllContent from '../component/faceManage.vue'
import { getRelativeCameraList } from '@/utils/api'
import { AllcamMap } from '@/utils/map/AllcamMap'
export default {
  components: { leftContent, RightContent, faceAllContent },
  data() {
    return {
      showAll: true, //true表示列表界面，false表示查看更多界面
      showLeftBox: true,
      searchInfo: {},
    }
  },
  mounted() {
    // AllcamMap.map.clearAllPlots();
    this.getAccessRelativeCamera()
  },
  destroyed() {
    if (this.$store.state.faceOperateId) {
      if (AllcamMap.map) {
        AllcamMap.map.removeHistoryTrack(this.$store.state.faceOperateId)
      }
    }
    if (AllcamMap.map) {
      AllcamMap.map.removeIcon('access')
      AllcamMap.map.removeIcon('device_aicamera')
    }
  },
  methods: {
    searchTime(info) {
      this.searchInfo = info
    },
    showCollapse() {
      this.showLeftBox = !this.showLeftBox
    },
    toPeopleComeInList() {
      this.showAll = true
    },
    toAllPeopleComeInList() {
      this.showAll = false
    },
    getAccessRelativeCamera() {
      getRelativeCameraList({ deviceType: 10 }).then((res) => {
        if (res.resultCode == 0) {
          if (AllcamMap.map) {
            AllcamMap.map.loadAccessRCamerIcon(
              res.accessList ? res.accessList : [],
              res.cameraList ? res.cameraList : [],
              true
            )
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.facepass {
  position: relative;
  width: 100%;
  min-height: 900px;
  height: calc(100vh - 65px);
  display: flex;
  font-size: 16px;
}

.colx {
  color: #1efffc;
}
.left0 {
  left: 0;
  background: rgba(12, 25, 44, 0.5);
  border-radius: 0 10px 10px 0;
  width: 16px;
  height: 50px;
  position: absolute;
  top: 50%;
}
.left470 {
  left: 470px;
  background: rgba(12, 25, 44, 0.5);
  border-radius: 0 10px 10px 0;
  width: 16px;
  height: 50px;
  position: absolute;
  top: 50%;
}
.centerItem {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 10000;
}
</style>
