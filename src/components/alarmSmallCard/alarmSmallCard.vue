<template>
  <!--告警小弹窗-->
  <div class="alarm-small-card" ref="alarm" @mouseover="handleMouseover">
    <img class="bg-img" src="../../assets/bigScreen/wrapper.png" />
    <div class="alarm-title">
      <div class="alarm-title-name">{{ $t('alarm.alarmTips') }}</div>
      <i class="el-icon-close alarm-close" @click="closeAlarmCard"></i>
    </div>
    <div class="my-alarm-wrapper">
      <div class="left-img" v-if="!!alarmData.alarmSnapUrl">
        <img :src="alarmData.alarmSnapUrl" style="" />
      </div>
      <div class="right-content">
        <div class="item-content">
          <div class="item-label">{{ $t('alarm.alarmType') }}:</div>
          <div class="item-value">{{ alarmData.alarmTypeName }}</div>
        </div>
        <div class="item-content">
          <div class="item-label">{{ $t('application.deviceName') }}:</div>
          <div class="item-value" :title="alarmData.alarmDevName">{{ alarmData.alarmDevName }}</div>
        </div>
        <div class="item-content">
          <div class="item-label">{{ $t('application.devicePos') }}:</div>
          <div class="item-value" :title="alarmData.alarmLocate || alarmData.installLocation">
            {{ alarmData.alarmLocate || alarmData.installLocation }}
          </div>
        </div>
        <div class="item-content">
          <div class="item-label">{{ $t('alarm.alarmTime') }}:</div>
          <div class="item-value">{{ alarmData.alarmTime }}</div>
        </div>

        <div class="primary" v-has-permi="[151]" @click="toDetail">{{ $t('alarm.checkDetail') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGuardHitInfo } from '../../utils/api'
import { permissions } from '../../utils/permissions'

export default {
  props: ['alarmData'],
  created() {
    console.log(this.alarmData)
    this.getPermissions()
  },
  data() {
    return {
      isCheckAlarm: true,
    }
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.isCheckAlarm = await permissions(151) //查看权限
    },
    closeAlarmCard() {
      this.$EventBus.$emit('reset')
      this.$emit('closeCard', 1)
    },
    handleMouseover() {
      this.$emit('mouse')
    },
    toDetail() {
      //告警详情
      console.log(this.alarmData)
      this.$EventBus.$emit('linkage', this.alarmData)
      this.$emit('closeCard', 1, this.alarmData)
      // this.$store.commit('alarmPage', 1)
      // getGuardHitInfo({ alarmId: this.alarmData.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //     if (res.guardHitInfo && Object.keys(res.guardHitInfo).length) {
      //       let alarmInfo = { ...this.alarmData, ...res.guardHitInfo, alarmId: this.alarmData.alarmId }
      //       this.$emit('closeCard', 2, alarmInfo)
      //       this.$store.commit('alarmPage', 1)
      //     } else {
      //       this.$message.warning(this.$t('public.empty'))
      //     }
      //     // console.log(item)
      //   }
      // })
    },
  },
}
</script>

<style lang="scss">
.alarm-small-card {
  pointer-events: auto;
  position: fixed;
  z-index: 1000;
  width: 400px;
  min-height: 210px;
  top: 50%;
  left: 50%;
  //background-color: #2a4a6b;
  font-size: 14px;
  .item-content {
    display: flex;
    margin-bottom: 5px;
    .item-label {
      margin-right: 5px;
      white-space: nowrap;
    }
    .item-value {
      color: #ddd;
      overflow: hidden;
      white-space: nowrap;
      /*文字超出宽度则显示ellipsis省略号*/
      text-overflow: ellipsis;
    }
  }
  .bg-img {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
  .alarm-title {
    color: #ffffff;
    font-size: 16px;
    width: 100%;
    padding: 15px 20px 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    display: flex;
    justify-content: space-between;
    .alarm-close {
      font-size: 20px;
      cursor: pointer;
    }
  }

  .my-alarm-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    .left-img {
      width: 110px;
      height: 110px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .right-content {
      color: #ffffff;
      flex: 1;
      margin-left: 10px;
      font-size: 14px;
      overflow: hidden;
      .alarm-time {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .fx1 {
        //line-height: 30px;
      }

      .primary {
        margin-top: 15px;
        cursor: pointer;
        width: 90px;
        height: 30px;
        background: #00ccff;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
