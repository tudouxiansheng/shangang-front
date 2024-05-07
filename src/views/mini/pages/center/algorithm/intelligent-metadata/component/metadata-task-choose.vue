<template>
  <div id="metadataTaskChoose" v-if="isRouterAlive" ref="metadataTaskChoose">
    <!-- 智能分析任务 -->
    <el-dialog
      :title="$t('metadata.selectTask1')"
      v-model="$parent.metadataTaskVisible"
      top="10vh"
      width="1200px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-row>
        <el-col :span="24" style="padding: 0px">
          <div style="position: relative; min-height: 38px" class="btnMargin">
            <!-- 查询和其他操作 -->
            <div class="filter-container" style="position: absolute; top: 0px; right: -8px">
              <el-form
                :inline="true"
                class="demo-form-inline"
                label-width="100px"
                ref="form"
                :model="searchForm"
                label-position="left"
                style="display: flex"
              >
                <el-form-item prop="adminLName">
                  <el-input
                    v-model="searchForm.taskName"
                    auto-complete="off"
                    :placeholder="$t('analysisTask.inputSearchTask')"
                    clearable
                    class="inputMiddle"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleFind" class="miniBtn">
                    {{ $t('public.search') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div
            style="max-height: 421px"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            
          >
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
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
              :max-height="tableHeight"
              border
            >
              <template #empty>
                <span>{{ dataText }}</span>
              </template>
              <el-table-column label width="50" type="selection" />

              <el-table-column
                :label="$t('workOrder.ticketName')"
                min-width="60"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span>{{ row.taskName }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('analysisTask.algoName')"
                min-width="90"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      {{ row.algorithms[0].algorithmName }}
                      <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in row.algorithms" :key="index">
                          {{ item.algorithmName }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.workState')" min-width="70" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="setTaskStateClass(row.taskState)">
                    {{ setTaskState(row.taskState) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('analysisTask.taskRemark')" show-overflow-tooltip>
                <template #default="{ row }">
                  <span>{{ row.stateDesc }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('public.createTime')"
                show-overflow-tooltip
                min-width="100"
              >
                <template #default="{ row }">
                  <span>{{ row.createTime }}</span>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('public.updateTime')"
                show-overflow-tooltip
                min-width="100"
              >
                <template #default="{ row }">
                  <span>{{ row.updateTime }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.operating')" width="60">
                <template #default="{ row }">
                  <span class="cell-operate" @click="handleInfo(row)">
                    {{ $t('public.particulars') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>

            <!--分页-->
            <div class="pagination" v-if="!loading && tableData.length">
              <div class="paging">
                <span>{{ $t('public.everyPageShows') }}</span>
                <el-select v-model="number" @change="numberChange">
                  <el-option
                    v-for="(item, index) in numberList"
                    :key="index"
                    :label="item"
                    :value="index"
                  ></el-option>
                </el-select>
                <span>{{ $t('public.records') }}</span>
              </div>
              <div>
                <el-pagination
                  v-model:current-page="pageNum"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="totalNum"
                  @current-change="handleCurrentChange"
                  background
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <task-detail v-model:visible="taskDetailVisible" :data="taskDetailData" />
  </div>
</template>

<script>
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import TaskDetail from '../../intelligent-task/component/taskDetail'
import { mapState } from 'vuex'

export default {
  components: {
    TaskDetail,
    ElIconArrowDown
  },
  data() {
    return {
      batchBtnShow: true,

      isRouterAlive: true,
      timeSpanList: [],
      algorithmList: [], //算法列表
      showDeviceTools: true,
      maskloading: false, // 点击提交按钮后蒙版

      sourceTypeList: [],
      taskTypeList: [],
      //jquery
      locale: localStorage.getItem('locale'),
      planType: 0,

      // 条件搜索
      searchForm: {
        taskName: ''
      },

      multipleSelection: [], //表格选中状态存放数组

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      operation: 1, // true:添加, false:修改
      dialogFormVisible: false, // 添加或者修改

      // 添加修改框表单
      dataForm: {
        taskName: '',
        algorithmId: '',
        remark: '',
        sourceType: '',
        streamType: 1,
        recordStartTime: '',
        recordEndTime: '',
        contentName: '',
        content: '',
        analyzeMode: 1
      },

      //新增算法仓
      dialogFormVisible_info: false,
      algorithms: [],
      tableDataTather: [],
      rowIndexList: [],
      ifCanSetPresetFather: false,
      presetArrFather: [],

      //5.7.6
      tableHeight: 401,

      taskDetailVisible: false,
      taskDetailData: {}
    }
  },
  computed: {
    ...mapState({
      analysisTaskStatus: state => state.dict['analysis_task_status'] // 智能分析任务状态
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setData()
      this.locale = localStorage.getItem('locale')
    }
  },
  mounted() {
    this.setData()
    this.getList()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    setData() {
      this.sourceTypeList = [
        {
          name: this.$t('analysisTask.camera'),
          value: 1
        },
        {
          name: this.$t('analysisTask.rtmp'),
          value: 2
        }
      ]
    },
    setTaskState(val) {
      return this.selectDictLabel(this.analysisTaskStatus, val, {
        key: 'name',
        value: 'code'
      })
    },
    setTaskStateClass(val) {
      if (val == 2) {
        return 'success'
      } else if (val == 6) {
        return 'danger'
      }
    },
    setTaskType(val) {
      if (val) {
        this.taskTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },

    //获取随机数rowIndex
    getRowIndex() {
      let charactors = 'abcdefghijklmnopqrstuvwxyz1234567890'
      let value = '',
        index
      for (let j = 1; j <= 20; j++) {
        index = parseInt(charactors.length * Math.random())
        value = value + charactors.charAt(index)
      }
      let i
      for (i = 0; i < this.rowIndexList.length; i++) {
        if (this.rowIndexList[i] == value) {
          this.getRowIndex()
          break
        }
      }
      if (i == this.rowIndexList.length) {
        this.rowIndexList.push(value)
        return value
      }
    },

    async dialogOpen() {},
    dialogClosed() {
      this.$parent.metadataTaskVisible = false
    },

    getList() {
      this.dataText = ''
      this.loading = true
      let obj = {}
      obj.pageInfo = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskOwner: 0
      }
      obj.taskName = this.searchForm.taskName
      this.$api.getNewTaskList(obj).then(res => {
        if (res.taskList && res.taskList.length) {
          this.tableData = res.taskList
          this.totalNum = res.pageInfo.totalNum
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.taskTypeList.length; j++) {
              if (this.tableData[i].taskType == this.taskTypeList[j].value) {
                this.tableData[i].taskType = this.taskTypeList[j].name
              }
            }

            for (let j = 0; j < this.analysisTaskStatus.length; j++) {
              if (this.tableData[i].state == this.analysisTaskStatus[j].code) {
                this.tableData[i].state = this.analysisTaskStatus[j].name
              }
            }
          }
          this.$nextTick(() => {
            if (this.$refs.multipleTable) {
              this.$refs.multipleTable?.setScrollTop(0);
            }
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getList()
    },

    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.batchBtnShow = val.length ? false : true
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      }
    },
    //详情
    async handleInfo(row) {
      let res = await this.$api.getNewTaskInfo({ taskId: row.taskId })
      if (res.resultCode !== 0) return
      res.periodList.forEach(element => {
        element.startTime = element.startTime + ':00'
        element.endTime = element.endTime + ':00'
      })
      this.taskDetailData = res
      this.taskDetailVisible = true
    },

    submitForm() {
      this.$emit('getChoosedTask', this.multipleSelection[0])
      this.$parent.metadataTaskVisible = false
    },

    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getList()
    },

    // 分页输入跳转页数
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    }
  }
}
</script>

<style lang="scss">
#metadataTaskChoose {
  .el-table {
    .el-dropdown {
      cursor: pointer;
    }
  }

  .el-dialog__body {
    padding: 0px 20px 20px;
  }
}
</style>
