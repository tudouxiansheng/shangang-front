<template>
  <div class="box">
    <div class="box_header">今日总告警处理情况</div>
    <ul class="box_list">
      <li class="box_list_item">
        <div class="box_list_item_header">
          <span>告警总数</span><span>{{ allAlarm.alarmTotal }}个</span>
        </div>
        <div class="box_list_item_chart">
          <div
            class="box_list_item_chart_content"
            :style="changeDataFn(allAlarm.alarmTotal)"
          >
            <div class="box_list_item_header_flash"></div>
          </div>
        </div>
      </li>
      <li class="box_list_item">
        <div class="box_list_item_header">
          <span>已处理</span><span>{{ allAlarm.processedNum }}个</span>
        </div>
        <div class="box_list_item_chart">
          <div
            class="box_list_item_chart_content"
            :style="changeDataFn(allAlarm.processedNum)"
          >
            <div class="box_list_item_header_flash"></div>
          </div>
        </div>
      </li>
      <li class="box_list_item">
        <div class="box_list_item_header">
          <span>进行中</span><span>{{ allAlarm.inProgressNum }}个</span>
        </div>
        <div class="box_list_item_chart">
          <div
            class="box_list_item_chart_content"
            :style="changeDataFn(allAlarm.inProgressNum)"
          >
            <div class="box_list_item_header_flash"></div>
          </div>
        </div>
      </li>
      <li class="box_list_item">
        <div class="box_list_item_header">
          <span>未处理</span><span>{{ allAlarm.untreatedNum }}个</span>
        </div>
        <div class="box_list_item_chart">
          <div
            class="box_list_item_chart_content"
            :style="changeDataFn(allAlarm.untreatedNum)"
          >
            <div class="box_list_item_header_flash"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { allAlarmSituation } from '@/utils/api.js'
export default {
  name: 'barGraph',
  data() {
    return {
      allAlarm: {
        alarmTotal: '',
        inProgressNum: '',
        processedNum: '',
        untreatedNum: '',
      },
    }
  },
  created() {
    this.getDataFn()
  },
  mounted() {
    // this.changeDataFn()
  },
  methods: {
    changeDataFn(value) {
      return {
        width:
          this.allAlarm.alarmTotal == 0
            ? '0px'
            : Math.floor((value / this.allAlarm.alarmTotal) * 339) + 'px',
      }
    },
    getDataFn() {
      let arr = []
      arr.push(this.$route.query.codeType)
      allAlarmSituation({
        alarmTypeCodes: arr,
      }).then((res) => {
        console.log('总告警处理情况', res)
        this.allAlarm.alarmTotal = res.alarmTotal
        this.allAlarm.inProgressNum = res.inProgressNum
        this.allAlarm.processedNum = res.processedNum
        this.allAlarm.untreatedNum = res.untreatedNum
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  .box_header {
    border-left: 4px solid #00fff0;
    font-size: 16px;
    color: #ffffff;
    padding-left: 9px;
    margin-top: 22px;
  }
  .box_list {
    padding: 0 20px;
    .box_list_item {
      .box_list_item_header {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #ffffff;
      }
      .box_list_item_chart {
        padding: 5px;
        width: 351px;
        height: 24px;
        border: 1px solid #27f7e1;
        background-color: rgba(39, 247, 225, 0.1);
        .box_list_item_chart_content {
          position: relative;
          overflow: hidden;
          width: 339px;
          height: 12px;
          background: linear-gradient(90deg, #1a80ff 0%, #28f7e1 100%);
          @keyframes flash {
            from {
              left: 0;
            }

            to {
              left: 100%;
            }
          }
          .box_list_item_header_flash {
            position: absolute;
            width: 0px;
            height: calc(100% + 5px);
            background-color: #fff;
            transform: rotate(30deg);
            box-shadow: 0px 0px 14px 5px rgba(255, 255, 255, 0.7);
            animation: flash 2s linear 0s infinite;
          }
        }
      }
    }
  }
}
</style>
