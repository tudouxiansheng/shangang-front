<template>
  <div class="p-5" ref="longOffline" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :rules="searchFormRules"
      :inline="true"
      label-width="120px"
      label-position="left"
      class="border-b border-gray-500"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('videoOperate.searchType') + ':'">
            <el-radio-group v-model="searchType">
              <el-radio label="1">{{ $t('organizationManage.area') }}</el-radio>
              <el-radio label="2">{{ $t('videoOperate.platForm1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="searchType == 1" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + ':'">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :clearable="false"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="searchType == 2">
          <el-form-item :label="$t('videoOperate.platForm') + ':'" prop="platId">
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
          <el-button v-hasPermi="[1409]" type="primary" @click="getLongOnOfflineStat">
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
        <el-col :span="6">
          <el-form-item :label="$t('deviceInfo.reportState') + ':'" prop="handleState">
            <el-select
              v-model="searchForm.handleState"
              :placeholder="$t('videoOperate.reportStateProp')"
              clearable
            >
              <el-option
                v-for="item in faultHandleStateData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item
            class="appendIpt"
            :label="$t('deviceInfo.offlineDurationGreaterThan') + ':'"
            prop="offlineDurationMin"
          >
            <el-input
              v-model.number="searchForm.offlineDurationMin"
              clearable
              :placeholder="$t('videoOperate.offlineDurationMinpRrop')"
            >
              <template #append>
                <div>
                  <span>{{ $t('report.day') }}</span>
                  <span class="ml-5 text-delete">{{ $t('videoOperate.deadline') }}</span>
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="mt-5">
      <el-button
        type="success"
        @click="handleExport"
        v-hasPermi="[1410]"
        :disabled="tableData.length == 0"
      >
        {{ $t('businessLog.exportExcel') }}
      </el-button>
      <el-button type="primary" @click="mutiFaultReport" :disabled="devIds.length == 0">
        {{ $t('dictConst.reportFailure') }}
      </el-button>
    </el-row>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        max-height="490"
        :row-class-name="tableRowClassName"
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
          prop="platName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('videoOperate.offlineDuration')"
          prop="duration"
          :formatter="timeFormatter"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('deviceInfo.reportState')"
          :formatter="faultHandleStateFormatter"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="cursor-pointer text-detail" @click="faultReport(row)">
              {{ $t('operateManage.faultReport') }}
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
        @pagination="getLongOnOfflineStat"
      />
    </el-row>
    <report-fault @refreshTable="getLongOnOfflineStat" />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { download } from '@/utils/common/download'
import { mapState } from 'vuex'
import { permissions } from '@/utils/common/permissions'
import reportFault from '../../component/report-fault.vue'
import { getDayHourMinAndSec } from '@/utils/common/mutil.js'
export default {
  name: 'DeviceLongOfflineStatistics',
  components: { Treeselect, reportFault },
  data() {
    return {
      isRouterAlive: true,
      permissionsDevList: true,
      searchType: '1',
      organizationOption: null,
      organizationId: undefined,
      organizationIdCopy: undefined,
      platOption: [],
      platId: '',
      searchForm: {
        devName: undefined,
        devId: undefined,
        ipAddress: undefined,
        interconnectCode: undefined,
        handleState: undefined,
        offlineDurationMin: 7,
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
      searchFormRules: {
        offlineDurationMin: [
          {
            required: true,
            message: this.$t('videoOperate.offlineDurationMinpRrop'),
            trigger: 'change'
          },
          { validator: checkOfflineDurationMin, trigger: 'change' }
        ]
      },
      devIds: [],
      devNames: [],
      devId: '',
      devName: '',
      reportFaultType: 1, //1.单个设备故障上报  2.多个设备故障上报
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      faultHandleStateData: state => state.dict.fault_handle_state
    })
  },
  created() {
    this.getPermissions()
    this.getPlatformList()
  },

  methods: {
    async getPermissions() {
      this.permissionsDevList = await permissions(1409)
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
    async getLongOnOfflineStat() {
      if (this.permissionsDevList) {
        this.loading = true
        if (this.searchType == 1) {
          this.searchForm.organizationId = this.organizationId
          delete this.searchForm.platId
        } else {
          this.searchForm.platId = this.platId
          delete this.searchForm.organizationId
        }
        let res = await this.$api.longOnOfflineStat(this.searchForm)
        if (res.resultCode == 0) {
          this.loading = false
          this.total = res.pageInfo.totalNum
          this.tableData = res.longOfflineDevices
        }
      }
    },
    handleReset() {
      this.searchType = '1'
      this.organizationId = this.organizationIdCopy
      this.platId = ''
      this.$refs['searchForm'].resetFields()
      this.getLongOnOfflineStat()
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    handleSelectionChange(selection) {
      this.devIds = selection.map(item => item.devId)
      this.devNames = selection.map(item => item.devName)
    },
    async handleExport() {
      if (this.devIdList.length > 0) {
        this.searchForm.customExportInfo.devIds = this.devIdList
      }
      let res = await this.$api.longOnOfflineExport(this.searchForm)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('videoOperate.historyOnlineDetail'))
      }
    },
    faultReport(row) {
      this.devId = row.devId
      this.devName = row.devName
      this.reportFaultType = 1
      this.dialogVisible = true
    },
    mutiFaultReport() {
      this.reportFaultType = 2
      this.dialogVisible = true
    },
    timeFormatter(row) {
      return getDayHourMinAndSec(row.duration * 1000)
    },
    faultHandleStateFormatter(row) {
      return this.selectDictLabel(this.faultHandleStateData, row.faultHandleState)
    },
    platIdFormatter(row) {
      return this.selectDictLabel(this.platOption, row.platId, {
        key: 'platName',
        value: 'platId'
      })
    },
    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationId = this.organizationOption[0].id
            this.organizationIdCopy = this.organizationOption[0].id
            this.getLongOnOfflineStat()
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
var checkOfflineDurationMin = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error(this.$t('operateManage.offlineMinLessWarn')))
  }
}
</script>

<style lang="scss" scoped>
.appendIpt {
  :deep(.el-input) {
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
:deep(.border-gray-500) {
  border-color: #48535a;
}
</style>
