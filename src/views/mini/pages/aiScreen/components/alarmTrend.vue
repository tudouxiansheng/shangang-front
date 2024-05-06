<template>
  <div class="left-banner-first bottom-banner">
    <img src="../images/wrapperxyz.png" />
    <div class="title-ai">
      <div class="line"></div>
      <div class="titlename-ai">今日告警趋势图</div>
    </div>
    <div id="alarmTrend"></div>
  </div>
</template>

<script>
import { getAlarmTrend } from '@/utils/api'
export default {
  props: ['callalarm'],
  mounted() {
    this.getAlarmTrend()
  },
  watch: {
    callalarm: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal == true) {
        this.getAlarmTrend()
      }
    },
  },
  methods: {
    //获取时间段
    getAlarmTrend() {
      getAlarmTrend({
        alarmTypeList: [
          'ALARM_STAFF_LEAVE',
          'ALARM_STAFF_SLEEP',
          'ALARM_SMOKE',
          'ALARM_HELMET_DETECT',
          'ALARM_USE_PHONE_WHILE_WALKING',
          'ALARM_YELLOW_SMOKE',
          'ALARM_WATER_DETECT',
          'ALARM_WEAR_LABOR_CLOTH',
        ],
      }).then((res) => {
        console.log(res)
        let allaram = res.alarmTendencyInfoList
        let mydealArray = []
        for (let i = 0; i < allaram.length; i++) {
          if (allaram[i].alarmTimeList) {
            let numArray = allaram[i].alarmTimeList.map((item) => {
              return item.alarmNum
            })
            numArray.unshift(allaram[i].alarmName)
            mydealArray.push(numArray)
          }
        }
        console.log(mydealArray, 'mydealArray')

        let barChart = this.$echarts.init(document.getElementById('alarmTrend'))
        let option = {
          tooltip: {
            trigger: 'axis',
          },
          dataset: {
            source: [
              [
                'product',
                '0点',
                '1点',
                '2点',
                '3点',
                '4点',
                '5点',
                '6点',
                '7点',
                '8点',
                '9点',
                '10点',
                '11点',
                '12点',
                '13点',
                '14点',
                '15点',
                '16点',
                '17点',
                '18点',
                '19点',
                '20点',
                '21点',
                '22点',
                '23点',
              ],
              ...mydealArray,
            ],
          },
          xAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#ffffff',
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: '#ffffff',
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
            },
          ],
        }
        barChart.setOption(option)

        // tools.loopShowTooltip(barChart, option, {
        //     loopSeries: true
        // });

        var timer = null
        var count = 0,
          total = 23 // series.data.length
        function autoTip() {
          timer = setInterval(function () {
            var curr = count % total
            barChart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0, // 因为只有一组数据，所以此处应为0
              dataIndex: curr,
            })
            count += 1
          }, 3000)
        }
        autoTip()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.bottom-banner {
  position: fixed;
  bottom: 30px;
  width: 810px;
  height: 326px;
  img {
    width: 100%;
    height: 100%;
  }
  .title-ai {
    position: absolute;
    left: 27px;
    top: 27px;
    display: flex;
    width: 100%;

    .line {
      width: 4px;
      height: 22px;
      background: #00fff0;
    }

    .titlename-ai {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      position: absolute;
      left: 9px;
    }
  }

  #alarmTrend {
    width: 100%;
    position: absolute;
    height: calc(100% - 60px);
    top: 56px;
  }
}
</style>
