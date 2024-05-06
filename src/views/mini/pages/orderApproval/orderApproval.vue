<template>
  <!-- 工单审核界面 -->
  <div class="orderApproval">
    <el-tabs v-model="workStatus" @tab-click="handleChangeStatus">
      <el-tab-pane :label="$t('work.pending')" :key="1" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('work.processed')" :key="2" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('work.audit')" :key="3" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('work.completed')" name="3" :key="4"></el-tab-pane>
      <el-tab-pane :key="5" :label="$t('public.all')" name="99"></el-tab-pane>
    </el-tabs>
    <div class="admissionRecord">
      <div class="filter-wrapper">
        <el-form :inline="true" :model="filterForm">
          <!--          <el-form-item v-if="workStatus == '1'" :label="$t('alarm.handler')">-->
          <!--            <el-input-->
          <!--              @clear="search"-->
          <!--              v-model="filterForm.handler"-->
          <!--              :placeholder="$t('public.placeholderEnter', { type: $t('alarm.handler') })"-->
          <!--              style="width: 208px; margin-left: 5px"-->
          <!--              clearable-->
          <!--            ></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('alarm.workOrderName')">
            <el-input
              v-model="filterForm.workSheetName"
              :placeholder="$t('public.placeholderEnter', { type: $t('alarm.workOrderName') })"
              style="width: 208px; margin-left: 5px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('alarm.workOrderLevel')">
            <el-select
              v-model="filterForm.workSheetLevel"
              :placeholder="$t('public.placeholderSelect', { type: $t('alarm.workOrderName') })"
              class="filter-m-s"
            >
              <el-option :label="$t('public.all')" value=""></el-option>
              <el-option
                v-for="item in degreeOfUrgency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('public.createTime')">
            <el-date-picker
              v-model="filterForm.startTime"
              type="datetime"
              :placeholder="$t('public.placeholderSelect', { type: $t('public.createTime') })"
              style="width: 208px; margin-left: 5px"
              default-time="00:00:00"
              @change="changeStartTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('public.endTime')">
            <el-date-picker
              v-model="filterForm.endTime"
              type="datetime"
              default-time="23:59:59"
              :placeholder="$t('public.placeholderSelect', { type: $t('public.endTime') })"
              style="width: 208px; margin-left: 5px"
              @change="changeEndTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('public.search') }}</el-button>
            <el-button type="default" @click="resetForm">{{ $t('public.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="approval-table">
        <CardList
          :data="workSheetInfoList"
          :columns="4"
          :total="total"
          :page-no="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[16, 32, 48, 80, 100]"
          :pager="true"
          @page-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
          <template slot-scope="{ item }">
            <div class="alarm-item">
              <div class="alarm-title">
                <div class="left">
                  <div class="alarm-icon">
                    <img src="./images/work.png" alt="" />
                    <!--                  <i class="el-icon-warning"></i>-->
                  </div>
                  <div class="alarm-type" :title="item.workSheetName">{{ item.workSheetName }}</div>
                </div>
                <div class="handle-status" :class="item.state != 3 ? 'red' : ''">
                  {{ item.state | formatStatus(that) }}
                </div>
              </div>
              <div class="alarm-content">
                <div class="alarm-detail" @click.stop="handleDetail(item)">
                  <div class="alarm-detail-item">
                    <div class="item-label">{{ $t('alarm.workOrderLevel') }}</div>
                    <div class="item-value">{{ item.workSheetLevel | formatLevel(that) }}</div>
                  </div>
                  <div class="alarm-detail-item">
                    <div class="item-label">{{ $t('work.desc') }}</div>
                    <div class="desc" :title="item.description">{{ item.description }}</div>
                  </div>
                  <div class="alarm-detail-item">
                    <div class="item-label">{{ $t('public.createTime') }}</div>
                    <div class="item-value" :title="item.createTime">{{ item.createTime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </CardList>
      </div>
      <!--详情-->
      <workDetail :visible="workDetailVisible" :info="workDetail" @close="handleCloseDetail"></workDetail>
    </div>
  </div>
</template>

<script>
import { deleteWorkSheet, getWorkList, deleteChildSheet, viewWorkSheet } from '../../../../utils/api'
import workDetail from './components/workDetail'
import Dayjs from '../../../../utils/Dayjs'
import CardList from '../../../../components/CardList'
import { permissions } from '../../../../utils/permissions'
export default {
  name: 'workList',
  components: { CardList, workDetail },
  data() {
    return {
      total: 0,
      workStatus: '99',
      that: this,
      workDetail: {},
      workDetailVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 16,
      },
      filterForm: {
        state: '99',
        workSheetName: '', //工单名称
        startTime: '',
        endTime: '',
        workSheetLevel: '', //紧急程度
      },
      workSheetInfoList: [],
      degreeOfUrgency: [
        {
          value: 1,
          label: this.$t('home.level1'),
        },
        {
          value: 2,
          label: this.$t('home.level2'),
        },
        {
          value: 3,
          label: this.$t('home.level3'),
        },
        {
          value: 4,
          label: this.$t('home.level4'),
        },
      ], //紧急程度

      workSheetTypeList: [
        {
          label: this.$t('work.patrol'),
          value: 0,
        },
        {
          label: this.$t('work.alarm'),
          value: 1,
        },
      ],
      workSheetState: [
        {
          value: 0,
          label: this.$t('work.pending'),
        },
        {
          value: 1,
          label: this.$t('work.processed'),
        },
        {
          value: 2,
          label: this.$t('work.audit'),
        },
        {
          value: 3,
          label: this.$t('work.completed'),
        },
      ],
      //权限判断
      isAudit: true, //审核权限
      isIssued: true, //派发权限
      isProcess: true, //处理权限
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  created() {
    this.getPermissions()
  },
  mounted() {},
  filters: {
    formatStatus(val, that) {
      let temp = that.workSheetState.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
    formatLevel(val, that) {
      let temp = that.degreeOfUrgency.filter((item) => item.value == val)
      if (temp && temp.length) {
        return temp[0].label
      }
      return that.$t('public.unknown')
    },
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.isAudit = await permissions(872) //审核权限
      this.isIssued = await permissions(870) //派发权限
      this.isProcess = await permissions(871) //处理权限
      if (this.isIssued) {
        this.workStatus = '0'
        this.handleGetList()
      } else if ((this.isProcess && !this.isIssued) || (this.isProcess && !this.isAudit)) {
        this.workStatus = '1'
        this.$set(this.filterForm, 'handlerId', sessionStorage.getItem('userId'))
        this.handleGetList()
      } else if ((this.isAudit && !this.isIssued) || (this.isAudit && !this.isProcess)) {
        this.workStatus = '2'
        this.handleGetList()
      } else {
        this.workStatus = '99'
        this.$set(this.filterForm, 'handlerId', '')
        this.handleGetList()
      }
    },
    handleChangeStatus() {
      if (this.workStatus == '1') {
        this.$set(this.filterForm, 'handlerId', sessionStorage.getItem('userId'))
      } else {
        this.$set(this.filterForm, 'handlerId', '')
      }
      // console.log(this.workStatus)
      this.handleGetList()
    },
    handleCloseDetail(type) {
      this.workDetailVisible = false
      this.workDetail = {}
      if (type) {
        this.handleGetList()
      }
    },
    handleDetail(item) {
      let params = {
        workSheetId: item.id,
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      viewWorkSheet(params)
        .then((res) => {
          loading.close()
          this.workDetailVisible = true
          this.workDetail = { ...res.workSheetInfo }
          console.log(res)
        })
        .catch(() => {
          loading.close()
        })
    },
    //删除工单
    orderDelete(row, child) {
      if (typeof child == 'object') {
        deleteWorkSheet({ workSheetIdList: [row.workSheetId] }).then((res) => {
          if (res.resultCode == 0) {
            this.$message.success('删除成功')
            this.handleGetList()
          }
        })
      } else {
        deleteChildSheet({ childWorkSheetId: row.workSheetId }).then((res) => {
          if (res.resultCode == 0) {
            this.$message.success('删除子工单成功')
            this.handleGetList()
          }
        })
      }
    },

    // 改变开始时间
    changeStartTime(val) {
      if (val === null) {
        this.filterForm.startTime = ''
      } else {
        this.filterForm.startTime = Dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 改变结束时间
    changeEndTime(val) {
      if (val === null) {
        this.filterForm.endTime = ''
      } else {
        this.filterForm.endTime = Dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 查询
    search() {
      this.listQuery.pageNum = 1
      this.handleGetList()
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.handleGetList()
    }, // 分页
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.handleGetList()
    },
    // 重置
    resetForm() {
      this.filterForm = {
        workSheetName: '',
        workSheetLevel: '',
        startTime: '',
        endTime: '',
        state: '99',
      }
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 16

      this.handleGetList()
    },
    //获取工单列表
    handleGetList() {
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
        },
        ...this.filterForm,
        state: this.workStatus,
      }
      if (
        this.filterForm.startTime &&
        this.filterForm.endTime &&
        new Date(this.filterForm.startTime).getTime() > new Date(this.filterForm.endTime).getTime()
      ) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }

      switch (params.state) {
        case '0':
          params.state = [0]
          break
        case '1':
          params.state = [1]
          break
        case '2':
          params.state = [2]
          break
        case '3':
          params.state = [3]
          break
        case '99':
          params.state = [0, 1, 2, 3]
          // if (this.isAudit) {
          //   //审核权限
          //   params.state = [2, 3]
          // } else if (this.isIssued) {
          //   //派发权限
          //   params.state = [0, 3]
          // } else if (this.isProcess) {
          //   //处理权限
          //   params.state = [1, 3]
          // } else {
          //   params.state = [3]
          // }
          break
      }
      Object.keys(params).map((key) => {
        if (params[key] === '') {
          delete params[key]
        }
      })
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      getWorkList(params)
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            this.workSheetInfoList = res.workSheetInfoList
            this.total = res.pageInfo.totalNum
          }
        })
        .catch(() => {
          loading.close()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
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
      flex: 1;
      .alarm-icon {
        width: 16px;
        height: 14px;
        margin-right: 8px;
        color: #ff4d4f;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .alarm-type {
        margin-left: 5px;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
        flex: 1;
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
    height: 98px;
    .alarm-detail {
      flex: 1;
      overflow: hidden;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .alarm-detail-item {
        display: flex;
        color: #ddd;
        margin-bottom: 5px;
        .item-label {
          margin-right: 5px;
          color: #ccc;
          white-space: nowrap;
          &:after {
            content: '：';
          }
        }
        .item-value {
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
        .desc {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
.filter-m-s {
  width: 120px;
}
.work-sheet-name {
  //width: 500px;
  //overflow: hidden;
  //white-space: nowrap;
  ///*文字超出宽度则显示ellipsis省略号*/
  //text-overflow: ellipsis;
}
.orderApproval {
  width: 1780px;
  margin: 20px auto 0;
  height: 100%;
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
  // ::v-deep.el-dialog {
  //   background: url('./images/800.png') no-repeat;
  //   background-size: 100% 100%;
  //   padding: 35px 15px 30px 15px;
  //   box-sizing: border-box;
  //   .el-dialog__title {
  //     color: #fff;
  //   }
  // }
  .is-center {
    text-align: center !important;
  }
  .admissionRecord {
    width: 100%;
    height: 100%;
    background: #051b2c;
    //padding: 20px 30px 0 30px;
    box-sizing: border-box;
    overflow: hidden;
    .approval-table {
      width: 100%;
      height: calc(100% - 130px);
    }

    input::-webkit-input-placeholder {
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: transparent;
      border: 1px solid #0085d0;
      color: #0085d0;
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      background-color: transparent;
      border: 1px solid #aaaaaa;
      color: #e6e6e6;
    }
    .el-checkbox__inner {
      background: transparent;
    }

    .el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
      border-color: #156c9e;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #156c9e;
    }

    .el-table th,
    .el-table tr {
      background: transparent;
    }
    table {
      border-collapse: collapse !important;
      border-bottom: 1px solid #156c9e !important;
    }
    .el-collapse {
      border: none;
    }
    .el-collapse-item__header {
      background: transparent;
      color: #fff;
      font-size: 20px;
      border: none;
    }
    .el-collapse-item__wrap {
      background: transparent;
      border: none;
    }
    .el-collapse-item__content {
      color: #fff;
    }
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #4d4d4d;
      border: none;
      color: #fff;
    }
    .chooseListOrderApproval {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .btnsss {
        position: absolute;
        top: 10px;
        right: 0;
        margin: 0;
      }
      .el-input__inner {
        background: #404040;
        border: #404040;
      }
      li {
        margin: 10px 100px 20px 0;
      }
    }
  }
}
</style>
