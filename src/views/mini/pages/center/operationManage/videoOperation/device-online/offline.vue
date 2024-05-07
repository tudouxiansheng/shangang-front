<template>
  <div class="p-5" ref="offline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="75px"
      label-position="left"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item :label="$t('videoOperate.searchType') + '：'" label-width="110px">
            <el-radio-group v-model="searchType">
              <el-radio label="1">{{ $t('organizationManage.area') }}</el-radio>
              <el-radio label="2">{{ $t('videoOperate.platForm1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-show="searchType == 1" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + '：'">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :clearable="false"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" v-show="searchType == 2">
          <el-form-item :label="$t('videoOperate.platForm') + '：'" prop="platId">
            <el-select v-model="platId" :placeholder="$t('videoOperate.platFormProp')" clearable>
              <el-option
                v-for="item in platOption"
                :key="item.platId"
                :label="item.platName"
                :value="item.platId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('videoOperate.timeRange') + ':'">
            <el-radio-group v-model="timeType" class="mr-5" @change="timeTypeChange">
              <el-radio-button label="1">{{ $t('videoOperate.today') }}</el-radio-button>
              <el-radio-button label="2">{{ $t('videoOperate.week') }}</el-radio-button>
              <el-radio-button label="3">{{ $t('videoOperate.month') }}</el-radio-button>
            </el-radio-group>
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="times"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              format="YYYY-MM-DD"
              value-format="YYYYMMDD"
              :clearable="false"
              @change="timesChange"
            >
              >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="4" class="text-right">
          <el-button type="primary" @click="getOnOfflineStat" v-hasPermi="[1408]">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row v-loading="echartLoading">
      <echart id="resourceOperateBar" height="400px" :options="getOption()"></echart>
    </el-row>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        max-height="315"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, index) in tableHeaderList"
          :width="index == 0 || index == 1 ? '100' : ''"
          :fixed="index == 0 || index == 1"
          :key="index"
          :label="item"
          :prop="index.toString()"
          show-overflow-tooltip
        />
      </el-table>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import echart from '@/components/echart'
import { getFormatDate5, getDIYTime1 } from '@/utils/common/mutil.js'
import { permissions } from '@/utils/common/permissions'

export default {
  name: 'DeviceOfflineStatistics',
  components: { Treeselect, echart },
  data() {
    return {
      isRouterAlive: true,
      permissionsStatistics: true,
      permissionsStatisticsDetail: true,
      organizationOption: null,
      searchType: '1',
      organizationId: undefined,
      organizationIdCopy: undefined,
      platOption: [],
      platId: '',
      timeType: '1',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      times: [],
      dayList: [],
      weekList: [],
      mounthList: [],
      searchForm: {},
      echartLoading: false,
      echartData: [],
      loading: false,
      tableHeaderList: [],
      tableData: [],
      xData: [],
      offlineList: [],
      onlineList: [],
      offlineRateList: []
    }
  },
  created() {
    this.timesForamtter()
    this.getPermissions()
    this.getPlatformList()
  },
  methods: {
    async getPermissions() {
      this.permissionsStatistics = await permissions(1408)
      this.permissionsStatisticsDetail = await permissions(1414)
    },
    async getPlatformList() {
      let organizationId = sessionStorage.getItem('organizationId')
      let res = await this.$api.queryAccessPlatformList({
        organizationId
      })
      if (res.platformList && res.platformList.length) {
        res.platformList = res.platformList.map(item => {
          return {
            enableStatus: item.enableStatus,
            platId: item.platformId,
            platName: item.platformName,
            platType: item.platformType,
            platStatus: item.platformStatus
          }
        })
        this.platOption = res.platformList
      }
    },
    timeTypeChange() {
      switch (this.timeType) {
        case '1':
          this.times = this.dayList
          break
        case '2':
          this.times = this.weekList
          break
        case '3':
          this.times = this.mounthList
          break
        default:
          break
      }
    },
    timesChange() {
      this.timeType = ''
    },
    timesForamtter() {
      let date = new Date()
      let dayFormattered = getFormatDate5(date)
      let weekList = getDIYTime1(3)
      let monthList = getDIYTime1(4)
      let weekFormattered = getFormatDate5(weekList[0])
      let mounthFormattered = getFormatDate5(monthList[0])
      this.dayList = [dayFormattered, dayFormattered]
      this.times = this.dayList
      this.weekList = [weekFormattered, dayFormattered]
      this.mounthList = [mounthFormattered, dayFormattered]
    },
    async getOnOfflineStat() {
      this.loading = true
      this.echartLoading = true
      this.searchForm.beginDate = this.times[0]
      this.searchForm.endDate = this.times[1]
      if (this.searchType == 1) {
        this.searchForm.organizationId = this.organizationId
        delete this.searchForm.platId
      } else {
        this.searchForm.platId = this.platId
        delete this.searchForm.organizationId
      }
      if (this.permissionsStatistics) {
        let res1 = await this.$api.onOfflineStat(this.searchForm)
        if (res1.resultCode == 0) {
          this.echartLoading = false
          this.echartData = res1.onofflineStatInfo
          this.xData = []
          this.offlineList = []
          this.onlineList = []
          this.offlineRateList = []
          this.echartData.forEach(item => {
            this.xData.push(item.statTime)
            this.offlineList.push(item.offlines)
            this.onlineList.push(item.onlines)
            this.offlineRateList.push(item.offlineRate)
          })
        }
      }
      if (this.permissionsStatisticsDetail) {
        let res2 = await this.$api.onOfflineDetailStat(this.searchForm)
        if (res2.resultCode == 0) {
          this.loading = false
          this.tableData = []
          let list = res2.onofflineStatDetails
          if (list.length > 0) {
            if (this.searchType == '1') {
              this.tableHeaderList = [
                this.$t('deviceInfo.areaName'),
                this.$t('deviceInfo.pointOfflineRate')
              ]
            } else {
              this.tableHeaderList = [
                this.$t('public.platName'),
                this.$t('deviceInfo.pointOfflineRate')
              ]
            }
            list[0].onofflineStatDetail.forEach(item => {
              this.tableHeaderList.push(item.statTime)
            })
            list.forEach((item, index) => {
              this.tableData[index] = [item.name, item.offlineRateTotal]
              item.onofflineStatDetail.forEach(item1 => {
                this.tableData[index].push(item1.offlineRate)
              })
            })
          }
        }
      }
    },
    getOption() {
      return {
        title: {
          text: this.$t('operateManage.offlineRateComputationalFormula'),
          right: 0,
          textStyle: {
            color: '#FF6B6B',
            fontSize: 14,
            fontWeight: 400,
            fontFamily: 'MicrosoftYaHei'
          }
        },
        tooltip: [
          {
            trigger: 'axis',
            backgroundColor: 'rgba(35, 44, 59, 0.6)',
            textStyle: {
              color: '#fff'
            }
          }
        ],
        legend: {
          bottom: '0%',
          icon: 'roundRect',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 30
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, //坐标轴两边留白
          data: this.xData
        },
        yAxis: [
          {
            type: 'value',
            name: this.$t('areaManage.deviceNum'),
            nameTextStyle: {
              color: '#999999'
            },
            splitNumber: 5,
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: this.$t('operateManage.offlineRate'),
            nameTextStyle: {
              color: '#999999'
            },
            splitNumber: 5,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                return value + '%'
              }
            }
          }
        ],
        series: [
          {
            name: this.$t('videoOperate.offlineDevNum'),
            type: 'line',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#FF6B6B',
                lineStyle: {
                  width: 1
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(255, 107, 107, 0.07)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 107, 107, 0.21)'
                    }
                  ])
                }
              }
            },
            data: this.offlineList
          },
          {
            name: this.$t('videoOperate.onlineDevNum'),
            type: 'line',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#3DE0BF',
                lineStyle: {
                  width: 1
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(61, 224, 191, 0.07)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(61, 224, 191, 0.21)'
                    }
                  ])
                }
              }
            },
            data: this.onlineList
          },
          {
            name: this.$t('operateManage.offlineRate'),
            type: 'line',
            showSymbol: false,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#cccccc',
                lineStyle: {
                  width: 1
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(61, 224, 191, 0.07)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(61, 224, 191, 0.21)'
                    }
                  ])
                }
              }
            },
            data: this.offlineRateList
          }
        ]
      }
    },
    handleReset() {
      this.searchType = '1'
      this.organizationId = this.organizationIdCopy
      this.platId = ''
      this.$refs['searchForm'].resetFields()
      this.getOnOfflineStat()
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
            this.getOnOfflineStat()
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) return {}
      return data.map(item => {
        let obj = {
          id: item.payload.organizationId,
          label: item.label,
          children: null
        }
        if (item.leaf === true) {
          delete obj.children
        }
        return obj
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.treeselect {
  :deep(.el-form-item--medium .el-form-item__content) {
    width: 202px;
    line-height: 36px;
  }
}

:deep(.el-date-editor--daterange.el-input__inner) {
  width: 275px;
}
:deep(.el-range-editor--medium .el-range-separator) {
  width: 25px;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.el-table__body tr.hover-row > td) {
  background-color: #175290;
}
</style>
