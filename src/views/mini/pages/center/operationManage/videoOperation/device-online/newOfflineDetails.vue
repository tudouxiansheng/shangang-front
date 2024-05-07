<template>
  <div class="p-7" ref="offline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      :label-width="locale === 'en' ? '120px' : '90px'"
      label-position="left"
    >
      <el-row>
        <el-col :span="6" class="treeselect">
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
        <el-col :span="13">
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
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="text-right">
          <el-button type="primary" @click="handleSearch" v-hasPermi="[1421]">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            v-hasPermi="[1423]"
            type="success"
            :loading="exportLoading"
            @click="handleExport"
          >
            {{ $t('businessLog.exportExcel') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('devModel.cameraName') + ':'" prop="devName">
            <el-input
              v-model.trim="searchForm.devName"
              clearable
              :placeholder="$t('devModel.inputCameraName')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData2"
        max-height="400"
        :row-class-name="tableRowClassName"
      >
        <el-table-column :label="$t('devModel.cameraName')" prop="devName" show-overflow-tooltip />
        <el-table-column :label="$t('devModel.cameraId')" prop="devId" show-overflow-tooltip />
        <el-table-column :label="$t('public.AffiliatedOrg')" prop="area" show-overflow-tooltip />
        <el-table-column
          width="230"
          :label="$t('report.onlineTotalTime')"
          prop="onlineHours"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.onlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="230"
          :label="$t('report.offlineTotalTime')"
          prop="offlineHours"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.offlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('report.onlineTimes')"
          prop="onlineCounts"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('report.offlineTimes')"
          prop="offlineCounts"
          show-overflow-tooltip
        />
        <el-table-column
          :formatter="preFormatter"
          :label="$t('report.onlineRate')"
          prop="onlineRate"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('cascadeDevice.platform')"
          prop="platName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('report.viewDetails')">
          <template #default="{ row }">
            <span
              v-hasPermi="[1422]"
              class="cursor-pointer text-detail"
              @click="handleDeviceDetail(row)"
            >
              {{ $t('report.viewDetails') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <pagination
        v-show="total2 > 0"
        :total="total2"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getOnOfflineStat"
      />
    </el-row>
    <el-row class="mt-5" v-if="isTable" style="margin-top: 60px">
      <div style="padding-bottom: 15px">{{ tableHeaderTitle }}</div>
      <el-table
        border
        v-loading="isTableLoading"
        :data="tableData1"
        max-height="315"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          :label="$t('report.statisticsDate')"
          prop="statTime"
          show-overflow-tooltip
          :formatter="tableFormatter"
        />
        <el-table-column
          :label="$t('report.theDayOnlineRate')"
          prop="onlineRate"
          :formatter="preFormatter"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('report.onlineTime')" prop="onlineHours" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.onlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('report.offlineTime')"
          prop="offlineHours"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.offlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('report.onlineTimes')"
          prop="onlineCounts"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('report.offlineTimes')"
          prop="offlineCounts"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.singleDayOfflineDetails')">
          <template #default="{ row }">
            <span class="cursor-pointer text-detail" @click="handleDetail(row)">
              {{ $t('report.theDayDetails') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <device-detail :deviceInfo="deviceInfo" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { getFormatDate5, getDIYTime1 } from '@/utils/common/mutil.js'
import { permissions } from '@/utils/common/permissions'
import { download } from '@/utils/common/download'
import deviceDetail from './component/device-newDetail.vue'
import dayjs from 'dayjs'
import { getDayHourMinAndSec } from '@/utils/common/mutil'

export default {
  components: { Treeselect, deviceDetail },
  data() {
    return {
      isRouterAlive: true,
      permissionsStatistics: true,
      permissionsStatisticsDetail: true,
      organizationOption: null,
      organizationId: undefined,
      organizationIdCopy: undefined,
      platOption: [],
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
      searchForm: {
        devName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      tableHeaderTitle: '',
      tableData2: [],
      tableData1: [],
      total2: 0,
      deviceInfo: {},
      isTable: false,
      dialogVisible: false,

      isTableLoading: false,
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
        let res = await this.$api.onOfflineNewDetailExport(this.searchForm)
        if (res.resultCode == 0) {
          res.fileUrl && download(res.fileUrl, this.$t('public.onlineOfflineDeviceDetails'))
        }
      } finally {
        this.exportLoading = false
      }
    },
    async handleDeviceDetail(row) {
      this.tableHeaderTitle = row.devName
      this.isTable = true
      this.isTableLoading = true
      this.tableData1 = []
      let res1 = await this.$api.onOfflineDetailDeviceDateList({
        devId: row.devId,
        beginDate: this.searchForm.beginDate,
        endDate: this.searchForm.endDate
      })
      if (res1.resultCode == 0) {
        this.isTableLoading = false
        let list = res1.onOfflineDeviceInfos
        if (list.length) {
          this.tableData1 = list
        }
      }
    },
    handleDetail(row) {
      this.deviceInfo = row
      this.dialogVisible = true
    },
    async getPermissions() {
      this.permissionsStatistics = await permissions(1421)
      this.permissionsStatisticsDetail = await permissions(1422)
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
    preFormatter(row, column, cellValue, index) {
      return cellValue + '%'
    },
    handleReset() {
      this.timeType = '2'
      this.times = this.weekList
      this.organizationId = this.organizationIdCopy
      this.searchForm.pageInfo.pageNum = 1
      this.searchForm.pageInfo.pageSize = 10
      this.$refs['searchForm'].resetFields()
      this.getOnOfflineStat()
    },
    handleSearch() {
      this.searchForm.pageInfo.pageNum = 1
      this.getOnOfflineStat()
    },
    async getOnOfflineStat() {
      this.loading = true
      this.isTable = false
      this.tableHeaderTitle = ''
      this.searchForm.beginDate = this.times[0]
      this.searchForm.endDate = this.times[1]
      this.searchForm.organizationId = this.organizationId
      if (this.permissionsStatistics) {
        let res2 = await this.$api.onOfflineDetailDeviceList(this.searchForm)
        if (res2.resultCode == 0) {
          this.loading = false
          this.tableData2 = res2.onOfflineDeviceInfos
          this.total2 = res2.pageInfo.totalNum
          if (this.tableData2.length && this.permissionsStatisticsDetail) {
            this.handleDeviceDetail(this.tableData2[0])
          }
        } else {
          this.tableData2 = []
          this.total2 = 0
        }
      }
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 != 1 ? '' : 'success-row'
    },
    tableFormatter(row) {
      const dateString = row.statTime
      const year = dateString.slice(0, 4)
      const month = dateString.slice(4, 6)
      const day = dateString.slice(6, 8)
      if (dateString.length > 8) {
        const h = dateString.slice(8, 10)
        return `${year}-${month}-${day} ${h}:00`
      }
      return `${year}-${month}-${day}`
    },
    getTimeFormatter(time) {
      return getDayHourMinAndSec(time * 1000)
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationIdCopy = this.organizationId = this.organizationOption[0].id
            this.handleSearch()
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
:deep(.el-table__body) tr.hover-row > td {
  background-color: #175290;
}
</style>
