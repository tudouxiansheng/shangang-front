<template>
  <div class="box">
    <div class="box_top">
      <div class="box_top_header">今日设备运行统计</div>
      <div class="ep-sec">
        <div class="eq centerItem">
          <img src="@/views/mini/pages/aiScreen/images/eq1.png" />
          <span class="alleq">设备总数</span>
          <span class="alleqnum">{{ deviceTotal }}</span>
          <div class="arrow arrow1"></div>
          <div class="arrow arrow2"></div>
          <div class="arrow"></div>
        </div>
        <div class="eq centerItem">
          <img src="@/views/mini/pages/aiScreen/images/eq2.png" />
          <span class="alleq outlne">离线率</span>
          <span class="alleqnum lixian">{{ offlineRate }}%</span>
          <div class="arrow arrow1 redd"></div>
          <div class="arrow arrow2 redd"></div>
          <div class="arrow redd"></div>
        </div>
      </div>
      <div class="equipment-operation" id="equipment-operation"></div>
    </div>
    <CenterList></CenterList>
    <div class="box_bottom">
      <BarGraph></BarGraph>
    </div>
  </div>
</template>

<script>
import BarGraph from '@/views/mini/pages/artificial/components/rightArtifical/barGraph'
import CenterList from '@/views/mini/pages/artificial/components/rightArtifical/CenterList'
import { getDeviceWork } from '@/utils/api'
export default {
  name: 'NavCoontentTwo',
  components: {
    BarGraph,
    CenterList,
  },
  data() {
    return {
      equipmentList: [
        {
          num: 43,
          typeName: '离线设备',
        },
        {
          num: 88,
          typeName: '在线设备',
        },
      ],
      deviceTotal: '', //设备总数
      offlineRate: '', //离线率
    }
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
                text: ['{value|' + total + '}\n ' + '{name|在线数量}'],
                top: 'center',
                left: '103',
                textAlign: 'center',
                textStyle: {
                  color: '#ffffff',
                  rich: {
                    value: {
                      color: '#ffffff',
                      fontSize: 28,
                      fontWeight: 'bold',
                      lineHeight: 35,
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
                left: 205,
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

<style lang="scss" scoped>
.box {
  .box_top {
    border-bottom: 1px solid #2a95fc;

    .box_top_header {
      border-left: 4px solid #00fff0;
      font-size: 16px;
      color: #ffffff;
      padding-left: 9px;
      margin-top: 22px;
    }

    .ep-sec {
      position: relative;
      // top: 56px;
      // width: 308px;
      height: 70px;
      display: flex;

      .eq {
        flex: 1;
        position: relative;
      }

      .alleq {
        position: absolute;
        top: 14px;
        left: 54px;
        color: #ffffff;
      }

      .alleqnum {
        position: absolute;
        font-weight: bold;
        color: #2a95fc;
        font-size: 22px;
        left: 76px;
        top: 32px;
      }

      .lixian {
        color: #ff7675;
      }

      .centerItem {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .arrow {
        display: block;
        width: 7px;
        height: 7px;
        position: absolute;
        bottom: 13px;
        left: 42px;
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
        bottom: 29px;
        //   left: 60px;
      }

      .arrow2 {
        bottom: 21px;
        //   left: 60px;
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
          -webkit-transform: translate(0, 5px) rotate(45deg);
        }

        100% {
          opacity: 0;
          -webkit-transform: translate(0, 10px) rotate(45deg);
        }
      }
    }

    #equipment-operation {
      width: 330px !important;
      position: relative;
      height: 150px !important;
      bottom: 0;
      //   left: -200px !important;
      //   z-index: 999;
    }
  }
}
</style>
