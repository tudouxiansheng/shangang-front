<template>
  <div>
    <collapse-card
      :title="$t('operateManage.videoOverview')"
      hideCollapse
      background
      backgroundColor="#0A314F"
    >
      <template #operate>
        <el-button type="success" @click="handleExport">
          {{ $t('businessLog.exportExcel') }}
        </el-button>
      </template>

      <el-row>
        <el-col :span="10" v-loading="loading3">
          <echart id="videoPreviewPie" height="228px" :options="getOption3()"></echart>
        </el-col>
        <el-col :span="2" class="pt-7">
          <el-tag
            class="cursor-pointer hover:bg-blue-500 hover:text-white hover:border-blue-500"
            @click="handleCheck3"
          >
            {{ $t('operateManage.view') }}
          </el-tag>
        </el-col>

        <el-col :span="11" v-loading="loading4">
          <echart id="recodeIntegrityPie" height="228px" :options="getOption4()"></echart>
        </el-col>
        <el-col :span="1" class="pt-7">
          <el-tag
            class="cursor-pointer hover:bg-blue-500 hover:text-white hover:border-blue-500"
            @click="handleCheck4"
          >
            {{ $t('operateManage.view') }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" v-loading="loading1">
          <echart id="SurveillanceDeviceOnlinePie" height="228px" :options="getOption1()"></echart>
        </el-col>
        <el-col :span="2" class="pt-7">
          <el-tag
            class="cursor-pointer hover:bg-blue-500 hover:text-white hover:border-blue-500"
            @click="handleCheck1"
          >
            {{ $t('operateManage.view') }}
          </el-tag>
        </el-col>
      </el-row>
    </collapse-card>
  </div>
</template>

<script>
import collapseCard from '../../component/collapse-card.vue'
import echart from '@/components/echart'
import { exportExcel } from '@/utils/common/excelOperate'
import routeJump from '@/mixin/route-jump.js'
import { permissions } from '@/utils/common/permissions'
export default {
  components: { collapseCard, echart },
  mixins: [routeJump],
  props: ['organizationId'],
  data() {
    return {
      permissionData1: true,
      permissionData3: true,
      permissionData4: true,
      echartData1: [],
      echartData3: [],
      echartData4: [],
      title1: '',
      title3: '',
      title4: '',
      tabelData1: [],
      tabelData3: [],
      tabelData4: [],
      checkTime1: '',
      checkTime3: '',
      checkTime4: '',
      loading1: true,
      loading3: true,
      loading4: true,
      sheetNameList: [],
      excelFileName: '',
      locale: localStorage.getItem('locale')
    }
  },
  watch: {
    organizationId(value) {
      if (value != undefined) {
        this.getDevStatus()
        this.getPreviewSummaryInfo()
        this.getRecordIntegralityRealtime()
      }
    }
  },
  created() {
    this.getPermissions()
    this.dataInternationalised()
  },
  methods: {
    async getPermissions() {
      this.permissionData3 = await permissions(1428)
      this.permissionData4 = await permissions(1417)
    },
    dataInternationalised() {
      this.sheetNameList = [
        this.$t('operateManage.onlineRatio'),
        this.$t('operateManage.videoPreviewRatio'),
        this.$t('operateManage.videoIntegralityRatio')
      ]
      this.excelFileName = this.$t('operateManage.videoOverview')
    },
    async getDevStatus() {
      this.loading1 = true
      let res1 = await this.$api.getDevStatus({
        organizationId: this.organizationId
      })
      if (res1.resultCode == 0) {
        this.loading1 = false
        this.title1 = res1.onlineRate
        this.echartData1 = [
          {
            name: this.$t('public.statustype1'),
            value: res1.online,
            ratio: res1.onlineRate
          },
          {
            name: this.$t('public.statustype2'),
            value: res1.offline,
            ratio: res1.offlineRate
          },
          {
            name: this.$t('dictConst.notDetected'),
            value: res1.unchecked,
            ratio: res1.uncheckedRate
          }
        ]
        if (this.locale == 'zh') {
          this.tabelData1 = [
            {
              统计项: this.$t('public.statustype1'),
              数量: res1.online,
              比率: res1.onlineRate
            },
            {
              统计项: this.$t('public.statustype2'),
              数量: res1.offline,
              比率: res1.offlineRate
            },
            {
              统计项: this.$t('dictConst.notDetected'),
              数量: res1.unchecked,
              比率: res1.uncheckedRate
            }
          ]
        } else {
          this.tabelData1 = [
            {
              statisticalItem: this.$t('public.statustype1'),
              number: res1.online,
              percentum: res1.onlineRate
            },
            {
              statisticalItem: this.$t('public.statustype2'),
              number: res1.offline,
              percentum: res1.offlineRate
            },
            {
              statisticalItem: this.$t('dictConst.notDetected'),
              number: res1.unchecked,
              percentum: res1.uncheckedRate
            }
          ]
        }
      }
    },

    async getPreviewSummaryInfo() {
      this.loading3 = true

      if (this.permissionData3) {
        let res3 = await this.$api.getPreviewSummaryInfo({
          organizationId: this.organizationId
        })
        if (res3.resultCode == 0) {
          this.loading3 = false
          this.title3 = res3.successRate
          this.echartData3 = [
            {
              name: this.$t('operateManage.previewSuccessRatio'),
              value: res3.successNum,
              ratio: res3.successRate
            },
            {
              name: this.$t('operateManage.previewFailRatio'),
              value: res3.failure,
              ratio: res3.failureRate
            },
            {
              name: this.$t('dictConst.notDetected'),
              value: res3.unchecked,
              ratio: res3.uncheckedRate
            }
          ]
          if (this.locale == 'zh') {
            this.tabelData3 = [
              {
                统计项: this.$t('operateManage.previewSuccessRatio'),
                数量: res3.successNum,
                比率: res3.onlineRate
              },
              {
                统计项: this.$t('operateManage.previewFailRatio'),
                数量: res3.failure,
                比率: res3.failureRate
              },
              {
                统计项: this.$t('dictConst.notDetected'),
                数量: res3.unchecked,
                比率: res3.uncheckedRate
              }
            ]
          } else {
            this.tabelData3 = [
              {
                statisticalItem: this.$t('operateManage.previewSuccessRatio'),
                number: res3.successNum,
                percentum: res3.onlineRate
              },
              {
                statisticalItem: this.$t('operateManage.previewFailRatio'),
                number: res3.failure,
                percentum: res3.failureRate
              },
              {
                statisticalItem: this.$t('dictConst.notDetected'),
                number: res3.unchecked,
                percentum: res3.uncheckedRate
              }
            ]
          }
        }
      }
    },
    async getRecordIntegralityRealtime() {
      this.loading4 = true
      if (this.permissionData4) {
        let res4 = await this.$api.getRecordIntegralityRealtime({
          organizationId: this.organizationId
        })
        if (res4.resultCode == 0) {
          this.loading4 = false
          this.title4 = res4.completedRate
          this.echartData4 = [
            {
              name: this.$t('operateManage.recordIntegralityItem1'),
              value: res4.completed,
              ratio: res4.completedRate
            },
            {
              name: this.$t('operateManage.recordIntegralityItem2'),
              value: res4.uncompleted,
              ratio: res4.uncompletedRate
            },
            {
              name: this.$t('operateManage.recordIntegralityItem3'),
              value: res4.checkFailed,
              ratio: res4.checkFailedRate
            },
            {
              name: this.$t('operateManage.recordIntegralityItem4'),
              value: res4.unchecked,
              ratio: res4.uncheckedRate
            }
          ]
          if (this.locale == 'zh') {
            this.tabelData4 = [
              {
                统计项: this.$t('operateManage.recordIntegralityItem1'),
                数量: res4.completed,
                比率: res4.completedRate
              },
              {
                统计项: this.$t('operateManage.recordIntegralityItem2'),
                数量: res4.uncompleted,
                比率: res4.uncompletedRate
              },
              {
                统计项: this.$t('operateManage.recordIntegralityItem3'),
                数量: res4.checkFailed,
                比率: res4.checkFailedRate
              },
              {
                统计项: this.$t('operateManage.recordIntegralityItem4'),
                数量: res4.unchecked,
                比率: res4.uncheckedRate
              }
            ]
          } else {
            this.tabelData4 = [
              {
                statisticalItem: this.$t('operateManage.recordIntegralityItem1'),
                number: res4.completed,
                percentum: res4.completedRate
              },
              {
                statisticalItem: this.$t('operateManage.recordIntegralityItem2'),
                number: res4.uncompleted,
                percentum: res4.uncompletedRate
              },
              {
                statisticalItem: this.$t('operateManage.recordIntegralityItem3'),
                number: res4.checkFailed,
                percentum: res4.checkFailedRate
              },
              {
                statisticalItem: this.$t('operateManage.recordIntegralityItem4'),
                number: res4.unchecked,
                percentum: res4.uncheckedRate
              }
            ]
          }
        }
      }
    },

    getOption1() {
      let colorList = ['#478EFE', '#60A5FA', '#DBE0E6']
      return {
        title: [
          {
            text: '{val|' + this.title1 + '}',
            top: '38%',
            textAlign: 'center',
            left: '17%',
            textStyle: {
              rich: {
                val: {
                  fontSize: 30
                }
              }
            }
          },
          {
            text: this.$t('operateManage.onlineRatio'),
            top: '10%',
            textAlign: 'left',
            left: '40%',
            textStyle: {
              fontSize: 16
            }
          },
          {
            text: this.$t('operateManage.onlineRatioComputationalFormula'),
            top: '23%',
            textAlign: 'left',
            left: '40%',
            textStyle: {
              color: '#7A869A',
              fontSize: 12
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(35, 44, 59, 0.6)',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          top: '35%',
          left: '40%',
          icon: 'circle',
          itemGap: 17,
          formatter: name => {
            if (this.echartData1.length > 0) {
              const item = this.echartData1.filter(item => item.name === name)[0]
              return `{name|${name}}{rate| ${item.ratio}} ${
                item.value + this.$t('operateManage.sets')
              }`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 50
              },
              rate: {
                width: 70
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['18%', '45%'],
            radius: ['50%', '70%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: false
            },
            data: this.echartData1
          }
        ]
      }
    },
    getOption3() {
      let colorList = ['#818CF8', '#C7D2FE', '#DBE0E6']
      return {
        title: [
          {
            text: '{val|' + this.title3 + '}',
            top: '38%',
            textAlign: 'center',
            left: '17%',
            textStyle: {
              rich: {
                val: {
                  fontSize: 30
                }
              }
            }
          },
          {
            text: this.$t('operateManage.videoPreviewRatio'),
            top: '10%',
            textAlign: 'left',
            left: '40%',
            textStyle: {
              fontSize: 16
            }
          },
          {
            text: this.$t('operateManage.videoPreviewRatioComputationalFormula'),
            top: '23%',
            textAlign: 'left',
            left: '40%',
            textStyle: {
              color: '#7A869A',

              fontSize: 12
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(35, 44, 59, 0.6)',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          top: '39%',
          left: '40%',
          icon: 'circle',
          itemGap: 17,
          formatter: name => {
            if (this.echartData3.length > 0) {
              const item = this.echartData3.filter(item => item.name === name)[0]
              return `{name|${name}}{rate| ${item.ratio}} ${
                item.value + this.$t('operateManage.sets')
              }`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 70
              },
              rate: {
                width: 70
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['18%', '45%'],
            radius: ['50%', '70%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: false
            },
            data: this.echartData3
          }
        ]
      }
    },
    getOption4() {
      let colorList = ['#FBBF24', '#FFD145', '#FDE68A', '#DBE0E6']
      return {
        title: [
          {
            text: '{val|' + this.title4 + '}',
            top: '38%',
            textAlign: 'center',
            left: '24%',
            textStyle: {
              rich: {
                val: {
                  fontSize: 30
                }
              }
            }
          },
          {
            text: this.$t('operateManage.videoIntegralityYesterdayRatio'),
            top: '10%',
            textAlign: 'left',
            left: '47%',
            textStyle: {
              fontSize: 16
            }
          },
          {
            text: this.$t('operateManage.videoIntegralityRatioComputationalFormula'),
            top: '23%',
            textAlign: 'left',
            left: '47%',
            textStyle: {
              color: '#7A869A',
              fontSize: 12
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(35, 44, 59, 0.6)',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          top: '32%',
          left: '47%',
          icon: 'circle',
          itemGap: 15,
          formatter: name => {
            if (this.echartData4.length > 0) {
              const item = this.echartData4.filter(item => item.name === name)[0]
              return `{name|${name}}{rate| ${item.ratio}} ${
                item.value + this.$t('operateManage.sets')
              }`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 70
              },
              rate: {
                width: 70
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['25%', '45%'],
            radius: ['50%', '70%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: false
            },
            data: this.echartData4
          }
        ]
      }
    },
    handleExport() {
      let excelData = [this.tabelData1, this.tabelData3, this.tabelData4]
      exportExcel(excelData, this.sheetNameList, this.excelFileName)
    },
    handleCheck1() {
      let routerPush = {
        name: 'StatusMonitoringOfMonitoringPoints'
      }
      this.routeJump('/devOps/monitor/point-status', routerPush)
    },
    handleCheck3() {
      this.routeJump('/devOps/video-preview', {
        path: '/devOps/video-preview'
      })
    },
    handleCheck4() {
      this.routeJump('/devOps/video-monitor', {
        path: '/devOps/video-monitor'
      })
    }
  }
}
</script>
