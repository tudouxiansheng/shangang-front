<template>
  <div class="leftVisitor">
    <div class="topTile-visit">
      <div class="visitor-name">访客数据统计</div>
      <img src="@/assets/bigScreen/BigIcon/标题装饰.png" />
    </div>

    <div class="visitData">
      <div class="v-blue">今日来访人数</div>
      <div class="visit-panel">
        <div class="left-panel">
          <div class="gezi">
            <div class="itemx">{{ count.decade }}</div>
            <div class="itemx">{{ count.hundred }}</div>
            <div class="itemx">{{ count.unit }}</div>
          </div>
          人
        </div>
        <div class="right-panel">
          今日离开人数： {{ outCome }}人<br />
          今日在访人数：{{ income }}人
        </div>
      </div>
    </div>
    <div class="topTile-visit visitEvent">
      <div class="topTile-visit visitor-name">来访事由分布</div>
      <img src="@/assets/bigScreen/BigIcon/标题装饰.png" />
    </div>
    <!--中间第二个图-->
    <div class="visit-Data" id="visit-Data"></div>

    <div class="topTile-visit visit-time">
      <div class="topTile-visit visitor-name">来访时间段分布</div>
      <img src="@/assets/bigScreen/BigIcon/标题装饰.png" />
    </div>
    <div class="time-Data" id="time-Data"></div>
  </div>
</template>

<script>
import { getVistorData, faceComeTye, getLoginUserInfo } from '@/utils/api'
import { formatDateTime } from '@/utils/mutil'
export default {
  data() {
    return {
      statusDtoList: [],
      typeList: [],
      timeStatisticList: [],
      income: 0, //入园
      outCome: 0, //出园
      showFirst: false,
      showSecond: false,
      showThird: false,
      count: {
        unit: 0,
        decade: 0,
        hundred: 0,
      },
    }
  },
  mounted() {
    //左边访客数据
    this.visitData()
    //来访事由
    this.getVisitData()
    //来访时间段
    this.getVisitTime()
    //接收实时推送
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
  },
  beforeDestroy() {
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
  },
  methods: {
    visitData() {
      getVistorData({
        queryDate: formatDateTime(new Date()).substring(0, 10),
      }).then((res) => {
        if (res.resultCode == 0) {
          this.statusDtoList = res.info.statusDtoList
          this.countFirstTap()
          this.typeList = res.info.typeList
          this.getVisitData()
          this.timeStatisticList = res.info.timeStatisticList
          this.getVisitTime()
        }
      })
    },
    //计算第一个卡片
    countFirstTap() {
      let incomeLIst = this.statusDtoList.filter((item) => {
        //入园
        return item.visitStatus == 2
      })
      this.income = incomeLIst[0].num
      let outComeList = this.statusDtoList.filter((item) => {
        //出园
        return item.visitStatus == 3
      })
      this.outCome = outComeList[0].num

      this.allinOutCome = this.income + this.outCome
      let StringArray = String(this.allinOutCome).split('')
      // console.log(StringArray);

      if (StringArray.length == 1) {
        this.count.unit = this.allinOutCome
      } else if (StringArray.length == 2) {
        this.count.unit = Number(StringArray[1])
        this.count.decade = Number(StringArray[0])
      } else if (StringArray.length == 3) {
        this.count.unit = Number(StringArray[2])
        this.count.decade = Number(StringArray[1])
        this.count.hundred = Number(StringArray[0])
      }
    },
    getVisitData() {
      let barChart = this.$echarts.init(document.getElementById('visit-Data'))
      if (this.typeList.length > 0) {
        let data = this.typeList
        for (let i = 0; i < data.length; i++) {
          data[i].value = data[i].num
          data[i].name = data[i].typeName
        }

        let dataName = []
        let total = 0
        data.forEach((res) => {
          dataName.push(res.typeName)
          total += parseFloat(res.value) * 10000
        })
        let dataNum = []
        data.forEach((res) => {
          dataNum.push(res.value)
        })
        //  console.log(dataNum, dataName, data)
        total = total / 10000
        let option = {
          title: {
            zlevel: 0,
            text: ['{value|' + total + '}' + '  ' + '{name|人}'],
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
            type: 'scroll',
            data: dataName,
            pageTextStyle: {
              color: '#fff',
            },
            pageIconColor: '#aaa',
            pageIconInactiveColor: '#2f4554',
            itemGap: 20,
            top: 'top',
            align: 'left',
            icon: 'circle',
            itemHeight: 7,
            right: 15,
            textStyle: {
              fontSize: '12',
              color: function (dataName) {
                return dataName
              },
            },
            formatter: function (name) {
              var index = 0
              //    <!-- //1.外卖；2.保洁；3.快递配送；4.维修施工；5.面试；6.其他 -->
              var clientlabels = ['外卖', '保洁', '快递配送', '维修施工', '面试', '其他']
              var clientcounts = dataNum
              clientlabels.forEach(function (value, i) {
                if (value == name) {
                  index = i
                }
              })
              return name + ' ' + clientcounts[index] + '人'
            },
          },
          series: [
            {
              name: dataName,
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
                      fontSize: 40,
                      fontWeight: 'bold',
                      lineHeight: 40,
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
          color: ['#2691ff', '#ab4cfb', '#d88416', '#7d4cfb', '#fff100'],
        }
        barChart.setOption(option)
      }
    },
    getVisitTime() {
      let date = this.timeStatisticList.map((item) => {
        return item.time
      })
      let num = this.timeStatisticList.map((item) => {
        return item.num
      })
      let barChart = this.$echarts.init(document.getElementById('time-Data'))
      let option = {
        xAxis: [
          {
            type: 'category',

            data: date,
            splitLine: {
              //网格线
              show: false,
            },
            // 刻度线
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff', //更改坐标轴文字颜色
                fontSize: 14, //更改坐标轴文字大小
              },
              interval: 'auto',
            },
          },
        ],
        color: ['#628BFF'],
        textStyle: {
          color: '#fff',
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              // color: "#ffffff",
              width: 1, //这里是为了突出显示加上的
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              // color: "#fff",
              opacity: 0.1,
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff', //更改坐标轴文字颜色
              fontSize: 14, //更改坐标轴文字大小
            },
          },
        },
        tooltip: {
          //组件提示
          trigger: 'axis',
        },
        series: [
          {
            data: num,
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#628BFF', // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: 'rgba(98,139,255,0.2)', // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
              },
            },
          },
        ],
      }
      barChart.setOption(option)
    },
    //webSocket
    handleWebSocketMessage(redata) {
      if (redata.type == 'visit_current_data') {
        console.log(redata)
        let visitData = JSON.parse(Base64.decode(redata.content))
        console.log(visitData, 'visitData')
        this.visitData()
      }
    },
  },
}
</script>

<style lang="scss">
.leftVisitor {
  padding: 31px 22px 22px 22px;
  font-size: 16px;
  .topTile-visit {
    display: flex;

    .visitor-name {
      color: #ffffff;
    }
  }

  .visitData {
    margin-top: 54px;

    .v-blue {
      color: #00e3fb;
    }

    .visit-panel {
      display: flex;
      margin-top: 28px;

      .left-panel {
        display: flex;
        flex: 1;
        line-height: 124px;
        color: #ffffff;
        font-size: 18px;

        .gezi {
          display: flex;

          .itemx {
            width: 56px;
            height: 80px;
            border: 2px solid #0cd8fa;
            border-radius: 5px;
            box-shadow: rgb(12, 216, 250) 0px 0px 20px inset;
            margin-right: 20px;
            color: #ffffff;
            font-size: 30px;
            line-height: 80px;
            text-align: center;
            font-weight: bold;
          }
        }
      }

      .right-panel {
        display: flex;
        flex-direction: column;
        color: #ffffff;
        line-height: 45px;
      }
    }
  }

  .visitEvent {
    margin-top: 58px;
  }

  .visit-Data {
    width: 100%;
    height: 220px;
    margin-top: 20px;
  }

  .visit-time {
    margin-top: 10px;
  }

  .time-Data {
    width: 100%;
    height: 220px;
    margin-top: 20px;
  }
}
</style>
