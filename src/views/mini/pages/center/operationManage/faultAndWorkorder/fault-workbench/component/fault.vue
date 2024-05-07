<template>
  <div class="mt-3 fault">
    <ul class="fault-summary" v-loading="loading1">
      <li>
        <span class="top">
          <count-to :start-val="0" :end-val="existing" :duration="2600" class="ac-card-subtitle" />
          <svg-icon className="test-status" iconClass="test-status1"></svg-icon>
        </span>
        <span class="bottom bottom1">{{ $t('faultAndWorkorder.totalFault') }}</span>
      </li>
      <li>
        <span class="top">
          <count-to
            :start-val="0"
            :end-val="confirming"
            :duration="2600"
            class="ac-card-subtitle"
          />
          <svg-icon className="test-status" iconClass="test-status2"></svg-icon>
        </span>
        <span class="bottom bottom2">{{ $t('faultAndWorkorder.pending') }}</span>
      </li>
      <li>
        <span class="top">
          <count-to
            :start-val="0"
            :end-val="processing"
            :duration="2600"
            class="ac-card-subtitle"
          />
          <svg-icon className="test-status" iconClass="test-status3"></svg-icon>
        </span>
        <span class="bottom bottom3">{{ $t('faultAndWorkorder.processing') }}</span>
      </li>
      <li class="last-li">
        <span class="top">
          <count-to :start-val="0" :end-val="closed" :duration="2600" class="ac-card-subtitle" />
          <svg-icon className="test-status" iconClass="test-status4"></svg-icon>
        </span>
        <span class="bottom bottom4">{{ $t('faultAndWorkorder.closed') }}</span>
      </li>
    </ul>
    <el-form
      class="mt-8 border-b border-border"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="110px"
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
          <el-form-item :label="$t('faultAndWorkorder.faultStatus') + ':'" prop="faultStatus">
            <el-select
              v-model="searchForm.faultStatus"
              clearable
              :placeholder="$t('faultAndWorkorder.statusProp')"
            >
              <el-option
                v-for="item in faultStatusData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="text-right">
          <el-button type="primary" v-hasPermi="[1451]" @click="getFaultList">
            {{ $t('public.search') }}
          </el-button>

          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button :icon="isMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="handleMore">
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
            :options="faultTypeOption"
            label="code"
            text="name"
          />
        </el-form-item>
      </el-row>
    </el-form>

    <el-row class="mt-5">
      <el-button
        v-hasPermi="[1451]"
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
      v-loading="loading2"
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
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.level')"
        :formatter="levelFormatter"
        prop="level"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.reportTime')"
        prop="createTime"
        sortable
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultReporter')"
        prop="reportPerson"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('faultAndWorkorder.faultStatus')"
        prop="faultStatus"
        :formatter="faultStatusFormatter"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('public.operating')">
        <template #default="{ row }">
          <span class="table-operate" v-hasPermi="[1451]" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
          <el-dropdown v-show="row.faultStatus == 1" @command="handleCommand">
            <span class="table-operate">
              {{ $t('faultAndWorkorder.handle') }}
              <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{
                    type: 1,
                    faultId: row.faultId,
                    devOrgId: row.devOrgId
                  }"
                >
                  <span v-hasPermi="[1456]">
                    {{ $t('faultAndWorkorder.createWorkorder') }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-item :command="{ type: 2, faultId: row.faultId }">
                  <span v-hasPermi="[1452]">
                    {{ $t('faultAndWorkorder.closeFault') }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getFaultList"
    />

    <!-- 生成工单 -->
    <creat-workoder v-model:dialogVisible="dialogVisible1" />
    <!-- 关闭故障 -->
    <el-dialog
      :title="$t('faultAndWorkorder.closeFault')"
      v-model="dialogVisible2"
      top="10vh"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
      @closed="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="$t('faultAndWorkorder.handleResult') + ':'" prop="processResult">
          <el-input
            v-model="form.processResult"
            clearable
            type="textarea"
            :rows="2"
            maxlength="256"
            show-word-limit
            :placeholder="$t('faultAndWorkorder.handleResultProp')"
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
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import SelectTag from '@/components/select-tag'
import { mapState } from 'vuex'
import creatWorkoder from '../../component/creat-workoder.vue'
import { getFormatDate6, getDIYTime1 } from '@/utils/common/mutil.js'
import { download } from '@/utils/common/download'
export default {
  components: {
    Treeselect,
    SelectTag,
    creatWorkoder,
    ElIconArrowDown
  },
  props: ['activeName'],
  data() {
    return {
      loading1: false,
      existing: 0,
      confirming: 0,
      processing: 0,
      closed: 0,
      organizationOption: null,
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
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      isMore: false,
      loading2: false,
      total: 0,
      tableData: [],
      faultId: undefined,
      dialogVisible1: false, //创建工单
      dialogVisible2: false, //非故障关闭
      form: {},
      formRules: {
        processResult: [
          {
            max: 256,
            message: this.$t('faultAndWorkorder.handleResultLengthProp'),
            trigger: 'change'
          }
        ]
      },
      roleId: undefined,
      devOrgId: undefined
    }
  },
  computed: {
    ...mapState({
      faultTypeData: state => state.dict.fault_type,
      userReportFaultTypeData: state => state.dict.user_report_fault_type,
      patrolFaultTypeData: state => state.dict.patrol_fault_type,
      faultStatusData: state => state.dict.fault_status,
      workOrderLevelData: state => state.dict.workorder_level
    }),
    faultTypeOption() {
      let arr = []
      switch (this.activeName) {
        case '0':
          arr = this.faultTypeData
          break
        case '1':
          arr = this.userReportFaultTypeData
          break
        case '2':
          arr = this.patrolFaultTypeData
          break
        default:
          break
      }
      return arr
    },
    faultSource() {
      let str = ''
      switch (this.activeName) {
        case '0':
          str = undefined
          break
        case '1':
          str = 1
          break
        case '2':
          str = 2
          break
        default:
          break
      }
      return str
    }
  },
  watch: {
    faultSource() {
      this.handleReset()
      this.getFaultSummary()
      this.getFaultList()
    },
    faultTypeOption(list) {
      let arr = []
      this.faultType = []
      switch (this.activeName) {
        case '0':
          list.forEach(item => {
            arr.push(item.code)
          })
          break
        case '1':
          list.forEach(item => {
            arr.push(item.code)
          })
          break
        case '2':
          list.forEach(item => {
            arr.push(item.code)
          })
          break
        default:
          break
      }
      this.faultType = arr
    }
  },
  created() {
    this.timesForamtter()
    this.getPlatformList()
    this.getFaultType()
    this.getFaultSummary()
    this.getFaultList()
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
      let arr = []
      this.faultType = []
      switch (this.activeName) {
        case '0':
          this.faultTypeData.forEach(item => {
            arr.push(item.code)
          })
          break
        case '1':
          this.userReportFaultTypeData.forEach(item => {
            arr.push(item.code)
          })
          break
        case '2':
          this.patrolFaultTypeData.forEach(item => {
            arr.push(item.code)
          })
          break
        default:
          break
      }
      this.faultType = arr
    },
    async getFaultSummary() {
      this.loading1 = true
      let res = await this.$api.getFaultSummary({
        faultSource: this.faultSource
      })
      if (res.resultCode == 0) {
        this.loading1 = false
        this.existing = res.existing
        this.confirming = res.confirming
        this.processing = res.processing
        this.closed = res.closed
      }
    },
    async getFaultList() {
      this.loading2 = true
      this.searchForm.faultSource = this.faultSource
      this.searchForm.faultTypes ? delete this.searchForm.faultTypes : ''
      this.faultType.length == this.faultTypeOption.length
        ? ''
        : (this.searchForm.faultTypes = this.faultType)
      if (this.times.length > 0) {
        this.searchForm.retrievalStartDay = this.times[0] + ' 00:00:00'
        this.searchForm.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        this.searchForm.retrievalStartDay = undefined
        this.searchForm.retrievalEndDay = undefined
      }
      let res = await this.$api.getFaultList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading2 = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.faultList
      }
    },
    async handleExport() {
      this.searchForm.faultSource = this.faultSource
      this.searchForm.faultTypes ? delete this.searchForm.faultTypes : ''
      this.faultType.length == this.faultTypeOption.length
        ? ''
        : (this.searchForm.faultTypes = this.faultType)
      if (this.times.length > 0) {
        this.searchForm.retrievalStartDay = this.times[0] + ' 00:00:00'
        this.searchForm.retrievalEndDay = this.times[1] + ' 23:59:59'
      } else {
        this.searchForm.retrievalStartDay = undefined
        this.searchForm.retrievalEndDay = undefined
      }
      let res = await this.$api.getFaultListExport(this.searchForm)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('faultAndWorkorder.faultList'))
      }
    },

    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.organizationId = this.organizationIdCopy
      this.isMore = false
      this.timeType = undefined
      this.times = []
      this.timeTypeChange()
      this.getFaultType()
      this.getFaultList()
    },
    handleMore() {
      this.isMore = !this.isMore
    },
    handleDetail(row) {
      this.$router.push({
        name: 'FaultDetail',
        params: {
          id: row.faultId
        }
      })
    },
    handleCommand(command) {
      this.faultId = command.faultId
      if (command.type == 1) {
        // 生成工单
        this.devOrgId = command.devOrgId
        this.dialogVisible1 = true
      } else {
        // 非关闭故障
        this.dialogVisible2 = true
      }
    },
    judgeOperateHandle(faultId, command) {
      this.faultId = faultId
      return {
        faultId,
        command
      }
    },
    async handleSubmit() {
      this.form.faultId = this.faultId
      let res = await this.$api.closeFault(this.form)
      if (res.resultCode == 0) {
        this.getFaultList()
        this.dialogVisible2 = false
        this.$message({
          message: this.$t('faultAndWorkorder.faultCloseSuccess'),
          type: 'success'
        })
      }
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.dialogVisible2 = false
    },
    faultTypeFormatter(row) {
      return this.selectDictLabel(this.faultTypeData, row.faultType)
    },
    levelFormatter(row) {
      return this.selectDictLabel(this.workOrderLevelData, row.level)
    },
    faultStatusFormatter(row) {
      return this.selectDictLabel(this.faultStatusData, row.faultStatus)
    },
    async getMaintainerRole() {
      let res = await this.$api.getMaintainerRole()
      if (res.resultCode == 0) {
        this.roleId = res.roleId
      }
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
.fault {
  .fault-summary {
    display: flex;
    padding-bottom: 25px;
    height: 168px;
    border-bottom: 1px solid #48535a;

    li {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      margin-right: 75px;
      background: #fff;
      box-shadow: 0px 0px 7px 1px rgba(193, 199, 208, 0.3);

      &:last-child {
        margin-right: 0;
      }

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        padding: 0 20px;

        span {
          color: #3b82f6;
          font-size: 30px;
          font-weight: 800;
        }

        .test-status {
          width: 44px;
          height: 42px;
        }
      }

      .bottom {
        padding-left: 20px;
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-size: 16px;
      }

      .bottom1 {
        background: #3b82f6;
      }

      .bottom2 {
        background: #34d399;
      }

      .bottom3 {
        background: #818cf8;
      }

      .bottom4 {
        background: #fbbf24;
      }
    }

    .last-li {
      margin-right: 0;
    }
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
}

.table-operate {
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
}

:deep(.el-date-editor--daterange.el-input__inner) {
  width: 275px;
}

:deep(.el-range-editor--medium) .el-range-separator {
  width: 25px;
}
</style>
