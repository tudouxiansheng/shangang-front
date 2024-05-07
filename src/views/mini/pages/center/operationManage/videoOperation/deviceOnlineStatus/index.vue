<template>
  <div v-if="isRouterAlive" class="p-5" ref="deviceOnlineStatus">
    <el-form
      class="border-b queryForm"
      :label-width="locale == 'en' ? '200px' : '80px'"
      ref="queryForm"
      label-position="left"
      :model="queryParams"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="20">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" class="treeselect">
              <el-form-item :label="$t('dictConst.area') + '：'" prop="organizationId">
                <treeselect
                  :options="organizationOption"
                  :load-options="loadOptions"
                  :clearable="false"
                  :placeholder="$t('organizationManage.chooseArea')"
                  v-model="queryParams.organizationId"
                >
                  <template #option-label="{ node, labelClassName }">
                    <div :class="labelClassName">
                      <span :title="node.label">{{ node.label }}</span>
                    </div>
                  </template>
                </treeselect>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('dictConst.monitoringPlatform') + '：'" prop="platId">
                <el-select v-model="queryParams.platId" clearable>
                  <el-option
                    v-for="(item, index) in platNameList"
                    :key="index"
                    :label="item.platName"
                    :value="item.platId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('dictConst.equipmentName') + '：'" prop="devName">
                <el-input v-model="queryParams.devName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('dictConst.deviceID') + '：'" prop="devId">
                <el-input v-model="queryParams.devId" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('dictConst.equipmentStatus') + '：'" prop="deviceStatus">
                <el-select v-model="queryParams.status" clearable>
                  <el-option
                    v-for="item in deviceStatus"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4">
          <el-button type="primary" @click="handleQuery" style="min-width: 33%">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="resetQuery" style="min-width: 33%">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div style="padding: 20px 0">
      <el-button
        type="success"
        @click="OnOfflineCheckExport"
        :disabled="tableData.length == 0"
        v-hasPermi="[1447]"
      >
        {{ $t('dictConst.exportExecel') }}
      </el-button>
      <el-button @click="mutiFaultReport" :disabled="multiple" type="primary">
        {{ $t('dictConst.reportFailure') }}
      </el-button>
    </div>
    <div
      :style="{ height: tableHeight + 'px' }"
      ref="tableWrapper"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
    >
      <div v-show="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>
      <!-- 表格 -->
      <el-table
        v-if="!loading && tableData.length"
        :row-class-name="tableRowClassName"
        :data="tableData"
        height="calc(100% - 56px)"
        @selection-change="handleSelectionChange"
        border
      >
        <template #empty>
          <span style="font-size: 14px">{{ $t('public.noData') }}</span>
        </template>
        <el-table-column width="50" type="selection" />
        <el-table-column
          :label="$t('dictConst.equipmentName')"
          prop="devName"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('dictConst.deviceID')" prop="devId" show-overflow-tooltip />
        <el-table-column :label="$t('dictConst.deviceIP')" prop="ipAddress" show-overflow-tooltip />
        <el-table-column
          :label="$t('dictConst.deviceInterconnectionCode')"
          prop="interconnectCode"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('dictConst.videoPreviewStatus')"
          prop="previewStatus"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div class="yuandian1" v-if="row.previewStatus == 1"></div>
            <span v-if="row.previewStatus == 1" style="color: #7dbe1b">
              {{ $t('dictConst.normal') }}
            </span>
            <div class="yuandian2" v-if="row.previewStatus == 2"></div>
            <span v-if="row.previewStatus == 2" style="color: #e85f25">
              {{ $t('dictConst.failed') }}
            </span>
            <div class="yuandian3" v-if="row.previewStatus == -1"></div>
            <span v-if="row.previewStatus == -1" style="color: #969eab">
              {{ $t('dictConst.notDetected') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('dictConst.equipmentStatus')"
          prop="status"
          sortable
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span v-if="row.status == 0">{{ $t('dictConst.inactivated') }}</span>
            <span v-if="row.status == 1">{{ $t('dictConst.online') }}</span>
            <span v-if="row.status == 2">{{ $t('dictConst.offline') }}</span>
            <span v-if="row.status == 3">{{ $t('dictConst.unusual') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('dictConst.area')" prop="area" show-overflow-tooltip />
        <el-table-column
          :label="$t('dictConst.monitoringPlatform')"
          prop="platName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('dictConst.stateDuration')"
          prop="duration"
          sortable
          :formatter="timeFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('dictConst.detectionTime')"
          prop="previewTime"
          sortable
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.operating')" min-width="100">
          <template #default="{ row }">
            <div>
              <el-button
                size="small"
                type="text"
                style="color: #2c6dd2"
                @click="dialogTableVisibleShow(row)"
                v-hasPermi="[1445]"
              >
                {{ $t('public.particulars') }}
              </el-button>
              <el-button size="small" type="text" style="color: #2c6dd2" @click="faultReport(row)">
                {{ $t('operateManage.faultReport') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination
        v-show="!loading && total > 0"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="$t('dictConst.devicedetails')"
        v-model="dialogTableVisible"
        top="10vh"
        width="930px"
        height="420px"
        class="workOrderDialog"
        :close-on-click-modal="false"
        @closed="dialogClosed"
        @open="dialogOpen"
        :modal="false"
        draggable
      >
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.monitoringpointname') }}
            </span>
          </div>
          <div style="width: 20%">
            <span style="color: #bdbdbd; float: left">{{ detailData.devName || '-' }}</span>
          </div>
          <div style="width: 16%; margin-left: 4%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.IPaddressandportnumber') }}
            </span>
          </div>
          <div style="width: 30%">
            <span style="color: #bdbdbd; float: left">{{ detailData.devIp || '-' }}</span>
          </div>
        </div>
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">{{ $t('public.state') }}</span>
          </div>
          <div style="width: 20%">
            <div class="yuandian5" v-if="detailData.status == 0" style="float: left"></div>
            <span style="color: #969eab; float: left" v-if="detailData.status == 0">
              {{ $t('dictConst.inactivated') }}
            </span>
            <div class="yuandian6" v-if="detailData.status == 1" style="float: left"></div>
            <span style="color: #7dbe1b; float: left" v-if="detailData.status == 1">
              {{ $t('dictConst.online') }}
            </span>
            <div class="yuandian5" v-if="detailData.status == 2" style="float: left"></div>
            <span style="color: #969eab; float: left" v-if="detailData.status == 2">
              {{ $t('dictConst.offline') }}
            </span>
            <div class="yuandian4" v-if="detailData.status == 3" style="float: left"></div>
            <span style="color: #e85f25; float: left" v-if="detailData.status == 3">
              {{ $t('dictConst.unusual') }}
            </span>
            <span
              style="color: #969eab; float: left"
              v-if="
                !detailData.status ||
                (detailData.status != 0 &&
                  detailData.status != 1 &&
                  detailData.status != 2 &&
                  detailData.status != 3)
              "
            >
              -
            </span>
          </div>
          <div style="width: 16%; margin-left: 4%">
            <span style="margin-right: 20px; float: left">{{ $t('dictConst.previewStatus') }}</span>
          </div>
          <div style="width: 30%">
            <div class="yuandian5" v-if="detailData.previewStatus == -1" style="float: left"></div>
            <span style="color: #969eab; float: left" v-if="detailData.previewStatus == -1">
              {{ $t('dictConst.notDetected') }}
            </span>
            <div class="yuandian6" v-if="detailData.previewStatus == 1" style="float: left"></div>
            <span style="color: #7dbe1b; float: left" v-if="detailData.previewStatus == 1">
              {{ $t('dictConst.success') }}
            </span>
            <div class="yuandian4" v-if="detailData.previewStatus == 2" style="float: left"></div>
            <span style="color: #e85f25; float: left" v-if="detailData.previewStatus == 2">
              {{ $t('dictConst.failed') }}
            </span>
            <span
              style="color: #969eab; float: left"
              v-if="
                !detailData.previewStatus ||
                (detailData.previewStatus != -1 &&
                  detailData.previewStatus != 1 &&
                  detailData.previewStatus != 2)
              "
            >
              -
            </span>
          </div>
        </div>
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">{{ $t('dictConst.channelnumber') }}</span>
          </div>
          <div style="width: 20%">
            <span style="color: #bdbdbd; float: left">{{ detailData.channelNo || '-' }}</span>
          </div>
          <div style="width: 16%; margin-left: 4%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.equipmentmanufacturer') }}
            </span>
          </div>
          <div style="width: 30%">
            <span style="color: #bdbdbd; float: left">{{ detailData.manufacturer || '-' }}</span>
          </div>
        </div>
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.recordingstatus') }}
            </span>
          </div>
          <div style="width: 20%">
            <div class="yuandian6" v-if="detailData.recordStatus == 0" style="float: left"></div>
            <span style="color: #7dbe1b; float: left" v-if="detailData.recordStatus == 0">
              {{ $t('dictConst.normal') }}
            </span>
            <div class="yuandian4" v-if="detailData.recordStatus == 1" style="float: left"></div>
            <span style="color: #e85f25; float: left" v-if="detailData.recordStatus == 1">
              {{ $t('dictConst.unusual') }}
            </span>
            <span
              style="color: #969eab; float: left"
              v-if="detailData.recordStatus != 0 && detailData.recordStatus != 1"
            >
              -
            </span>
          </div>
          <div style="width: 16%; margin-left: 4%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.owningdevicestatus') }}
            </span>
          </div>
          <div style="width: 30%">
            <div class="yuandian5" v-if="detailData.mainDevStatus == 0" style="float: left"></div>
            <span style="color: #969eab; float: left" v-if="detailData.mainDevStatus == 0">
              {{ $t('dictConst.inactivated') }}
            </span>
            <div class="yuandian6" v-if="detailData.mainDevStatus == 1" style="float: left"></div>
            <span style="color: #7dbe1b; float: left" v-if="detailData.mainDevStatus == 1">
              {{ $t('dictConst.online') }}
            </span>
            <div class="yuandian5" v-if="detailData.mainDevStatus == 2" style="float: left"></div>
            <span style="color: #969eab; float: left" v-if="detailData.mainDevStatus == 2">
              {{ $t('dictConst.offline') }}
            </span>
            <div class="yuandian4" v-if="detailData.mainDevStatus == 3" style="float: left"></div>
            <span style="color: #e85f25; float: left" v-if="detailData.mainDevStatus == 3">
              {{ $t('dictConst.unusual') }}
            </span>
            <span
              style="color: #969eab; float: left"
              v-if="
                !detailData.mainDevStatus ||
                (detailData.mainDevStatus != 0 &&
                  detailData.mainDevStatus != 1 &&
                  detailData.mainDevStatus != 2 &&
                  detailData.mainDevStatus != 3)
              "
            >
              -
            </span>
          </div>
        </div>
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.statetimingduration') }}
            </span>
          </div>
          <div style="width: 20%">
            <span style="color: #bdbdbd; float: left">{{ detailData.duration || '-' }}</span>
          </div>
          <div style="width: 16%; margin-left: 4%">
            <span style="margin-right: 20px; float: left">
              {{ $t('dictConst.deviceinterconnectioncode') }}
            </span>
          </div>
          <div style="width: 30%">
            <span style="color: #bdbdbd; float: left">
              {{ detailData.interconnectCode || '-' }}
            </span>
          </div>
        </div>
        <div class="flexstyle">
          <div style="width: 16%; margin-left: 14%">
            <span style="margin-right: 20px; float: left">{{ $t('dictConst.previewtime') }}</span>
          </div>
          <div style="width: 20%">
            <span style="color: #bdbdbd; float: left">{{ detailData.previewTime || '-' }}</span>
          </div>
        </div>
      </el-dialog>
    </div>
    <report-fault @refreshTable="getList" />
  </div>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import reportFault from '../../component/report-fault.vue'
import { download } from '@/utils/common/download'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { getDayHourMinAndSec } from '@/utils/common/mutil'
export default {
  name: 'StatusMonitoringOfMonitoringPoints',
  components: { Treeselect, reportFault },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      organizationOption: null,
      multiple: true,
      linkCode: 0,
      isRouterAlive: true,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        organizationId: Number(sessionStorage.getItem('organizationId')),
        platId: undefined,
        devName: undefined,
        devId: undefined,
        status: undefined
      },
      //弹出框控制
      dialogTableVisible: false,
      propsCas: {
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        value: 'areaCode',
        label: 'areaName',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level == 0) {
            setTimeout(() => {
              resolve([
                {
                  areaCode: '000000000000',
                  areaLevel: 0,
                  areaName: this.$t('dictConst.entireCountry'),
                  leaf: false
                }
              ])
            })
          } else {
            api.getAreaList({ areaCode: node.value }).then(res => {
              if (res.resultCode == 0) {
                const nodes = res.subAreaList.map(item => ({
                  ...item,
                  leaf: node.level >= 3
                }))
                resolve(nodes)
              }
            })
          }
        }
      },
      platNameList: [],
      tableHeight: 580,
      loading: false,
      total: 0,
      tableData: [{ cameraId: '1' }, { cameraId: '2' }],
      devIds: [],
      devNames: [],
      devId: '',
      devName: '',
      dialogVisible: false,
      reportFaultType: 1, //1.单个设备故障上报  2.多个设备故障上报
      //详情数据
      detailData: []
    }
  },
  computed: {
    // 获取字典表
    ...mapState({
      deviceStatus: state => state.dict.device_status,
      previewStatus: state => state.dict.preview_status
    })
  },
  created() {
    this.getPlatList()
    this.getList()
  },
  mounted() {
    this.refreshnodesArr()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      this.$api.OnOfflineCheck(this.queryParams).then(res => {
        if (res.resultCode == 0) {
          this.tableData = res.deviceOnlineCheckDetails
          this.total = res.pageInfo.totalNum
          this.loading = false
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        organizationId: Number(sessionStorage.getItem('organizationId')),
        platId: undefined,
        interconnectCode: undefined,
        devName: undefined,
        ipAddress: undefined,
        devId: undefined,
        status: undefined
      }
      this.$resetForm('queryForm')
      this.handleQuery()
    },
    //刷新按钮
    refreshnodesArr() {},
    /** 表格多选框选中数据 */
    handleSelectionChange(selection) {
      this.devIds = selection.map(item => item.devId)
      this.devNames = selection.map(item => item.devName)
      this.multiple = !selection.length
    },
    /** 获取所属平台数据 */
    getPlatList() {
      let data = {
        organizationId: sessionStorage.getItem('organizationId')
      }
      this.$api.queryAccessPlatformList(data).then(res => {
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
          this.platNameList = res.platformList
        }
      })
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
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    /**详情弹出框*/
    dialogTableVisibleShow(data) {
      this.$api.OnOfflineCheckDetail({ devId: data.devId }).then(res => {
        this.detailData = []
        this.detailData.devId = res.devId
        this.detailData.devName = res.devName
        this.detailData.devIp = res.devIp
        this.detailData.interconnectCode = res.interconnectCode
        this.detailData.platName = res.platName
        this.detailData.status = res.status
        this.detailData.previewStatus = res.previewStatus
        this.detailData.duration = res.duration
        this.detailData.previewTime = res.previewTime
        this.detailData.recordStatus = res.recordStatus
        this.detailData.mainDevStatus = res.mainDevStatus
        this.detailData.manufacturer = res.manufacturer
        this.detailData.channelNo = res.channelNo
      })
      this.dialogTableVisible = true
    },
    /**重新检测*/
    OnOfflineCheckAgain(data) {
      this.$api.OnOfflineCheckAgain({ devId: data.devId }).then(res => {
        if (res) {
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('dictConst.successmonitoring'),
              type: 'success'
            })
          } else {
            this.$message.error(this.$t('dictConst.failmonitoring'))
          }
        } else {
          this.$message.error(this.$t('dictConst.failmonitoring'))
        }
        this.getList()
      })
    },
    /**弹框点击关闭的操作*/
    dialogClosed() {},
    dialogOpen() {
      if (this.$refs.queryForm) {
        this.$nextTick(() => {})
      }
      this.$nextTick(() => {
        
      })
    },
    OnOfflineCheckExport() {
      this.$api
        .OnOfflineCheckExport({
          organizationId: this.queryParams.organizationId,
          platId: this.queryParams.platId,
          interconnectCode: this.queryParams.interconnectCode,
          devName: this.queryParams.devName,
          ipAddress: this.queryParams.ipAddress,
          devId: this.queryParams.devId,
          status: this.queryParams.status,
          previewStatus: this.queryParams.previewStatus,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.fileUrl) {
            download(res.fileUrl, this.$t('dictConst.devOnlineListExport'))
          }
        })
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.queryParams.organizationId = this.organizationOption[0].id
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) {
        return {}
      } else {
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
    },
    timeFormatter(row) {
      return getDayHourMinAndSec(row.duration * 60 * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner,
  .el-select,
  .el-cascader {
    width: 100%;
  }
}

.flexstyle {
  display: flex;
  margin-bottom: 30px;
}

.yuandian1 {
  width: 5px;
  height: 5px;
  background-color: #7dbe1b;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.yuandian2 {
  width: 5px;
  height: 5px;
  background-color: #e85f25;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.yuandian3 {
  width: 5px;
  height: 5px;
  background-color: #969eab;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.yuandian4 {
  width: 5px;
  height: 5px;
  background-color: #e85f25;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-top: 8px;
}

.yuandian5 {
  width: 5px;
  height: 5px;
  background-color: #969eab;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-top: 8px;
}

.yuandian6 {
  width: 5px;
  height: 5px;
  background-color: #7dbe1b;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-top: 8px;
}

.mynetwork {
  width: 100%;
  height: 300px;
}

#workOrderDialog {
  .el-dialog__body {
    padding-bottom: 1px;

    .el-date-editor {
      .el-range-input,
      .el-range-separator {
        color: #262626;
      }
    }
  }
}

/*解决el-col下面出现的空白问题*/
.el-row {
  display: flex;
  flex-wrap: wrap;
}

:deep(.border-b) {
  border-bottom-color: #48535a;
}

:deep(.el-dialog__body) {
  padding: 0 35px;
}
</style>
