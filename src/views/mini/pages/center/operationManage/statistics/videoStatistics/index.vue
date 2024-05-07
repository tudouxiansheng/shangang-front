<template>
  <div class="p-5" ref="videoErrStatistics" v-if="isRouterAlive">
    <el-form
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="110px"
      label-position="left"
      class="border-b"
    >
      <el-row>
        <el-col :span="5" class="treeselect">
          <el-form-item :label="$t('organizationManage.area') + ':'" prop="organizationId">
            <treeselect
              :options="organizationOption"
              :load-options="loadOptions"
              :placeholder="$t('organizationManage.chooseArea')"
              v-model="searchForm.organizationId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
        <el-col :span="5">
          <el-form-item :label="$t('operateManage.patrolResult') + ':'" prop="status">
            <el-select
              v-model="searchForm.status"
              :placeholder="$t('operateManage.patrolResultProp')"
              clearable
            >
              <el-option
                v-for="item in patrolResultData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('report.date') + ':'">
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="searchForm.patrolDate"
              type="date"
              :placeholder="$t('deviceApply.pleaseSelsectDeadLine')"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button type="primary" @click="getQualityList">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item :label="$t('alarmLinkage.devName') + ':'" prop="devName">
            <el-input
              v-model="searchForm.devName"
              clearable
              :placeholder="$t('public.pleaseInputMainDevName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('deviceInfo.deviceID') + ':'" prop="devId">
            <el-input
              v-model="searchForm.devId"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevId')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('deviceInfo.deviceIP') + ':'" prop="ip">
            <el-input
              v-model="searchForm.ip"
              clearable
              :placeholder="$t('deviceInfo.pleaseInputDevIp')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="mt-5">
      <el-button type="success" @click="handleExport">
        {{ $t('businessLog.exportExcel') }}
      </el-button>
      <el-button @click="mutiFaultReport" :disabled="multiple" type="primary">
        {{ $t('dictConst.reportFailure') }}
      </el-button>
    </el-row>
    <el-row class="mt-5">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          :label="$t('deviceInfo.deviceName')"
          prop="devName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('deviceInfo.deviceID')" prop="devId" show-overflow-tooltip />
        <el-table-column :label="$t('deviceInfo.deviceIP')" prop="ip" show-overflow-tooltip />
        <el-table-column
          :label="$t('dictConst.area')"
          prop="organizationName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('operateManage.patrolResult')"
          prop="status"
          show-overflow-tooltip
          :formatter="statusFormatter"
        />
        <el-table-column
          :label="$t('operateManage.diagnosisResult')"
          prop="result"
          show-overflow-tooltip
          :formatter="resultFormatter"
        />
        <el-table-column
          :label="$t('operateManage.errReason')"
          prop="errorItems"
          :formatter="errorItemsFormatter"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('operateManage.dpi')" prop="dpi" show-overflow-tooltip />
        <el-table-column
          width="180"
          :label="$t('operateManage.patrolTime')"
          prop="startTime"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.operating')" width="300">
          <template #default="{ row }">
            <span class="mr-5 cursor-pointer text-detail" @click="handleDetail(row)">
              {{ $t('public.particulars') }}
            </span>
            <span class="mr-5 cursor-pointer text-detail" @click="faultReport(row)">
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
        @pagination="getQualityList"
      />
    </el-row>
    <camera-result-detail />
    <report-fault @refreshTable="getQualityList" />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { mapState } from 'vuex'
import { getFormatDate6 } from '@/utils/common/mutil.js'
import { download } from '@/utils/common/download'
import cameraResultDetail from './component/camera-result-detail'
import { permissions } from '@/utils/common/permissions'
import reportFault from '../../component/report-fault.vue'

export default {
  name: 'VideoAnomalyStatistics',
  components: { Treeselect, cameraResultDetail, reportFault },
  data() {
    return {
      isRouterAlive: true,
      permissionQualityList: true,
      organizationIdCopy: undefined,
      organizationOption: null,
      platOption: [],
      multiple: true,
      devId: '',
      devName: '',
      devIds: [],
      devNames: [],
      dialogVisible: false,
      reportFaultType: 1, //1.单个设备故障上报  2.多个设备故障上报
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      searchForm: {
        organizationId: undefined,
        platId: '',
        status: undefined,
        devName: '',
        devId: '',
        ip: '',
        patrolDate: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      tableData: [],
      total: 0,
      devIdList: [],
      cameraResultDetailVisible: false,
      recordInfos: [],
      dataForm: {},
      cuType: sessionStorage.getItem('cuType')
    }
  },
  computed: {
    ...mapState({
      faultHandleStateData: state => state.dict.fault_handle_state,
      patrolResultData: state => state.dict.patrol_result,
      videoDpiData: state => state.dict.video_dpi,
      diagnosisResultData: state => state.dict.diagnosis_result,
      deviceStatusData: state => state.dict.device_status,
      isYesData: state => state.dict.is_yes,
      patrolQualityStatusData: state => state.dict.patrol_quality_status
    })
  },
  async created() {
    this.getPlatformList()
    this.timesForamtter()
    this.getQualityList()
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
    timesForamtter() {
      let day = new Date()
      this.searchForm.patrolDate = getFormatDate6(day)
    },
    async getQualityList() {
      this.loading = true
      let res = await this.$api.getQualityList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.qualityList
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getQualityList()
    },
    statusFormatter(row) {
      return this.selectDictLabel(this.patrolResultData, row.status)
    },
    resultFormatter(row) {
      return this.selectDictLabel(this.diagnosisResultData, row.result)
    },
    errorItemsFormatter(row) {
      let arr = []
      if (row.errorItems) {
        row.errorItems.forEach(item => {
          arr.push(this.selectDictLabel(this.patrolQualityStatusData, item))
        })
      }
      return arr.join('、')
    },
    dpiFormatter(row) {
      return this.selectDictLabel(this.videoDpiData, row.dpi)
    },
    async handleDetail(row) {
      let res = await this.$api.getVideoQualityInfo({
        patrolTime: row.startTime,
        devId: row.devId
      })
      if (res.resultCode == 0) {
        this.dataForm = {
          devId: res.devId,
          devName: res.devName,
          ip: res.ip,
          status: res.status,
          result: res.result,
          startTime: res.startTime,
          endTime: res.endTime,
          devStatus: res.devStatus,
          snap: res.snap,
          blur: res.blur,
          blacklight: res.blacklight,
          motion: res.motion,
          freeze: res.freeze,
          shake: res.shake,
          lostOrCover: res.lostOrCover,
          color: res.color,
          backlight: res.backlight,
          play: res.play,
          errorItems: res.errorItems,
          dpi: res.dpi
        }
        this.cameraResultDetailVisible = true
      }
    },
    handleSelectionChange(list) {
      /* 故障上报*/
      this.devIds = list.map(item => item.devId)
      this.devNames = list.map(item => item.devName)
      this.multiple = !list.length

      this.devIdList = []
      list.map(item => {
        this.devIdList.push(item.devId)
      })
    },
    async handleExport() {
      let { organizationId, platId, status, patrolDate, devId, devName, ip } = this.searchForm
      let netType = this.$getNetType()
      let obj = { organizationId, platId, status, patrolDate, devId, devName, ip, netType }
      let res = await this.$api.exportQualityList(obj)
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('operateManage.videoPatrolResultList'))
      }
    },

    /** 组织表单控件懒加载 */
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
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
    },
    /*多个故障申报*/
    mutiFaultReport() {
      this.reportFaultType = 2
      this.dialogVisible = true
    },
    /*单个故障申报*/
    faultReport(row) {
      this.devId = row.devId
      this.devName = row.devName
      this.reportFaultType = 1
      this.dialogVisible = true
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
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
</style>
