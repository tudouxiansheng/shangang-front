<template>
  <div>
    <collapse-card
      :title="$t('operateManage.focusVideoQualityStatistics')"
      hideCollapse
      background
      backgroundColor="#0A314F"
    >
      <template #operate>
        <el-button type="primary" plain @click="handleCheck">
          {{ $t('operateManage.view') }}
        </el-button>
        <el-button type="success" @click="handleExport">
          {{ $t('businessLog.exportExcel') }}
        </el-button>
      </template>
      <div class="video-box" v-loading="loading">
        <div class="echarts1">
          <echart id="videoStatusPie" height="275px" :options="getOption1()"></echart>
        </div>
        <div class="echarts2">
          <echart id="videoAbnormalPie" height="275px" :options="getOption2()"></echart>
        </div>
        <div style="width: 450px">
          <div class="image-error">
            <p>{{ $t('operateManage.imgError') }}</p>
            <div>
              <div class="legend">
                <div class="item">
                  <span class="legend-circle legend-circle1"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError1') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[0].ratio }}</span>
                  <span>{{ echartData3[0].value }}</span>
                </div>
                <div class="item">
                  <span class="legend-circle legend-circle2"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError2') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[1].ratio }}</span>
                  <span>{{ echartData3[1].value }}</span>
                </div>
                <div class="item">
                  <span class="legend-circle legend-circle3"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError3') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[2].ratio }}</span>
                  <span>{{ echartData3[2].value }}</span>
                </div>
                <div class="item">
                  <span class="legend-circle legend-circle4"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError4') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[3].ratio }}</span>
                  <span>{{ echartData3[3].value }}</span>
                </div>
                <div class="item">
                  <span class="legend-circle legend-circle5"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError5') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[4].ratio }}</span>
                  <span>{{ echartData3[4].value }}</span>
                </div>
              </div>
              <div class="legend legend1">
                <div class="item">
                  <span class="legend-circle legend-circle6"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError6') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[5].ratio }}</span>
                  <span>{{ echartData3[5].value }}</span>
                </div>
                <div class="item">
                  <span class="legend-circle legend-circle7"></span>
                  <span class="legend-item-name">{{ $t('operateManage.imgError7') }}</span>
                  <span class="legend-item-ratio">{{ echartData3[6].ratio }}</span>
                  <span>{{ echartData3[6].value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </collapse-card>
  </div>
</template>

<script>
import collapseCard from '../../component/collapse-card.vue'
import echart from '@/components/echart'
import { getDIYTime1, getFormatDate6 } from '@/utils/common/mutil.js'
import { exportExcel } from '@/utils/common/excelOperate'
import routeJump from '@/mixin/route-jump.js'
import { permissions } from '@/utils/common/permissions'

export default {
  components: { collapseCard, echart },
  props: ['organizationId'],
  mixins: [routeJump],
  data() {
    return {
      permissionSummaryInfo: true,
      time: '',
      echartData1: [],
      echartData2: [],
      echartData3: [],
      total: undefined,
      tabelData1: [],
      tabelData2: [],
      tabelData3: [],
      videoErrTotal: 0,
      iamgeErrTotal: 0,
      total1: 0,
      dialogVisible: false,
      dataForm: {},
      loading: true,
      sheetNameList: [],
      excelFileName: '',
      echartData4: [],
      locale: localStorage.getItem('locale')
    }
  },
  watch: {
    organizationId(value) {
      if (value != undefined) {
        this.getSummaryInfo()
      }
    }
  },
  created() {
    this.timesForamtter()
    this.dataInternationalised()
  },
  methods: {
    dataInternationalised() {
      this.sheetNameList = [
        this.$t('operateManage.result'),
        this.$t('operateManage.videoError'),
        this.$t('operateManage.imgError')
      ]
      this.excelFileName = this.$t('operateManage.focusVideoQualityStatistics')
    },
    timesForamtter() {
      let time = getDIYTime1(2)
      this.time = getFormatDate6(time[0])
    },
    // 获取监控点设备在线率
    async getSummaryInfo() {
      this.loading = true
      let res = await this.$api.getVideoQualitySummaryInfo({
        organizationId: this.organizationId,
        statDate: this.time
      })
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.total
        this.videoErrTotal = res.errorCount
        this.iamgeErrTotal = res.patrolFailure.getUrlFailure
        this.echartData1 = [
          {
            name: this.$t('operateManage.videoError1'),
            value: res.successNum,
            ratio: res.successRate
          },
          {
            name: this.$t('operateManage.videoError2'),
            value: res.errorCount,
            ratio: res.errorRate
          },
          {
            name: this.$t('operateManage.videoError3'),
            value: res.failure,
            ratio: res.failureRate
          },
          {
            name: this.$t('operateManage.videoError4'),
            value: res.unchecked,
            ratio: res.uncheckedRate
          }
        ]
        this.echartData2 = [
          {
            name: this.$t('operateManage.videoItemError1'),
            value: res.patrolFailure.getUrlFailure,
            ratio: res.patrolFailure.urlFailureRate
          },
          {
            name: this.$t('operateManage.videoItemError2'),
            value: res.patrolFailure.recvStreamFailure,
            ratio: res.patrolFailure.streamFailureRate
          },
          {
            name: this.$t('operateManage.videoItemError3'),
            value: res.patrolFailure.detectFailure,
            ratio: res.patrolFailure.detectFailureRate
          },
          {
            name: this.$t('operateManage.videoItemError4'),
            value: res.patrolFailure.other,
            ratio: res.patrolFailure.otherRate
          }
        ]

        this.echartData3 = [
          {
            name: this.$t('operateManage.imgError1'),
            value: res.patrolFailure.detectFailureDetail.blur,
            ratio: res.patrolFailure.detectFailureDetail.blurRate
          },
          {
            name: this.$t('operateManage.imgError2'),
            value: res.patrolFailure.detectFailureDetail.motion,
            ratio: res.patrolFailure.detectFailureDetail.motionRate
          },
          {
            name: this.$t('operateManage.imgError3'),
            value: res.patrolFailure.detectFailureDetail.freeze,
            ratio: res.patrolFailure.detectFailureDetail.freezeRate
          },
          {
            name: this.$t('operateManage.imgError4'),
            value: res.patrolFailure.detectFailureDetail.shake,
            ratio: res.patrolFailure.detectFailureDetail.shakeRate
          },
          {
            name: this.$t('operateManage.imgError5'),
            value: res.patrolFailure.detectFailureDetail.lostOrCover,
            ratio: res.patrolFailure.detectFailureDetail.lostOrCoverRate
          },
          {
            name: this.$t('operateManage.imgError6'),
            value: res.patrolFailure.detectFailureDetail.color,
            ratio: res.patrolFailure.detectFailureDetail.colorRate
          },
          {
            name: this.$t('operateManage.imgError7'),
            value: res.patrolFailure.detectFailureDetail.backlight,
            ratio: res.patrolFailure.detectFailureDetail.backlightRate
          }
        ]
        if (this.locale == 'zh') {
          this.tabelData1 = [
            {
              统计项: this.$t('operateManage.videoError1'),
              数量: res.successNum,
              比率: res.successRate
            },
            {
              统计项: this.$t('operateManage.videoError2'),
              数量: res.errorCount,
              比率: res.errorRate
            },
            {
              统计项: this.$t('operateManage.videoError3'),
              数量: res.failure,
              比率: res.failureRate
            },
            {
              统计项: this.$t('operateManage.videoError4'),
              数量: res.unchecked,
              比率: res.uncheckedRate
            }
          ]
          this.tabelData2 = [
            {
              统计项: this.$t('operateManage.videoItemError1'),
              数量: res.patrolFailure.getUrlFailure,
              比率: res.patrolFailure.urlFailureRate
            },
            {
              统计项: this.$t('operateManage.videoItemError2'),
              数量: res.patrolFailure.recvStreamFailure,
              比率: res.patrolFailure.streamFailureRate
            },
            {
              统计项: this.$t('operateManage.videoItemError3'),
              数量: res.patrolFailure.detectFailure,
              比率: res.patrolFailure.detectFailureRate
            },
            {
              统计项: this.$t('operateManage.videoItemError4'),
              数量: res.patrolFailure.other,
              比率: res.patrolFailure.otherRate
            }
          ]
          this.tabelData3 = [
            {
              统计项: this.$t('operateManage.imgError1'),
              数量: res.patrolFailure.detectFailureDetail.blur,
              比率: res.patrolFailure.detectFailureDetail.blurRate
            },
            {
              统计项: this.$t('operateManage.imgError2'),
              数量: res.patrolFailure.detectFailureDetail.motion,
              比率: res.patrolFailure.detectFailureDetail.motionRate
            },
            {
              统计项: this.$t('operateManage.imgError3'),
              数量: res.patrolFailure.detectFailureDetail.freeze,
              比率: res.patrolFailure.detectFailureDetail.freezeRate
            },
            {
              统计项: this.$t('operateManage.imgError4'),
              数量: res.patrolFailure.detectFailureDetail.shake,
              比率: res.patrolFailure.detectFailureDetail.shakeRate
            },
            {
              统计项: this.$t('operateManage.imgError5'),
              数量: res.patrolFailure.detectFailureDetail.lostOrCover,
              比率: res.patrolFailure.detectFailureDetail.lostOrCoverRate
            },
            {
              统计项: this.$t('operateManage.imgError6'),
              数量: res.patrolFailure.detectFailureDetail.color,
              比率: res.patrolFailure.detectFailureDetail.colorRate
            },
            {
              统计项: this.$t('operateManage.imgError7'),
              数量: res.patrolFailure.detectFailureDetail.backlight,
              比率: res.patrolFailure.detectFailureDetail.backlightRate
            }
          ]
        } else {
          this.tabelData1 = [
            {
              statisticalItem: this.$t('operateManage.videoError1'),
              number: res.successNum,
              percentum: res.successRate
            },
            {
              statisticalItem: this.$t('operateManage.videoError2'),
              number: res.errorCount,
              percentum: res.errorRate
            },
            {
              statisticalItem: this.$t('operateManage.videoError3'),
              number: res.failure,
              percentum: res.failureRate
            },
            {
              statisticalItem: this.$t('operateManage.videoError4'),
              number: res.unchecked,
              percentum: res.uncheckedRate
            }
          ]
          this.tabelData2 = [
            {
              statisticalItem: this.$t('operateManage.videoItemError1'),
              number: res.patrolFailure.getUrlFailure,
              percentum: res.patrolFailure.urlFailureRate
            },
            {
              statisticalItem: this.$t('operateManage.videoItemError2'),
              number: res.patrolFailure.recvStreamFailure,
              percentum: res.patrolFailure.streamFailureRate
            },
            {
              statisticalItem: this.$t('operateManage.videoItemError3'),
              number: res.patrolFailure.detectFailure,
              percentum: res.patrolFailure.detectFailureRate
            },
            {
              statisticalItem: this.$t('operateManage.videoItemError4'),
              number: res.patrolFailure.other,
              percentum: res.patrolFailure.otherRate
            }
          ]
          this.tabelData3 = [
            {
              statisticalItem: this.$t('operateManage.imgError1'),
              number: res.patrolFailure.detectFailureDetail.blur,
              percentum: res.patrolFailure.detectFailureDetail.blurRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError2'),
              number: res.patrolFailure.detectFailureDetail.motion,
              percentum: res.patrolFailure.detectFailureDetail.motionRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError3'),
              number: res.patrolFailure.detectFailureDetail.freeze,
              percentum: res.patrolFailure.detectFailureDetail.freezeRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError4'),
              number: res.patrolFailure.detectFailureDetail.shake,
              percentum: res.patrolFailure.detectFailureDetail.shakeRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError5'),
              number: res.patrolFailure.detectFailureDetail.lostOrCover,
              percentum: res.patrolFailure.detectFailureDetail.lostOrCoverRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError6'),
              number: res.patrolFailure.detectFailureDetail.color,
              percentum: res.patrolFailure.detectFailureDetail.colorRate
            },
            {
              statisticalItem: this.$t('operateManage.imgError7'),
              number: res.patrolFailure.detectFailureDetail.backlight,
              percentum: res.patrolFailure.detectFailureDetail.backlightRate
            }
          ]
        }
      }
    },
    getOption1() {
      let colors = ['#3DE0BF', '#478EFE', '#FF552D', '#AAAAAA']
      return {
        title: [
          {
            text: this.$t('operateManage.focusVideoStatistics'),
            left: '58%',
            top: '12%',
            textAlign: 'left',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          {
            text: '{val|' + this.total + '}\n{name|' + this.$t('operateManage.sets') + '}',
            top: '32%',
            textAlign: 'center',
            left: '28%',
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  padding: [5, 0],
                  fontWeight: 800
                },
                val: {
                  fontSize: 36,
                  fontWeight: 'normal'
                }
              }
            }
          }
        ],
        color: colors,
        legend: {
          orient: 'vertical',
          top: '29%',
          left: '58%',
          icon: 'circle',
          itemGap: 15,
          formatter: name => {
            if (this.echartData1.length > 0) {
              const item = this.echartData1.filter(item => item.name === name)[0]
              return `{name|${name}}{value|${item.ratio}} ${item.value}`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 60
              },
              value: {
                width: 50
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['37%', '55%'],
            center: ['29%', '45%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colors[params.dataIndex]
                }
              }
            },
            label: {
              show: false,
              position: 'outside',
              formatter: '{top|{b}}\n{bottom|{c}({d}%)}',
              rich: {
                top: {
                  padding: [0, 0, 10, 0],
                  align: 'center'
                },
                bottom: {
                  align: 'center'
                }
              }
            },
            labelLine: {
              length: 10,
              length2: 10
            },

            data: this.echartData1
          }
        ]
      }
    },
    getOption2() {
      let colorList = ['#478EFE', '#4CDBFF', '#FF552D', '#FFD145', '#AAAAAA']
      return {
        title: [
          {
            text: this.$t('operateManage.videoError'),
            left: '55%',
            top: '12%',
            textAlign: 'left',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          {
            text: '{val|' + this.videoErrTotal + '}\n{name|' + this.$t('operateManage.sets') + '}',
            top: '32%',
            textAlign: 'center',
            left: '26%',
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  padding: [5, 0],
                  fontWeight: 800
                },
                val: {
                  fontSize: 36,
                  fontWeight: 'normal'
                }
              }
            }
          }
        ],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: '29%',
          left: '55%',
          icon: 'circle',
          itemGap: 15,
          formatter: name => {
            if (this.echartData2.length > 0) {
              const item = this.echartData2.filter(item => item.name === name)[0]
              return `{name|${name}}{value|${item.ratio}} ${item.value}`
            }
          },
          textStyle: {
            rich: {
              name: {
                width: 70
              },
              value: {
                width: 50
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['27%', '45%'],
            radius: ['37%', '55%'],
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
            data: this.echartData2
          }
        ]
      }
    },
    handleExport() {
      let excelData = [this.tabelData1, this.tabelData2, this.tabelData3]
      exportExcel(excelData, this.sheetNameList, this.excelFileName)
    },
    edite() {
      this.dialogVisible = true
    },
    handleCheck() {
      this.routeJump('/bms/video-quality-check', {
        path: '/bms/video-quality-check'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-box {
  display: flex;
  .echarts1 {
    flex: 1;
  }
  .echarts2 {
    flex: 1;
  }
}
.edit-icon-class {
  margin-left: 20px;
  display: inline;
  color: rgba(59, 130, 246);
}
.image-error {
  margin-left: 30px;
  margin-top: 32px;
  font-size: 16px;
  color: #fff;
  .legend {
    float: left;
    margin-top: 15px;
    color: #fff;
    font-size: 12px;
    font-family: 'sans-serif';
    span {
      display: inline-block;
    }
    .item {
      position: relative;
      margin-top: 10px;
    }
    .legend-item-name {
      width: 90px;
      margin-left: 20px;
    }
    .legend-circle {
      position: absolute;
      top: 3px;
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 12px;
      background: #478efe;
    }
    .legend-circle1 {
      background: #478efe;
    }
    .legend-circle2 {
      background: #4cdbff;
    }
    .legend-circle3 {
      background: #9e87ff;
    }
    .legend-circle4 {
      background: #ff73a1;
    }
    .legend-circle5 {
      background: #ff9832;
    }
    .legend-circle6 {
      background: #ff552d;
    }
    .legend-circle7 {
      background: #ffd145;
    }
    .legend-circle8 {
      background: #6ee7b7;
    }
    .legend-item-ratio {
      width: 60px;
    }
  }
  .legend1 {
    margin-left: 30px;
  }
}
</style>
