<template>
  <div class="leftContent">
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
        {{ $t('passageway.accessType') }}
        <img src="../../../../../assets/bigScreen/BigIcon/标题装饰.png" class="img" />
      </div>
      <div class="pie" id="pie"></div>
    </div>
    <!--第三个模块-->
    <div class="thirleModule">
      <div class="firstTiltle">
        {{ $t('passageway.flowTrend') }}
        <img src="../../../../../assets/bigScreen/BigIcon/标题装饰.png" class="img" />
      </div>
      <div class="tuli">
        <div :class="[selected1 ? 'color-blue' : '', 'yue']" @click="clickTime(1)">{{ $t('public.month') }}</div>
        <div :class="[selected2 ? 'color-blue' : '', 'zhou']" @click="clickTime(2)">{{ $t('public.week') }}</div>
        <div :class="[selected3 ? 'color-blue' : '', 'tian']" @click="clickTime(3)">{{ $t('public.today') }}</div>
      </div>
      <div class="facetrend" id="facetrend"></div>
    </div>
  </div>
</template>

<script>
import { countSite, faceAccessState, faceFlowTrend, faceComeTye } from '../../../../../utils/api'
import { getDIYTime1 } from '../../../../../utils/mutil'
import i18n from '@/i18n/'
export default {
  data() {
    return {
      accessStateCount: {},
      selected1: false,
      selected2: true,
      selected3: false,
      timer: null,
    }
  },
  created() {
    this.getDeviceAccessState()
  },
  props: ['searchInfo'],
  mounted() {
    this.setTimeout()
    this.faceTend(2)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  watch: {
    'searchInfo.beginTime': function (val, old) {
      if (val) {
        this.getfaceComeIn()
      }
      if (val == this.time(getDIYTime1(4)[0]).split(' ')[0] + ' ' + '00:00:00') {
        this.clickTime(3)
      } else if (val == this.time(getDIYTime1(3)[0]).split(' ')[0] + ' ' + '00:00:00') {
        this.clickTime(2)
      } else {
        this.clickTime(1)
      }
    },
  },
  methods: {
    p(s) {
      return s < 10 ? '0' + s : s
    },
    //左边第一个设备模块
    getDeviceAccessState() {
      faceAccessState({ deviceType: 10 }).then((res) => {
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
    //人员进出
    getfaceComeIn() {
      let barChart = this.$echarts.init(document.getElementById('pie'))
      faceComeTye({
        startTime: this.searchInfo.beginTime,
        endTime: this.searchInfo.endTime,
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          if (res.resultList) {
            let data = res.resultList
            for (let i = 0; i < data.length; i++) {
              data[i].value = data[i].count < 0 ? 0 : data[i].count
            }
            let dataName = []
            let total = 0
            data.forEach((res) => {
              dataName.push(res.name)
              total += parseFloat(res.value) * 10000
            })
            let dataNum = []
            data.forEach((res) => {
              dataNum.push(res.value)
            })
            total = total / 10000
            let option = {
              title: {
                zlevel: 0,
                text: ['{value|' + total + '}' + '  ' + `{name|${i18n.t('public.people')}}`],
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
                  var clientlabels = ['访客', '工作人员']
                  var clientcounts = dataNum
                  clientlabels.forEach(function (value, i) {
                    if (value == name) {
                      index = i
                    }
                  })
                  return name + ' ' + clientcounts[index] + i18n.t('public.people')
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
              color: ['#2691FF', '#7531FF'],
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
    time(a) {
      const resDate = a.getFullYear() + '-' + this.p(a.getMonth() + 1) + '-' + this.p(a.getDate())
      const resTime = this.p(a.getHours()) + ':' + this.p(a.getMinutes()) + ':' + this.p(a.getSeconds())
      return resDate + ' ' + resTime
    },
    //人员趋势
    faceTend(type) {
      let startTime = ''
      let endTime = ''
      var timeArray = ''
      if (type == 1) {
        //近一月
        timeArray = getDIYTime1(5)
        startTime = this.time(timeArray[0])
        endTime = this.time(timeArray[1])
      } else if (type == 2) {
        //近一周
        timeArray = getDIYTime1(3)
        startTime = this.time(timeArray[0])
        endTime = this.time(timeArray[1])
      } else if (type == 3) {
        startTime = this.time(getDIYTime1(2)[0]).split(' ')[0] + ' ' + '00:00:00'
        endTime = this.time(getDIYTime1(2)[0]).split(' ')[0] + ' ' + '23:59:59'
      }
      var dateArray = []
      var inArray = []
      var outArray = []
      faceFlowTrend({ startTime: startTime, endTime: endTime }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res.countList, 'res')
          if (res.countList) {
            var result = res.countList
            for (let i = 0; i < result.length; i++) {
              dateArray.push(result[i].date)
              inArray.push(result[i].inCount)
              outArray.push(result[i].outCount)
            }
            let barChart = this.$echarts.init(document.getElementById('facetrend'))
            barChart.clear()
            let option = {
              tooltip: {
                trigger: 'axis',
              },
              legend: {
                data: [this.$t('passageway.out'), this.$t('passageway.in')],
                textStyle: {
                  color: '#ffffff',
                },
                top: '28',
                right: '10',
              },
              grid: {
                left: '14%',
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
                // axisLabel: {
                //   interval: 2,
                // },
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: `{value} ${this.$t('public.unit')}`,
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
      console.log(this.inArray, this.outArray, this.dateArray)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/facepass';
</style>
