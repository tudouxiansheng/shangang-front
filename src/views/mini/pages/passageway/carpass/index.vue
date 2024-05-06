<template>
  <!--车辆进出-->
  <div class="screen">
    <div class="facepass" v-if="showAll">
      <!--左边-->
      <left-content v-show="showLeftBox" :searchTime="searchTime"></left-content>
      <div :class="[showLeftBox ? 'left470 ' : 'left0 ', 'centerItem']" @click="showCollapse">
        <i :class="[showLeftBox ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right', 'colx']"></i>
      </div>
      <!--右边-->
      <right-content @toAllPeopleComeInList="toAllPeopleComeInList" @searchTimexx="searchTimeInfo"></right-content>
    </div>
    <!--查看更多-->
    <carAllContent v-if="!showAll" @toCarComeInList="toCarComeInList"></carAllContent>
  </div>
</template>

<script>
import leftContent from './leftContent.vue'
import RightContent from './rightContent.vue'
import carAllContent from '../component/carManage.vue'
import { AllcamMap } from '../../../../../utils/map/AllcamMap'
import { getRelativeCameraList } from '@/utils/api'
export default {
  components: { leftContent, RightContent, carAllContent },
  data() {
    return {
      showAll: true, //true表示列表界面，false表示查看更多界面
      showLeftBox: true,
      searchTime: {},
    }
  },
  created() {
    // AllcamMap.map.clearAllPlots();
    this.getAccessRelativeCamera()
  },
  destroyed() {
    if (AllcamMap.map) {
      AllcamMap.map.clearAllPlots()
    }
  },
  mounted() {
    if (AllcamMap.map) {
      AllcamMap.map.clearAllPlots()
    }
    this.getAccessRelativeCamera()
  },
  methods: {
    searchTimeInfo(info) {
      console.log(info, 'info')
      this.searchTime = info
    },
    toCarComeInList() {
      this.showAll = true
    },
    toAllPeopleComeInList() {
      this.showAll = false
    },
    showCollapse() {
      this.showLeftBox = !this.showLeftBox
    },
    getAccessRelativeCamera() {
      getRelativeCameraList({ deviceType: 11 }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, '车辆门禁关联的摄像机')
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
