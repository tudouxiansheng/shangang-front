<template>
  <div class="task-info-wrapper">
    <div class="top-filter-wrapper">
      <el-tabs v-model="filterForm.state" @tab-click="handleChangeStatus">
        <el-tab-pane :label="$t('public.all')" name="6"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.notStarted')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.execution')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.executed')" name="3"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.expired')" name="4"></el-tab-pane>
        <el-tab-pane :label="$t('patrol.undone')" name="5"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm">
        <el-form-item :label="$t('patrol.taskNum')">
          <el-input v-model="filterForm.taskNo" :placeholder="$t('patrol.taskNum')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('patrol.route')">
          <el-input v-model="filterForm.routeName" :placeholder="$t('patrol.route')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('patrol.patrolMan')">
          <el-input v-model="filterForm.userName" :placeholder="$t('patrol.patrolMan')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            v-model="filterForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :editable="false"
            :picker-options="pickerOptions"
            :clearable="false"
            :placeholder="$t('patrol.startTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.endTime')">
          <el-date-picker
            v-model="filterForm.endTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            :editable="false"
            :clearable="false"
            :placeholder="$t('patrol.endTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
          <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="task-content-wrapper">
      <CustomTable
        :data="tableData"
        :total="total"
        :listQuery="listQuery"
        :pager="true"
        stripe
        border
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <el-table-column
          :label="$t('patrol.order')"
          width="60"
          type="index"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ $index }">
            {{ listQuery.pageSize * (listQuery.pageNo - 1) + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" :label="$t('patrol.taskNum')"></el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"
          prop="routeName"
          :label="$t('patrol.route')"
        ></el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"
          prop="patrolPeopleName"
          :label="$t('patrol.patrolMan')"
        ></el-table-column>
        <el-table-column align="center" prop="startTime" :label="$t('patrol.startTime')"></el-table-column>
        <el-table-column align="center" prop="endTime" :label="$t('patrol.endTime')"></el-table-column>
        <el-table-column align="center" prop="state" :label="$t('patrol.taskStatus')">
          <template slot-scope="scope">
            <span :class="[handleFormatClass(scope.row.state)]">{{ handleFormatStatus(scope.row.state) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="actualStartTime" :label="$t('patrol.actualStartTime')"></el-table-column>
        <el-table-column align="center" prop="actualEndTime" :label="$t('patrol.actualEndTime')"></el-table-column>
        <el-table-column align="center" :label="$t('patrol.opt')">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">{{ $t('public.detail') }}</el-button>
          </template>
        </el-table-column>
      </CustomTable>
    </div>
    <TaskInfo :visible="infoDialogVisible" @close="handleCloseDialog" :info="detailRow" :data="patrolList"></TaskInfo>
  </div>
</template>

<script>
import CustomTable from '../../../../../components/CustomTable'
import TaskInfo from '../components/taskInfo'
import { getChildTaskList, getChildTaskInfo } from '../../../../../utils/api'
export default {
  name: 'patrol',
  components: {
    CustomTable,
    TaskInfo,
  },
  data() {
    return {
      infoDialogVisible: false,
      filterForm: {
        state: '6',
        id: '',
        patrolPeopleName: '',
        routeName: '',
        startTime: '',
        endTime: '',
      },
      detailRow: {},
      patrolList: [],
      tableData: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      pickerOptions: {
        // disabledDate(time) {
        //   //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
        //   return time.getTime() > Date.now()
        // },
      },
    }
  },
  created() {
    this.handleGetList()
  },
  destroyed() {},

  async mounted() {},
  methods: {
    handleCloseDialog() {
      this.infoDialogVisible = false
      this.detailRow = {}
      this.patrolList = []
    },
    handleFormatStatus(status) {
      const statusDict = {
        1: this.$t('patrol.notStarted'),
        2: this.$t('patrol.execution'),
        3: this.$t('patrol.executed'),
        4: this.$t('patrol.expired'),
        5: this.$t('patrol.undone'),
      }
      return statusDict[status]
    },
    handleFormatClass(status) {
      const statusDict = {
        1: "level4",
        2: "level3",
        3: "level2",
        4: "level1",
        5: "level1",
      }
      return statusDict[status]
    },
    handleChangeStatus() {
      this.listQuery.pageNo = 1
      this.handleGetList()
    },
    handleSearch() {
      this.listQuery.pageNo = 1
      this.handleGetList()
    },
    handleReset() {
      this.filterForm = {
        state: this.filterForm.state,
        id: '',
        patrolPeopleName: '',
        routeName: '',
        startTime: '',
        endTime: '',
      }
      this.listQuery.pageNo = 1
      this.handleGetList()
    },
    handleDetail(row) {
      console.log(row)
      let params = {
        id: row.id,
        taskIssuedId: row.taskIssuedId,
      }
      getChildTaskInfo(params).then((res) => {
        if (res.resultCode == 0) {
          this.detailRow = { ...res.patrolTaskChildInfo }
          this.patrolList = [...res.routeList]
          this.infoDialogVisible = true
        }
      })
    },
    handleGetList() {
      if (this.filterForm.startTime && !this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (!this.filterForm.startTime && this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (new Date(this.filterForm.startTime).getTime() > new Date(this.filterForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        },
        ...this.filterForm,
      }
      Object.keys(params).map((item) => {
        if (params[item] == '') {
          delete params[item]
        }
      })
      if (params.state == 6) {
        delete params.state
      }
      getChildTaskList(params).then((res) => {
        if (res.resultCode == 0) {
          this.tableData = res.patrolTaskChildInfoList
          this.total = res.pageInfo.totalNum
        }
      })
    },
    handlePageChange(pageNo) {
      this.listQuery.pageNo = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = size
      this.handleGetList()
    },
  },
}
</script>

<style scoped lang="scss">
.tree-img {
  width: 18px;
  height: 18px;
  position: absolute;
  right: 5px;
  top: 6px;
}
.level1 {
  color: #ff4d4f;
}
.level2 {
  color: #65bc4c;
}
.level3 {
  color: #ffa900;
}
.level4 {
  color: #00ccff;
}
.task-info-wrapper {
  background-color: transparent;
  box-sizing: border-box;
  width: 1700px;
  height: 100%;
  margin: 20px auto;
  position: relative;
  ::v-deep.el-tabs {
    .el-tabs__item {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      &.is-active {
        color: #409eff;
      }
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
  }
  .filter-wrapper {
    ::v-deep.el-form {
      .el-slider {
        width: 140px;
      }
    }
    .filter-m-s {
      width: 120px;
    }
  }
  .task-content-wrapper {
    width: 100%;
    height: calc(100% - 150px);
    clear: both;
  }
}
</style>
