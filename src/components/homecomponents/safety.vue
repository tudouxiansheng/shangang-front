<template>
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
    <div class="safety">
      <template v-if="statsList.length">
        <div class="gragh-one" id="barGraph" ref="barGraph"></div>
      </template>
      <div class="empty" v-else>{{ $t('public.empty') }}</div>
    </div>
  </CustomCard>
</template>

<script>
import { getAlarmType2 } from '@/utils/api'
import Dayjs from '../../utils/Dayjs'
import CustomCard from './components/custom-card'
import resizes from '@/mixin/resizes'
export default {
  name: 'safety',
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
      selected1: false,
      selected2: true,
      selected3: false,
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      statsList: [],
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
      this.$echarts.init(this.$refs.barGraph).resize()
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
      this.getSafety(timeCount)
    },
    getSafety(timeCount) {
      getAlarmType2(timeCount).then((res) => {
        if (res.resultCode === 0) {
          let showItems = this.showProperty.showItems
          let ts = showItems.map((s) => s.value)
          this.statsList = res.statsList.filter((s) => ts.includes(s.alarmType))
          if (this.statsList.length) {
            var newArr = this.statsList.map((item, index) => {
              return item.countNum
            })
            var max = Math.max.apply(
              Math,
              this.statsList.map(function (o) {
                return o.countNum
              })
            )
            var maxNum = this.statsList.map((item, index) => {
              return {
                max: max === 0 ? 5 : max,
                min: max === 0 ? -1 : -max / 5,
                name: this.isZh ? item.alarmTypeName : item.alarmType,
              }
            })
            let seriesdata = []
            let seriesvalue = [0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < newArr.length; i++) {
              seriesvalue[i] = newArr[i]
              seriesdata[i] = {
                value: seriesvalue,
                data: [this.statsList[i]],
              }
              seriesvalue = [0, 0, 0, 0, 0, 0, 0]
            }
            let tips = this.$t('alarm.num')
            // console.log(newArr, maxNum)
            let buildSeries = function (data) {
              let helper = data.map((item, index) => {
                let arr = new Array(data.length)
                arr.splice(index, 1, item)
                return arr
              })
              return [data, ...helper].map((item, index) => {
                // console.log('每一项', index, item)
                return {
                  type: 'radar',
                  // 折线拐点标志样式
                  symbolSize: index != 0 ? 'none' : 4,
                  // 线条样式
                  lineStyle: {
                    color: index === 0 ? '#9913FF' : 'transparent',
                  },
                  // 区域填充样式
                  areaStyle: {
                    normal: {
                      // 单项区域填充样式
                      color: {
                        type: 'linear',
                        x: 0, //右
                        y: 0, //下
                        x2: 1, //左
                        y2: 1, //上
                        colorStops: [
                          {
                            offset: 0,
                            color: '#9913FF',
                          },
                          {
                            offset: 0.5,
                            color: 'rgba(0,0,0,0)',
                          },
                          {
                            offset: 1,
                            color: '#9913FF',
                          },
                        ],
                        globalCoord: false,
                      },
                      opacity: 1, // 区域透明度
                    },
                  },
                  // 提示框内容
                  tooltip: {
                    backgroundColor: 'rgba(50,50,50,0.7)',
                    borderWidth: 0,
                    padding: [5, 10],
                    textStyle: {
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontFamily: 'sans-serif',
                    },
                    confine: true, // 提示框显示在canvas以内
                    show: index === 0 ? false : true,
                    formatter: function () {
                      return (
                        maxNum[index - 1].name + "<br/><span class='ra-tips'></span>" + tips + ' : ' + data[index - 1]
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
              grid: {
                position: 'center',
              },
              tooltip: {},
              radar: {
                radius: '55%', // 修改雷达图的大小
                name: {
                  textStyle: {
                    color: '#fff',
                    fontSize: 10,
                  },
                },
                nameGap: 8,
                indicator: maxNum,
                center: ['45%', '55%'],
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
            this.$nextTick(() => {
              let barChart = this.$echarts.init(document.getElementById('barGraph'))
              barChart.setOption(saveOption)
              window.tools?.loopShowTooltip(barChart, saveOption, {
                loopSeries: true,
              })
            })
          } else {
            if (document.getElementById('barGraph')) {
              let barChart = this.$echarts.init(document.getElementById('barGraph'))
              barChart.dispose()
            }
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ra-tips {
  display: inline-block;
  margin-right: 5px;
  border-radius: 10px;
  width: 9px;
  height: 9px;
  background-color: #9913ff;
}

.safety {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  pointer-events: auto;
  top: 0;

  #barGraph {
    width: 100%;
    min-height: 220px;
    max-height: 240px;
    color: #e5e5e5;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    font-size: 26px;
    color: #e9e9e9;
  }

  .inputtext {
    position: absolute;
    right: 15px;
    top: 14px;
    width: 120px;
    border: 1px solid #00ccff;
    opacity: 0.7;
    border-radius: 4px;
    color: #edf6f7;
    height: 40px;
    z-index: 100000;
    // opacity:2 !important;
  }

  .title {
    width: 100%;
    height: 40px;
    padding: 5px 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;

    .left {
      flex: 1;
      display: flex;

      .title-info {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
      }
    }

    .right {
      flex: 1;
      text-align: right;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      z-index: 99;
      font-size: 14px;

      ul {
        display: flex;
        color: #fff;
        align-items: flex-end;

        text-align: right;

        li {
          padding: 2px 6px;
          border-radius: 3px;
          box-sizing: border-box;
          margin: 0 3px;
          cursor: pointer;
          pointer-events: auto;

          &.active {
            background-color: #226fbd;
          }
        }
      }
    }

    img {
      width: 30px;
      margin-left: 10px;
    }
  }
}

.color-blue {
  background: #3696e5;
}
</style>
