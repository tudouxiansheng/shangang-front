<template>
  <div class="left-banner-first second-b">
    <img src="../images/wrapperxy.png" class="wrapper-img" />
    <div class="title-ai">
      <div class="line"></div>
      <div class="titlename-ai">总设备运行统计</div>
    </div>
    <div class="ep-sec">
      <div class="eq eq1 centerItem">
        <img src="../images/eq1.png" />
        <span class="alleq">设备总数</span>
        <span class="alleqnum">{{ deviceTotal }}</span>
        <div class="arrow arrow1"></div>
        <div class="arrow arrow2"></div>
        <div class="arrow"></div>
      </div>
      <div class="eq eq2 centerItem">
        <img src="../images/eq2.png" />
        <span class="alleq outlne">离线率</span>
        <span class="alleqnum lixian">{{ offlineRate }}%</span>
        <div class="arrow arrow1 redd"></div>
        <div class="arrow arrow2 redd"></div>
        <div class="arrow redd"></div>
      </div>
    </div>
    <div class="equipment-operation" id="equipment-operation"></div>
  </div>
</template>

<script>
import { getDeviceWork } from '@/utils/api'
export default {
  props: ['callalarm'],
  data() {
    return {
      equipmentList: [
        {
          num: '',
          typeName: '离线设备',
        },
        {
          num: '',
          typeName: '在线设备',
        },
      ],
      deviceTotal: '', //设备总数
      offlineRate: '', //离线率
    }
  },
  watch: {
    callalarm: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal == true) {
        this.equipmentOpt()
      }
    },
  },
  mounted() {
    this.equipmentOpt()
  },
  methods: {
    equipmentOpt() {
      getDeviceWork({}).then((res) => {
        if (res.resultCode == 0) {
          console.log(res)
          this.deviceTotal = res.deviceTotal
          this.offlineRate = res.offlineRate
          this.equipmentList[0].num = res.offlineNum
          this.equipmentList[1].num = res.onlineNum
          let barChart = this.$echarts.init(
            document.getElementById('equipment-operation')
          )
          if (this.equipmentList.length > 0) {
            let data = this.equipmentList
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
            total = total / 10000
            let option = {
              title: {
                zlevel: 0,
                text: ['{value|' + total + '}' + '  ' + '{name|台}'],
                rich: {
                  value: {
                    color: '#ffffff',
                    fontSize: 30,
                    lineHeight: 40,
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
                      fontSize: 40,
                      fontWeight: 'bold',
                      lineHeight: 40,
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
                itemGap: 20,
                top: 50,
                align: 'left',
                icon: 'circle',
                itemHeight: 7,
                right: 40,
                textStyle: {
                  fontSize: '14',
                  color: function (dataName) {
                    return dataName
                  },
                },
                formatter: function (name) {
                  console.log(name, 'name')
                  var index = 0
                  console.log(dataNum, 'dataNum', data)
                  data.forEach(function (value, i) {
                    console.log(value)
                    if (value.name == name) {
                      index = i
                    }
                  })
                  return name + ' ' + data[index].value + '台'
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
              color: ['#FF7675', '#2A95FC', '#d88416', '#7d4cfb', '#fff100'],
            }
            barChart.setOption(option)

            tools.loopShowTooltip(barChart, option, {
              loopSeries: true,
            })
          }
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

  .ep-sec {
    position: absolute;
    top: 56px;
    width: 100%;
    height: 70px;
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
    .eq {
      flex: 1;
      position: relative;
    }

    .alleq {
      position: absolute;
      top: 14px;
      left: 58px;
      font-size: 14px;
      color: #ffffff;
    }

    .alleqnum {
      position: absolute;
      font-weight: bold;
      color: #2a95fc;
      font-size: 22px;
      left: 93px;
      top: 32px;
    }

    .lixian {
      color: #ff7675;
    }

    .centerItem {
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 100%;
        height: 100%;
      }
    }

    .arrow {
      display: block;
      width: 7px;
      height: 7px;
      position: absolute;
      bottom: 4px;
      left: 60px;
      margin-left: -11px;
      border: 1px solid transparent;
      border-bottom: 1px solid #2a95fc;
      border-right: 1px solid #2a95fc;
      z-index: 99;
      opacity: 0.8;
      transform: rotate(45deg);
      animation: arrow 2s infinite ease-in-out;
    }

    .arrow1 {
      bottom: 9px;
      left: 60px;
    }

    .arrow2 {
      bottom: 14px;
      left: 60px;
    }

    .redd {
      border-bottom: 1px solid #ff7675;
      border-right: 1px solid #ff7675;
    }

    @keyframes arrow {
      0% {
        opacity: 0;
        -webkit-transform: translate(0, 0px) rotate(45deg);
      }

      50% {
        opacity: 1;
        -webkit-transform: translate(0, -5px) rotate(45deg);
      }

      100% {
        opacity: 0;
        -webkit-transform: translate(0, -10px) rotate(45deg);
      }
    }
  }

  #equipment-operation {
    width: 100%;
    position: absolute;
    height: 230px;
    bottom: 0;
  }
}

.second-b {
  margin-top: 56px;
}
</style>
