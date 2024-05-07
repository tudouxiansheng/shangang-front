<template>
  <div class="video-quality-task">
    <el-form
      class="mt-8"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-position="left"
      :label-width="locale === 'en' ? '160px' : '120px'"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="19">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="7">
              <el-form-item :label="$t('videoQualityPatrol.taskName') + ':'" prop="name">
                <el-input
                  v-model="searchForm.name"
                  :placeholder="$t('videoQualityPatrol.taskNameProp')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="7">
              <el-form-item :label="$t('videoQualityPatrol.taskType') + '：'" prop="type">
                <el-select clearable v-model="searchForm.type">
                  <el-option
                    v-for="item in taskTypeData"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="7">
              <el-form-item :label="$t('videoQualityPatrol.taskStatus') + '：'" prop="status">
                <el-select clearable v-model="searchForm.status">
                  <el-option
                    v-for="item in taskStatusTypeData"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="5">
          <el-button class="float-right ml-5" v-hasPermi="[9001]" @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
          <el-button
            type="primary"
            class="float-right"
            v-hasPermi="[9001]"
            @click="getVideoQualityMainTaskPage"
          >
            {{ $t('public.search') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-button type="primary" v-hasPermi="[9002]" @click="creatTask">
        {{ $t('videoQualityPatrol.create') }}
      </el-button>
    </el-row>
    <el-table
      class="mt-5"
      border
      v-loading="loading"
      :data="tableData"
      max-height="550"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        :label="$t('videoQualityPatrol.taskName')"
        prop="taskName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.cameraCount')"
        prop="cameraCount"
        :width="locale === 'en' ? '200px' : undefined"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.taskType')"
        :formatter="taskTypeFormatter"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.total')"
        :width="locale === 'en' ? '270px' : undefined"
        prop="total"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.createTime')"
        prop="createTime"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.updateTime')"
        prop="updateTime"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('videoQualityPatrol.taskStatus')"
        width="150px"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span class="text-normal" v-if="row.taskStatus == 1 && row.taskType != 1">
            {{ taskStatusFormatter(row) }}
          </span>
          <span class="text-delete" v-else-if="row.taskStatus == 2 || row.taskStatus == 3">
            {{ taskStatusFormatter(row) }}
          </span>
          <span v-else>{{ taskStatusFormatter(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('videoQualityPatrol.checkStatus')"
        width="200px"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-if="row.checkStatus == 1" class="text-normal">
            {{ $t('videoQualityPatrol.checkStatusType1') }}
          </span>
          <span v-else>{{ $t('videoQualityPatrol.checkStatusType2') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('public.operating')" v-hasPermi="[9002]" width="250">
        <template #default="{ row }">
          <span class="mr-5 cursor-pointer text-detail" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
          <span
            v-show="
              row.checkStatus != 1 &&
              (row.taskStatus != 1 || (row.taskStatus == 1 && row.taskType == 1))
            "
            class="mr-5 cursor-pointer text-detail"
            @click="handleEdit(row)"
          >
            {{ $t('public.edit') }}
          </span>
          <span
            v-show="row.taskType == 1 && row.taskStatus == 1 && row.checkStatus != 1"
            class="mr-5 cursor-pointer text-normal"
            @click="handleExecute(row)"
          >
            {{ $t('videoQualityPatrol.execute') }}
          </span>
          <span
            v-show="row.taskType != 1 && row.taskStatus == 3 && row.checkStatus != 1"
            class="mr-5 cursor-pointer text-normal"
            @click="handleStartTask(row)"
          >
            {{ $t('videoQualityPatrol.startTask') }}
          </span>
          <span
            v-show="row.taskType != 1 && row.taskStatus == 1 && row.checkStatus != 1"
            class="mr-5 cursor-pointer text-delete"
            @click="handleStopTask(row)"
          >
            {{ $t('videoQualityPatrol.stopTask') }}
          </span>
          <span
            v-show="
              row.checkStatus != 1 &&
              (row.taskStatus != 1 || (row.taskStatus == 1 && row.taskType == 1))
            "
            class="cursor-pointer text-delete"
            @click="handleDelete(row)"
          >
            {{ $t('public.delete') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getVideoQualityMainTaskPage(false)"
    />
    <create-task />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import createTask from './components/create-task.vue'
export default {
  components: { createTask },
  data() {
    return {
      searchForm: {
        name: undefined,
        type: undefined,
        status: undefined,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      operation: true,
      dataForm: undefined,
      taskId: undefined,
      cameraInfos: [],
      weekOptions: [],
      hourOptions: [
        {
          label: '00',
          value: 0
        },
        {
          label: '01',
          value: 1
        },
        {
          label: '02',
          value: 2
        },
        {
          label: '03',
          value: 3
        },
        {
          label: '04',
          value: 4
        },
        {
          label: '05',
          value: 5
        },
        {
          label: '06',
          value: 6
        },
        {
          label: '07',
          value: 7
        },
        {
          label: '08',
          value: 8
        },
        {
          label: '09',
          value: 9
        },
        {
          label: '10',
          value: 10
        },
        {
          label: '11',
          value: 11
        },
        {
          label: '12',
          value: 12
        },
        {
          label: '13',
          value: 13
        },
        {
          label: '14',
          value: 14
        },
        {
          label: '15',
          value: 15
        },
        {
          label: '16',
          value: 16
        },
        {
          label: '17',
          value: 17
        },
        {
          label: '18',
          value: 18
        },
        {
          label: '19',
          value: 19
        },
        {
          label: '20',
          value: 20
        },
        {
          label: '21',
          value: 21
        },
        {
          label: '22',
          value: 22
        },
        {
          label: '23',
          value: 23
        }
      ],
      streamTypeList: [],
      maskloading: false, // 点击提交按钮后蒙版
      cuType: sessionStorage.getItem('cuType'),
      key: sessionStorage.getItem('key'),
      locale: sessionStorage.getItem('language')
    }
  },
  computed: {
    ...mapState({
      taskTypeData: state => state.dict.task_type,
      taskStatusTypeData: state => state.dict.task_status_type,
      clientNonce: state => state.auth.clientNonce,
      token: state => state.auth.accessToken,
    })
  },
  mounted() {
    this.setData()
    this.getVideoQualityMainTaskPage()
  },
  methods: {
    async getVideoQualityMainTaskPage(isSearch = true) {
      this.loading = true
      if (isSearch) {
        this.searchForm.pageInfo.pageNum = 1
      } else {
        this.$refs['searchForm'].resetFields()
      }
      let res = await this.$api.getVideoQualityMainTaskPage(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.qualityTaskList
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getVideoQualityMainTaskPage()
    },
    creatTask() {
      this.dataForm = {
        name: '',
        type: 1,
        week: 1,
        hour: 0,
        startDay: undefined,
        endDay: undefined
      }
      this.operation = true
      this.dialogFormVisible = true
    },
    handleDetail(row) {
      this.$router.push({
        name: 'VideoQualityTaskDetails',
        params: {
          id: row.taskId,
          name: row.taskName
        }
      })
    },
    setData() {
      this.typeOptions = [
        {
          name: this.$t('devOps.oneTime'),
          value: 1
        },
        {
          name: this.$t('devOps.everyDay'),
          value: 2
        },
        {
          name: this.$t('devOps.everyWeek'),
          value: 3
        }
      ]
      this.weekOptions = [
        {
          label: this.$t('videoRecord.monday'),
          value: 2
        },
        {
          label: this.$t('videoRecord.tuesday'),
          value: 3
        },
        {
          label: this.$t('videoRecord.wednesday'),
          value: 4
        },
        {
          label: this.$t('videoRecord.thursday'),
          value: 5
        },
        {
          label: this.$t('videoRecord.friday'),
          value: 6
        },
        {
          label: this.$t('videoRecord.saturday'),
          value: 7
        },
        {
          label: this.$t('videoRecord.sunday'),
          value: 1
        }
      ]
      this.streamTypeList = [
        {
          name: this.$t('videoQualityPatrol.streamType1'),
          value: 1
        },
        {
          name: this.$t('videoQualityPatrol.streamType2'),
          value: 2
        },
        {
          name: this.$t('videoQualityPatrol.streamType3'),
          value: 3
        }
      ]
    },
    async handleEdit(row) {
      this.taskId = row.taskId
      await this.getVideoQualityMainTaskDetail(row.taskId)
      await this.getVideoQualityMainTaskCameraList(row.taskId)
      this.operation = false
      this.dialogFormVisible = true
    },
    async getVideoQualityMainTaskDetail(taskId) {
      let res = await this.$api.getVideoQualityMainTaskDetail({ taskId })
      if (res.resultCode == 0) {
        this.dataForm = {
          name: res.taskName,
          type: res.taskType,
          week: res.week,
          hour: res.hour,
          startDay: res.startDay,
          endDay: res.endDay
        }
      }
    },
    async getVideoQualityMainTaskCameraList(taskId) {
      let res = await this.$api.getVideoQualityMainTaskCameraList({
        taskId
      })
      if (res.resultCode == 0) {
        this.cameraInfos = res.cameras
      }
    },
    // 搜索！
    handleFind() {
      this.searchForm.pageInfo.pageNum = 1
      this.getVideoQualityMainTaskPage()
    },
    async handleExecute(row) {
      let res = await this.$api.startUpVideoQualityMainTask({
        taskId: row.taskId
      })
      if (res.resultCode == 0) {
        this.$message.success(this.$t('videoQualityPatrol.taskExecuteSuccess'))
        this.getVideoQualityMainTaskPage()
      }
    },
    async handleStartTask(row) {
      let res = await this.$api.recoveryVideoQualityMainTask({
        taskId: row.taskId
      })
      if (res.resultCode == 0) {
        this.$message.success(this.$t('videoQualityPatrol.taskStartSuccess'))
        this.getVideoQualityMainTaskPage()
      }
    },
    async handleStopTask(row) {
      let res = await this.$api.stopVideoQualityMainTask({
        taskId: row.taskId
      })
      if (res.resultCode == 0) {
        this.$message.success(this.$t('videoQualityPatrol.taskStopSuccess'))
        this.getVideoQualityMainTaskPage()
      }
    },
    handleDelete(row) {
      this.$confirm(this.$t('videoQualityPatrol.deleteWarn'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api
            .deleteVideoQualityMainTask({
              taskId: row.taskId
            })
            .then(res => {
              if (res.resultCode == 0) {
                this.$message.success(this.$t('videoQualityPatrol.taskDeleteSuccess'))
                this.getVideoQualityMainTaskPage()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    taskTypeFormatter(row) {
      return this.selectDictLabel(this.taskTypeData, row.taskType)
    },
    taskStatusFormatter(row) {
      if (row.taskType == 1) {
        return '——'
      } else {
        return this.selectDictLabel(this.taskStatusTypeData, row.taskStatus)
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss">
.video-quality-task {
}
</style>
