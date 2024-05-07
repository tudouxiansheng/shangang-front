<template>
  <div ref="workOrderStatistics" v-if="isRouterAlive">
    <div class="form">
      <el-form ref="searchForm" :inline="true" label-width="80px" label-position="left">
        <el-row>
          <el-col :span="6" class="treeselect">
            <el-form-item :label="$t('organizationManage.area') + ':'" prop="organizationId">
              <treeselect
                :options="organizationOption"
                :load-options="loadOptions"
                :clearable="false"
                :placeholder="$t('organizationManage.chooseArea')"
                v-model="organizationId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="$t('videoOperate.timeRange') + ':'">
              <el-radio-group v-model="timeType" class="mr-5" @change="timeTypeChange">
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
                value-format="YYYY-MM-DD"
                :clearable="false"
                @change="timesChange"
              >
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button v-hasPermi="[1462]" type="primary" @click="getWoClosedLoopStatDetails">
              {{ $t('public.search') }}
            </el-button>
            <el-button v-hasPermi="[1463]" type="success" @click="getWoClosedLoopStatDetailsExport">
              {{ $t('businessLog.exportExcel') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <collapse-card
      :title="$t('faultAndWorkorder.workOrderCompletedStatistics')"
      hideCollapse
      background
    >
      <echart
        v-loading="loading1"
        id="workOrderStatisticsLine"
        height="500px"
        :options="getOption"
      ></echart>
    </collapse-card>

    <collapse-card
      :title="$t('faultAndWorkorder.workOrderCompletedDetail')"
      hideCollapse
      background
    >
      <el-table
        border
        v-loading="loading2"
        :data="tableData"
        :row-class-name="tableRowClassName"
        max-height="490"
      >
        <el-table-column
          :label="$t('faultAndWorkorder.area')"
          prop="contentName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.workorderTotal')"
          prop="total"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.lessThanOneDay')"
          prop="oneDay"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.lessThanThreeDays')"
          prop="threeDay"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.moreThanThreeDays')"
          prop="moreThanThreeDay"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.unclosed')"
          prop="unclosed"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('faultAndWorkorder.closedLoopRate')"
          prop="closedLoopRate"
          show-overflow-tooltip
        />
      </el-table>
    </collapse-card>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { getFormatDate6, getDIYTime1 } from '@/utils/common/mutil.js'
import collapseCard from '@/views/center/operationManage/component/collapse-card.vue'
import echart from '@/components/echart'
import { download } from '@/utils/common/download'

export default {
  name: 'WorkOrderEfficiencyStatistics',
  components: { Treeselect, collapseCard, echart },
  data() {
    return {
      isRouterAlive: true,
      organizationId: '',
      organizationIdCopy: '',
      organizationOption: null,
      timeType: 2,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      times: [],
      weekList: [],
      mounthList: [],
      loading1: false,
      loading2: false,
      tableData: [],
      xData: [],
      oneDayList: [],
      threeDayList: [],
      moreThanThreeDayList: [],
      unclosedList: []
    }
  },
  computed: {
    getOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        legend: {
          top: '0%',
          right: '0%',
          itemWidth: 14
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 40
          }
        ],
        series: [
          {
            name: this.$t('faultAndWorkorder.lessThanOneDay'),
            type: 'bar',
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            data: this.oneDayList
          },
          {
            name: this.$t('faultAndWorkorder.lessThanThreeDays'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            data: this.threeDayList
          },
          {
            name: this.$t('faultAndWorkorder.moreThanThreeDays'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            data: this.moreThanThreeDayList
          },
          {
            name: this.$t('faultAndWorkorder.unclosed'),
            type: 'bar',
            barWidth: 10,
            barGap: 1,
            data: this.unclosedList
          }
        ]
      }
    }
  },
  mounted() {
    this.timesForamtter()
  },
  methods: {
    timeTypeChange() {
      switch (this.timeType) {
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
      let dayFormattered = getFormatDate6(date)
      let weekList = getDIYTime1(3)
      let monthList = getDIYTime1(4)
      let weekFormattered = getFormatDate6(weekList[0])
      let mounthFormattered = getFormatDate6(monthList[0])
      this.weekList = [weekFormattered, dayFormattered]
      this.mounthList = [mounthFormattered, dayFormattered]
      this.times = this.weekList
    },
    async getWoClosedLoopStatDetails() {
      let obj = {
        organizationId: this.organizationId
      }
      if (this.times.length > 0) {
        obj.retrievalStartDay = this.times[0] + ' 00:00:00'
        obj.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        obj.retrievalStartDay = undefined
        obj.retrievalEndDay = undefined
      }
      obj.organizationId = obj.organizationId.toString()
      this.loading1 = true
      this.loading2 = true
      let res = await this.$api.getWoClosedLoopStatDetails(obj)
      if (res.resultCode == 0) {
        this.loading1 = false
        this.loading2 = false
        this.tableData = res.woClosedLoopDetailList
        this.xData = []
        this.oneDayList = []
        this.threeDayList = []
        this.moreThanThreeDayList = []
        this.unclosedList = []
        this.tableData.forEach(item => {
          this.xData.push(item.contentName)
          this.oneDayList.push(item.oneDay)
          this.threeDayList.push(item.threeDay)
          this.moreThanThreeDayList.push(item.moreThanThreeDay)
          this.unclosedList.push(item.unclosed)
        })
      }
    },
    async getWoClosedLoopStatDetailsExport() {
      let obj = {
        organizationId: this.organizationId,
        netType: this.$getNetType()
      }
      if (this.times.length > 0) {
        obj.retrievalStartDay = this.times[0] + ' 00:00:00'
        obj.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        obj.retrievalStartDay = undefined
        obj.retrievalEndDay = undefined
      }
      obj.organizationId = obj.organizationId.toString()
      let res = await this.$api.getWoClosedLoopStatDetailsExport(obj)
      if (res.resultCode == 0) {
        res.fileUrl &&
          download(res.fileUrl, this.$t('faultAndWorkorder.workOrderCompletedStatistics'))
      }
    },
    // 表格斑马纹
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
            this.getWoClosedLoopStatDetails()
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
    .vue-treeselect__control {
      border: 1px solid #c1c7d0;
    }
  }
}
.form {
  margin: 20px;
  margin-bottom: 0;
  border-bottom: 1px solid #48535a;
}
</style>
