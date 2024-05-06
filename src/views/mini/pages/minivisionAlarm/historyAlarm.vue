<template>
  <div class="screen">
    <div id="historyAlarm">
      <div class="main">
        <!-- 全屏展示图表-->
        <div class="bg">
          <div class="headtitle">
            <div class="title">告警事件中心</div>
            <div class="pDiv" style="position: relative; z-index: 10000">
              <i class="el-icon-close infoIcon" @click="allFalse"></i>
            </div>
          </div>
          <!-- <el-row class="tac"> -->
          <div class="content">
            <div class="left">
              <el-col :span="12">
                <el-menu :default-active="active" class="el-menu-vertical-demo">
                  <el-menu-item index="7" @click="flag = '9'">
                    <span slot="title">AI算法告警</span>
                  </el-menu-item>
                  <el-menu-item index="1" @click="flag = '1'">
                    <span slot="title">人员布控告警</span>
                  </el-menu-item>
                  <el-menu-item index="2" @click="flag = '2'">
                    <span slot="title">车辆布控告警</span>
                  </el-menu-item>
                  <!-- <el-menu-item index="5" @click="flag = '5'">
                    <span slot="title">物联业务告警</span>
                  </el-menu-item>
                  <el-menu-item index="6" @click="flag = '6'">
                    <span slot="title">长尾算法告警</span>
                  </el-menu-item> -->
                </el-menu>
              </el-col>
            </div>
            <div class="right">
              <personAlarm v-if="flag === '1'"></personAlarm>
              <carAlarm v-if="flag === '2'"></carAlarm>
              <!-- <internet-Alarm v-if="flag === '5'"></internet-Alarm> -->
              <!-- <longTail v-if="flag === '6'"></longTail> -->
              <AIGiveAnAlarm v-if="flag === '9'" @tabfn="tabfn"></AIGiveAnAlarm>
              <!-- <longTail v-if="flag === '6'"></longTail> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import personAlarm from './personAlarm'
import carAlarm from './carAlarm'
import AIGiveAnAlarm from './AIGiveAnAlarm'
export default {
  components: {
    personAlarm,
    carAlarm,
    AIGiveAnAlarm,
  },
  data() {
    return {
      data1: false,
      flag: '9',
      active: '7',
      infoObj: {},
      // routes:"",
      // [$route.path]:""
    }
  },
  mounted() {
    this.routerJump()
  },
  methods: {
    // 人车应用路由跳转
    routerJump() {
      if (this.$route.query.type) {
        this.type = this.$route.query.type
        // 车辆告警
        if (this.type == 1) {
          this.active = '2'
        }
        // 人员告警
        if (this.type == 2) {
          this.active = '1'
        }
        // AI告警
        if (this.type == 3) {
          this.active = '7'
          this.flag = '9'
        }
      }
    },
    allFalse() {
      this.routes = this.$router.options.routes
      // this.$emit("visiableS", this.data1);
      this.$store.commit('closeMoreAlarm', true)
    },
    tabfn(value) {
      this.infoObj = value
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

  .main {
    width: 100%;
    min-height: 800px;
    height: 800px;
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
      transform: translate(-50%, -50%);
      background: url('../../../../assets/aiScreen/alarm-wrapper.png') no-repeat;
      background-size: 100% 100%;

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
        height: calc(100% - 50px);
        .left {
          margin-left: 20px;
          margin-top: 27px;
          width: 180px;
        }
        .right {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
}
.infoIcon {
  font-size: 18px;
}
</style>
