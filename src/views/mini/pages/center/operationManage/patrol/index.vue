<template>
  <div class="patrol" ref="patrol" v-if="isRouterAlive">
    <div class="statistics-container">
      <div class="operate treeselect">
        <treeselect
          :options="organizationOption"
          :load-options="loadOptions"
          :clearable="false"
          :placeholder="$t('organizationManage.chooseArea')"
          v-model="organizationId"
          @input="treeselectChange"
        />
      </div>
      <div class="patrol-content">
        <div class="patrol-content-item">
          <div class="total-score">
            <div>{{ $t('operateManage.totalScore') }}</div>
            <div>{{ score }}</div>
          </div>
          <div class="test-operate">
            <el-button @click="handleTestAgin">{{ $t('operateManage.testAgin') }}</el-button>
            <el-button type="primary" @click="handleExport">
              {{ $t('operateManage.testReoprt') }}
            </el-button>
          </div>
        </div>
        <div class="patrol-content-item">
          <div v-loading="loading1">
            <echart id="SurveillancePie" height="280px" :options="getOption1()"></echart>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-title">{{ $t('operateManage.testTotal') }}</span>
                <span class="legend-value1">{{ devTotal1 }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-title">{{ $t('public.statustype1') }}</span>
                <span class="legend-value2">{{ onlineNum1 }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-title">{{ $t('public.statustype2') }}</span>
                <span class="legend-value3">{{ offlineNum1 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="patrol-content-item">
          <div v-loading="loading3">
            <echart id="SurveillancePie" height="280px" :options="getOption3()"></echart>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-title">{{ $t('operateManage.testTotal') }}</span>
                <span class="legend-value1">{{ devTotal3 }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-title">{{ $t('public.normal') }}</span>
                <span class="legend-value2">{{ onlineNum3 }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-title">{{ $t('public.statustype3') }}</span>
                <span class="legend-value3">{{ offlineNum3 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="major-patrol">
      <collapse-card :title="$t('operateManage.focusPatrol')" hideCollapse background>
        <template #operate>
          <el-button v-show="groupId && !isProcessing" type="primary" @click="startPatrol">
            {{ $t('operateManage.startTest') }}
          </el-button>
          <el-button v-show="isProcessing" type="info">
            {{ $t('operateManage.patroling1') }}
          </el-button>
          <el-button type="success" @click="toHistoryPatrol">
            {{ $t('operateManage.patrolHistory') }}
          </el-button>
        </template>

        <div>
          <div>
            <span class="text-white">{{ $t('operateManage.selectGroupProp') }}</span>
            <svg-icon iconClass="manage" className="manage-icon-class"></svg-icon>

            <span class="group-manage" @click="groupManage">
              {{ $t('operateManage.groupMange') }}
            </span>
          </div>
          <div>
            <el-radio-group
              class="mt-3"
              v-model="groupId"
              @change="groupIdChange"
              :disabled="isProcessing"
            >
              <el-radio-button
                v-for="(item, index) in groupList"
                :key="index"
                :label="item.groupId"
              >
                {{ item.groupName }}
              </el-radio-button>
            </el-radio-group>
            <div v-if="groupList.length == 0" class="mt-3 text-delete">
              {{ $t('operateManage.noGroupProp') }}
            </div>
          </div>
        </div>
        <div class="mt-5">
          <span class="text-white">{{ $t('operateManage.selectPatrolItems') }}</span>
          <div class="mt-3">
            <select-tag
              tag-mode
              inline
              v-model="selectedPatrolContentValueList"
              :options="patrolContentList"
              label="value"
              text="name"
              :disabled="isProcessing"
            />
          </div>
        </div>
        <div class="mt-5 text-xs text-white">
          <span class="mr-3">
            {{ $t('operateManage.chosen') + totalDeviceNum }}/500{{ $t('operateManage.sets') }}
          </span>
          <span>
            {{ $t('operateManage.patrolContent') + '：' + selectedPatrolContentNameList }}
          </span>
        </div>
        <div class="mt-5">
          <el-table
            border
            v-loading="loading"
            :data="tableData"
            max-height="490"
            :row-class-name="tableRowClassName"
          >
            <el-table-column :label="$t('operateManage.index')" type="index" width="50" />
            <el-table-column
              :label="$t('deviceInfo.deviceName')"
              prop="devName"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('deviceInfo.deviceID')"
              prop="devId"
              show-overflow-tooltip
            />
            <el-table-column :label="$t('deviceInfo.deviceIP')" prop="ip" show-overflow-tooltip />
            <el-table-column
              :label="$t('operateManage.patrolItem1')"
              show-overflow-tooltip
              :formatter="devStatusFormatter"
            />
            <el-table-column
              :label="$t('operateManage.patrolItem2')"
              show-overflow-tooltip
              :formatter="previewFormatter"
            />
            <el-table-column
              :label="$t('operateManage.patrolItem3')"
              prop="recordStatus"
              show-overflow-tooltip
              :formatter="recordStatusFormatter"
            />
            <el-table-column
              :label="$t('operateManage.patrolItem4')"
              prop="integrity"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.integrity ? row.integrity : '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('operateManage.patrolItem5')"
              prop="quality"
              show-overflow-tooltip
              :formatter="qualityFormatter"
            />
            <el-table-column
              :label="$t('operateManage.endTime')"
              prop="endTime"
              show-overflow-tooltip
            />
          </el-table>

          <pagination
            v-show="total > 0 && !loading"
            :total="total"
            v-model:pageNum="pageInfo.pageNum"
            v-model:limit="pageInfo.pageSize"
            @pagination="getDeviceList"
          />

          <el-form label-position="left">
            <el-form-item
              v-show="isProcessing"
              :label="$t('operateManage.patrolProgress') + progress + '%'"
              label-width="130px"
            >
              <el-slider v-model="progress" disabled></el-slider>
            </el-form-item>
          </el-form>
        </div>
      </collapse-card>
    </div>
    <patrol-detail />
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import collapseCard from '../component/collapse-card.vue'
import echart from '@/components/echart'
import SelectTag from '@/components/select-tag'
import patrolDetail from './component/patrol-detail.vue'
import { exportExcel } from '@/utils/common/excelOperate'
import { mapState } from 'vuex'

export default {
  name: 'OneClickInspection',
  components: { Treeselect, collapseCard, echart, SelectTag, patrolDetail },
  data() {
    return {
      flag: true,
      isRouterAlive: true,
      organizationOption: null,
      organizationId: undefined,
      totalDeviceNum: 0,
      loading1: true,
      loading3: true,
      loading: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      groupId: '',
      groupList: [],
      selectedPatrolContentValueList: [],
      progress: 50,
      patrolDetaildialogVisible: false,
      exportdialogVisible: false,
      echartData1: [],
      devTotal1: 0,
      onlineNum1: 0,
      offlineNum1: 0,
      onlineRate1: 0,
      echartData3: [],
      devTotal3: 0,
      onlineNum3: 0,
      offlineNum3: 0,
      onlineRate3: 0,
      tableData1: [],
      tableData3: [],
      sheetNameList: [],
      excelFileName: '',
      searchFlag: 1,
      isProcessing: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      devListParams: {
        groupId: ''
      },
      patrolParams: {
        groupId: '',
        items: []
      },
      locale: localStorage.getItem('locale')
    }
  },
  computed: {
    score() {
      let num = (40 * this.onlineRate1 + 30 * this.onlineRate3) / 100
      return num.toFixed(2)
    },
    selectedPatrolContentNameList() {
      let nameList = []
      this.patrolContentList.map(item => {
        if (
          this.selectedPatrolContentValueList &&
          this.selectedPatrolContentValueList.includes(item.value)
        ) {
          nameList.push(item.name)
        }
      })
      return nameList.join('、')
    },
    ...mapState({
      patrolContentList: state => state.dict.patrol_items,
      patrolDevStatusData: state => state.dict.patrol_dev_status,
      patrolPreviewStatusData: state => state.dict.patrol_preview_status,
      patrolRecordStatusData: state => state.dict.patrol_record_status,
      patrolQualityStatusData: state => state.dict.patrol_quality_status
    })
  },
  mounted() {
    this.dataInternationalised()
    this.getMajorInspectPatrolStatus()
    this.getGroupList()
  },
  methods: {
    dataInternationalised() {
      this.sheetNameList = [
        this.$t('operateManage.onlineStatistics'),
        this.$t('operateManage.videoStatusStatistics')
      ]
      this.excelFileName = this.$t('operateManage.testReoprt')
    },
    treeselectChange() {
      this.getStatisticsList()
    },
    // 获取统计信息
    async getStatisticsList() {
      this.loading1 = true
      let res1 = await this.$api.getDevStatus({
        organizationId: this.organizationId
      })
      if (res1.resultCode == 0) {
        this.loading1 = false
        this.devTotal1 = res1.total
        this.onlineNum1 = res1.online
        this.offlineNum1 = res1.offline
        if (res1.total == 0) {
          this.onlineRate1 = 0
        } else {
          let onlineRate = res1.online / res1.total
          this.onlineRate1 = (onlineRate * 100).toFixed(2)
        }
        let onlineRate = res1.online / res1.total
        this.onlineRate1 = (onlineRate * 100).toFixed(2)
        this.echartData1 = [
          {
            name: this.$t('public.statustype1'),
            value: res1.online
          },
          {
            name: this.$t('public.statustype2'),
            value: res1.offline
          }
        ]
        if (this.locale == 'zh') {
          this.tableData1 = [
            {
              统计项: this.$t('public.statustype1'),
              数量: this.onlineNum1,
              比率: this.onlineRate1 + '%'
            },
            {
              统计项: this.$t('public.statustype2'),
              数量: this.offlineNum1,
              比率: res1.offline == 0 ? '0%' : (100 - this.onlineRate1).toFixed(2) + '%'
            }
          ]
        } else {
          this.tableData1 = [
            {
              statisticalItem: this.$t('public.statustype1'),
              number: this.onlineNum1,
              percentum: this.onlineRate1 + '%'
            },
            {
              statisticalItem: this.$t('public.statustype2'),
              number: this.offlineNum1,
              percentum: res1.offline == 0 ? '0%' : (100 - this.onlineRate1).toFixed(2) + '%'
            }
          ]
        }
      }
      this.loading3 = true
      let res3 = await this.$api.getRecordStatus({
        organizationId: this.organizationId
      })
      if (res3.resultCode == 0) {
        this.loading3 = false
        this.devTotal3 = res3.total
        this.onlineNum3 = res3.recording
        this.offlineNum3 = res3.notRecording
        if (res3.total == 0) {
          this.onlineRate3 = 0
        } else {
          let onlineRate = res3.recording / res3.total
          this.onlineRate3 = (onlineRate * 100).toFixed(2)
        }
        this.echartData3 = [
          {
            name: this.$t('public.normal'),
            value: res3.recording
          },
          {
            name: this.$t('public.statustype3'),
            value: res3.notRecording
          }
        ]
        if (this.locale == 'zh') {
          this.tableData3 = [
            {
              统计项: this.$t('public.normal'),
              数量: this.onlineNum3,
              比率: this.onlineRate3 + '%'
            },
            {
              统计项: this.$t('public.statustype3'),
              数量: this.offlineNum3,
              比率: res3.notRecording == 0 ? '0%' : (100 - this.onlineRate3).toFixed(2) + '%'
            }
          ]
        } else {
          this.tableData3 = [
            {
              statisticalItem: this.$t('public.normal'),
              number: this.onlineNum3,
              percentum: this.onlineRate3 + '%'
            },
            {
              statisticalItem: this.$t('public.statustype3'),
              number: this.offlineNum3,
              percentum: res3.notRecording == 0 ? '0%' : (100 - this.onlineRate3).toFixed(2) + '%'
            }
          ]
        }
      }
    },
    handleTestAgin() {
      this.getStatisticsList()
    },
    handleExport() {
      let excelData = [this.tableData1, this.tableData3]
      exportExcel(excelData, this.sheetNameList, this.excelFileName)
    },
    getDeviceList() {
      if (this.searchFlag == 1) {
        this.getGroupInfo()
      } else if (this.searchFlag == 2) {
        this.getTaskInfo()
      }
    },
    getOption1() {
      let colorList = ['#478EFE', '#EBECF0']
      return {
        title: {
          text:
            '{val|' +
            this.onlineRate1 +
            '%}\n{name|' +
            this.$t('operateManage.monitoringPoint') +
            '}',
          top: '40%',
          textAlign: 'center',
          left: '50%',
          textStyle: {
            rich: {
              name: {
                fontSize: 18,
                fontWeight: 'bold',
                padding: [5, 0]
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['65%', '80%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: false
            },

            data: this.echartData1
          }
        ]
      }
    },
    getOption3() {
      let colorList = ['#FF552D', '#EBECF0']
      return {
        title: {
          text:
            '{val|' + this.onlineRate3 + '%}\n{name|' + this.$t('operateManage.videoStatus') + '}',
          top: '40%',
          textAlign: 'center',
          left: '50%',
          textStyle: {
            rich: {
              name: {
                fontSize: 18,
                fontWeight: 'bold',
                padding: [5, 0]
              },
              val: {
                fontSize: 36,
                fontWeight: 'normal'
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['65%', '80%'],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: false
            },
            data: this.echartData3
          }
        ]
      }
    },
    groupManage() {
      this.$router.push('groupManage')
    },
    // 查询用户当前是否有进行中的巡检任务
    async getMajorInspectPatrolStatus(taskId) {
      let res1 = await this.$api.getMajorInspectPatrolStatus()
      if (res1.resultCode == 0) {
        this.isProcessing = res1.processing
        if (this.isProcessing) {
          this.getTaskInfo()
        } else {
          if (this.flag) {
            return
          } else {
            this.pageInfo = {
              pageNum: 1,
              pageSize: 10
            }
            let obj = {
              taskId: taskId,
              pageInfo: this.pageInfo
            }
            let res2 = await this.$api.getPatrolResult(obj)
            if (res2.resultCode == 0) {
              this.tableData = res2.resultList
              this.total = res2.pageInfo.totalNum
            }
          }
        }
      }
    },
    async getTaskInfo() {
      this.searchFlag = 2
      let obj = {
        pageInfo: this.pageInfo
      }
      let res = await this.$api.getTaskInfo(obj)
      if (res.resultCode == 0) {
        this.selectedPatrolContentValueList = res.items
        this.groupId = res.groupId
        this.selectedPatrolContentValueList = res.items
        this.total = res.pageInfo.totalNum
        this.totalDeviceNum = res.pageInfo.totalNum
        this.progress = res.progress
        let groupResult = res.groupResult
        this.tableData = groupResult
      }
    },
    // 获取所有分组
    async getGroupList() {
      let res = await this.$api.getGroupList()
      if (res.resultCode == 0) {
        this.groupList = res.groupList
      }
    },
    groupIdChange() {
      this.selectedPatrolContentValueList = []
      this.patrolContentList.map(item => {
        this.selectedPatrolContentValueList.push(item.value)
      })
      this.groupList.map(item => {
        if (item.groupId == this.groupId) {
          this.totalDeviceNum = item.totalDeviceNum
        }
      })
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = 10
      if (this.groupId) {
        this.getGroupInfo()
      }
    },
    // 获取巡检组设备列表
    async getGroupInfo() {
      this.searchFlag = 1
      this.loading = true
      this.devListParams.pageInfo = this.pageInfo
      this.devListParams.groupId = this.groupId

      let res = await this.$api.getGroupInfo(this.devListParams)
      if (res.resultCode == 0) {
        this.total = res.pageInfo.totalNum
        this.loading = false
        this.tableData = res.devList
      }
    },
    // 巡检
    async startPatrol() {
      this.isProcessing = true
      this.loading = true
      this.patrolParams.groupId = this.groupId
      this.patrolParams.items = this.selectedPatrolContentValueList
      let res = await this.$api.majorInspect(this.patrolParams)
      if (res.resultCode == 0) {
        this.loading = false
        this.flag = false
        this.getMajorInspectPatrolStatus(res.taskId)
      }
    },
    toHistoryPatrol() {
      this.$router.push('/devOps/patrolHistory')
    },
    handleExportPatrolList() {
      this.exportdialogVisible = true
    },
    devStatusFormatter(row) {
      if (row.devStatus) {
        return this.selectDictLabel(this.patrolDevStatusData, row.devStatus)
      } else {
        return '—'
      }
    },
    previewFormatter(row) {
      if (row.devStatus) {
        return this.selectDictLabel(this.patrolPreviewStatusData, row.preview)
      } else {
        return '—'
      }
    },
    recordStatusFormatter(row) {
      if (row.recordStatus || row.resultCode == 0) {
        return this.selectDictLabel(this.patrolRecordStatusData, row.recordStatus)
      } else {
        return '—'
      }
    },
    qualityFormatter(row) {
      if (row.quality && row.quality.length == 0 && row.endTime) {
        return this.$t('public.normal')
      } else if (row.quality && row.quality.length > 0) {
        let arr = []
        row.quality.forEach(item => {
          arr.push(this.selectDictLabel(this.patrolQualityStatusData, item))
        })
        return arr.join('、')
      } else {
        return '—'
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
            this.organizationId = this.organizationOption[0].id
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

<style lang="scss">
.vue-treeselect {
  display: inline-block;
  width: 202px;
}
.patrol {
  .statistics-container {
    .operate {
      padding: 20px;
      border-bottom: 1px solid #ebecf0;
    }
  }
  .patrol-content {
    display: flex;
    padding: 15px;
    .patrol-content-item {
      flex: 1;
      margin-left: 10px;
      padding: 20px;
      background: #0a314f;
      height: 380px;
      border-radius: 4px;
      &:first-child {
        margin-left: 0;
        background: #0a314f;
      }
      .legend {
        display: flex;
        .legend-item {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
        }
      }
    }
    .total-score {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: auto;
      width: 275px;
      height: 275px;
      border-radius: 50%;
      box-shadow: 0 0 9px 3px rgba(188, 188, 188, 0.3);
      background: url('~@/assets/img/common/score.png') no-repeat center center;
      text-align: center;
      div {
        &:first-child {
          margin-top: 35px;
          color: #232c3b;
          font-size: 18px;
        }
        &:nth-child(2) {
          margin-bottom: 25px;
          color: #fcc419;
          font-size: 35px;
        }
      }
    }
    .test-operate {
      text-align: center;
      margin-top: 30px;
    }
    .legend-title {
      color: #7a869a;
      font-size: 14px;
    }
    .legend-value1 {
      color: #7a869a;
      font-weight: 800;
      font-size: 16px;
    }
    .legend-value2 {
      color: #20c997;
      font-weight: 800;
      font-size: 16px;
    }
    .legend-value3 {
      color: #ff6b6b;
      font-weight: 800;
      font-size: 16px;
    }
  }
  .major-patrol {
    margin-top: 15px;
    .manage-icon-class {
      display: inline;
      margin-left: 20px;
    }
    .group-manage {
      margin-left: 5px;
      color: #04a1ff;
      cursor: pointer;
    }
  }
  .el-radio-button {
    margin-right: 20px !important;
  }
  .el-radio-button__inner {
    border-radius: 4px !important;
  }
}
.el-radio-button--small .el-radio-button__inner {
  padding: 11px 15px;
}
</style>
