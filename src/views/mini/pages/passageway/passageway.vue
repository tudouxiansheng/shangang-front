<template>
  <div class="screen">
    <div id="historyAlarm">
      <div class="main">
        <!-- 全屏展示图表-->
        <div class="bg">
          <div class="headtitle">
            <div class="title">进出口管理</div>
          </div>
          <div class="content">
            <div class="left" style="width: 180px">
              <el-col :span="12">
                <el-menu :default-active="active" class="el-menu-vertical-demo">
                  <el-menu-item index="2" @click="flag = '2'">
                    <span slot="title">人脸门禁管理</span>
                  </el-menu-item>
                  <el-menu-item index="1" @click="flag = '1'">
                    <span slot="title">车辆道闸管理</span>
                  </el-menu-item>
                </el-menu>
              </el-col>
            </div>
            <div class="right" style="flex: 1">
              <carManage v-show="flag === '1'"></carManage>
              <faceManage v-show="flag === '2'"></faceManage>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import carManage from './component/carManage.vue'
import faceManage from './component/faceManage.vue'
import { AllcamMap } from '@/utils/map/AllcamMap'
export default {
  components: {
    carManage,
    faceManage,
  },
  data() {
    return {
      data1: false,
      flag: '2',
      active: '2',
    }
  },
  mounted() {
    if (AllcamMap.map) {
      AllcamMap.map.clearAllPlots()
    }
    this.routerJump()
  },
  methods: {
    routerJump() {
      if (this.$route.query.type) {
        this.type = this.$route.query.type
        if (this.type == 1) {
          this.active = 2
        }
        if (this.type == 2) {
          this.active = 1
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#historyAlarm {
  width: 100%;
  min-height: calc(100vh - 70px);

  .el-col-12 {
    width: 120px;
  }

  .el-menu,
  .menus {
    background: transparent !important;
  }

  .el-menu {
    border-right: 0px;
  }

  .el-menu-item.is-active {
    width: 120px;
    //   height: 60px;
    background: #00aeff !important;
    border-radius: 8px;
  }

  .el-menu-item,
  .el-submenu__title {
    height: 60px;
    line-height: 60px;
  }

  .el-submenu__title,
  .el-menu-item {
    background: transparent !important;
    color: #fff;
  }

  .el-menu-item {
    padding: 0px;
    border-radius: 8px;
    //   margin-left: 32%;
  }

  .el-menu-item * {
    // margin-left: 18%;
  }

  .main {
    width: 100%;
    min-height: 800px;
    height: 800px;
    //   height: calc(100vh - 70px);
    position: relative;

    .bg {
      position: absolute;
      pointer-events: auto;
      width: 1733px;
      height: 100%;
      background: rgba(20, 47, 72, 0.8);
      border-radius: 8px;
      top: 50%;
      left: 50%;
      margin: -350px 0 0 -870px;

      // margin: 0 auto;
      // align-items: center;
      .headtitle {
        display: flex;
        justify-content: space-between;

        .title {
          padding-top: 16px;
          padding-left: 16px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #1efffc;
        }

        .pDiv {
          color: #edf6f7;
          cursor: pointer;
          // margin-top: 15px;
          margin-right: 10px;
          padding: 10px 10px;
        }
      }
      .content {
        display: flex;
        height: 100%;
        .left {
          margin-left: 20px;
          margin-top: 57px;
        }
        .right {
        }
      }
    }
  }
}
</style>
