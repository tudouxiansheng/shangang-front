<template>
  <div class="myTask">
    <div class="myTask-item" v-for="item in data" :key="item.url">
      <div class="myTask-item-left">
        <img :src="item.url" class="left-img" />
      </div>
      <div class="myTask-item-right">
        <div class="myTask-item-top">{{ item.title }}</div>
        <div :class="[item.num.toString().length > 4 ? 'fs30' : 'fs40', 'myTask-item-bottom']">
          {{ item.num }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        // { url: require('../img/alarm.png'), title: this.$t('worktable.AlarmTask'), num: 0, type: 'alarmTask' }, //暂时注释掉告警任务
        {
          url: require('../img/workOrder.png'),
          title: this.$t('worktable.TicketTask'),
          num: 0,
          type: 'workSheetTask',
        },
        { url: require('../img/patrol.png'), title: this.$t('worktable.PatrolTask'), num: 0, type: 'patrol' },
        { url: require('../img/visitor.png'), title: this.$t('worktable.PendingVisitor'), num: 0, type: 'visitor' },
      ],
    }
  },
  props: {
    myTaskData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    myTaskData: {
      handler(newVal) {
        if (newVal) {
          this.data.forEach((item) => {
            item.num = newVal[item.type]
          })
        }
      },
    },
  },
}
</script>
<style scoped lang="scss">
.myTask {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .myTask-item {
    height: 100%;
    display: flex;
    align-items: center;

    .left-img {
      width: 144px;
      height: 114px;
    }

    .myTask-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .myTask-item-top {
        font-size: 20px;
        font-weight: bold;
        text-shadow: 0px 4px 4px rgba(52, 233, 254, 0.25);
        margin-bottom: 5px;
        position: relative;

        &::after {
          display: inline-block;
          content: '';
          background: url('../img/bottomLine.png') no-repeat;
          position: absolute;
          width: 107px;
          height: 12px;
          left: 0;
          bottom: -7px;
        }
      }

      .myTask-item-bottom {
        font-weight: 400;
        color: #3aebff;
        line-height: 57px;
        text-shadow: 0px 3px 6px rgba(58, 235, 255, 0.5);
      }

      .fs40 {
        font-size: 40px;
      }

      .fs30 {
        font-size: 30px;
      }
    }
  }
}
</style>
