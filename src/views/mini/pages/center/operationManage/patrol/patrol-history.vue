<template>
  <div class="p-5">
    <el-page-header @back="goBack" :content="$t('operateManage.patrol')" />
    <el-form
      class="mt-5 border-b"
      :model="searchForm"
      ref="searchForm"
      :inline="true"
      label-width="80px"
      label-position="left"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('operateManage.groupName') + ':'" prop="groupName">
            <el-input
              v-model="searchForm.groupName"
              clearable
              :placeholder="$t('operateManage.pleaseInputGroupName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('operateManage.startTime') + ':'" prop="time">
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="time"
              type="datetimerange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" @click="getTaskList">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      class="mt-5"
      border
      v-loading="loading"
      :data="tableData"
      max-height="490"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        :label="$t('operateManage.groupName')"
        prop="groupName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('public.workState')"
        prop="status"
        :formatter="taskStatusFormatter"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('operateManage.executor')"
        prop="createUserName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('operateManage.startTime')"
        prop="createTime"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('operateManage.taskEndTime')"
        prop="updateTime"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('public.operating')">
        <template #default="{ row }">
          <span class="cursor-pointer text-detail" @click="handleDetail(row)">
            {{ $t('public.particulars') }}
          </span>
          <span class="ml-5 cursor-pointer text-detail" @click="handleDownload(row)">
            {{ $t('operateManage.down') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0 && !loading"
      :total="total"
      v-model:pageNum="searchForm.pageInfo.pageNum"
      v-model:limit="searchForm.pageInfo.pageSize"
      @pagination="getTaskList"
    />
  </div>
</template>

<script>
import { download } from '@/utils/common/download'
import { mapState } from 'vuex'
export default {
  name: 'PatrolHistory',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      searchForm: {
        groupName: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      time: [],
      loading: false,
      total: 0,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      taskStatusData: state => state.dict.task_status
    })
  },
  created() {
    this.getTaskList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async getTaskList() {
      this.loading = true
      if (this.time == null) {
        this.searchForm.beginTime = undefined
        this.searchForm.endTime = undefined
      } else {
        this.searchForm.beginTime = this.time[0]
        this.searchForm.endTime = this.time[1]
      }

      let res = await this.$api.getTaskList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.tableData = res.taskList
      }
    },
    handleReset() {
      this.time = []
      this.searchForm.beginTime = ''
      this.searchForm.endTime = ''
      this.$refs['searchForm'].resetFields()
      this.getTaskList()
    },
    handleDetail(row) {
      this.$router.push({
        name: 'PatrolDetail',
        params: {
          id: row.taskId,
          items: row.items.join('-')
        }
      })
    },
    async handleDownload(row) {
      let res = await this.$api.exportMajorResult({
        taskId: row.taskId,
        netType: this.$getNetType()
      })
      if (res.resultCode == 0) {
        res.fileUrl && download(res.fileUrl, this.$t('operateManage.status'))
      }
    },
    taskStatusFormatter(row) {
      return this.selectDictLabel(this.taskStatusData, row.status)
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-page-header__content) {
  color: #fff;
}
</style>
