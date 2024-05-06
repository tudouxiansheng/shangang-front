<template>
  <!--告警任务处理-->
  <CustomCard :module-name="showProperty.moduleName">
    <ul slot="filter" v-if="showProperty.timeRange && showProperty.timeRange.length">
      <li
        :class="checkData == item.value ? 'active' : ''"
        @click="handleCheckData(item.value)"
        v-for="(item, index) in showProperty.timeRange"
        :key="index"
      >
        {{ isZh ? item.label : item.labelEn }}
      </li>
    </ul>
    <div class="alarm-Main" id="alarmMain" ref="alarmMain"></div>
  </CustomCard>
</template>

<script>
import { getAlarmLevel } from '../../utils/api'
import { alarmOption } from '../../utils/echartsconst'
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'
import resizes from '@/mixin/resizes'
export default {
  props: ['showProperty'],
  mixins: [resizes],
  components: {
    CustomCard,
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  data() {
    return {
      statusData: [],
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      timer: null,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    this.handleSetTimeOut(60 * 1000)
  },
  methods: {
    chartResize() {
      this.$echarts.init(this.$refs.alarmMain).resize()
    },
    handleSetTimeOut(time) {
      this.handleCheckData(this.checkData)
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
    },
    formatStatus(val) {
      if (val == 1) {
        return this.$t('home.level1')
      } else if (val == 2) {
        return this.$t('home.level2')
      } else if (val == 3) {
        return this.$t('home.level3')
      } else if (val == 4) {
        return this.$t('home.level4')
      }
    },
    handleCheckData(timeType) {
      this.checkData = timeType
      let timeCount = {
        timeType: '',
        passRecord: true,
      }
      if (timeType == 'today') {
        timeCount.timeType = 'day'
      } else if (timeType == 'week') {
        timeCount.timeType = 'week'
      } else if (timeType == 'month') {
        timeCount.timeType = 'month'
      }
      this.fetchpatrolPlan(timeCount)
    },
    /**
     * 处理告警状态alarmStatus==2,3都表示已处理，先把所有数据相加
     */
    fetchpatrolPlan(params) {
      getAlarmLevel(params).then((res) => {
        if (res.resultCode == 0) {
          let xData = []
          let deal = []
          let nodeal = []
          res.statsList.map((item) => {
            xData.push(this.formatStatus(item.alarmLevel))
            nodeal.push(item.treatedNum)
            deal.push(item.untreatedNum)
          })

          let barChart = this.$echarts.init(document.getElementById('alarmMain'))
          var barWidth = 10
          alarmOption.legend = {
            itemWidth: 18,
            itemHeight: 10,
            right: '33%',
            top: 30,
            data: [
              {
                name: this.$t('alarm.handled'),
              },
              {
                name: this.$t('alarm.unhandled'),
              },
            ],
            textStyle: {
              color: '#ffffff',
              fontSize: 10,
            },
          }
          alarmOption.xAxis.data = xData
          alarmOption.yAxis.name = this.$t('public.amount')
          alarmOption.series[0].data = nodeal
          alarmOption.series[0].name = this.$t('alarm.handled')
          alarmOption.series[1].data = deal
          alarmOption.series[1].name = this.$t('alarm.unhandled')
          barChart.setOption(alarmOption)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.alarm-Main {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 100%;
  position: absolute;
  pointer-events: auto;
  top: 0;
}
</style>
