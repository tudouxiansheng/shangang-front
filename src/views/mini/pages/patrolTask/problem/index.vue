<template>
  <div class="alarm-info-wrapper">
    <div class="top-filter-wrapper">
      <el-tabs v-model="filterForm.state" @tab-click="handleChangeStatus">
        <el-tab-pane :label="$t('home.noHandle')" name="0"></el-tab-pane>
        <el-tab-pane :label="$t('home.handled')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('public.all')" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm">
        <el-form-item :label="$t('patrol.point')">
          <el-input v-model="filterForm.pointName" :placeholder="$t('patrol.point')"></el-input>
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
            :placeholder="$t('public.startTime')"
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
            :placeholder="$t('public.endTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
          <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="alarm-content-wrapper">
      <CardList
        :data="tableData"
        :columns="4"
        :page-sizes="[16,32,48,80,100]"
        :total="total"
        :pageNo="listQuery.pageNo"
        :pageSize="listQuery.pageSize"
        :pager="true"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template slot-scope="{ item }">
          <div class="alarm-item">
            <div class="alarm-title" v-if="false">
              <div class="left">
                <!--                <div class="alarm-type" :title="item.pointName">{{ item.pointName }}</div>-->
              </div>
              <div class="handle-status" :class="item.normal == 1 ? 'red' : ''">
                {{ item.normal == 1 ? $t('patrol.unusual') : $t('patrol.normal') }}
              </div>
            </div>
            <div class="alarm-content">
              <div class="alarm-img" v-if="item.fileList && item.fileList.length">
                <img v-viewer :src="item.fileList[0].fileUrl" alt="" />
              </div>
              <div class="alarm-detail" @click.stop="handleDetail(item)">
                <div class="alarm-detail-item">
                  <div class="item-label">{{ $t('patrol.point') }}</div>
                  <div class="item-value">
                    {{ item.pointName }}
                  </div>
                </div>
                <div class="alarm-detail-item">
                  <div class="item-label">{{ $t('patrol.route') }}</div>
                  <div class="item-value" :title="item.routeName">{{ item.routeName }}</div>
                </div>
                <div class="alarm-detail-item">
                  <div class="item-label">{{ $t('patrol.patrolMan') }}</div>
                  <div class="item-value" :title="item.userName">{{ item.userName }}</div>
                </div>
                <div class="alarm-detail-item">
                  <div class="item-label">{{ $t('patrol.PunchTime') }}</div>
                  <div class="item-value" :title="item.reportTime">{{ item.reportTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <patrolDetail
      :visible="detailVisible"
      @handleRight="handleRight"
      :info="detailRow"
      @close="handleCloseDialog"
    ></patrolDetail>
  </div>
</template>

<script>
import CardList from '../../../../../components/CardList'
import patrolDetail from '../components/patrolDetail'
import { getPatrolReportInfo, getPatrolReportList } from '../../../../../utils/api'
export default {
  name: 'patrol',
  components: {
    CardList,
    patrolDetail,
  },
  data() {
    return {
      detailVisible: false,
      detailRow: {},
      filterForm: {
        state: '0',
        pointName: '',
        userName: '',
        routeName: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 16,
      },
      pickerOptions: {
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() > Date.now()
        },
      },
    }
  },
  created() {
    this.handleGetList()
  },
  async mounted() {},
  methods: {
    handleCloseDialog() {
      this.detailVisible = false
      this.detailRow = {}
    },
    handleRight() {
      this.handleCloseDialog()
      this.handleGetList()
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
      this.listQuery.pageNo = 1
      this.filterForm = {
        state: this.filterForm.state,
        pointName: '',
        userName: '',
        routeName: '',
        startTime: '',
        endTime: '',
      }
      this.handleGetList()
    },
    handleDetail(item) {
      let params = {
        pointRecordId: item.id,
      }

      getPatrolReportInfo(params).then((res) => {
        console.log(res)
        if (res.resultCode == 0) {
          this.detailRow = { id: item.id, state: item.state, ...res }
          this.detailVisible = true
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
      if (params.state == 2) {
        delete params.state
      }
      getPatrolReportList(params).then((res) => {
        if (res.resultCode == 0) {
          this.tableData = res.pointReportList
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
  color: #ff4e00;
}
.level3 {
  color: #ffa900;
}
.level4 {
  color: #00ccff;
}
.alarm-item {
  font-size: 14px;
  background-color: #173252;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 5px;
  color: #fff;
  .alarm-title {
    display: flex;
    margin-bottom: 15px;
    font-size: 14px;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .alarm-icon {
        width: 16px;
        height: 14px;
        color: #ff4d4f;
        .icon {
          background-color: transparent;
          font-size: 14px;
        }
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .alarm-type {
        flex: 1;
        margin-left: 5px;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
    }

    .handle-status {
      color: #17cd57;
      font-size: 12px;
      white-space: nowrap;
      &.red {
        color: #ff4d4f;
      }
    }
  }
  .alarm-content {
    display: flex;
    .alarm-img {
      width: 90px;
      height: 80px;
      background-color: #ccc;
      align-self: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .similarity {
      color: #1efffc;
    }
    .alarm-img-person {
      width: 90px;
      height: 80px;
      display: flex;
      flex-direction: column;
      .person-img {
        display: flex;
        height: 45px;
        justify-content: space-between;
        img {
          width: 45%;
          height: 90%;
        }
      }
      .alarm-detail-item {
        display: flex;
        color: #ddd;
        margin-bottom: 5px;
        font-size: 12px;
        .item-label {
          margin-right: 5px;
          color: #ccc;
          white-space: nowrap;
          &:after {
            content: ':';
          }
        }
        .item-value {
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
    }
    .alarm-detail {
      margin-left: 10px;
      flex: 1;
      overflow: hidden;
      font-size: 12px;
      cursor: pointer;
      .alarm-detail-item {
        display: flex;
        color: #ddd;
        margin-bottom: 5px;
        .item-label {
          margin-right: 5px;
          color: #ccc;
          white-space: nowrap;
          &:after {
            content: ':';
          }
        }
        .item-value {
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
    }
  }
}
.alarm-info-wrapper {
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
      .el-form-item__label {
      }
      .el-slider {
        width: 140px;
      }
    }
    .filter-m-s {
      width: 120px;
    }
  }
  .alarm-content-wrapper {
    width: 100%;
    height: calc(100% - 130px);
    clear: both;
  }
}
</style>
