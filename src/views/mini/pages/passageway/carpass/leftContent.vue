<template>
  <div class="leftContent">
    <!--第一个模块-->
    <!--第一个模块-->
    <div class="firstmodule">
      <div class="firstTiltle">
        {{ $t('passageway.onAndOff') }}
        <img src="../../../../../assets/bigScreen/BigIcon/标题装饰.png" class="img" />
      </div>
      <div class="showOnlineNum">
        <div class="box1">
          <img src="../../../../../assets/passway/online.png" class="box1img" />
          <div class="num">{{ accessStateCount.total }}</div>
          <div>{{ $t('public.deviceTotal') }}({{ $t('public.unit') }})</div>
        </div>
        <div class="box2">
          <div class="leftbox fxc">
            <img src="../../../../../assets/passway/box1.png" class="myimg" />
            <div class="bili">
              <span class="size">{{ accessStateCount.onlinePercentage }}</span
              >%
            </div>
            <div class="line">{{ $t('passageway.online') }}:{{ accessStateCount.online }}</div>
          </div>
          <div class="rightbox fxc">
            <img src="../../../../../assets/passway/box1.png" class="myimg" />
            <div class="bili">
              <span class="size">{{ accessStateCount.offlinePercentage }}</span
              >%
            </div>
            <div class="line">{{ $t('passageway.offline') }}:{{ accessStateCount.offline }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--第二个模块-->
    <div class="secondModule">
      <div class="firstTiltle">
        {{ $t('passageway.carAccessType') }}
        <img src="../../../../../assets/bigScreen/BigIcon/标题装饰.png" style="left: 81px" class="img" />
      </div>
      <div class="pie" id="pie2"></div>
    </div>
    <!--第三个模块-->
    <div class="thirleModule">
      <div class="firstTiltle">
        {{ $t('passageway.carFlowTrend') }}
        <img src="../../../../../assets/bigScreen/BigIcon/标题装饰.png" style="left: 81px" class="img" />
      </div>
      <div class="tuli">
        <div :class="[selected1 ? 'color-blue' : '', 'yue']" @click="clickTime(1)">{{ $t('public.month') }}</div>
        <div :class="[selected2 ? 'color-blue' : '', 'zhou']" @click="clickTime(2)">{{ $t('public.week') }}</div>
        <div :class="[selected3 ? 'color-blue' : '', 'tian']" @click="clickTime(3)">{{ $t('public.today') }}</div>
      </div>
      <div class="facetrend" id="vehicletrend"></div>
    </div>
  </div>
</template>

<script>
import { carAccessState, getVehicleNumByInOutType, getVehicleNumByType } from '../../../../../utils/api'
import Dayjs from '../../../../../utils/Dayjs'
import i18n from '@/i18n/'
export default {
  data() {
    return {
      accessStateCount: {},
      selected1: false,
      selected2: true,
      selected3: false,
      startEventTime: '',
      endEventTime: '',
      searchTime: {},
      timer: null,
    }
  },
  created() {
    this.getDeviceAccessState()
  },
  mounted() {
    console.log('mounted')
    this.setTimeout()
    this.faceTend(2)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  watch: {},
  // eslint-disable-next-line vue/no-dupe-keys
  methods: {
    //左边第一个设备模块
    getDeviceAccessState() {
      carAccessState({}).then((res) => {
        if (res.resultCode == 0) {
          this.accessStateCount = res.accessStateCount
        }
      })
    },
    // 定时刷新
    setTimeout() {
      this.getfaceComeIn()
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setTimeout()
      }, 10000)
    },
    //车辆进出
    getfaceComeIn() {
      let barChart = this.$echarts.init(document.getElementById('pie2'))
      getVehicleNumByType({
        startEventTime: this.searchTime.beginTime
          ? this.searchTime.beginTime
          : Dayjs().subtract(1, 'week').format('YYYY-MM-DD 00:00:00'),
        endEventTime: this.searchTime.endTime ? this.searchTime.endTime : Dayjs().format('YYYY-MM-DD 23:59:59'),
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          if (res.vehicleTypeCountInfoList) {
            let data = res.vehicleTypeCountInfoList
            for (let i = 0; i < data.length; i++) {
              data[i].value = data[i].count
              data[i].name = data[i].vehicleTypeName
            }
            let dataName = []
            let total = 0
            data.forEach((res) => {
              dataName.push(res.vehicleTypeName)
              total += parseFloat(res.value) * 10000
            })
            let dataNum = []
            data.forEach((res) => {
              dataNum.push(res.count)
            })
            console.log(dataNum, 'dataNum')
            total = total / 10000
            let option = {
              title: {
                zlevel: 0,
                text: ['{value|' + total + '}' + '  ' + `{name|${i18n.t('public.car')}}`],
                rich: {
                  value: {
                    color: '#ffffff',
                    fontSize: 20,
                    fontWeight: 500,
                    lineHeight: 20,
                  },
                  name: {
                    color: '#ffffff',
                    lineHeight: 20,
                  },
                },
                top: 'center',
                left: '110',
                textAlign: 'center',
                textStyle: {
                  color: '#ffffff',
                  rich: {
                    value: {
                      color: '#ffffff',
                      fontSize: 20,
                      fontWeight: 'bold',
                      lineHeight: 20,
                    },
                    name: {
                      color: '#ffffff',
                      lineHeight: 20,
                    },
                  },
                },
              },
              tooltip: {
                // 悬停指示
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
              },

              legend: {
                orient: 'vertical',
                data: dataName,
                itemGap: 30,
                top: 'middle',
                align: 'left',
                icon: 'circle',
                itemHeight: 7,
                right: 20,
                textStyle: {
                  fontSize: '12',
                  color: function (dataName) {
                    return dataName
                  },
                },
                formatter: function (name) {
                  var index = 0
                  var clientlabels = dataName
                  var clientcounts = dataNum
                  clientlabels.forEach(function (value, i) {
                    if (value == name) {
                      index = i
                    }
                  })
                  return name + ' ' + clientcounts[index] + i18n.t('public.car')
                },
              },
              series: [
                {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '66%'],
                  center: [110, '50%'],
                  stillShowZeroSum: false,
                  avoidLabelOverlap: false,
                  zlevel: 1,
                  label: {
                    normal: {
                      padding: [20, 20, 20, 20],
                      backgroundColor: '#fff',
                      show: false,
                      position: 'left',
                      formatter: ['{value|￥{c}}', '{name|{b}}'].join('\n'),
                      rich: {
                        value: {
                          color: '#7531FF',
                          fontSize: 20,
                          fontWeight: 'bold',
                          lineHeight: 20,
                        },
                        name: {
                          color: '#7531FF',
                          lineHeight: 20,
                        },
                      },
                    },
                  },

                  data: data,
                },
              ],
              color: ['#2691FF', '#7531FF', '#ffcc00', '#d88416', '#ab4cfb'],
            }
            barChart.setOption(option)
          }
        }
      })
      //"#2691FF", "#7531FF"
    },
    //点击时间
    clickTime(time) {
      console.log(time, 'time')
      switch (time) {
        case 1:
          this.selected1 = true
          this.selected2 = false
          this.selected3 = false
          this.faceTend(1)
          break
        case 2:
          this.selected1 = false
          this.selected2 = true
          this.selected3 = false
          this.faceTend(2)
          break
        case 3:
          this.selected1 = false
          this.selected2 = false
          this.selected3 = true
          this.faceTend(3)
          break
      }
    },
    //人员趋势
    faceTend(type) {
      console.log('车辆趋势')
      let startTime = ''
      let endTime = ''
      if (type == 1) {
        //近一月
        startTime = Dayjs().subtract(30, 'day').format('YYYY-MM-DD 00:00:00')
        endTime = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (type == 2) {
        //近一周
        startTime = Dayjs().subtract(1, 'week').format('YYYY-MM-DD 00:00:00')
        endTime = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (type == 3) {
        startTime = Dayjs().format('YYYY-MM-DD 00:00:00')
        endTime = Dayjs().format('YYYY-MM-DD 23:59:59')
      }
      var dateArray = []
      var inArray = []
      var outArray = []
      let data = {
        startEventTime: startTime,
        endEventTime: endTime,
        statType: type == 3 ? 'H' : 'D',
      }
      let barChart = this.$echarts.init(document.getElementById('vehicletrend'))
      barChart.clear()
      getVehicleNumByInOutType(data).then((res) => {
        if (res.resultCode == 0) {
          console.log(res.countList, 'res')
          if (res.countList) {
            var result = res.countList
            for (let i = 0; i < result.length; i++) {
              dateArray.push(result[i].date)
              inArray.push(result[i].inCount)
              outArray.push(result[i].outCount)
            }
            console.log(dateArray, inArray, outArray)

            let option = {
              tooltip: {
                trigger: 'axis',
              },
              grid: {
                left: '14%',
              },
              legend: {
                data: [this.$t('passageway.out'), this.$t('passageway.in')],
                textStyle: {
                  color: '#ffffff',
                },
                top: '28',
                right: '10',
              },
              color: ['#3E79FF', '#B048FF'],
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dateArray,
                axisLine: {
                  lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                  },
                },
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: `{value} ${i18n.t('public.car')}`,
                },
                axisLine: {
                  lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                  },
                },
                minInterval: 1,
              },
              // x轴拖动
              dataZoom: [
                {
                  type: 'slider',
                  height: 15, //滚动条高度
                  start: 8, //滚动条开始位置（共100等份）
                  end: 65, //结束位置（共100等份）
                },
              ],
              series: [
                {
                  name: this.$t('passageway.in'),
                  type: 'line',
                  data: inArray,
                  color: '#B048FF',
                  //线条样式
                  lineStyle: {
                    color: '#B048FF',
                  },
                  smooth: 0.3,
                },
                {
                  name: this.$t('passageway.out'),
                  type: 'line',
                  data: outArray,
                  color: '#3E79FF',
                  //线条样式
                  lineStyle: {
                    color: '#3E79FF',
                  },
                  smooth: 0.3,
                },
              ],
            }

            barChart.setOption(option)
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/facepass';
.leftContent {
  .fxc {
    display: flex;
    flex-direction: column;
  }
  /*头部的标题 */
  .firstTiltle {
    display: flex;
    color: #ffffff;
    font-size: 15px;
  }
  .firstmodule {
    .showOnlineNum {
      display: flex;
      margin-top: 30px;
      .box1 {
        display: flex;
        flex-direction: column;
        color: white;
        font-size: 16px;
        align-items: center;
        .box1img {
          width: 89px;
          height: 84px;
        }
        .num {
          margin-top: 14px;
        }
      }
      .box2 {
        display: flex;
        flex: 1;
        margin-top: 30px;
        .fxc {
          align-items: center;
          flex: 1;
          position: relative;
          .myimg {
            width: 100px;
            height: 84px;
          }
          .line {
            color: #ffffff;
            opacity: 0.6;
            margin-top: 11px;
          }
          .bili {
            position: absolute;
            top: 23px;
            color: #00e5ff;
            .size {
              font-size: 24px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .secondModule {
    margin-top: 30px;
    #pie2 {
      height: 260px;
      width: 100%;
    }
  }
  .thirleModule {
    position: relative;
    height: 320px;
    .tuli {
      z-index: 10000;
      width: 60%;
      display: flex;
      position: absolute;
      color: white;
      line-height: 28px;
      border-radius: 4px;
      border: 1px solid #00ccff;
      margin-top: 23px;
      cursor: pointer;
      font-size: 14px;
      .yue {
        flex: 1;
        text-align: center;
      }
      .zhou {
        flex: 1;

        text-align: center;
      }
      .tian {
        flex: 1;
        text-align: center;
      }
    }
    #vehicletrend {
      height: calc(100% - 20px);
      width: 100%;
      margin-top: 15px;
    }
  }
  .color-blue {
    background: #3696e5;
  }
}
</style>
