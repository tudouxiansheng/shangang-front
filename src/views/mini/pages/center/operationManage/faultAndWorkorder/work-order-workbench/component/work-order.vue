<template>
  <div class="p-5 pt-0">
    <el-form
      class="mt-8 border-b border-gray-300"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="100px"
      label-position="left"
    >
      <el-row>
        <el-col :span="6" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + ':'" prop="organizationId">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :clearable="false"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="searchForm.organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('videoOperate.platForm') + '：'" prop="platId">
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
          <el-form-item :label="$t('faultAndWorkorder.faultStatus') + ':'" prop="woStatus">
            <el-select
              v-model="searchForm.woStatus"
              clearable
              :placeholder="$t('faultAndWorkorder.statusProp')"
            >
              <el-option
                v-for="item in workOrderStatusOption"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="text-right">
          <el-button type="primary" v-hasPermi="[1453]" @click="getWorkOrderList">
            {{ $t('public.search') }}
          </el-button>

          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            :icon="isMore ? ' el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="handleMore"
          >
            {{ $t('public.manyCondition') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row v-show="isMore">
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
          <el-form-item :label="$t('deviceInfo.deviceName') + ':'" prop="devName">
            <el-input
              v-model="searchForm.devName"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('faultAndWorkorder.mineWorkorder') + ':'" prop="mine">
            <el-radio-group v-model="searchForm.mine" class="radio-class">
              <el-radio :label="true">{{ $t('alarmTypeManage.yes') }}</el-radio>
              <el-radio :label="false">{{ $t('alarmTypeManage.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="isMore">
        <el-col :span="12">
          <el-form-item :label="$t('faultAndWorkorder.faultTime') + ':'">
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
              value-format="YYYY-MM-DD"
              :clearable="false"
              @change="timesChange"
            >
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="isMore">
        <el-form-item :label="$t('faultAndWorkorder.faultType') + ':'">
          <select-tag
            tag-mode
            inline
            v-model="faultType"
            :options="faultTypeData"
            label="code"
            text="name"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <el-row class="mt-5">
      <el-button
        v-hasPermi="[1453]"
        type="success"
        :disabled="tableData.length == 0"
        @click="handleExport"
      >
        {{ $t('businessLog.exportExcel') }}
      </el-button>
    </el-row>
    <el-table
      class="mt-5"
      border
      v-loading="loading"
      :data="tableData"
      max-height="410"
      :row-class-name="tableRowClassName"
    >
      <el-table-column :label="$t('deviceInfo.deviceName')" prop="devName" show-overflow-tooltip />
      <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
      <el-table-column
        :label="$t('faultAndWorkorder.faultType')"
        prop="faultType"
        :formatter="faultTypeFormatter"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.level')"
        :formatter="levelFormatter"
        prop="level"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('public.createTime')"
        prop="createTime"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.maintainer')"
        prop="maintainerName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.deadline')"
        prop="deadline"
        sortable
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>{{ row.deadline ? row.deadline : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('faultAndWorkorder.delay')"
        prop="delay"
        show-overflow-tooltip
        :formatter="delayFormatter"
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultStatus')"
        prop="woStatus"
        show-overflow-tooltip
        :formatter="woStatusFormatter"
      />
      <el-table-column :label="$t('public.operating')">
        <template #default="{ row }">
          <span class="table-operate" v-hasPermi="[1453]" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
          <span
            class="table-operate"
            v-hasPermi="[1454]"
            v-show="row.woStatus == 2 || row.woStatus == 3 || row.woStatus == 4"
            @click="handleCheck(row)"
          >
            {{ $t('workOrder.audit') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getWorkOrderList"
    />
    <!-- 重新分配待审核 -->
    <reallocate-check />
    <!-- 挂起与验收审核 -->
    <work-order-check />
    <!-- 工单关闭 -->
    <el-dialog
      :title="$t('faultAndWorkorder.closeWorkorder')"
      v-model="dialogVisible3"
      top="10vh"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
      @closed="dialogClosed"
      draggable
    >
      <el-form ref="form" :model="form" label-width="80px" label-position="left">
        <el-form-item :label="$t('faultAndWorkorder.auditRemark') + ':'" prop="processResult">
          <el-input
            v-model="form.processResult"
            clearable
            type="textarea"
            :rows="2"
            :placeholder="$t('faultAndWorkorder.auditRemarkPrompt')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="text-center">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('workOrder.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import SelectTag from '@/components/select-tag'
import { mapState } from 'vuex'
import reallocateCheck from './reallocate-check.vue'
import workOrderCheck from './work-order-check.vue'
import { getFormatDate6, getDIYTime1 } from '@/utils/common/mutil.js'
import { download } from '@/utils/common/download'

export default {
  components: { Treeselect, SelectTag, reallocateCheck, workOrderCheck },
  data() {
    return {
      organizationOption: null,
      organizationId: undefined,
      platOption: [],
      timeType: undefined,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      times: [],
      dayList: [],
      weekList: [],
      mounthList: [],
      organizationIdCopy: undefined,
      faultType: [],
      searchForm: {
        organizationId: undefined,
        platId: undefined,
        faultStatus: undefined,
        devId: undefined,
        devName: undefined,
        retrievalStartDay: undefined,
        retrievalEndDay: undefined,
        mine: false,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      isMore: false,
      loading: false,
      total: 0,
      tableData: [],
      faultId: '',
      woId: '',
      devOrgId: '',
      dialogType2: 1, //1.验收审核  2.挂起审核
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      form: {}
    }
  },
  computed: {
    ...mapState({
      faultTypeData: state => state.dict.fault_type,
      workOrderStatusData: state => state.dict.workorder_status,
      workOrderLevelData: state => state.dict.workorder_level,
      workOrderStatusOption: state => state.dict.search_workorder_status
    })
  },
  created() {
    this.timesForamtter()
    this.getPlatformList()
    this.getFaultType()
    this.getWorkOrderList()
  },
  methods: {
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
      let dayFormattered = getFormatDate6(date)
      let weekList = getDIYTime1(3)
      let monthList = getDIYTime1(4)
      let weekFormattered = getFormatDate6(weekList[0])
      let mounthFormattered = getFormatDate6(monthList[0])
      this.dayList = [dayFormattered, dayFormattered]
      this.weekList = [weekFormattered, dayFormattered]
      this.mounthList = [mounthFormattered, dayFormattered]
    },
    getFaultType() {
      this.faultType = []
      this.faultTypeData.forEach(item => {
        this.faultType.push(item.code)
      })
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.organizationId = this.organizationIdCopy
      this.isMore = false
      this.timeType = undefined
      this.times = []
      this.timeTypeChange()
      this.getFaultType()
      this.getWorkOrderList()
    },
    handleMore() {
      this.isMore = !this.isMore
    },
    async getWorkOrderList() {
      this.loading = true
      this.searchForm.faultTypes ? delete this.searchForm.faultTypes : ''
      this.faultType.length == this.faultTypeData.length
        ? ''
        : (this.searchForm.faultTypes = this.faultType)
      if (this.times.length > 0) {
        this.searchForm.retrievalStartDay = this.times[0] + ' 00:00:00'
        this.searchForm.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        this.searchForm.retrievalStartDay = undefined
        this.searchForm.retrievalEndDay = undefined
      }
      let res = await this.$api.getWorkOrderList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.workOrderList
      }
    },
    async handleExport() {
      this.searchForm.faultSource = this.faultSource
      this.searchForm.faultTypes ? delete this.searchForm.faultTypes : ''
      this.faultType.length == this.faultTypeData.length
        ? ''
        : (this.searchForm.faultTypes = this.faultType)
      this.searchForm.netType = this.$getNetType()
      if (this.times.length > 0) {
        this.searchForm.retrievalStartDay = this.times[0] + ' 00:00:00'
        this.searchForm.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        this.searchForm.retrievalStartDay = undefined
        this.searchForm.retrievalEndDay = undefined
      }
      let searchFormCopy = JSON.parse(JSON.stringify(this.searchForm))
      delete searchFormCopy.pageInfo
      let res = await this.$api.exportWorkOrderList(searchFormCopy)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('faultAndWorkorder.workorderList'))
      }
    },
    handleDetail(row) {
      this.$router.push({
        name: 'WorkOrderWorkbenchDetail',
        params: {
          woId: row.woId,
          faultId: row.faultId
        }
      })
    },
    closeHandle(row) {
      this.dialogVisible3 = true
      this.faultId = row.faultId
    },
    handleCheck(row) {
      this.woId = row.woId
      if (row.woStatus == 2 || row.woStatus == 3) {
        row.woStatus == 2 ? (this.dialogType2 = 1) : (this.dialogType2 = 2)
        this.dialogVisible2 = true
      } else if (row.woStatus == 4) {
        this.devOrgId = row.devOrgIdId
        this.dialogVisible1 = true
      }
    },
    async handleSubmit() {
      this.form.faultId = this.faultId
      let res = await this.$api.closeFault(this.form)
      if (res.resultCode == 0) {
        this.getWorkOrderList()
        this.$message({
          message: this.$t('faultAndWorkorder.closeWorkorderSuccess'),
          type: 'success'
        })
      }
    },
    dialogClosed() {
      this.dialogVisible2 = false
    },
    woStatusFormatter(row) {
      return this.selectDictLabel(this.workOrderStatusData, row.woStatus)
    },
    faultTypeFormatter(row) {
      return this.selectDictLabel(this.faultTypeData, row.faultType)
    },
    levelFormatter(row) {
      return this.selectDictLabel(this.workOrderLevelData, row.level)
    },
    delayFormatter(row) {
      let isDelay = ''
      if (row.delay) {
        isDelay = this.$t('workOrder.yes')
      } else {
        if (row.delay == undefined) {
          isDelay = '——'
        } else if (row.delay == false) {
          isDelay = this.$t('workOrder.no')
        }
      }
      return isDelay
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.searchForm.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
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
.table-operate {
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
  @apply text-detail;
}
:deep(.el-dialog__body) {
  padding: 20px;
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
</style>
