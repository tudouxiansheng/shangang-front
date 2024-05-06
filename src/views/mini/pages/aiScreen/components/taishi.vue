<template>
  <div class="left-banner-first">
    <img src="../images/wrapperxy.png" class="wrapper-img" />
    <div class="title-ai">
      <div class="line"></div>
      <div class="titlename-ai">今日算法告警态势分布</div>
    </div>
    <div class="taishi" id="taishi"></div>
  </div>
</template>

<script>
import { getAlarmTaishi } from '@/utils/api'

export default {
  props: ['callalarm'],
  data() {
    return {
      barChart: null,
      timer: null,
    }
  },
  mounted() {
    this.barChart = this.$echarts.init(document.getElementById('taishi'))
    this.getTaishi()
  },
  watch: {
    callalarm: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal == true) {
        this.getTaishi()
      }
    },
  },
  methods: {
    getTaishi() {
      getAlarmTaishi({
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
        if (res.resultCode == 0) {
          // console.log(res);
          let max = Math.max.apply(
            Math,
            res.alarmNumList.map(function (o) {
              return o.alarmNum
            })
          )

          let maxNum = res.alarmNumList.map((item, index) => {
            return {
              max: max == 0 ? 100 : max,
              name: item.alarmName,
            }
          })
          let newArr = res.alarmNumList.map((item, index) => {
            return item.alarmNum
          })
          console.log(newArr, 'newArr')

          let buildSeries = function (data) {
            let helper = data.map((item, index) => {
              let arr = new Array(data.length)
              arr.splice(index, 1, item)
              return arr
            })

            return [data, ...helper].map((item, index) => {
              console.log('每一项', item)
              return {
                type: 'radar',
                // 折线拐点标志样式
                itemStyle: {
                  color: '#9913FF',
                },
                symbolSize: 10,
                // 线条样式
                lineStyle: {
                  color: index === 0 ? '#9913FF' : 'transparent',
                },
                // 区域填充样式
                areaStyle: {
                  color: index === 0 ? '#9913FF' : 'transparent',
                  opacity: 0.3,
                },
                // 提示框内容
                tooltip: {
                  backgroundColor: 'rgba(50,50,50,0.7)',
                  borderWidth: 0,
                  padding: [5, 10],
                  textStyle: {
                    color: '#FFFFFF',
                    fontFamily: 'sans-serif',
                  },
                  confine: true, // 提示框显示在canvas以内
                  show: index === 0 ? false : true,
                  formatter: function () {
                    return (
                      maxNum[index - 1].name +
                      "<br/><span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#9913FF'></span>" +
                      '告警数 : ' +
                      data[index - 1]
                    )
                  },
                },
                z: index === 0 ? 1 : 2,

                data: [item],
              }
            })
          }

          let saveOption = {
            color: ['#9913FF'],
            tooltip: {
              show: true,
            },
            grid: {
              // 控制图的大小，调整下面这些值就可以，
              x: 40,
              x2: 100,
              y2: 150, // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
            },
            radar: {
              name: {
                textStyle: {
                  color: '#fff',
                  fontSize: 14,
                },
              },
              indicator: maxNum,
              center: ['45%', '50%'],
              splitArea: {
                // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: true,
                areaStyle: {
                  // 分隔区域的样式设置。
                  color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                },
              },
              axisLine: {
                //指向外圈文本的分隔线样式
                lineStyle: {
                  color: '#5278A9',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#5278A9', // 分隔线颜色
                  width: 1, // 分隔线线宽
                },
              },
            },
            series: buildSeries(newArr),
          }

          this.barChart.setOption(saveOption, true)
          tools.loopShowTooltip(this.barChart, saveOption, {
            loopSeries: true,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.left-banner-first {
  width: 456px;
  height: 356px;
  position: relative;

  .wrapper-img {
    width: 456px;
    height: 356px;
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

  #taishi {
    width: 100%;
    position: absolute;
    height: calc(100% - 60px);
    top: 56px;
  }
}
</style>
