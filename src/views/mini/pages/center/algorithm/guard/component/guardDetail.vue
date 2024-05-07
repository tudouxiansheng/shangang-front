<template>
  <div id="guardDetailDialog">
    <el-dialog
      :title="$t('algoGuard.guardInfo')"
      v-model="$parent.dialogFormVisible_info"
      top="10vh"
      width="1100px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form ref="form" :model="form" label-width="120px" size="small" label-position="left">
        <div style="display: flex; padding: 0px 0px" class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('algoGuard.taskID') + '：'">
              <span>{{ form.guardId }}</span>
              <el-button  class="blueSpan ml10" link @click="copyValue(form.guardId)">
                {{ $t('frontParameterConfiguration.copy') }}
              </el-button>
            </el-form-item>
            <el-form-item :label="$t('algoGuard.guardType') + '：'">
              <span>{{ $parent.setGuardType(form.guardType) }}</span>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('algoGuard.guardSource') + '：'">
              <el-popover placement="bottom" trigger="hover">
                <ul>
                  <li v-show="form.sourceType == 1">{{ $t('algoGuard.devName') }}：</li>
                  <li v-show="form.sourceType == 2">{{ $t('algoGuard.taskName') }}：</li>
                  <li v-for="(item, index) in form.sourceList" :key="index">
                    {{ item.sourceName }}
                  </li>
                </ul>
                <template #reference>
                  <span class="blueSpan">
                    {{ form.sourceName }}
                    <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                  </span>
                </template>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('algoGuard.guardAlgo') + '：'" v-if="form.sourceType == 2">
              <el-popover placement="bottom" width="350" trigger="hover">
                <ul>
                  <li>{{ $t('algoGuard.algoID') }}：{{ algoInfo.algorithmId }}</li>
                  <li>{{ $t('algoGuard.algoName') }}：{{ algoInfo.algorithmName }}</li>
                  <li>{{ $t('algoGuard.accessID') }}：{{ algoInfo.accessId }}</li>
                  <li>{{ $t('algoGuard.modelID') }}：{{ algoInfo.modelId }}</li>
                  <li>{{ $t('algoGuard.maxChannel') }}：{{ algoInfo.maxChannel }}</li>
                </ul>
                <template #reference>
                  <span class="blueSpan" @mouseenter="showAlgoInfo">
                    {{ form.algorithmName }}
                  </span>
                </template>
              </el-popover>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('algoGuard.taskInfo')" name="info">
          {{ $t('algoGuard.taskInfo') }}
        </el-tab-pane>
        <el-tab-pane :label="$t('algoGuard.guardHit')" name="hit">
          {{ $t('algoGuard.guardHit') }}
        </el-tab-pane>
      </el-tabs>

      <div v-show="activeName == 'info'">
        <div>
          <h4 style="display: inline-block; margin: 0px 0px 10px">
            {{ $t('algoGuard.taskInfo') }}
          </h4>
          <el-icon class="blueSpan"><el-icon-edit /></el-icon>
        </div>
        <verticalTable
          :tableData="tableData"
          :tableStyle="{ width: '100%', border: '1px solid #bfbfbf' }"
        ></verticalTable>

        <div class="filterBox" v-if="$parent.rulesFather.length">
          <h4 style="margin: 10px 0px">{{ $t('algoGuard.guardRule') }}</h4>
          <div v-for="(item, index) in $parent.rulesFather" :key="index" class="filterDivDetail">
            <el-input v-model="item.propertyName" readonly></el-input>
            <el-input v-model="item.compares" readonly></el-input>
            <el-input v-model="item.remark" readonly></el-input>
          </div>
        </div>
      </div>

      <div v-show="activeName == 'hit'">
        <div>
          <el-date-picker
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            style="margin-bottom: 10px"
            v-model="dateValue"
            type="daterange"
            :range-separator="$t('public.to')"
            :start-placeholder="$t('public.startTimePrompt')"
            :end-placeholder="$t('public.endTimePrompt')"
            @change="dateChange"
            format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
          <el-button type="primary" class="miniBtn" @click="searchHit">
            {{ $t('public.search') }}
          </el-button>
        </div>

        <!-- 表格 -->
        <el-table
          ref="hitTable"
          :data="hitTableData"
          style="width: 100%"
          :row-class-name="$parent.tableRowClassName"
          border
          max-height="440"
        >
          <el-table-column :label="$t('algoGuard.alarmTime')" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.hitTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('algoGuard.alarmType')" min-width="90" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.alarmName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('algoGuard.alarmLevel')" min-width="65" show-overflow-tooltip>
            <template #default="{ row }">
              <span
                :class="
                  row.alarmLevel == 2 ? 'danger' : row.alarmLevel == 1 ? 'warning' : 'success'
                "
              >
                {{ $parent.locale == 'en' ? row.alarmLevelEnName : row.alarmLevelName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('algoGuard.hitLib')" min-width="80" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.repositoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('algoGuard.hitObj')" min-width="80" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.personName || row.lpn }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('algoGuard.similarity')" min-width="65" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.similarity }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operating')">
            <template #default="{ row }">
              <span class="cell-operate" @click="showSnapImg(row)">
                {{ $t('algoGuard.viewMetadata') }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="pagination">
          <div class="paging">
            <span>{{ $t('public.everyPageShows') }}</span>
            <el-select v-model="number_h" @change="numberChange_h">
              <el-option
                v-for="(item, index) in numberList_h"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span>{{ $t('public.records') }}</span>
          </div>
          <div>
            <el-pagination
              v-model:current-page="pageNum_h"
              :page-size="pageSize_h"
              layout="total, prev, pager, next, jumper"
              :total="totalNum_h"
              @current-change="handleCurrentChange_h"
              background
            />
          </div>
        </div>
      </div>

      <div v-show="activeName == 'perform'">
        <el-table
          ref="performTable"
          :data="performTableData"
          style="width: 100%"
          :row-class-name="$parent.tableRowClassName"
          border
        >
          <el-table-column
            :label="$t('algoGuard.executeTime')"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.startTime.substring(0, 10) == row.endTime.substring(0, 10)">
                {{ row.startTime }} ~
                {{ row.endTime.substring(11) }}
              </span>
              <span v-else>{{ row.startTime }} ~ {{ row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('algoGuard.executeStatus')"
            min-width="90"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operating')">
            <template #default="{ row }">
              <span class="cell-operate" @click="showJsonMessage(row)">
                {{ $t('algoGuard.executeInfo') }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="pagination">
          <div class="paging">
            <span>{{ $t('public.everyPageShows') }}</span>
            <el-select v-model="number_p" @change="numberChange_p">
              <el-option
                v-for="(item, index) in numberList_p"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span>{{ $t('public.records') }}</span>
          </div>
          <div>
            <el-pagination
              v-model:current-page="pageNum_p"
              :page-size="pageSize_p"
              layout="total, prev, pager, next, jumper"
              :total="totalNum_p"
              @current-change="handleCurrentChange_p"
              background
            />
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$parent.dialogFormVisible_info = false">
            {{ $t('public.cancel') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('algoGuard.snapImg')"
      v-model="snapImgDialogVisible"
      top="16vh"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      width="600px"
      class="snapDialog"
    >
      <img :src="snapImgUrl" style="width: 100%; height: 338px" />
    </el-dialog>

    <el-dialog
      :title="$t('algoGuard.executeInfo')"
      v-model="jsonVisible"
      top="16vh"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      width="600px"
      class="snapDialog"
    >
      <p>{{ jsonMessage }}</p>
    </el-dialog>

    <!-- 命中元数据 -->
    <metadata-detail v-model:visible="detailDialogVisible" />
  </div>
</template>

<script>
import { ArrowDown as ElIconArrowDown, Edit as ElIconEdit } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { getFormatDate } from '@/utils/common/mutil'
import verticalTable from '@/components/verticalTable.vue'
import Clipboard from 'vue-clipboard3'
import metadataDetail from '../../intelligent-metadata/component/metadata-detail.vue'
import { sStorage } from '@/utils/common/store'
import { mapState } from 'vuex'

export default {
  components: {
    verticalTable,
    metadataDetail,
    ElIconArrowDown,
    ElIconEdit
  },
  data() {
    return {
      form: {
        guardId: '',
        guardName: '',
        guardType: '',
        algorithmId: '',
        alarmType: [],
        //公共
        repositoryIds: [],
        threshold: 50,
        validDateBegin: '',
        validDateEnd: '',
        remark: '',
        sourceType: '',
        sourceId: '',
        sourceName: '',
        algorithmName: ''
      },
      //来源类型
      sourceTypeList: [
        {
          name: this.$t('algoGuard.camera'),
          value: 1
        },
        {
          name: this.$t('algoGuard.rtmp'),
          value: 2
        }
      ],
      ptzTypeData: [],
      cameraInfo: {
        cameraId: '',
        cameraName: '',
        ptzType: '',
        platName: '',
        status: ''
      },
      taskInfo: {
        taskId: '',
        taskName: '',
        taskType: '',
        taskState: ''
      },
      algoInfo: {
        cameraId: '',
        cameraName: '',
        ptzType: '',
        platName: '',
        status: ''
      },
      activeName: 'info',
      tableData: [
        { key: this.$t('algoGuard.taskName'), value: '1' },
        { key: this.$t('algoGuard.taskStatus'), value: '2' },
        { key: this.$t('algoGuard.taskType'), value: '3' },
        { key: this.$t('algoGuard.guardLib'), value: '4' },
        { key: this.$t('algoGuard.threshold'), value: '5' },
        { key: this.$t('algoGuard.guardTime'), value: '6' },
        { key: this.$t('algoGuard.runningPeriod'), value: '7' },
        { key: this.$t('algoGuard.alarmName'), value: '8' },
        { key: this.$t('algoGuard.addTime'), value: '9' },
        { key: this.$t('algoGuard.taskRemark'), value: '10' }
      ],
      // 布控命中
      dateValue: [],
      validDateBegin: '',
      validDateEnd: '',
      hitTableData: [],
      number_h: 0,
      //每页显示数量
      numberList_h: [10, 20, 30, 40, 50, 100, 500],
      pageNum_h: 1,
      pageSize_h: 10,
      // 总数量
      totalNum_h: 0,
      snapImgUrl: '',
      snapImgDialogVisible: false,
      // 任务执行情况
      performTableData: [
        {
          startTime: '2021-09-21 11:22:33',
          endTime: '2021-09-22 12:22:33',
          message: { fff: 'fff' }
        }
      ],
      number_p: 0,
      //每页显示数量
      numberList_p: [10, 20, 30, 40, 50, 100, 500],
      pageNum_p: 1,
      pageSize_p: 10,
      // 总数量
      totalNum_p: 0,
      jsonMessage: '',
      jsonVisible: false,
      //元数据弹框页面的有些选项的显隐判断
      pageType: 'guard',
      //命中元数据
      dataForm: {},
      //元数据弹框
      detailDialogVisible: false,
      dayjs
    }
  },
  async mounted() {
    this.getDictionary()
  },
  computed: {
    ...mapState({
      analysisTaskStatus: state => state.dict['analysis_task_status'] // 智能分析任务状态
    })
  },
  methods: {
    async copyValue(info) {
      const { toClipboard } = Clipboard()
      try {
        await toClipboard(info)
        this.$message({
          type: 'success',
          message: this.$t('frontParameterConfiguration.copySucc')
        })
      } catch (e) {}
    },
    setSourceType(val) {
      if (val) {
        this.sourceTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setState(val) {
      return this.selectDictLabel(this.analysisTaskStatus, val, {
        key: 'name',
        value: 'code'
      })
    },
    setTaskType(val) {
      if (val) {
        this.guardTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },

    setCameraState(val) {
      let name = ''
      if (val == 0) {
        name = this.$t('public.statustype0')
      } else if (val == 1) {
        name = this.$t('public.statustype1')
      } else if (val == 2) {
        name = this.$t('public.statustype2')
      } else if (val == 3) {
        name = this.$t('public.statustype3')
      }
      return name
    },
    setPtzType(val) {
      let name = ''
      this.ptzTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setLevel(val) {
      if (val == 0) {
        return this.$t('public.general')
      } else if (val == 1) {
        return this.$t('public.important')
      } else if (val == 2) {
        return this.$t('public.urgent')
      } else {
        return val
      }
    },
    // 字典查询
    async getDictionary() {
      await this.$api.getDictionary({ type: 'device-type' }).then(res => {
        if (res.dictionaryList) {
          this.ptzTypeData = res.dictionaryList
        }
      })
    },

    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm_Detail
        this.tableData = this.$parent.tableDataFather
        this.hitTableData = this.$parent.hitTableDataFather
        this.totalNum_h = this.$parent.hitTableDataFather_totalNum
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible_info = false
      this.$parent.maskloading = false
      this.activeName = 'info'
      this.$parent.tableDataFather = []
      this.$parent.hitTableDataFather = []
      this.dateValue = []
    },

    showSourceInfo() {
      if (this.form.sourceType == 1) {
        this.$api.getCameraInfo({ cameraId: this.form.sourceId }).then(res => {
          if (res.resultCode == 0) {
            this.cameraInfo = {
              cameraId: res.cameraBaseInfo.cameraId,
              cameraName: res.cameraBaseInfo.cameraName,
              ptzType: res.cameraBaseInfo.ptzType,
              platName: res.platInfo.platName,
              status: res.cameraMaintainInfo.status
            }
          }
        })
      } else if (this.form.sourceType == 2) {
        this.$api.getNewTaskInfo({ taskId: this.form.sourceId }).then(res => {
          if (res.resultCode == 0) {
            this.taskInfo = res
          }
        })
      }
    },
    showAlgoInfo() {
      this.$api
        .getNewAlgorithmInfo({
          algorithmId: this.form.algorithmId,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.algoInfo = res
          }
        })
    },

    // 编辑弹框
    showEditDialog() {
      this.$parent.operation = 2
      this.$parent.dialogFormVisible = true
      this.$parent.dialogFormVisible_info = false
    },

    // 布控命中--------
    showSnapImg(row) {
      this.dataForm = JSON.parse(JSON.stringify(row))
      this.dataForm.captureImagePath = this.dataForm.captureImage
      this.dataForm.captureTime = this.dataForm.hitTime
      this.detailDialogVisible = true
    },
    dateChange(val) {
      if (val) {
        this.validDateBegin = getFormatDate(val[0])
        this.validDateEnd = getFormatDate(val[1])
      } else {
        this.validDateBegin = ''
        this.validDateEnd = ''
      }
    },
    getList_h() {
      let _params = {
        pageInfo: { pageNum: this.pageNum_h, pageSize: this.pageSize_h },
        guardIds: [this.$parent.choosedGuardId],
        beginTime: this.validDateBegin,
        endTime: this.validDateEnd
      }
      this.$api.getGuardHitList(_params).then(res => {
        if (res.resultCode == 0) {
          this.hitTableData = res.guardHitList
          this.totalNum_h = res.pageInfo.totalNum
        } else {
          this.hitTableData = []
          this.totalNum_h = 0
        }
      })
    },
    searchHit() {
      this.pageNum_h = 1
      this.getList_h()
    },
    numberChange_h(val) {
      this.pageSize_h = this.numberList_h[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_h < this.pageSize_h * this.pageNum_h) {
        this.pageNum_h = 1
      }
      this.getList_h()
    },
    handleCurrentChange_h(val) {
      this.pageNum_h = val
      this.getList_h()
    },
    // 布控命中--------

    // 任务执行情况============
    showJsonMessage(row) {
      this.jsonMessage = row.message
      this.jsonVisible = true
    },
    getList_p() {
      this.$api
        .getGuardExecutionLog({
          pageInfo: { pageNum: this.pageNum_h, pageSize: this.pageSize_h },
          guardId: this.$parent.choosedGuardId
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.performTableData = res.guardExecutionLogList
          }
        })
    },
    numberChange_p(val) {
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_p < this.pageSize_p * this.pageNum_p) {
        this.pageNum_p = 1
      }
      this.getList_p()
    },
    handleCurrentChange_p(val) {
      this.pageNum_p = val
      this.getList_p()
    }
    // 任务执行情况============
  }
}
</script>

<style lang="scss">
#guardDetailDialog {
  .el-dialog__body {
    padding: 15px 20px 5px;
  }

  .filterDiv {
    display: flex;
    .el-select {
      width: 290px;
      margin-right: 10px;
    }
  }

  .el-tabs__content {
    display: none;
  }
  .el-tabs {
    padding-left: 16px;
    margin-left: -15px;
  }
  .el-tabs__item {
    background: none !important;
  }
  .el-tabs__item.is-active {
    color: #409eff !important;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .blueSpan {
    color: #10a9ff;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-tabs__nav-scroll {
    padding-left: 0px !important;
  }
  .el-tabs__item {
    padding-left: 0px !important;
  }
  .snapDialog {
    .el-dialog__body {
      padding: 10px;
    }
  }
  .el-date-editor .el-range-separator {
    color: #4d4d4d;
  }
  .el-range-input {
    color: #262626;
  }
  .filterDivDetail {
    display: flex;
    margin-bottom: 10px;
    .el-input {
      width: 290px;
      margin-right: 10px;
    }
  }
}
</style>
