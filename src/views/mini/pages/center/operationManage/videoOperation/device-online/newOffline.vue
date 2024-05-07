<template>
  <div id="newOffline" class="p-7" ref="offline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="90px"
      label-position="left"
    >
      <el-row>
        <el-col :span="5" class="treeselect">
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
        <el-col :span="12">
          <el-form-item :label="$t('videoOperate.timeRange') + ':'">
            <el-radio-group v-model="timeType" class="mr-5" @change="timeTypeChange">
              <el-radio-button label="1">{{ $t('videoOperate.today') }}</el-radio-button>
              <el-radio-button label="2">{{ $t('videoOperate.week') }}</el-radio-button>
              <el-radio-button label="3">{{ $t('videoOperate.month') }}</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="times"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              format="YYYY-MM-DD"
              value-format="YYYYMMDD"
              :clearable="false"
              :picker-options="pickerOptions"
              @change="timesChange"
            >
              >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7" class="text-right">
          <el-button type="primary" @click="getOnOfflineStat" v-hasPermi="[1408]">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            v-hasPermi="[1448]"
            type="success"
            :loading="exportLoading"
            @click="handleExport"
          >
            {{ $t('businessLog.exportExcel') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--  在线率展示区  -->
    <div class="statistics-box">
      <div class="statistics-item">
        <div class="statistics-item-left itemDay"></div>
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.onlineRate') }}</div>
          <div class="item-right-subTitle">
            <count-to
              :start-val="0"
              :decimals="onlineRateDay === 0 ? 0 : 2"
              suffix="%"
              :end-val="onlineRateDay"
              :duration="2600"
              class="item-right-subTitle-per1"
            />
            <div class="item-right-subTitle-per2">
              {{ $t('videoOperate.QOQ') }}：
              <div
                :class="{
                  'subTitle-per2-color': true,
                  'per2-bg1 el-icon-caret-bottom': sequentialDay < 0,
                  'per2-bg2 el-icon-caret-top': sequentialDay >= 0
                }"
              ></div>
              <count-to
                :start-val="0"
                :decimals="sequentialDay === 0 ? 0 : 2"
                :end-val="sequentialDay"
                :duration="2600"
                suffix="%"
                :class="{
                  'per2-bg1': sequentialDay < 0,
                  'per2-bg2': sequentialDay >= 0
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="statistics-item">
        <div class="statistics-item-left itemWeek"></div>
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.lastWeekOnlineRate') }}</div>
          <div class="item-right-subTitle">
            <count-to
              :start-val="0"
              :decimals="onlineRateWeek === 0 ? 0 : 2"
              suffix="%"
              :end-val="onlineRateWeek"
              :duration="2600"
              class="item-right-subTitle-per1"
            />
            <div class="item-right-subTitle-per2">
              {{ $t('videoOperate.QOQ') }}：
              <div
                :class="{
                  'subTitle-per2-color': true,
                  'per2-bg1 el-icon-caret-bottom': sequentialWeek < 0,
                  'per2-bg2 el-icon-caret-top': sequentialWeek >= 0
                }"
              ></div>
              <count-to
                :start-val="0"
                :decimals="sequentialWeek === 0 ? 0 : 2"
                :end-val="sequentialWeek"
                :duration="2600"
                suffix="%"
                :class="{
                  'per2-bg1': sequentialWeek < 0,
                  'per2-bg2': sequentialWeek >= 0
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="statistics-item">
        <div class="statistics-item-left itemMonth"></div>
        <div class="statistics-item-right">
          <div class="item-right-title">{{ $t('videoOperate.lastMonthOnlineRate') }}</div>
          <div class="item-right-subTitle">
            <count-to
              :start-val="0"
              :decimals="onlineRateMonth === 0 ? 0 : 2"
              suffix="%"
              :end-val="onlineRateMonth"
              :duration="2600"
              class="item-right-subTitle-per1"
            />
            <div class="item-right-subTitle-per2">
              {{ $t('videoOperate.QOQ') }}：
              <div
                :class="{
                  'subTitle-per2-color': true,
                  'per2-bg1 el-icon-caret-bottom': sequentialMonth < 0,
                  'per2-bg2 el-icon-caret-top': sequentialMonth >= 0
                }"
              ></div>
              <count-to
                :start-val="0"
                :decimals="sequentialMonth === 0 ? 0 : 2"
                :end-val="sequentialMonth"
                :duration="2600"
                suffix="%"
                :class="{
                  'per2-bg1': sequentialMonth < 0,
                  'per2-bg2': sequentialMonth >= 0
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <myCollapse>
      {{ $t('deviceInfo.deviceStatistics') }}
      <template v-slot:content>
        <el-row v-loading="echartLoading">
          <echart
            ref="resourceOperateBar"
            id="resourceOperateBar"
            height="400px"
            :options="getOption()"
          ></echart>
        </el-row>
      </template>
    </myCollapse>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        :max-height="tableHeght"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, index) in tableHeaderList"
          :width="getWidth(index)"
          min-width="110px"
          :fixed="index <= 2"
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
import myCollapse from './component/collapse'
import CountTo from 'vue-count-to'
import { getFormatDate5, getDIYTime1 } from '@/utils/common/mutil.js'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import dayjs from 'dayjs'
export default {
  components: { Treeselect, echart, CountTo, myCollapse },
  data() {
    return {
      isShowEchart: true, // 是否显示或隐藏 echart
      tableHeght: 315,
      isRouterAlive: true,
      permissionsStatistics: true,
      permissionsStatisticsDetail: true,
      organizationOption: null,
      organizationId: undefined,
      organizationIdCopy: undefined,
      timeType: '2',
      pickerOptions: {
        disabledDate(time) {
          const curDate = new Date()
          const threeMonths = dayjs(curDate).subtract(3, 'month').valueOf()
          return time.getTime() > Date.now() || time.getTime() < threeMonths
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
      onlineRateList: [],
      // 在线率
      onlineRateDay: 0,
      sequentialDay: 0,
      onlineRateWeek: 0,
      sequentialWeek: 0,
      onlineRateMonth: 0,
      sequentialMonth: 0,
      exportLoading: false
    }
  },
  created() {
    this.timesForamtter()
    this.getPermissions()
  },
  methods: {
    // 导出excel
    async handleExport() {
      this.exportLoading = true
      try {
        this.searchForm.beginDate = this.times[0]
        this.searchForm.endDate = this.times[1]
        this.searchForm.organizationId = this.organizationId
        let res = await this.$api.onOfflineNewStatExport(this.searchForm)
        if (res.resultCode == 0) {
          res.fileUrl && download(res.fileUrl, this.$t('public.onlineOfflineDevice'))
        }
      } finally {
        this.exportLoading = false
      }
    },
    // 用户权限
    async getPermissions() {
      this.permissionsStatistics = await permissions(1408)
      this.permissionsStatisticsDetail = await permissions(1414)
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
    timesChange(data) {
      if (this.dayList[0] == data[0] && this.dayList[1] == data[1]) {
        this.timeType = 1
      } else if (this.weekList[0] == data[0] && this.weekList[1] == data[1]) {
        this.timeType = 2
      } else if (this.mounthList[0] == data[0] && this.mounthList[1] == data[1]) {
        this.timeType = 3
      } else {
        this.timeType = ''
      }
    },
    timesForamtter() {
      let date = new Date()
      let dayFormattered = getFormatDate5(date)
      let weekList = getDIYTime1(3)
      let monthList = getDIYTime1(4)
      let weekFormattered = getFormatDate5(weekList[0])
      let mounthFormattered = getFormatDate5(monthList[0])
      this.dayList = [dayFormattered, dayFormattered]
      this.weekList = [weekFormattered, dayFormattered]
      this.times = this.weekList
      this.mounthList = [mounthFormattered, dayFormattered]
    },
    async getOnOfflineStat() {
      this.loading = true
      this.echartLoading = true
      this.searchForm.beginDate = this.times[0]
      this.searchForm.endDate = this.times[1]
      this.searchForm.organizationId = this.organizationId
      if (this.permissionsStatistics) {
        let res1 = await this.$api.onOfflineNewStat(this.searchForm)
        if (res1.resultCode == 0) {
          this.echartLoading = false
          this.xData = []
          this.offlineList = []
          this.onlineList = []
          this.onlineRateList = []

          this.echartData = res1.onofflineStatInfo

          this.echartData.forEach(item => {
            this.xData.push(item.area)
            this.onlineList.push(item.onlineCounts)
            this.offlineList.push(item.offlineCounts)
            this.onlineRateList.push(item.onlineRate)
          })
          this.onlineRateDay = res1.onlineRateDay
          this.sequentialDay = res1.sequentialDay
          this.onlineRateWeek = res1.onlineRateWeek
          this.sequentialWeek = res1.sequentialWeek
          this.onlineRateMonth = res1.onlineRateMonth
          this.sequentialMonth = res1.sequentialMonth
        } else {
          this.xData = []
          this.offlineList = []
          this.onlineList = []
          this.onlineRateList = []
          this.onlineRateDay = 0
          this.sequentialDay = 0
          this.onlineRateWeek = 0
          this.sequentialWeek = 0
          this.onlineRateMonth = 0
          this.sequentialMonth = 0
        }
      }
      if (this.permissionsStatisticsDetail) {
        let res2 = await this.$api.onOfflineDetailNewStat(this.searchForm)
        if (res2.resultCode == 0) {
          this.loading = false
          this.tableData = []
          let list = res2.onofflineStatDetails

          if (list.length > 0) {
            this.tableHeaderList = [
              this.$t('deviceInfo.organizationalRegion'),
              this.$t('deviceInfo.averageonlineRate'),
              this.$t('deviceInfo.pointonlineRateSequential')
            ]
            list[0].onofflineStatDetail.forEach(item => {
              this.tableHeaderList.push(this.tableFormatter(item))
            })
            list.forEach((item, index) => {
              this.tableData[index] = [
                item.name,
                item.onlineRateTotal + '%',
                item.onlineRateSequential
              ]
              item.onofflineStatDetail.forEach(item1 => {
                this.tableData[index].push(item1.onlineRate)
              })
            })
          }
        }
      }
    },
    getOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          borderWidth: 1,
          borderColor: '#8DD4FF',
          backgroundColor: 'rgba(9,40,64,0.8)',
          textStyle: {
            color: '#fff'
          },
          formatter: function (params) {
            let str = `${params[0].name} <br />`
            params.forEach((item, index) => {
              str += `<span style="display:inline-block; margin-right:5px; width:10px; height:10px;background-color:${
                item.color.colorStops ? item.color.colorStops[0].color : item.color
              }"></span>${item.seriesName}：${item.value} ${
                item.seriesType == 'line' ? '%' : ''
              }<br />`
            })
            return str
          }
        },
        axisPointer: {
          label: {
            backgroundColor: 'rgba(4,161,255,0.3)'
          }
        },
        legend: {
          top: 27,
          right: 150,
          icon: 'roundRect',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisPointer: {},
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('areaManage.deviceNum'),
            axisLabel: {},
            nameTextStyle: {
              color: '#999999'
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },

            max: function (value) {
              return Math.ceil(value.max + 20)
            }
          },
          {
            type: 'value',
            name: this.$t('operateManage.offlineRate'),
            axisLabel: {
              formatter: '{value} %'
            },
            nameTextStyle: {
              color: '#999999',
              align: 'left'
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#1E3174',
                type: 'dashed'
              }
            },
            max: function (value) {
              return Math.ceil(value.max + 20)
            }
          }
        ],
        series: [
          {
            name: this.$t('public.equipmentOnlineRate'),
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(4,161,255,0.3)',
              shadowBlur: 10,
              shadowOffsetX: 5,
              shadowOffsetY: 5,
              color: '#04A1FF'
            },
            itemStyle: {
              borderWidth: 3
            },
            data: this.onlineRateList
          },
          {
            name: this.$t('public.deviceOfflineMean'),
            type: 'bar',
            barMaxWidth: 12,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#29FFFF' },
                { offset: 1, color: 'rgba(51,204,204,0.1)' }
              ])
            },
            data: this.offlineList
          },
          {
            name: this.$t('public.deviceOnlineAverage'),
            type: 'bar',
            barMaxWidth: 12,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FFA736' },
                { offset: 1, color: 'rgba(236,168,80,0)' }
              ])
            },
            data: this.onlineList
          }
        ]
      }
    },
    handleReset() {
      this.timeType = '2'
      this.times = this.weekList
      this.organizationId = this.organizationIdCopy
      this.$refs['searchForm'].resetFields()
      this.getOnOfflineStat()
    },
    handleShowEchart() {
      this.isShowEchart = !this.isShowEchart
      this.tableHeght = this.isShowEchart ? 315 : 500
      if (this.isShowEchart) {
        this.$refs.resourceOperateBar.resizeEchart()
      }
    },
    tableFormatter(row) {
      const dateString = row.statTime
      const year = dateString.slice(0, 4)
      const month = dateString.slice(4, 6)
      const day = dateString.slice(6, 8)
      if (row.statTime.indexOf(':') !== -1) {
        return dateString
      }
      return `${year}-${month}-${day}`
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 != 1 ? '' : 'success-row'
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationIdCopy = this.organizationId = this.organizationOption[0].id
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
    },
    getWidth(index) {
      if (index < 3) {
        return this.locale === 'en' ? '210px' : '110px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  align-items: center;
}
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
:deep(.el-table__header-wrapper) {
  overflow-x: hidden;
}
.statistics-box {
  padding-bottom: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .statistics-item {
    display: flex;
    justify-content: center;
    align-items: center;
    .statistics-item-left {
      width: 84px;
      height: 64px;
    }
    .itemDay {
      background: url('~@/assets/img/common/statistics-day.png') no-repeat 100% 100%;
    }
    .itemWeek {
      background: url('~@/assets/img/common/statistics-week.png') no-repeat 100% 100%;
    }
    .itemMonth {
      background: url('~@/assets/img/common/statistics-month.png') no-repeat 100% 100%;
    }
    .statistics-item-right {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      .item-right-title {
        width: 160px;
        height: 30px;
        display: flex;
        align-items: flex-end;
        padding-left: 10px;
        white-space: nowrap;
        background: url('~@/assets/img/common/statistics-title.png') no-repeat left bottom;
        background-size: 149px 10px;
      }
      .item-right-subTitle {
        display: flex;
        align-items: flex-end;
        align-items: baseline;
        padding-left: 10px;
        .item-right-subTitle-per1 {
          height: 34px;
          display: flex;
          align-items: flex-end;
          align-items: baseline;
          font-size: 22px;
          font-weight: 400;
          color: #ffae12;
          margin-right: 25px;
          span {
            font-size: 12px;
          }
        }
        .item-right-subTitle-per2 {
          position: relative;
          white-space: nowrap;
          .subTitle-per2-color {
            display: inline-block;
            width: 14px;
            height: 12px;
          }
          .per2-bg1 {
            color: #fc3e3e;
          }
          .per2-bg2 {
            color: #b7fdde;
          }
          &:after {
            content: '';
            position: absolute;
            left: -12px;
            bottom: 50%;
            width: 1px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(0, 50%);
          }
        }
      }
    }
  }
}
</style>
