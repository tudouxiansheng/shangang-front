<template>
  <div class="statistics">
    <div class="statistics-header">
      <el-radio-group class="date-filter" @change="handleChangeRadio" v-model="dateType" fill="#1CA7EF">
        <el-radio-button label="today">{{ $t('public.today') }}</el-radio-button>
        <el-radio-button label="week">{{ $t('public.week') }}</el-radio-button>
        <el-radio-button label="month">{{ $t('public.month') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="statistics-container">
      <div class="part-left">
        <div class="item overview">
          <CustomCard :moduleName="$t('alarm.overview')">
            <div class="overview-wrapper">
              <!--              <div class="echarts" id="overview"></div>-->
              <div class="left-wrapper">
                <div class="alarm-count-wrapper">
                  <div class="alarm-count-item" v-for="(alarm, index) in alarmCount" :key="index">
                    <div class="label">{{ alarm.name }}</div>
                    <div class="value" :class="`c${index}`">{{ alarm.value }}</div>
                  </div>
                </div>
                <div class="echarts-1" id="overview"></div>
              </div>
              <div class="pie" id="overviewPie"></div>
            </div>
          </CustomCard>
        </div>
        <div class="item type">
          <alarm-type :queryDate="filterDate"></alarm-type>
        </div>
      </div>
      <div class="part-right">
        <div class="item trend">
          <alarmTrend :queryDate="filterDate"></alarmTrend>
        </div>
        <div class="item level">
          <CustomCard :moduleName="$t('alarm.levelAnalyze')">
            <div class="echarts" id="level">
              <div
                class="level-item"
                v-for="item in levelList"
                :key="item.alarmLevel"
                :class="`level-item-${item.alarmLevel}`"
              >
                <div class="level-num">{{ item.countNum }}</div>
                <div class="level-label">
                  {{
                    item.alarmLevel == 1
                      ? $t('home.level1')
                      : item.alarmLevel == 2
                      ? $t('home.level2')
                      : item.alarmLevel == 3
                      ? $t('home.level3')
                      : $t('home.level4')
                  }}
                </div>
              </div>
            </div>
          </CustomCard>
        </div>
        <div class="item happen">
          <CustomCard :moduleName="$t('alarm.HighLocation')">
            <div class="echarts" id="happen" v-if="frequentPlace.length">
              <div class="happen-list">
                <div class="happen-item" v-for="(item, index) in frequentPlace" :key="index">
                  <div class="item-list">
                    <div class="index">{{ index + 1 }}</div>
                    <div class="address" :title="item.cameraName">{{ item.cameraName }}</div>
                    <div class="num">{{ item.total }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="echarts" v-else>
              <div class="empty">{{ $t('public.empty') }}</div>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomCard from './component/custom-card'
import alarmType from './component/alarmType'
import alarmTrend from './component/alarmTrend'
import {
  alarmHandelMode,
  getAlarmFrequentPlace,
  getAlarmLevel,
  getAlarmStatus,
  getAlarmTypes,
} from '../../../../utils/api'
import Dayjs from '../../../../utils/Dayjs'
export default {
  name: 'statistics',
  components: {
    CustomCard,
    alarmType,
    alarmTrend,
  },
  data() {
    return {
      dateType: 'today',
      alarmStatus: [],
      alarmTypeCount: [],
      levelList: [],
      alarmCount: [],
      frequentPlace: [],
      overViewChart: null,
      overviewPie: null,
      alarmTypeChart: null,
      trendChart: null,
      filterDate: {
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD 23:59:59'),
      },
    }
  },
  mounted() {
    this.handleInitOverView()
    this.handleInitZhu()
    this.handleRefreshData()
  },
  methods: {
    handleChangeRadio(type) {
      console.log(Dayjs().startOf('week').format('YYYY-MM-DD'))
      let start = Dayjs().format('YYYY-MM-DD 00:00:00')
      let end = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      switch (type) {
        case 'today':
          start = Dayjs().format('YYYY-MM-DD 00:00:00')
          end = Dayjs().format('YYYY-MM-DD HH:mm:ss')
          break
        case 'week':
          start = Dayjs().startOf('week').format('YYYY-MM-DD 00:00:00')
          end = Dayjs().format('YYYY-MM-DD HH:mm:ss')
          break
        case 'month':
          start = Dayjs().startOf('month').format('YYYY-MM-DD 00:00:00')
          end = Dayjs().format('YYYY-MM-DD HH:mm:ss')
          break
        default:
          start = Dayjs().format('YYYY-MM-DD 00:00:00')
          end = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      this.$set(this.filterDate, 'beginTime', start)
      this.$set(this.filterDate, 'endTime', end)
      this.handleRefreshData()
    },
    async handleRefreshData() {
      await this.handleGetAlarmType()
      this.handleGetAlarmLevel()
      this.handleGetAlarmFrequentPlace()
      this.handleAlarmHandelMode()
      // this.handleGetAlarmStatus()
    },
    async handleGetAlarmType() {
      const result = await getAlarmTypes({
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
        beginTime: this.filterDate.beginTime,
        endTime: this.filterDate.endTime,
      })
      if (result.resultCode == 0) {
        this.alarmTypeList = result.alarmTypeList
        this.checkTypeList = this.alarmTypeList.slice(0, 10)
      }
      // console.log(result)
    },
    handleGetAlarmFrequentPlace() {
      let params = {
        startTime: Dayjs(this.filterDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.filterDate.endTime).format('YYYY-MM-DD'),
      }
      getAlarmFrequentPlace(params).then((res) => {
        if (res.resultCode == 0) {
          this.frequentPlace = res.infos
          if (this.frequentPlace.length > 4) {
            this.frequentPlace = this.frequentPlace.slice(0, 4)
          }
        }
      })
    },
    handleGetAlarmLevel() {
      let params = {
        startTime: Dayjs(this.filterDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.filterDate.endTime).format('YYYY-MM-DD'),
      }
      getAlarmLevel(params).then((res) => {
        if (res.resultCode === 0) {
          this.levelList = res.statsList
          if (this.overviewPie) {
            this.overviewPie.dispose()
            this.overviewPie.clear()
            this.overviewPie = null
          }
          let total = 0
          let treatedNum = 0
          let untreatedNum = 0
          this.levelList.map((item) => {
            total += item.countNum
            treatedNum += item.treatedNum
            untreatedNum += item.untreatedNum
          })
          let list = [
            {
              name: this.$t('alarm.alarmTotal'),
              value: total,
            },
            {
              name: this.$t('alarm.alertHandled'),
              value: treatedNum,
            },
            {
              name: this.$t('alarm.unhandledAlarm'),
              value: untreatedNum,
            },
          ]
          this.alarmCount = list
          let list2 = [
            {
              name: this.$t('alarm.alertHandled'),
              value: treatedNum,
            },
            {
              name: this.$t('alarm.unhandledAlarm'),
              value: untreatedNum,
            },
          ]
          let rate = total > 0 ? ((treatedNum / total) * 100).toFixed(1) : 0
          this.handleInitOverView(list, total, list2, rate)
        }
      })
    },
    handleAlarmHandelMode() {
      let params = {
        beginTime: Dayjs(this.filterDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.filterDate.endTime).format('YYYY-MM-DD'),
      }
      if (this.overViewChart) {
        this.overViewChart.dispose()
        this.overViewChart.clear()
        this.overViewChart = null
      }
      alarmHandelMode(params).then((res) => {
        if (res.resultCode == 0) {
          let dictMap = {
            0: this.$t('alarm.handle'),
            1: this.$t('alarm.workOrder'),
            2: this.$t('alarm.mistake'),
          }
          let list = []
          if (res.modeList && res.modeList.length) {
            res.modeList.map((item) => {
              list.push({
                name: dictMap[item.alarmHandleType],
                value: item.countNum,
              })
            })
          } else {
            list = [
              { name: this.$t('alarm.handle'), value: 0 },
              { name: this.$t('alarm.workOrder'), value: 0 },
              { name: this.$t('alarm.mistake'), value: 0 },
            ]
          }
          this.handleInitZhu(list)
        }
      })
    },
    handleGetAlarmStatus() {
      let params = {
        beginTime: Dayjs(this.filterDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.filterDate.endTime).format('YYYY-MM-DD'),
      }
      getAlarmStatus(params).then((res) => {
        if (res.resultCode === 0) {
          this.alarmStatus = res.statsList
        }
      })
    },
    handleInitZhu(list = []) {
      this.overViewChart = this.$echarts.init(document.getElementById('overview'))
      let yName = list.map((item) => item.name)
      let xData = list.map((item) => item.value)
      let barWidth = 10
      let colorList = [
        new echarts.graphic.LinearGradient(1, 0, 0, 1, [
          {
            offset: 1,
            color: '#ffffff',
          },
          {
            offset: 0,
            color: '#3696E5',
          },
        ]),
        new echarts.graphic.LinearGradient(1, 0, 0, 1, [
          {
            offset: 1,
            color: '#ffffff',
          },
          {
            offset: 0,
            color: '#3DFFBB',
          },
        ]),
        new echarts.graphic.LinearGradient(1, 0, 0, 1, [
          {
            offset: 1,
            color: '#ffffff',
          },
          {
            offset: 0,
            color: '#FFCC02',
          },
        ]),
      ]
      let color = ['#3696E5', '#3DFFBB', '#FFCC02']
      let option = {
        // title: {
        //   // 无数据时占位用
        //   show: total === 0, // 判断有没有数据，没有则show为true
        //   textStyle: {
        //     color: '#ccc',
        //     fontSize: 18,
        //   },
        //   text: this.$t('public.empty'),
        //   left: 'center',
        //   top: 'center',
        // },
        backgroundColor: '#204b74',
        grid: {
          left: '5%',
          right: '10%',
          bottom: '5%',
          top: '10%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          formatter: function (params) {
            return params[0].name + ' : ' + params[0].value
          },
        },
        xAxis: {
          show: false,
          type: 'value',
          max: function (value) {
            return value.max + 100
          },
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: yName,
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: function (params, index) {
                  return color[index]
                },
                fontSize: '12',
              },
            },
            data: xData,
          },
        ],
        series: [
          {
            //内
            type: 'bar',
            barWidth,
            legendHoverLink: false,
            symbolRepeat: false,
            itemStyle: {
              color: function (params) {
                return colorList[params.dataIndex]
              },
            },
            data: list,
            z: 1,
          },
          {
            // 背景
            type: 'pictorialBar',
            symbolRepeat: 'fixed',
            symbolMargin: 1,
            symbol: 'rich',
            symbolSize: [3, barWidth],
            itemStyle: {
              normal: {
                color: '#1b346f',
              },
            },
            label: {
              normal: {
                show: false,
                position: 'right',
                distance: 35,
                textStyle: {
                  fontSize: 12,
                  color: '#fff',
                },
                formatter: function (params) {
                  if (params.dataIndex === 0) {
                    total = params.data
                    return ''
                  } else {
                    return ((params.data / total) * 100).toFixed(1) + '%'
                  }
                },
              },
            },
            data: xData.map((item) => (item == 0 ? 1 : item)),
            z: 0,
          },
          {
            //分隔
            type: 'pictorialBar',
            itemStyle: {
              color: '#204b74',
            },
            symbolRepeat: 'fixed',
            symbolMargin: 2,
            symbol: 'rich',
            symbolClip: true,
            symbolSize: [5, barWidth],
            symbolPosition: 'start',
            symbolOffset: [-5, 0],
            data: list,
            z: 2,
          },
        ],
      }
      this.overViewChart.setOption(option)
    },
    handleInitOverView(list = [], total = 0, list2 = [], rate = 0) {
      this.overviewPie = this.$echarts.init(document.getElementById('overviewPie'))
      // let list = [
      //   {
      //     name: '告警总数',
      //     value: 300,
      //   },
      //   {
      //     name: '已处理告警',
      //     value: 150,
      //   },
      //   {
      //     name: '未处理告警',
      //     value: 100,
      //   },
      // ]
      let config = {
        color: ['#FFFFFF', '#04A1FF', '#26CCFF', '#0D76FF'],
        data: list2,
        title: {
          subtext: this.$t('public.rate'),
        },
      }
      let unit = '%'
      let title = this.$t('public.rate')
      let pieOption = {
        backgroundColor: '#204b74',
        tooltip: {
          show: true,
          appendToBody: true,
        },
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: config.color[0],
              },
              {
                offset: 0.25,
                color: config.color[1],
              },
              {
                offset: 0.5,
                color: config.color[2],
              },
              {
                offset: 1,
                color: config.color[3],
              },
            ],
            global: false,
          },
          '#FF7675',
        ],
        title: {
          text: '{a|' + rate + '}{b|' + unit + '}\n{c|' + title + '}',
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 28,
                color: '#fff',
                fontWeight: '500',
                margin: '0 5px 0 0',
              },
              b: {
                fontSize: 12,
                color: '#fff',
                padding: [0, 0, 10, 0],
                fontWeight: '500',
              },
              c: {
                fontSize: 14,
                color: 'rgba(255,255,255,.7)',
                padding: [5, 0],
              },
            },
          },
          subtext: '222222222222',
          top: '32%',
          left: '47%',
          textAlign: 'center',
          itemGap: 280,
          subtextStyle: {
            color: '#fff',
            fontSize: 26,
            align: 'center',
          },
        },
        series: [
          //环形
          {
            name: '',
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['50%', '45%'],
            hoverAnimation: true, //4.x版本使用取消悬浮放大
            label: {
              show: false,
              emphasis: {
                show: false,
              },
            },
            zlevel: 1,
            labelLine: {
              show: false,
            },
            data: list2,
          },
        ],
      }
      this.overviewPie.setOption(pieOption)
    },
  },
}
</script>

<style scoped lang="scss">
.statistics {
  color: #fff;
  width: 1520px;
  //background-color: #fff;
  height: calc(100% - 20px);
  margin: 20px auto auto;
  #level {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .level-item {
      width: 155px;
      height: 100px;
      position: relative;
      &-1 {
        background: url('./images/level1.png') no-repeat;
        background-size: 100% 100%;
        color: #fa3d3d;
      }
      &-2 {
        background: url('./images/level2.png') no-repeat;
        background-size: 100% 100%;
        color: #ff4e00;
      }
      &-3 {
        background: url('./images/level3.png') no-repeat;
        background-size: 100% 100%;
        color: #ffa900;
      }
      &-4 {
        background: url('./images/level4.png') no-repeat;
        background-size: 100% 100%;
        color: #00f5ff;
      }
      .level-num {
        position: absolute;
        top: 0;
        width: 100%;
        height: 74px;
        text-align: center;
        line-height: 74px;
        font-size: 28px;
        padding: 0 10px;
        box-sizing: border-box;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
      .level-label {
        position: absolute;
        bottom: 5px;
        width: 100%;
        font-size: 14px;
        color: #fff;
        text-align: center;
      }
    }
  }
  #happen {
    .happen-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      box-sizing: border-box;
      .happen-item {
        width: 50%;
        height: 66px;
        margin-bottom: 20px;
        padding: 0 10px;
        box-sizing: border-box;
        .item-list {
          width: 100%;
          height: 100%;
          border-radius: 0;
          background: url('./images/rect-bg.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          padding: 0 15px;
          box-sizing: border-box;
          color: #58dbff;
          .index {
            width: 30px;
            text-align: center;
          }
          .address {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
          }
          .num {
            width: 50px;
            font-weight: bold;
            text-align: center;
          }
        }
      }
    }
  }
  .statistics-header {
    text-align: right;
    .date-filter {
      width: 240px;
      margin-bottom: 18px;
      ::v-deep.el-radio-button__inner {
        width: 80px;
      }
    }
  }
  .statistics-container {
    display: flex;
    height: 100%;
    overflow: hidden;
    .more-filter {
      cursor: pointer;
    }
    .item {
      width: 100%;
      background-color: #204b74;
      margin-bottom: 20px;
      border-radius: 4px;
      font-size: 14px;
      overflow: hidden;
      &:last-child {
        margin-bottom: 0;
      }
      .echarts {
        width: 100%;
        height: 100%;
        position: relative;
        .empty {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 18px;
          color: #ccc;
          font-weight: bold;
        }
      }
    }
    .part-left {
      width: 700px;
      margin-right: 20px;
      .overview-wrapper {
        display: flex;
        height: 254px;
        overflow: hidden;
        .left-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          .alarm-count-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 60px;
            .alarm-count-item {
              text-align: center;
              width: 100%;
              .label {
                font-size: 16px;
                margin-bottom: 10px;
              }
              .value {
                font-size: 14px;
                font-weight: bold;
                &.c0 {
                  color: #3696e5;
                }
                &.c1 {
                  color: #3dffbb;
                }
                &.c2 {
                  color: #ffcc02;
                }
              }
            }
          }
          .echarts-1 {
            height: calc(100% - 60px);
          }
        }
        .pie {
          width: 220px;
          overflow: hidden;
        }
      }
      .type {
        height: 528px;
      }
    }
    .part-right {
      flex: 1;
      overflow: hidden;
      .trend {
        height: 296px;
      }
      .level {
        height: 202px;
      }
      .happen {
        height: 304px;
      }
    }
  }
}
</style>
