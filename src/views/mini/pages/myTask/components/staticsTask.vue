<template>
  <div class="statics">
    <!-- <div class="statics-left flex-col">
      <div class="left-top flex-col">
        <div class="num">
          {{ data.alarm }}
          <span>{{ $t('worktable.pieces') }}</span>
        </div>
        <img src="../img/staticsIcon.png" alt="" />
        <div class="alarm-task">{{ $t('worktable.AlarmTask') }}</div>
      </div>
      <div class="left-bottom">
        <div class="left-bottom-top">
          <div class="left-data">
            {{ $t('worktable.processed') }}
            <span>{{ data.process }}</span>
          </div>
          <div class="right-data">
            {{ $t('worktable.unprocessed') }}
            <span>{{ data.unprocessed }}</span>
          </div>
        </div>
        <div class="left-bottom-bottom">
          <div class="line" :style="{ width: Ratio + '%' }"></div>
        </div>
      </div>
    </div> -->
    <div class="statics-right" ref="bar"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {
        alarm: 27,
        process: 400,
        unprocessed: 400,
      },
      xData: [
        // this.$t('worktable.AlarmTask'),
        this.$t('worktable.TicketTask'),
        this.$t('worktable.PatrolTask'),
        this.$t('worktable.PendingVisitor'),
      ],
      yData: [],
      big: 0,
      bar: null,
    }
  },
  props: {
    staticsData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    Ratio() {
      const { process, unprocessed } = this.data
      return (process / (unprocessed + process)) * 100
    },
  },
  methods: {
    // 柱状图
    init() {
      this.bar = this.$echarts.init(this.$refs.bar)
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(17,95,182,0.5)',
          transitionDuration: 0,
          textStyle: {
            color: '#fff',
          },
          formatter: function (params) {
            return params[1].name + ': ' + params[1].value
          },
        },
        grid: {
          left: '12%',
          right: '12%',
          top: '25%',
          bottom: '25%',
        },
        xAxis: {
          data: this.xData,
          show: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#9CBFD6',
              opacity: 1,
            },
          },
          // x轴字体
          axisLabel: {
            interval: 0,
            textStyle: {
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
            },
            margin: 12, // 刻度标签与轴线之间的距离。
          },
        },
        yAxis: [
          {
            min: 0,
            max: this.big,
            name: this.$t('worktable.quantity'),
            nameTextStyle: {
              align: 'left',
              color: 'rgba(255,255,255,0.8)',
              padding: [0, 0, 0, -20],
              fontSize: 14,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#FFF',
                opacity: 0.4,
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#2D4377',
              },
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
              },
            },
          },
        ],
        legend: {
          top: '5%',
          left: '50%',
          textStyle: {
            color: '#D2E0F1',
            fontSize: 14,
          },

          itemGap: 12, // 设置间距
        },
        series: [
          {
            // 三个最低下的圆片
            name: '',
            type: 'pictorialBar',
            symbolSize: [14, 7],
            symbolOffset: [0, -1],
            z: 12,
            itemStyle: {
              opacity: 1,
              color: function (params) {
                var a = params.name.slice(0, 2)
                return new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#12B9DB', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#007AFF', // 100% 处的颜色
                    },
                  ],
                  false
                )
              },
            },
            data: [0.5, 0.5, 0.5, 0.5],
          },

          // 下半截柱状图
          {
            type: 'bar',
            barWidth: 14,
            barGap: '-100%',
            itemStyle: {
              // lenged文本
              opacity: 0.7,
              color: function (params) {
                var a = params.name.slice(0, 2)
                return new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#28CFFF', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(43,141,187,0.35)', // 100% 处的颜色
                    },
                  ],
                  false
                )
              },
            },

            data: this.yData,
          },

          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [14, 7],
            symbolOffset: [0, -4],
            z: 13,
            itemStyle: {
              opacity: 1,
              color: function (params) {
                var a = params.name.slice(0, 2)

                return new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#28CFFF', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#28CFFF', // 100% 处的颜色
                    },
                  ],
                  false
                )
              },
            },
            symbolPosition: 'end',
            data: this.yData,
          },

          {
            name: '', //头部
            type: 'pictorialBar',
            symbolSize: [14, 7],
            symbolOffset: [0, -3],
            z: 12,
            symbolPosition: 'end',
            itemStyle: {
              color: '#2B8DBB',
              opacity: 0.9,
            },
            data: new Array(3).fill(this.big),
          },
          {
            name: '',
            type: 'bar',
            barWidth: 14,
            barGap: '-100%',
            z: 0,
            itemStyle: {
              color: '#80D8FF',
              opacity: 0.3,
            },
            data: new Array(3).fill(this.big),
          },
        ],
      }
      this.bar.setOption(option)
    },
    // 处理最大值
    handleBigData(num) {
      const len = String(num).length
      const factor = Math.pow(10, len - 1)
      return Math.ceil(num / factor) * factor
    },
  },
  watch: {
    staticsData: {
      handler(newVal) {
        if (newVal) {
          this.yData = []
          const { doMyTaskInfo } = newVal
          const defaultKeys = ['workSheetTask', 'patrol', 'visitor']
          defaultKeys.forEach((item) => {
            this.yData.push(doMyTaskInfo[item])
          })
          this.yData = this.yData.map((item) => {
            typeof item == 'undefined' && (item = 0)
            return item
          })
          // 最大值小于5则取5,避免数量出现小数的情况
          const bigNum = Math.max(...this.yData)
          this.big = bigNum > 5 ? this.handleBigData(bigNum) : 5
          this.init()
        }
      },
    },
  },
}
</script>
<style scoped lang="scss">
.statics {
  display: flex;
  height: 100%;

  .statics-left {
    /* flex: 0.36; */
    width: 360px;
    align-items: center;

    .left-top {
      align-items: center;
      height: 75%;

      .num {
        font-size: 30px;
        font-weight: 400;
        color: #3aebff;

        span {
          font-size: 12px;
        }
      }

      .alarm-task {
        font-size: 18px;
        font-weight: bold;
        position: relative;

        &::before,
        &::after {
          display: block;
          content: '';
          position: absolute;
          background: url('../img/leftArrow.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 12px;
          height: 12px;
          top: 6px;
          right: -22px;
        }

        &::before {
          left: -24px;
          transform: rotate(180deg);
        }
      }

      img {
        height: 66%;
      }
    }

    .left-bottom {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      padding: 0 0 0 34px;

      .left-bottom-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        .left-data,
        .right-data {
          font-size: 14px;
          font-style: italic;
          position: relative;
          font-weight: 400;

          &.left-data {
            span {
              background: linear-gradient(180deg, #ffffff 0%, #42fdff 100%);
              -webkit-background-clip: text;
              color: transparent;
            }

            &::before {
              background: url('../img/processed.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              top: 3px;
            }
          }

          &.right-data {
            span {
              background: linear-gradient(180deg, #ffffff 0%, #fdbf2d 100%);
              -webkit-background-clip: text;
              color: transparent;
            }

            &::before {
              background: url('../img/unprocessed.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              top: 0;
            }
          }

          span {
            font-weight: bold;
            font-size: 18px;
            margin-left: 5px;
            padding-right: 2px;
          }

          &::before {
            content: '';
            display: block;
            position: absolute;
            width: 28px;
            height: 28px;
            left: -27px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .left-bottom-bottom {
        width: 322xp;
        height: 6px;
        background: rgba(255, 255, 255, 0.12);
        position: relative;

        .line {
          position: absolute;
          top: 0;
          left: 0;
          height: 6px;
          background: linear-gradient(180deg, #42fdff 0%, #47a1ff 100%);

          &::after {
            content: '';
            display: block;
            background: url('../img/lineIcon.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 32px;
            height: 32px;
            position: absolute;
            right: -15px;
            top: -13px;
          }
        }
      }
    }
  }

  .statics-right {
    flex: 1;
  }
}

.flex-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
