<template>
  <!--巡逻应用-->
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
    <div class="patrol-handle">
      <div class="left">
        <div class="item">
          <img class="img" src="../../assets/bigScreen/ICON/icon_1 .png" alt="" />
          <div class="img-box">
            <div class="patrol-box">
              <img src="../../assets/bigScreen/ICON/icon_3.png" alt="" />
              <div class="label">上报巡检次数</div>
            </div>
            <div class="num">{{ info.pointCount }}</div>
          </div>
        </div>
        <div class="item blue">
          <img class="img" src="../../assets/bigScreen/ICON/icon_2 .png" alt="" />
          <div class="img-box">
            <div class="patrol-box">
              <img src="../../assets/bigScreen/ICON/icon_3.png" alt="" />
              <div class="label">巡检异常次数</div>
            </div>
            <span class="num">{{ info.unusualPointCount }}</span>
          </div>
        </div>
        <div class="type-wrapper">
          <div class="btn">
            <span>已处理</span>
            <span class="processed">{{ info.treatedCount }}</span>
          </div>
          <div class="btn active">
            <span>未处理</span>
            <span class="untreated">{{ info.untreatedCount }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div id="patrolHandle" class="patrol-h"></div>
      </div>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'
import 'echarts-liquidfill'
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
      patrolplan: {
        beginDate: '',
        endDate: '',
      },
      info: {},
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
  created() {
    this.handleSetTimeOut(60 * 1000)
  },
  methods: {
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
      this.handleDisposeInfo(timeCount)
    },
    handleDisposeInfo(params) {
      this.$api.disposeInfo(params).then((res) => {
        if (res.resultCode == 0) {
          this.info = { ...res.info }
          let barChart = this.$echarts.init(document.getElementById('patrolHandle'))
          let value = this.info.disposeRate
          let option = {
            title: [
              {
                text: `处理率  ${value}%`,
                x: 'center',
                y: 'bottom',
                textStyle: {
                  fontSize: '14',
                  fontWeight: '400',
                  color: '#fff',
                },
              },
            ],
            series: [
              {
                type: 'liquidFill', //水位图
                radius: '80%', //显示比例
                center: ['50%', '45%'], //中心点
                amplitude: 20, //水波振幅
                data: [value / 100], // data个数代表波浪数
                color: [
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#017BCD',
                      },
                      {
                        offset: 1,
                        color: '#34C4E3',
                      },
                    ],
                    globalCoord: false,
                  },
                ], //波浪颜色
                backgroundStyle: {
                  borderWidth: 1,
                  color: 'rgba(201,219,252, .4)', //边框内部填充部分颜色
                },
                label: {
                  position: ['52%', '70%'],
                  formatter: value + '%',
                  textStyle: {
                    fontSize: 28,
                    color: '#fff',
                    fontWeight: 'bold',
                  },
                },
                outline: {
                  show: false,
                },
              },
            ],
          }
          barChart.setOption(option)
          window.addEventListener('resize', function () {
            barChart.resize()
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.patrol-handle {
  height: 100%;
  width: 100%;
  display: flex;
  z-index: 1;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;

  .right {
    flex: 1;

    .patrol-h {
      width: 100%;
      height: 100%;
    }
  }

  .left {
    flex: 1;
    height: 100%;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .type-wrapper {
      display: flex;
      font-size: 12px;
      margin-top: 14px;

      .btn {
        box-sizing: border-box;

        &.active {
          margin-left: 16px;
        }

        .processed {
          display: inline-block;
          background: #4293ef;
          padding-left: 6px;
          padding-right: 6px;
          margin-left: 8px;
        }

        .untreated {
          display: inline-block;
          background: #ff8585;
          padding-left: 6px;
          padding-right: 6px;
          margin-left: 8px;
        }
      }
    }

    .item {
      position: relative;
      height: 36px;
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .num {
        padding-left: 22px;
        font-size: 14px;
      }

      &.blue {
        margin-top: 8px;
      }

      .label {
        font-size: 14px;
        padding-left: 6px;
      }

      .img {
        height: 48px;
      }

      .img-box {
        margin-left: 10px;

        .patrol-box {
          display: flex;
        }
      }
    }
  }
}
</style>
