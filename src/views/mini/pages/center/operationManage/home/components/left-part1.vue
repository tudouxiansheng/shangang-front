<template>
  <div>
    <collapse-card
      :title="$t('operateManage.devDetail')"
      hideCollapse
      background
      backgroundColor="#0A314F"
    >
      <template #operate>
        <el-radio-group v-model="detailType">
          <el-radio-button label="1">{{ $t('deviceCamera.dpi') }}</el-radio-button>
          <el-radio-button label="2">{{ $t('operateManage.accessDrive') }}</el-radio-button>
          <el-radio-button label="3">{{ $t('operateManage.accessPlat') }}</el-radio-button>
        </el-radio-group>
      </template>
      <el-row v-if="detailType == 1" v-loading="loading">
        <el-col :span="8">
          <echart id="deviceDetailPie" height="275px" :options="getOption1()"></echart>
        </el-col>
        <el-col :span="16">
          <echart id="deviceDetailBar" height="275px" :options="getOption2()"></echart>
        </el-col>
      </el-row>
      <el-row v-if="detailType == 2" v-loading="loading">
        <el-col :span="8">
          <echart id="deviceDetailPie" height="275px" :options="getOption3()"></echart>
        </el-col>
        <el-col :span="16">
          <echart id="deviceDetailBar" height="275px" :options="getOption4()"></echart>
        </el-col>
      </el-row>
      <el-row v-if="detailType == 3" v-loading="loading">
        <el-col :span="8">
          <echart id="deviceDetailPie" height="275px" :options="getOption5()"></echart>
        </el-col>
        <el-col :span="16">
          <echart id="deviceDetailBar" height="275px" :options="getOption6()"></echart>
        </el-col>
      </el-row>
    </collapse-card>
  </div>
</template>

<script>
import collapseCard from '../../component/collapse-card.vue'
import echart from '@/components/echart'
import { permissions } from '@/utils/common/permissions'
export default {
  components: { collapseCard, echart },
  props: ['organizationId'],
  data() {
    return {
      loading: true,
      detailType: 1,
      permissionsDetailInfo: true,
      ratioTotal: 0,
      ratioEchartLeft: [],
      ratioEchartRight: [],
      ratioXdata: [],
      protocolTotal: 0,
      protocolEchartLeft: [],
      protocolEchartRight: [],
      protocolXdata: [],
      protocolSeries: [],
      platTotal: 0,
      platEchartLeft: [],
      platEchartRight: [],
      platXdata: [],
      platSeries: []
    }
  },
  watch: {
    organizationId(value) {
      if (value != undefined) {
        this.loading = true
        this.getDeviceAccessDistribution()
      }
    },
    detailType() {
      this.getOption1()
      this.getOption2()
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      this.permissionsDetailInfo = await permissions(1420)
    },
    // 获取设备详情
    async getDeviceAccessDistribution() {
      if (this.permissionsDetailInfo) {
        let res = await this.$api.getDeviceAccessDistribution({
          organizationId: this.organizationId
        })
        if (res.resultCode == 0) {
          this.loading = false
          let ratioEchartLeft = res.resolutionDistributionInfo.totalDistribution
          let ratioEchartRight = res.resolutionDistributionInfo.areaHistogramInfos
          let protocolEchartLeft = res.protocolDistributionInfo.totalDistribution
          let protocolEchartRight = res.protocolDistributionInfo.areaHistogramInfos
          let platEchartLeft = res.platDistributionInfo.totalDistribution
          let platEchartRight = res.platDistributionInfo.areaHistogramInfos

          let ratioObj = this.formatterEchartData(ratioEchartLeft, ratioEchartRight)
          this.ratioTotal = ratioObj.total
          this.ratioEchartLeft = ratioObj.formatterLeft
          this.ratioEchartRight = ratioObj.formatterRight
          this.ratioXdata = ratioObj.xData
          let protocolObj = this.formatterEchartData(protocolEchartLeft, protocolEchartRight)
          this.protocolTotal = protocolObj.total
          this.protocolEchartLeft = protocolObj.formatterLeft
          this.protocolEchartRight = protocolObj.formatterRight
          this.protocolXdata = protocolObj.xData

          let platObj = this.formatterEchartData(platEchartLeft, platEchartRight)
          this.platTotal = platObj.total
          this.platEchartLeft = platObj.formatterLeft
          this.platEchartRight = platObj.formatterRight
          this.platXdata = platObj.xData
          let colorList = [
            '#478EFE',
            '#4CDBFF',
            '#9E87FF',
            '#FF73A1',
            '#FF9832',
            '#FF552D',
            '#478EFE'
          ]

          this.platEchartLeft.forEach((item, index) => {
            this.platSeries[index] = {
              name: item.name,
              type: 'bar',
              data: this.platEchartRight[index],
              barWidth: 10, //柱子宽度
              barGap: 1, //柱子之间间距
              itemStyle: {
                normal: {
                  color: colorList[index],
                  opacity: 1
                }
              }
            }
          })
          this.protocolEchartLeft.forEach((item, index) => {
            this.protocolSeries[index] = {
              name: item.name,
              type: 'bar',
              data: this.protocolEchartRight[index],
              barWidth: 10, //柱子宽度
              barGap: 1, //柱子之间间距
              itemStyle: {
                normal: {
                  color: colorList[index],
                  opacity: 1
                }
              }
            }
          })
        }
      }
    },
    formatterEchartData(left, right) {
      let formatterLeft = []
      let formatterRight = []
      let xData = []
      let total = 0
      left.forEach(item => {
        total = total + item.count
        let obj = {
          name: item.dictionaries,
          value: item.count,
          ratio: item.rate
        }
        formatterLeft.push(obj)
      })
      for (let i = 0; i < formatterLeft.length; i++) {
        formatterRight.push([])
      }
      right.forEach(item => {
        xData.push(item.areaName)
        item.histogramInfos.forEach(item1 => {
          formatterLeft.filter((item2, index2) => {
            if (item2.name == item1.dictionaries) {
              formatterRight[index2].push(item1.count)
            }
          })
        })
      })
      return { total, formatterLeft, formatterRight, xData }
    },
    getOption1() {
      return {
        title: {
          text:
            '{val|' + this.ratioTotal + '}\n{name|' + this.$t('operateManage.deviceTotal') + '}',
          top: '37%',
          textAlign: 'center',
          left: '22%',
          textStyle: {
            rich: {
              name: {
                fontWeight: 'bold',
                padding: [5, 0],
                fontSize: 18
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '2%',
          icon: 'circle',
          itemGap: 20,
          formatter: name => {
            if (this.ratioEchartLeft.length > 0) {
              const item = this.ratioEchartLeft.filter(item => item.name === name)[0]
              return `{name|${name}}{rate| ${item.ratio}%} ${item.value}台`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 50
              },
              rate: {
                width: 60
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['23%', '50%'],
            radius: ['44%', '60%'],
            label: {
              show: false
            },
            data: this.ratioEchartLeft
          }
        ]
      }
    },
    getOption2() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.ratioXdata,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 40
          }
        ],
        series: [
          {
            name: this.$t('public.dpitype3'),
            type: 'bar',
            data: this.ratioEchartRight[0],
            barWidth: 10, //柱子宽度
            barGap: 1 //柱子之间间距
          },
          {
            name: this.$t('public.dpitype1'),
            type: 'bar',
            data: this.ratioEchartRight[1],
            barWidth: 10,
            barGap: 1
          },
          {
            name: this.$t('metadata.other'),
            type: 'bar',
            data: this.ratioEchartRight[2],
            barWidth: 10,
            barGap: 1
          },
          {
            name: this.$t('public.dpitype2'),
            type: 'bar',
            data: this.ratioEchartRight[3],
            barWidth: 10,
            barGap: 1
          }
        ]
      }
    },
    getOption3() {
      return {
        title: {
          text:
            '{val|' + this.protocolTotal + '}\n{name|' + this.$t('operateManage.deviceTotal') + '}',
          top: '37%',
          textAlign: 'center',
          left: '22%',
          textStyle: {
            rich: {
              name: {
                fontSize: 18,
                padding: [5, 0]
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: 'center',
          right: '2%',
          icon: 'circle',
          itemGap: 20,
          formatter: name => {
            if (this.protocolEchartLeft.length > 0) {
              const item = this.protocolEchartLeft.filter(item => item.name === name)[0]
              let nameFormattered = ''
              if (name.length > 5) {
                nameFormattered = name.slice(0, 5) + '...'
              } else {
                nameFormattered = name
              }
              return `{name|${nameFormattered}}{rate| ${item.ratio}%} ${item.value}台`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 70
              },
              rate: {
                width: 50
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['23%', '50%'],
            radius: ['44%', '60%'],
            label: {
              show: false
            },
            data: this.protocolEchartLeft
          }
        ]
      }
    },
    getOption4() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.protocolXdata,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 40
          }
        ],
        series: this.protocolSeries
      }
    },
    getOption5() {
      return {
        title: {
          text: '{val|' + this.platTotal + '}\n{name|' + this.$t('operateManage.deviceTotal') + '}',
          top: '37%',
          textAlign: 'center',
          left: '22%',
          textStyle: {
            rich: {
              name: {
                fontSize: 18,
                padding: [5, 0]
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item',
          extraCssText: 'z-index:999;'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: 'center',
          right: '2%',
          icon: 'circle',
          itemGap: 20,
          formatter: name => {
            if (this.platEchartLeft.length > 0) {
              const item = this.platEchartLeft.filter(item => item.name === name)[0]
              let itemName = ''
              if (name.length > 5) {
                itemName = name.slice(0, 5) + '...'
              } else {
                itemName = name
              }
              return `{name|${itemName}}{rate| ${item.ratio}%} ${item.value}台`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 70
              },
              rate: {
                width: 50
              }
            }
          },
          pageTextStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            center: ['23%', '50%'],
            radius: ['44%', '60%'],
            label: {
              show: false
            },
            data: this.platEchartLeft
          }
        ]
      }
    },
    getOption6() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.platXdata,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 40
          }
        ],
        series: this.platSeries
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-radio-button--small .el-radio-button__inner) {
  padding: 11px 15px;
}
</style>
