<template>
  <!--告警事件弹窗-->
  <div class="dialogDetail-art">
    <div class="infoDiv" style="width: 812px; height: 446px">
      <div class="pDiv" style="position: relative">
        <i class="el-icon-close infoIcon" @click="allfalse"></i>
        <div class="blueSpan">告警详情</div>
        <div class="content" style="display: flex">
          <div class="video myContent">
            <img :src="infoObj.alarmSnapUrl" class="alarmImg" v-if="infoObj.alarmSnapUrl" />
            <img :src="require('@/assets/alarmImg/' + iconSty(infoObj) + '.png')" class="alarmImg1" v-else />
          </div>
          <div style="margin-left: 25px">
            <div>
              <div class="title">
                <span class="blueSpan">告警等级：</span>
                <div class="rangeJ" :class="setLevelClass(infoObj.alarmLevel)">
                  {{ setAlarmLevel(infoObj.alarmLevel) }}
                </div>
              </div>
              <div class="title"><span class="blueSpan">告警时间：</span>{{ infoObj.alarmTime }}</div>
              <div class="title"><span class="blueSpan">告警设备名称：</span>{{ infoObj.deviceName }}</div>
              <div class="title"><span class="blueSpan">告警类型：</span>{{ infoObj.alarmTypeName }}</div>
              <div class="title"><span class="blueSpan">告警状态：</span>{{ setCheckState(infoObj.confirmState) }}</div>
              <div class="title">
                <span class="blueSpan">事件处理：</span>
                <span style="color: #00ccff; cursor: pointer" @click="clickDeal(infoObj.alarmId)">请点击处理</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 11px">
          <div style="display: inline-block; margin-right: 43px; cursor: pointer" @click="goToLive(infoObj)">
            <span style="display: flex; align-items: center"
              ><img src="@/assets/alarmImg/实况.png" alt="" style="width: 22px; margin-right: 5px" />实况</span
            >
          </div>
          <div style="display: inline-block; cursor: pointer" @click="goToVideo(infoObj)">
            <span style="display: flex; align-items: center"
              ><img src="@/assets/alarmImg/录像.png" alt="" style="width: 22px; margin-right: 5px" />回放</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoScreen from "@/mixin/VideoScreen" //查看视频
export default {
  mixins:[VideoScreen],
  props: ['infoObj'],
  methods: {
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
    },
    setAlarmLevel(val) {
      switch (val) {
        case 1:
          return '非常紧急'
        case 2:
          return '紧急'
        case 3:
          return '一般'
        case 4:
          return '低'
      }
    },
    setCheckState(val) {
      switch (val) {
        case 0:
          return '未处理'
        case 1:
          return '进行中'
        default:
          return '已处理'
      }
    },
    //关闭第一页告警
    allfalse() {
      this.$store.commit('dealAialarm', 0)
    },
    //点击处理
    clickDeal(alarmId) {
      //this.$emit('dealAialarm', 1)
      this.$store.commit('dealAialarm', 2)
    },
  },
  computed: {
    iconSty(item) {
      return (item) => {
        if (item.alarmType == 'ALARM_SMOKE_ALARM') {
          return '烟雾'
        } else if (item.alarmType == 'ALARM_GAS_DETECTION') {
          return '燃气'
        } else if (item.alarmType == 'ALARM_PERIMETER_INVASION') {
          return '巡更'
        } else {
          return 'noImg'
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialogDetail-art {
  position: relative;
  z-index: 100;
  pointer-events: none;
  position: fixed;
  z-index: 1000;
  width: 100%;
  min-height: calc(100vh - 65px);
  top: 65px;
  .infoDiv {
    pointer-events: auto;
    width: 340px;
    background: rgba(20, 47, 72, 0.65);
    border-radius: 8px;
    position: absolute;
    margin-left: -400px;
    left: 50%;
    top: 116px;
    background: url('../../../minivisionAlarm/images/800.png');
    background-size: 100% 100%;
    position: fixed;
    left: 50%;
    margin-left: -406px;
    .pDiv {
      color: #edf6f7;
      margin-left: 20px;
      margin-top: 18px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      .content {
        margin-top: 30px;
        height: 100%;
        .title {
          margin-bottom: 12px;
        }
        .rangeJ {
          display: inline-block;
          // width: 48px;
          height: 26px;
          // border: 1px solid #ff0000;
          border-radius: 4px;
          text-align: center;
          line-height: 26px;
          // color: #ff0000;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 14px;
        }
      }
      .blueSpan {
        color: #1efffc;
      }
    }
  }
  .infoIcon {
    color: #edf6f7;
    font-size: 12px;
    position: absolute;
    right: 12px;

    top: -12px;
    cursor: pointer;
    font-size: 18px;
  }
}
.myContent {
  width: 400px;
  height: 300px;
  background: #dff8fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.alarmImg {
  width: 400px;
  height: 300px;
}
</style>
