<template>
  <div class="p-5" ref="videoIntegrity" v-if="isRouterAlive">
    <el-form
      :model="formDetail"
      ref="formDetail"
      :label-width="locale == 'en' ? '200px' : '80px'"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="20">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" class="treeselect">
              <el-form-item :label="$t('videoIntegrity.area') + '：'" prop="areaCodes">
                <treeselect
                  :options="organizationOption"
                  :load-options="loadOptions"
                  :clearable="false"
                  :placeholder="$t('organizationManage.chooseArea')"
                  v-model="formDetail.areaCode"
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
              <el-form-item
                :label-width="locale == 'zh' ? '80px' : '200px'"
                :label="$t('videoIntegrity.monitoringPlatform') + ':'"
                prop="platId"
              >
                <el-select
                  clearable
                  v-model="formDetail.platId"
                  :placeholder="$t('deviceInfo.pleaseSelsectPlatName')"
                >
                  <el-option
                    v-for="item in platformList"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoIntegrity.equipmentName') + ':'">
                <el-input
                  v-model="formDetail.devName"
                  :placeholder="$t('videoIntegrity.pleaseEnterTheDeviceName')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoIntegrity.deviceIP') + ':'">
                <el-input
                  v-model="formDetail.ipAddress"
                  :placeholder="$t('videoIntegrity.pleaseEnterTheDeviceIP')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoIntegrity.inspectionResults') + ':'">
                <el-select v-model="formDetail.patrolResult" clearable>
                  <el-option
                    v-for="item in patrolResultList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoIntegrity.deviceID') + ':'">
                <el-input
                  v-model="formDetail.devId"
                  :placeholder="$t('videoIntegrity.pleaseEnterTheDeviceID')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item :label="$t('videoIntegrity.selectDate') + ':'">
                <el-date-picker
                  v-model="formDetail.date"
                  type="date"
                  :placeholder="$t('videoIntegrity.selectDate')"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4">
          <el-button type="primary" @click="search" style="min-width: 33%">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="resetDetailForm('formDetail')" style="min-width: 33%">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-button
      type="success"
      style="margin: 10px 0px 10px 0px"
      @click="downfile"
      :disabled="detailData.length == 0"
      v-hasPermi="[1434]"
    >
      {{ $t('videoIntegrity.exportExecel') }}
    </el-button>
    <el-button @click="reportFault" :disabled="multiple" type="primary">
      {{ $t('dictConst.reportFailure') }}
    </el-button>
    <el-table
      border
      ref="multipleTable"
      :data="detailData"
      tooltip-effect="dark"
      style="width: 99%; border: 1px solid #156c9e"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :row-class-name="tableRowClassName"
    >
      <el-table-column width="50" type="selection" />
      <el-table-column :label="$t('videoIntegrity.equipmentName')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.devName }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.deviceID')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.devId }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.deviceIP')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.ipAddress }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.area')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.organizationName }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.inspectionResults')" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="yuandian1" v-if="row.patrolResult == -1"></div>
          <span v-if="row.patrolResult == -1" style="color: #969eab">
            {{ $t('videoIntegrity.notDetected') }}
          </span>
          <div class="yuandian2" v-if="row.patrolResult == 1"></div>
          <span v-if="row.patrolResult == 1" style="color: #76b21c">
            {{ $t('videoIntegrity.inspectionIsNormal') }}
          </span>
          <div class="yuandian3" v-if="row.patrolResult == 2"></div>
          <span v-if="row.patrolResult == 2" style="color: #e85f25">
            {{ $t('videoIntegrity.inspectionFailed') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.frequencyOfInterruption')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.indexCounts }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.belongingToThePlatform')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.platName }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.recordingCompleterate')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.recordIntegralityRate }}</template>
      </el-table-column>
      <el-table-column
        :label="$t('videoIntegrity.shouldBeRecordingTime')"
        show-overflow-tooltip
        :formatter="timeFormatter1"
      ></el-table-column>
      <el-table-column
        :label="$t('videoIntegrity.actualRecordingTime')"
        show-overflow-tooltip
        :formatter="timeFormatter2"
      ></el-table-column>
      <el-table-column
        :label="$t('videoIntegrity.lostRecordingTime')"
        show-overflow-tooltip
        :formatter="timeFormatter3"
      ></el-table-column>
      <el-table-column
        :label="$t('videoIntegrity.cameraOfflineTime')"
        show-overflow-tooltip
        :formatter="timeFormatter4"
      ></el-table-column>
      <el-table-column
        :label="$t('videoIntegrity.equipmentRecordingStrategy')"
        show-overflow-tooltip
      >
        <template #default="{ row }">{{ row.recordPolicy }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.statisticsDate')" show-overflow-tooltip>
        <template #default="{ row }">{{ row.statTime }}</template>
      </el-table-column>
      <el-table-column :label="$t('videoIntegrity.operate')" show-overflow-tooltip width="155px">
        <template #default="{ row }">
          <el-button size="small" type="text" style="color: #2c6dd2" @click="faultReport(row)">
            {{ $t('operateManage.faultReport') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="detailData.length"
      :total="totalNumTwo"
      v-model:pageNum="pageNumTwo"
      v-model:limit="pageSizeTwo"
      @pagination="getDetailListByPage"
    ></pagination>
    <report-fault @refreshTable="getIntegralityDetailList" />
  </div>
</template>

<script>
import { download } from '@/utils/common/download'
import api from '@/api'
import reportFault from '../../component/report-fault.vue'
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { getDayHourMinAndSec } from '@/utils/common/mutil'
export default {
  name: 'VideoIntegrity',
  components: { Treeselect, reportFault },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      organizationOption: null,
      isRouterAlive: true,
      loading: false,
      reportFaultType: 1, //1.单个设备故障上报  2.多个设备故障上报
      devId: '',
      devName: '',
      devIds: [],
      devNames: [],
      formDetail: {
        areaCode: Number(sessionStorage.getItem('organizationId')),
        platId: '',
        devName: '',
        ipAddress: '',
        devId: '',
        patrolResult: '',
        date: ''
      },
      platformList: [],
      orgId: '',
      /*所属区域懒加载*/
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
                  areaName: this.$t('videoIntegrity.entireCountry'),
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
      /*详情数据*/
      detailData: [],
      /*详情分页*/
      pageNumTwo: 1,
      pageSizeTwo: 10,
      totalNumTwo: 0, // 总数量
      ids: [],
      dialogVisible: false,
      multiple: true
    }
  },
  computed: {
    patrolResultList() {
      return [
        {
          name: this.$t('videoIntegrity.inspectionIsNormal'),
          value: 1
        },
        {
          name: this.$t('videoIntegrity.inspectionFailed'),
          value: 2
        },
        {
          name: this.$t('videoIntegrity.notDetected'),
          value: -1
        }
      ]
    }
  },
  created() {
    this.getIntegralityDetailList()
  },
  mounted() {
    this.getPlatformList()
  },
  methods: {
    search() {
      this.pageNumTwo = 1
      this.pageSizeTwo = 10
      this.getIntegralityDetailList()
    },
    /*多个故障申报*/
    reportFault() {
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
    /** 表格多选框选中数据 */
    handleSelectionChange(selection) {
      this.devIds = selection.map(item => item.devId)
      this.devNames = selection.map(item => item.devName)
      this.multiple = !selection.length
    },
    //录像完整性详情
    getIntegralityDetailList() {
      this.loading = true
      var startDate = ''
      if (this.formDetail.date) {
        var done = new Date(this.formDetail.date)
        startDate =
          done.getFullYear() +
          '-' +
          (done.getMonth() > 9 ? done.getMonth() + 1 : '0' + (done.getMonth() + 1)) +
          '-' +
          (done.getDate() > 9 ? done.getDate() : '0' + done.getDate())
      }
      this.$api
        .getRecordIntegralityDetail({
          organizationId: this.formDetail.areaCode,
          platId: this.formDetail.platId,
          devName: this.formDetail.devName,
          ipAddress: this.formDetail.ipAddress,
          devId: this.formDetail.devId,
          retrievalDay: startDate,
          patrolResult: this.formDetail.patrolResult,
          pageInfo: {
            pageNum: this.pageNumTwo,
            pageSize: this.pageSizeTwo
          }
        })
        .then(res => {
          this.detailData = res.recordIntegralityDetails
          this.pageNumTwo = res.pageInfo.pageNum
          this.pageSizeTwo = res.pageInfo.pageSize
          this.totalNumTwo = res.pageInfo.totalNum
          this.loading = false
        })
    },
    /*详情重置按钮*/
    async resetDetailForm(formName) {
      this.$refs[formName].resetFields()
      this.formDetail = {
        areaCode: Number(sessionStorage.getItem('organizationId')),
        platId: '',
        devName: '',
        ipAddress: '',
        devId: '',
        patrolResult: '',
        date: ''
      }
      this.search()
    },
    /*文件导出*/
    downfile() {
      var startDate = ''
      if (this.formDetail.date) {
        var done = new Date(this.formDetail.date)
        startDate =
          done.getFullYear() +
          '-' +
          (done.getMonth() > 9 ? done.getMonth() + 1 : '0' + (done.getMonth() + 1)) +
          '-' +
          (done.getDate() > 9 ? done.getDate() : '0' + done.getDate())
      }
      this.$api
        .getRecordIntegralityExport({
          organizationId: this.formDetail.areaCode,
          platId: this.formDetail.platId,
          devName: this.formDetail.devName,
          ipAddress: this.formDetail.ipAddress,
          devId: this.formDetail.devId,
          retrievalDay: startDate,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.fileUrl) {
            download(res.fileUrl, this.$t('videoIntegrity.videoIntegrityDetailExcel'))
          }
        })
    },
    // 获取所属平台
    getPlatformList() {
      let data = {
        organizationId: this.orgId == '' ? sessionStorage.getItem('organizationId') : this.orgId
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
          this.platformList = res.platformList
        }
      })
    },
    //详情分页
    getDetailListByPage() {
      this.getIntegralityDetailList()
    },
    /*重新检测按钮*/
    chongxinjiance(data) {
      let checkDate = new Date()
      let checkDay =
        checkDate.getFullYear().toString() +
        '-' +
        (checkDate.getMonth() + 1).toString() +
        '-' +
        checkDate.getDate().toString()
      this.$api
        .getRecordIntegralityCheck({
          devId: data.devId,
          checkDay: checkDay
        })
        .then(res => {
          if (res) {
            if (res.resultDesc == 'SUCCESS') {
              this.$message({
                message: this.$t('videoIntegrity.successdetection'),
                type: 'success'
              })
            } else {
              this.$message.error(this.$t('videoIntegrity.faildetection'))
            }
          } else {
            this.$message.error(this.$t('videoIntegrity.faildetection'))
          }
          this.getIntegralityDetailList()
        })
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.formDetail.areaCode = this.organizationOption[0].id
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
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    timeFormatter1(row) {
      return getDayHourMinAndSec(row.recordShouldTime * 1000)
    },
    timeFormatter2(row) {
      return getDayHourMinAndSec(row.recordActualTime * 1000)
    },
    timeFormatter3(row) {
      return getDayHourMinAndSec(row.recordLostTime * 1000)
    },
    timeFormatter4(row) {
      return getDayHourMinAndSec(row.offlineDuration * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.echartstyle {
  height: 300px;
  width: 90%;
  padding-bottom: 3px;
  padding-left: 4%;
}

.echartstyleZhu {
  height: 300px;
  width: 90%;
  padding-bottom: 3px;
  padding-left: 4%;
}

.searchForm {
  display: flex;
  justify-content: space-between;
}

.yuandian1 {
  width: 5px;
  height: 5px;
  background-color: #969eab;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.yuandian2 {
  width: 5px;
  height: 5px;
  background-color: #76b21c;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.yuandian3 {
  width: 5px;
  height: 5px;
  background-color: #e85f25;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 2px;
}

.el-cascader--medium {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

/*解决el-col下面出现的空白问题*/
.el-row {
  display: flex;
  flex-wrap: wrap;
}

:deep(.circular) {
  display: inline-block;
}
</style>
