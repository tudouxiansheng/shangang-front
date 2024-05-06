<template>
  <!--人车进出流量-->
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
    <div id="personAndCar" ref="personAndCar"></div>
  </CustomCard>
</template>

<script>
import Dayjs from '../../utils/Dayjs'
import CustomCard from './components/custom-card'
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
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      timer: null,
      barChart: null,
    }
  },
  mounted() {
    this.initLint()
    // 访客统计
    this.handleSetTimeOut(60 * 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    chartResize() {
      this.$echarts.init(this.$refs.personAndCar).resize()
    },
    handleSetTimeOut(time) {
      this.handleCheckData(this.checkData)
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
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
      this.handleGetData(timeCount)
    },
    handleGetData(parmas) {
      this.$api.showTraffic(parmas).then((res) => {
        if (res.resultCode == 0) {
          let dateList = []
          let dataCount = {
            person: [],
            car: [],
          }
          let label = this.isZh ? '日' : 'day'
          if (this.checkData == 'today') {
            label = this.isZh ? '时' : 'H'
          } else {
            label = this.isZh ? '日' : 'day'
          }
          res.charts.map((item) => {
            dateList.push(`${item.label}${label}`)

            dataCount.person.push(item.personCount)
            dataCount.car.push(item.vehicleCount)
          })
          let series = [
            {
              name: this.isZh ? '人员' : 'Person',
              type: 'line',
              smooth: true,
              showSymbol: false,
              symbol: 'circle',
              symbolSize: 6,
              data: dataCount.person,
              yAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(199, 237, 250,0.5)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(199, 237, 250,0.2)',
                      },
                    ],
                    false
                  ),
                },
              },
              itemStyle: {
                normal: {
                  color: '#9D1EFF',
                },
              },
              lineStyle: {
                normal: {
                  width: 3,
                },
              },
            },
            {
              name: this.isZh ? '车辆' : 'Car',
              type: 'line',
              smooth: true,
              showSymbol: false,
              symbol: 'circle',
              symbolSize: 6,
              yAxisIndex: 1,
              data: dataCount.car,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(199, 237, 250,0.5)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(199, 237, 250,0.2)',
                      },
                    ],
                    false
                  ),
                },
              },
              itemStyle: {
                normal: {
                  color: '#3170FF',
                },
              },
              lineStyle: {
                normal: {
                  width: 3,
                },
              },
            },
          ]
          this.barChart.setOption({
            xAxis: {
              data: dateList,
            },
            series: series,
          })
        }
      })
    },
    initLint() {
      this.barChart = this.$echarts.init(document.getElementById('personAndCar'))
      let option = {
        // title: {
        //   text: '今日&昨日',
        //   left: '50%',
        //   textAlign: 'center',
        // },
        grid: {
          borderWidth: 0,
          top: 70,
          left: 45,
          right: 45,
          bottom: 35,
          textStyle: {
            color: '#fff',
            fontSize: 10,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#ddd',
            },
          },
          backgroundColor: 'rgba(255,255,255,1)',
          padding: [5, 10],
          textStyle: {
            color: '#7588E4',
          },

          extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)',
        },
        legend: {
          top: 30,
          right: '35%',
          // orient: 'vertical',
          textStyle: {
            color: '#ccc',
            fontSize: 10,
          },
          data: [this.isZh ? '人员' : 'Person', this.isZh ? '车辆' : 'Car'],
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#609ee9',
            },
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 10,
              color: '#fff',
            },
          },
        },
        yAxis: [
          {
            type: 'value',
            name: this.isZh ? '人员' : 'Person',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: ['#D4DFF5'],
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 10,
                color: '#fff',
              },
            },
            nameTextStyle: {
              color: '#ffffff',
              fontSize: 10,
            },
          },
          {
            type: 'value',
            name: this.isZh ? '人员' : 'Car',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: ['#D4DFF5'],
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 10,
                color: '#fff',
              },
            },
            nameTextStyle: {
              color: '#ffffff',
              fontSize: 10,
            },
          },
        ],
        series: [],
      }
      this.barChart.setOption(option)
    },
  },
}
</script>

<style lang="scss" scoped>
#personAndCar {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 100%;
  position: absolute;
  pointer-events: auto;
  top: 0;
}
</style>
