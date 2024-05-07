<template>
  <!-- 智能分析任务管理 -->
  <div id="intelligentAnalysisTask" v-if="isRouterAlive" ref="intelligentAnalysisTask">
    <div class="btnMargin">
      <el-button type="primary" @click="handleAddTask">
        {{ $t('analysisTask.createTask') }}
      </el-button>
      <el-button type="primary" @click="handleStart" :disabled="multiple">
        {{ $t('analysisTask.start') }}
      </el-button>
      <el-button type="danger" @click="handleStop" :disabled="multiple">
        {{ $t('analysisTask.stop') }}
      </el-button>
      <el-button type="danger" @click="handleDelete" :disabled="multiple">
        {{ $t('analysisTask.delete') }}
      </el-button>
    </div>

    <el-form
      class="advanced-query-form"
      :label-width="locale == 'en' ? '120px' : '100px'"
      ref="queryForm"
      :model="queryParams"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="19">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="1 < count">
              <el-form-item :label="$t('analysisTask.taskOwner') + ':'" prop="taskOwner">
                <el-select clearable v-model="queryParams.taskOwner">
                  <el-option
                    v-for="item in taskOwnerList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="2 < count">
              <el-form-item :label="$t('analysisTask.taskName') + ':'" prop="taskName">
                <el-input
                  v-model="queryParams.taskName"
                  clearable
                  :placeholder="$t('analysisTask.selectTaskName')"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="3 < count">
              <el-form-item :label="$t('analysisTask.taskState') + ':'" prop="taskState">
                <el-select clearable v-model="queryParams.taskState">
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="item in analysisTaskStatus"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="4 < count">
              <el-form-item
                :label="$t('analysisTask.taskType') + ':'"
                :label-width="locale == 'en' ? '170px' : '100px'"
                prop="taskType"
              >
                <el-select clearable v-model="queryParams.taskType">
                  <el-option :label="$t('public.all')" value=""></el-option>
                  <el-option
                    v-for="(item, index) in arsIntelligentTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9" v-show="5 < count">
              <el-form-item :label="$t('public.createTime') + ':'" prop="createTime">
                <el-date-picker
                  :shortcuts="pickerOptions && pickerOptions.shortcuts"
                  :disabled-date="pickerOptions && pickerOptions.disabledDate"
                  :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                  v-model="timeRange"
                  type="datetimerange"
                  align="right"
                  unlink-panels
                  style="width: 360px"
                  clearable
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                  @change="dateRangeChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9" v-show="6 < count">
              <el-form-item :label="$t('analysisTask.sourceType') + ':'" class="form-item-flex">
                <el-select v-model="queryParams.sourceType" @change="sourceTypeChange">
                  <el-option
                    v-for="item in sourceTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  ref="camara"
                  v-if="queryParams.sourceType === 1"
                  @focus="selectCamaraChange"
                  v-model="contentName"
                  :placeholder="$t('alarmList.selectACamera')"
                  class="newCameras"
                >
                  <template #suffix>
                    <svg-icon icon-class="add-input" class-name="el-input__icon" />
                  </template>
                </el-input>
                <el-input
                  v-if="queryParams.sourceType === 3"
                  v-model="contentName"
                  :placeholder="$t('analysisTask.selectVideoFile')"
                  class="newCameras"
                >
                  <template #suffix>
                    <svg-icon icon-class="add-input" class-name="el-input__icon" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" v-show="7 < count">
              <el-form-item
                :label="$t('analysisTask.streamType') + ':'"
                :label-width="locale == 'en' ? '166px' : '100px'"
                prop="streamType"
              >
                <el-select clearable v-model="queryParams.streamType">
                  <el-option :label="$t('public.all')" value></el-option>
                  <el-option
                    v-for="item in streamTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="5">
          <el-form-item class="advanced-query-form-btn">
            <el-button type="primary" class="initial-width" @click="handleQuery">
              {{ $t('public.search') }}
            </el-button>
            <el-button class="initial-width" @click="resetQuery">
              {{ $t('public.reset') }}
            </el-button>
            <el-button class="initial-width" @click="advancedSearch">
              {{ $t('public.manyCondition') }}
              <span :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div
      :style="{ height: tableHeight + 'px' }"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>
      <!-- 表格 -->
      <el-table
        v-if="!loading && tableData.length"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        class="elTable"
        border
        :max-height="tableHeight - 56"
      >
        <el-table-column width="50" type="selection" />

        <el-table-column :label="$t('analysisTask.taskName')" min-width="90" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="task-name">{{ row.taskName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('analysisTask.taskType')"
          min-width="90"
          show-overflow-tooltip
          :formatter="taskTypeFormat"
        />

        <el-table-column :label="$t('analysisTask.algo')" min-width="90" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.algorithms[0].algorithmName }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('analysisTask.sourceType')"
          show-overflow-tooltip
          :formatter="sourceTypeFormat"
        />

        <el-table-column
          :label="$t('analysisTask.streamType')"
          show-overflow-tooltip
          :formatter="streamTypeFormat"
        />

        <el-table-column :label="$t('public.createTime')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('analysisTask.taskState')" min-width="90" show-overflow-tooltip>
          <template #default="{ row }">
            <span :class="setTaskStateClass(row.taskState)">
              {{ setTaskState(row.taskState) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('public.operating')" min-width="120" class="operate-col">
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              class="operate-btn"
              :title="$t('public.particulars')"
              @click="handleInfo(row)"
            >
              <svg-icon icon-class="task-detail" />
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              class="operate-btn"
              :title="$t('analysisTask.start')"
              :disabled="startButtonDisabled(row)"
              @click="handleStart(row)"
            >
              <svg-icon icon-class="task-start" />
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              class="operate-btn"
              :title="$t('analysisTask.stop')"
              :disabled="stopButtonDisabled(row)"
              @click="handleStop(row)"
            >
              <svg-icon icon-class="task-stop" />
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              class="operate-btn"
              :title="$t('public.delete')"
              :disabled="deleteButtonDisabled(row)"
              @click="handleDelete(row)"
            >
              <svg-icon icon-class="task-delete" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <pagination
        v-if="!loading && total > 0"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </div>

    <camera-selector
      :title="$t('analysisTask.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      :device-type="1"
    />

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :what="$t('analysisTask.task')"
      @getList="getList"
      :operate="operate"
      :batchApi="batchApi"
      whatId="taskId"
      whatName="taskName"
      v-model:visible="batchDialogVisible"
    ></batch-operate>

    <task-detail v-model:visible="view.visible" :data="view.data" />

    <modify-form v-model:visible="modify.visible" :data="modify.data" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BatchOperate from '@/components/batchOperate'
import TaskDetail from './component/taskDetail'
import ModifyForm from './component/modifyForm'
import CameraSelector from '@components/cameraSelector'
export default {
  name: 'IntelligentAnalysisTask',
  components: {
    BatchOperate,
    TaskDetail,
    ModifyForm,
    CameraSelector
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        taskOwner: 1,
        taskName: undefined,
        taskState: undefined,
        taskType: undefined,
        sourceType: 1,
        contents: [],
        streamType: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      contentName: undefined,
      timeRange: [],
      expand: false,
      tableHeight: 715,
      queryFormCount: 5,
      loading: false,
      total: 0,
      tableData: [],
      dialogDeviceVisible: false,
      multipleSelection: [],
      multiple: true,
      batchApi: '',
      batchDialogVisible: false, //批量操作对话框
      operate: '',
      view: {
        visible: false,
        data: {}
      },
      modify: {
        visible: false,
        data: {}
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getQueryFormCount)
    this.getQueryFormCount()
    this.getDictionary()
    this.getList()
  },
  watch: {
    $route(to, from) {
      if (from.path === '/algorithm/intelligent-task-add') {
        this.getList()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getQueryFormCount)
  },
  computed: {
    ...mapState({
      arsIntelligentTypeList: state => state.dict['ars_intelligent_type'], // 智能分析任务类型
      analysisTaskStatus: state => state.dict['analysis_task_status'] // 智能分析任务状态
    }),
    count() {
      return this.expand ? 11 : this.queryFormCount
    },
    streamTypeList() {
      return [
        {
          name: this.$t('analysisTask.live'),
          value: 1
        },
        {
          name: this.$t('analysisTask.record'),
          value: 2
        }
      ]
    },
    sourceTypeList() {
      return [
        {
          name: this.$t('analysisTask.camera'),
          value: 1
        }
      ]
    },
    taskOwnerList() {
      return [
        {
          name: this.$t('analysisTask.allTask'),
          value: 0
        },
        {
          name: this.$t('analysisTask.myTask'),
          value: 1
        }
      ]
    },
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: this.$t('public.nearlyThreeDays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearlySevenSays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearly30Days'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['ars_intelligent_type'])
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
        taskOwner: 1,
        taskName: undefined,
        taskState: undefined,
        taskType: undefined,
        sourceType: 1,
        contents: [],
        streamType: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.timeRange = []
      this.contentName = undefined
      this.$resetForm('queryForm')
      this.handleQuery()
    },
    /** 高级搜索按钮操作 */
    advancedSearch() {
      this.expand = !this.expand
      this.tableHeight = this.expand ? 665 : 715
    },
    dateRangeChange(val) {
      this.queryParams.beginTime = val != null ? val[0] : undefined
      this.queryParams.endTime = val != null ? val[1] : undefined
    },
    getQueryFormCount() {
      let winW = window.innerWidth
      switch (true) {
        case winW >= 1920:
          this.queryFormCount = 5
          break
        case winW >= 1200 && winW < 1920:
          this.queryFormCount = 4
          break
        case winW >= 992 && winW < 1200:
          this.queryFormCount = 3
          break
        case winW >= 768 && winW < 992:
          this.queryFormCount = 2
          break
        case winW < 768:
          this.queryFormCount = 2
          break
      }
    },
    // 表格列表选中
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      this.multiple = !selection.length
    },
    getList() {
      this.loading = true
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      if (!queryParams.contents.length) {
        delete queryParams.contents
        delete queryParams.sourceType
      }
      this.$api
        .getNewTaskList(queryParams)
        .then(res => {
          if (res.taskList && res.taskList.length) {
            this.tableData = res.taskList
            this.total = res.pageInfo.totalNum
            this.$nextTick(() => {
              this.$refs.multipleTable?.setScrollTop(0)
            })
          } else {
            this.tableData = []
            this.total = 0
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    },
    taskTypeFormat(row) {
      return this.selectDictLabel(this.arsIntelligentTypeList, row.taskType, {
        key: 'name',
        value: 'value'
      })
    },
    sourceTypeFormat(row) {
      return this.selectDictLabel(this.sourceTypeList, row.sourceType, {
        key: 'name',
        value: 'value'
      })
    },
    streamTypeFormat(row) {
      return this.selectDictLabel(this.streamTypeList, row.streamType, {
        key: 'name',
        value: 'value'
      })
    },
    setTaskState(val) {
      return this.selectDictLabel(this.analysisTaskStatus, val, {
        key: 'name',
        value: 'code'
      })
    },
    setTaskStateClass(val) {
      if (val === 2) {
        return 'success'
      } else if (val === 6) {
        return 'danger'
      }
    },
    async getCameras(cameras) {
      this.contentName = cameras.map(item => item.name).join(',')
      this.queryParams.contents = cameras.map(item => item.id)
    },
    sourceTypeChange(val) {
      this.contentName = undefined
      this.queryParams.contents = []
    },
    handleAddTask() {
      this.$router.push({
        path: '/algorithm/intelligent-task-add'
      })
    },
    selectCamaraChange() {
      this.dialogDeviceVisible = true
      this.$refs.camara.blur()
    },
    //启动
    async handleStart(row = {}) {
      if (row.taskId) {
        this.$confirm(this.$t('analysisTask.startTaskPrompt'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(() => {
            this.$api.startNewTask({ taskId: row.taskId }).then(response => {
              if (response.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('analysisTask.startTaskSuccess')
                })
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('analysisTask.startTaskCanceled')
            })
          })
      } else {
        this.operate = this.$t('analysisTask.start')
        this.batchApi = 'startNewTask'
        this.batchDialogVisible = true
      }
    },

    //停止
    async handleStop(row = {}) {
      const { taskState, taskId } = row
      let confirmText = this.$t('analysisTask.stopTaskPrompt', {
        num: taskId ? 1 : this.multipleSelection.length
      })
      if (taskState === 1) {
        confirmText = this.$t('analysisTask.stopTaskPrompt1')
      } else if (taskState === 2) {
        confirmText = this.$t('analysisTask.stopTaskPrompt2')
      }
      this.$confirm(confirmText, this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          if (taskId) {
            this.$api.stopNewTask({ taskId }).then(response => {
              if (response.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('analysisTask.stopTaskSuccess')
                })
                this.getList()
              }
            })
          } else {
            this.operate = this.$t('analysisTask.stop')
            this.batchApi = 'stopNewTask'
            this.batchDialogVisible = true
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('analysisTask.stopTaskCanceled')
          })
        })
    },
    //详情
    async handleInfo(row) {
      let res = await this.$api.getNewTaskInfo({ taskId: row.taskId })
      if (res.resultCode !== 0) return
      res.periodList.forEach(element => {
        element.startTime = element.startTime + ':00'
        element.endTime = element.endTime + ':00'
      })
      this.view.data = res
      this.view.visible = true
    },
    async handleModify(row) {
      let res = await this.$api.getNewTaskInfo({ taskId: row.taskId })
      if (res.resultCode !== 0) return
      res.periodList.forEach(element => {
        element.startTime = element.startTime + ':00'
        element.endTime = element.endTime + ':00'
      })
      this.modify.data = res
      this.modify.visible = true
    },
    // 删除
    handleDelete(row = {}) {
      const { taskState, taskId } = row
      if (taskState === 2) {
        this.$alert(this.$t('analysisTask.delTaskPrompt'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm')
        })
        return
      }
      this.$confirm(
        this.$t('analysisTask.ifDelTask', {
          num: taskId ? 1 : this.multipleSelection.length
        }),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          if (row.taskId) {
            this.$api.deleteNewTaskInfo({ taskId: row.taskId }).then(response => {
              if (response.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })
                this.getList()
              }
            })
          } else {
            this.operate = this.$t('analysisTask.delete')
            this.batchApi = 'deleteNewTaskInfo'
            this.batchDialogVisible = true
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    startButtonDisabled(row) {
      const { taskState } = row
      return taskState !== 5 && taskState !== 6 && taskState !== 7
    },
    stopButtonDisabled(row) {
      const { taskState } = row
      return taskState !== 1 && taskState !== 2
    },
    deleteButtonDisabled(row) {
      const { taskState } = row
      return taskState === 0 || taskState === 4
    }
  }
}
</script>

<style lang="scss" scoped>
#intelligentAnalysisTask {
  padding: 0 20px 20px;
  :deep(.advanced-query-form) {
    .el-select {
      width: 100%;
    }

    .el-date-editor--daterange.el-input__inner {
      width: 100%;
    }

    .advanced-query-form-btn {
      float: right;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    .form-item-flex {
      .el-form-item__content {
        display: flex;

        .el-select {
          width: 28%;
          .el-input__inner {
            border-radius: 6px 0 0 6px !important;
          }
          .el-input .el-input__wrapper {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
        }
        .newCameras {
          width: 72%;
          .el-input__wrapper {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          }
        }
        .el-input {
          .el-input__inner {
            border-radius: 0 6px 6px 0;
          }
        }
      }
    }
  }

  .task-name {
    color: #10a9ff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .operate-btn {
    font-size: 12px;
    height: initial;
    padding: 0;
    .svg-icon {
      font-size: 16px;
      transition: all 0.2s linear;
      color: #10a9ff;
      &:hover {
        scale: 1.2;
      }
    }
    &.is-disabled {
      .svg-icon {
        color: #a2a2a2;
      }
    }
  }
  .operate-btn + .operate-btn {
    margin-left: 20px;
  }
}
</style>
