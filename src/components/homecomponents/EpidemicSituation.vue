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
    <div class="alarm-Main" id="epMain"></div>
  </CustomCard>
</template>

<script>
import { epidemicStatistic } from '../../utils/api'
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'

export default {
  props: ['showProperty'],
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
        startTime: '',
        endTime: '',
        passRecord: true,
      }
      if (timeType == 'today') {
        timeCount.startTime = Dayjs().format('YYYY-MM-DD')
        timeCount.endTime = Dayjs().format('YYYY-MM-DD')
      } else if (timeType == 'week') {
        timeCount.startTime = Dayjs().startOf('week').format('YYYY-MM-DD')
        timeCount.endTime = Dayjs().endOf('week').format('YYYY-MM-DD')
      } else if (timeType == 'month') {
        timeCount.startTime = Dayjs().startOf('month').format('YYYY-MM-DD')
        timeCount.endTime = Dayjs().endOf('month').format('YYYY-MM-DD')
      }
      this.handleGetEpidemicStatistic(timeCount)
    },
    handleGetEpidemicStatistic(params) {
      epidemicStatistic(params).then((res) => {
        if (res.resultCode == 0) {
          let tp = {
            ...res.epidemicStatisticsInfo,
          }
          let labelAndEn = {
            normalCount: this.$t('public.normal'),
            temperatureCount: this.$t('public.T_Abnormal'),
            testResultCount: this.$t('public.test_Abnormal'),
            healthCodeCount: this.$t('public.CodeAbnormal'),
            temperAndHealthCount: this.$t('public.T_Code_Abnormal'),
          }
          let temp = []
          Object.keys(tp).map((key) => {
            temp.push({
              label: labelAndEn[key],
              value: tp[key],
            })
          })
          let barChart = this.$echarts.init(document.getElementById('epMain'))
          let xData = temp.map((item) => item.label)
          let yData = temp.map((item) => item.value)
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            grid: {
              left: '5',
              top: '50',
              right: '15',
              bottom: '15',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                data: xData,
                axisLine: {
                  lineStyle: {
                    color: 'rgba(255,255,255,0.12)',
                  },
                },
                axisLabel: {
                  margin: 5,
                  color: '#e2e9ff',
                  interval: this.isZh ? 0 : 'auto',
                  textStyle: {
                    fontSize: 10,
                  },
                },
              },
            ],
            yAxis: [
              {
                minInterval: 1,
                axisLabel: {
                  color: '#e2e9ff',
                },
                axisLine: {
                  show: false,
                },
                axisTick: {
                  lineStyle: {
                    color: 'rgba(255,255,255,0.12)',
                  },
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(255,255,255,0.12)',
                  },
                },
              },
            ],
            series: [
              {
                type: 'bar',
                data: yData,
                barWidth: '10',
                itemStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(0,244,255,1)', // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgba(0,77,167,1)', // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [30, 30, 30, 30],
                    shadowColor: 'rgba(0,160,221,1)',
                    shadowBlur: 4,
                  },
                },
              },
            ],
          }
          barChart.setOption(option)
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
