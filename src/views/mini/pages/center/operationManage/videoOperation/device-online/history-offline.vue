<template>
  <div class="p-5" ref="historyOffline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="110px"
      label-position="left"
      class="border-b border-gray-500"
    >
      <el-row>
        <el-col :span="6" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + ':'" prop="organizationId">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :placeholder="$t('organizationManage.chooseArea')"
              :clearable="false"
              v-model="searchForm.organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('videoOperate.platForm') + ':'" prop="platId">
            <el-select
              v-model="searchForm.platId"
              :placeholder="$t('videoOperate.platFormProp')"
              clearable
            >
              <el-option
                v-for="item in platOption"
                :key="item.platId"
                :label="item.platName"
                :value="item.platId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceName') + ':'" prop="devName">
            <el-input
              v-model="searchForm.devName"
              clearable
              :placeholder="$t('public.pleaseInputMainDevName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button v-hasPermi="[1414]" type="primary" @click="getlLngOnOfflineStat">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceID') + ':'" prop="devId">
            <el-input
              v-model="searchForm.devId"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevId')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.deviceIP') + ':'" prop="ipAddress">
            <el-input
              v-model="searchForm.ipAddress"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevIp')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="$t('deviceInfo.deviceInterconnectedCoding') + ':'"
            prop="interconnectCode"
          >
            <el-input
              v-model="searchForm.interconnectCode"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevInterCoding')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('report.date') + ':'">
            <el-radio-group v-model="timeType" class="mr-5" @change="timeTypeChange">
              <el-radio-button label="1">{{ $t('devOps.yesterday') }}</el-radio-button>
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
      </el-row>
    </el-form>
    <el-row class="mt-5">
      <el-button type="success" @click="handleExport" :disabled="tableData.length == 0">
        {{ $t('businessLog.exportExcel') }}
      </el-button>
    </el-row>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        :row-class-name="tableRowClassName"
        max-height="490"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          :label="$t('deviceInfo.deviceName')"
          prop="devName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
        <el-table-column
          :label="$t('deviceInfo.deviceIP')"
          prop="ipAddress"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('deviceInfo.deviceInterconnectedCoding')"
          prop="interconnectCode"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('dictConst.area')" prop="area" show-overflow-tooltip />
        <el-table-column
          :label="$t('dictConst.monitoringPlatform')"
          :formatter="platIdFormatter"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('report.historicalOfflineDuration')"
          prop="duration"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.offlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('report.historicalOnlineDuration')"
          prop="duration"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ getTimeFormatter(row.onlineHours) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span v-hasPermi="[1422]" class="cursor-pointer" @click="handleDetail(row)">
              {{ $t('public.particulars') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getlLngOnOfflineStat"
      />
    </el-row>
    <device-detail :deviceInfo="deviceInfo" />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { mapState } from 'vuex'
import deviceDetail from './component/device-detail.vue'
import {
  getDIYTime,
  getDIYTime3,
  getFormatDate5,
  getDayHourMinAndSec
} from '@/utils/common/mutil.js'
import { download } from '@/utils/common/download'
import { permissions } from '@/utils/common/permissions'

export default {
  name: 'DeviceHistoryOfflineStatistics',
  components: { Treeselect, deviceDetail },
  data() {
    return {
      isRouterAlive: true,
      permissionsDevList: true,
      organizationOption: null,
      organizationIdCopy: undefined,
      platOption: [],
      timeType: '2',
      times: [],
      dayList: [],
      weekList: [],
      mounthList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() - 24 * 60 * 60 * 1000
        }
      },
      searchForm: {
        organizationId: undefined,
        platId: undefined,
        devName: undefined,
        devId: undefined,
        ipAddress: undefined,
        interconnectCode: undefined,
        netType: this.$getNetType(),
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      tableData: [],
      total: 0,
      devIdList: [],
      deviceInfo: {},
      dialogVisible: false,
      echartData: []
    }
  },
  computed: {
    ...mapState({
      faultHandleStateData: state => state.dict.fault_handle_state
    })
  },
  async created() {
    await this.getPermissions()
    this.timesForamtter()
    this.getPlatformList()
  },

  methods: {
    async getPermissions() {
      this.permissionsDevList = await permissions(1421)
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
      let dayList = getDIYTime3(1)
      let weekList = getDIYTime3(2)
      let { time } = getDIYTime(3)
      let dayFormattered = getFormatDate5(dayList[0])
      let weekFormattered = getFormatDate5(weekList[0])
      let mounthFormattered = getFormatDate5(time[0])
      this.dayList = [dayFormattered, dayFormattered]
      this.weekList = [weekFormattered, dayFormattered]
      this.mounthList = [mounthFormattered, dayFormattered]
      this.times = [weekFormattered, dayFormattered]
    },
    async getlLngOnOfflineStat() {
      if (this.permissionsDevList) {
        this.loading = true
        this.searchForm.retrievalStartDay = this.times[0]
        this.searchForm.retrievalEndDay = this.times[1]
        let res = await this.$api.onOfflineDetail(this.searchForm)
        if (res.resultCode == 0) {
          this.loading = false
          this.total = res.pageInfo.totalNum
          this.tableData = res.onOfflineDeviceInfos
        }
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.organizationId = this.organizationIdCopy
      this.getlLngOnOfflineStat()
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    handleDetail(row) {
      this.deviceInfo = row
      this.dialogVisible = true
    },
    handleSelectionChange(list) {
      this.devIdList = []
      list.map(item => {
        this.devIdList.push(item.devId)
      })
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    async handleExport() {
      if (this.devIdList.length > 0) {
        this.searchForm.customExportInfo.devIds = this.devIdList
      }
      let res = await this.$api.onOfflineDetailExport(this.searchForm)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('videoOperate.historyOnlineDetail'))
      }
    },
    platIdFormatter(row) {
      return this.selectDictLabel(this.platOption, row.platId, {
        key: 'platName',
        value: 'platId'
      })
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
            this.searchForm.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
            this.getlLngOnOfflineStat()
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
    line-height: 0px;
    .vue-treeselect__control {
      border: 1px solid #c1c7d0;
    }
  }
}
.appendIpt {
  .el-input {
    .el-input__inner {
      width: 180px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .el-input-group__append {
      color: #000;
      background-color: transparent;
      padding: 0 8px;
      border: none;
    }
  }
}
:deep(.el-date-editor--daterange.el-input__inner) {
  width: 360px;
}
:deep(.circular) {
  display: inline-block;
}
:deep(.border-gray-500) {
  border-color: #48535a;
}
</style>
