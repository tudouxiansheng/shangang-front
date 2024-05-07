<template>
  <!-- 订阅详情 -->
  <div id="subscription-list">
    <!-- 返回区 -->
    <div style="display: inline-block">
      <div class="goBack" @click="goBack">
        <el-icon><el-icon-arrow-left /></el-icon>
        <span>{{ $t('platformManagement.subscriptionDetails') }}</span>
      </div>
    </div>
    <div style="padding: 20px">
      <div>
        <!-- 查询和其他操作 -->
        <div class="btnMargin">
          <el-button
            type="primary"
            @click="handleAdd"
            v-if="$parent.PermissionManage && $parent.choosedType == 2"
          >
            <span>{{ $t('platformManagement.addSubscription') }}</span>
          </el-button>
          <el-button
            type="primary"
            @click="handleAdd"
            v-if="$parent.PermissionManage && $parent.choosedType == 1 && $parent.choosedForcePush"
          >
            <span>{{ $t('platformManagement.manualOrdering') }}</span>
          </el-button>
          <el-button
            type="danger"
            :disabled="delShow"
            @click="cancel"
            v-if="$parent.PermissionManage && $parent.choosedType == 2"
          >
            <span>{{ $t('public.batchCancel') }}</span>
          </el-button>
          <el-button
            type="danger"
            :disabled="Boolean(!multipleSelection.length)"
            @click="del"
            v-if="$parent.PermissionManage && $parent.choosedType == 1 && $parent.choosedForcePush"
          >
            <span>{{ $t('public.batchDeletion') }}</span>
          </el-button>
        </div>

        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '220px' : '95px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('platformManagement.subscriptionTitle') + ':'">
                <el-input
                  v-model="searchForm.title"
                  :placeholder="$t('platformManagement.inputSubscriptionTitle')"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('platformManagement.subscriptionCategory') + ':'">
                <el-select
                  v-model="searchForm.subscribeDetail"
                  clearable
                  :placeholder="$t('platformManagement.selectSubscriptionCategory')"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="(item, index) in subscribeDetailList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('platformManagement.executionStatus') + ':'">
                <el-select
                  v-model="searchForm.subscribeStatus"
                  clearable
                  :placeholder="$t('platformManagement.selectExecutionStatus')"
                >
                  <el-option
                    v-for="(item, index) in subStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" style="display: inline-block" @click="handleFind">
                {{ $t('public.search') }}
              </el-button>
              <el-button @click="handleRest">{{ $t('public.reset') }}</el-button>
            </div>
          </el-form>
        </div>

        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <!-- 表格 -->
          <el-table
            :max-height="tableHeight"
            v-if="!loading && tableData.length"
            :row-class-name="$parent.tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
            @row-contextmenu="rowContextmenu"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('platformManagement.subscriptionIdentifier')"
              prop="subscribeId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('platformManagement.subscriptionTitle')"
              prop="title"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('platformManagement.subscriptionCategory')"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.subscribeDetail_zh }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('platformManagement.startDate')"
              prop="beginTime"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('platformManagement.endDate')"
              prop="endTime"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('platformManagement.betweenInformation')"
              prop="reportInterval"
              show-overflow-tooltip
              min-width="100"
            />
            <el-table-column
              :label="$t('platformManagement.executionStatus')"
              show-overflow-tooltip
              min-width="100"
            >
              <template #default="{ row }">
                <span>{{ setSubStatus(row.subscribeStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="$parent.PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span
                  class="cell-operate danger"
                  @click="handleCancel(row)"
                  v-if="
                    $parent.PermissionManage && row.subscribeStatus == 0 && $parent.choosedType == 2
                  "
                >
                  {{ $t('platformManagement.cancelSubscription') }}
                </span>
                <span
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                  v-if="$parent.PermissionManage"
                >
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="!loading && tableData.length"
            :total="total"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getList"
          />
        </div>
      </div>
    </div>

    <!-- 添加订阅弹框 -->
    <subscription-add></subscription-add>
    <!-- 取消订阅弹框 -->
    <subscription-cancel ref="cancelDialog"></subscription-cancel>
    <!-- 订阅详情弹框 -->
    <subscription-detail></subscription-detail>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :multipleSelectionMany="multipleSelectionMany"
      :what="what"
      @getList="getList"
      :operate="operate"
      :batchApi="batchApi"
      :whatId="whatId"
      :whatName="whatName"
      v-model:loading="loading"
      v-model:visible="batchDialogVisible"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { ArrowLeft as ElIconArrowLeft } from '@element-plus/icons-vue'
import tableCopy from '@/mixin/tableCopy.js'
import { mapState, mapActions } from 'vuex'

import subscriptionAdd from './subscription-add'
import subscriptionCancel from './subscription-cancel'
import subscriptionDetail from './subscription-detail'
import batchOperate from '@/components/batchOperate' //批量操作

export default {
  components: {
    'subscription-add': subscriptionAdd,
    'subscription-cancel': subscriptionCancel,
    'subscription-detail': subscriptionDetail,
    'batch-operate': batchOperate,
    ElIconArrowLeft
  },
  mixins: [tableCopy],
  props: [],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //batchOperate
      what: '',
      operate: '',
      batchApi: '',
      whatId: '',
      whatName: '',
      multipleSelectionMany: [],
      batchDialogVisible: false,

      loading: false,
      loading1: false,
      multipleSelection: [],

      //场景治理
      dataText: '',
      dataText1: '',
      tableHeight: 635,
      tableHeight1: 635,

      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],

      pageNum1: 1,
      pageSize1: 10,
      total1: 0,
      tableData1: [],

      delShow: true,
      allocateShow: true,
      dialogFormVisible_allocate: false,
      choosedCameraId: '',
      allocateWay: '',
      allocateOperation: '',
      choosedWorkOrderId: '',

      searchForm: {
        title: '',
        subscribeDetail: '',
        subscribeStatus: ''
      },

      subTypeList: [],
      subStatusList: [],

      dialogVisible_add: false,
      dialogVisible_detail: false,
      dialogVisible_cancel: false,

      choosedSubInfo: {},
      resourceUriList: [],

      cancelFlag: '',
      choosedInfo: {},

      choosedInternetCode: ''
    }
  },
  computed: {
    ...mapState({
      subscribeDetailList: state => state.dict['subscribe_type'],
      subscribeResourcesList: state => state.dict['subscribe_resources_type'],
      subscribeResultPicList: state => state.dict['subscribe_result_pic_type']
    })
  },
  async created() {
    await this.setData()
    await this.getDic()
    await this.getVigList()
    await this.getList()
  },
  methods: {
    setSubStatus(val) {
      this.subStatusList.map(item => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    setData() {
      this.subTypeList = [
        {
          name: '1',
          value: 1
        }
      ]
      this.subStatusList = [
        {
          name: this.$t('platformManagement.isSubscribe'),
          value: 0
        },
        {
          name: this.$t('platformManagement.cancelledSubscribe'),
          value: 1
        },
        {
          name: this.$t('platformManagement.subscriptionExpiration'),
          value: 2
        },
        {
          name: this.$t('platformManagement.notSubscribed'),
          value: 9
        },
        {
          name: this.$t('platformManagement.subscriptionFailed'),
          value: 10
        }
      ]
      this.dataText = this.$t('platformManagement.noData')
      this.dataText1 = this.$t('platformManagement.noData')
    },

    setIsConfigured(val) {
      if (val == 0) {
        return this.$t('platformManagement.notConfigured')
      } else if (val == 1) {
        return this.$t('platformManagement.configured')
      }
    },

    handleFindWork() {
      this.pageNum1 = 1
      this.getWorkOrderList()
    },
    ...mapActions('dict', ['getSysDictData']),
    getDic() {
      this.getSysDictData([
        'subscribe_type',
        'subscribe_resources_type',
        'subscribe_result_pic_type'
      ])
    },

    async getVigList() {
      this.resourceUriList = []
      let res = await this.$api.getLocalPlatformInfo({})

      this.choosedInternetCode = res.internetCode

      for (let i = 0; i < res.vigInfoList.length; i++) {
        this.resourceUriList.push({
          name:
            res.vigInfoList[i].protocol+'://' +
            res.vigInfoList[i].ip +
            ':' +
            res.vigInfoList[i].port +
            '/VIID/SubscribeNotifications',
          value:
            res.vigInfoList[i].protocol+'://' +
            res.vigInfoList[i].ip +
            ':' +
            res.vigInfoList[i].port +
            '/VIID/SubscribeNotifications'
        })
      }
    },

    async getList() {
      this.loading = true
      let res = await this.$api.selectSubscribeList({
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        platId: this.$parent.choosedResourceUri,
        title: this.searchForm.title,
        subscribeDetail: this.searchForm.subscribeDetail.length
          ? this.searchForm.subscribeDetail.join(',')
          : '',
        subscribeStatus:
          this.searchForm.subscribeStatus !== '' ? Number(this.searchForm.subscribeStatus) : null,

        platformType: this.$parent.choosedType
      })
      if (res.resultCode == 0 && res.subscribeInfoList) {
        this.tableData = res.subscribeInfoList

        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].subscribeDetail_zh = this.setSubscribeDetail(
            this.tableData[i].subscribeDetail.split(',')
          )
        }
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].resourceClass_zh = this.subscribeResources(
            this.tableData[i].resourceClass
          )
        }
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].resultImageDeclare_zh = this.subscribeResultPic(
            this.tableData[i].resultImageDeclare.split(',')
          )
        }

        this.total = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },

    setSubscribeDetail(arr) {
      let list = []
      for (let i = 0; i < arr.length; i++) {
        this.subscribeDetailList.filter(item => {
          if (arr[i] == item.value) {
            list.push(' ' + item.name)
          }
        })
      }
      return list.join(',')
    },
    subscribeResources(arr) {
      let list = ''
      this.subscribeResourcesList.filter(item => {
        if (arr == item.value) {
          list = item.name
        }
      })
      return list
    },
    subscribeResultPic(arr) {
      let list = []
      for (let i = 0; i < arr.length; i++) {
        this.subscribeResultPicList.filter(item => {
          if (arr[i] == item.value) {
            list.push(' ' + item.name)
          }
        })
      }
      return list.join(',')
    },

    async getWorkOrderList() {
      this.loading1 = true
      let res = await this.$api.getWorkOrdersInGovernance({
        pageInfo: {
          pageNum: this.pageNum1,
          pageSize: this.pageSize1
        },
        governanceId: this.$parent.choosedGovId
      })
      if (res.resultCode == 0) {
        this.tableData1 = res.workOrderList
        this.total1 = res.pageInfo.totalNum
        this.loading1 = false
      } else {
        this.tableData1 = []
        this.total1 = 0
        this.loading1 = false
      }
    },
    cancel() {
      this.cancelFlag = 'batch'
      this.dialogVisible_cancel = true
    },

    async batchOperate() {
      this.loading = true

      this.what = this.$t('platformManagement.subscribe')
      this.operate = this.$t('public.batchCancelContent')
      this.batchApi = 'sendCancelSubscribe'
      this.whatId = 'subscribeId'
      this.whatName = 'title'

      this.multipleSelectionMany = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let obj = JSON.parse(JSON.stringify(this.multipleSelection[i]))
        obj.subscribeCancelPerson = this.$refs.cancelDialog.form.subscribeCancelPerson
        obj.cancelReason = this.$refs.cancelDialog.form.cancelReason
        obj.subscribeCancelOrg = this.$refs.cancelDialog.form.subscribeCancelOrg

        delete obj.subscribeDetail_zh

        this.multipleSelectionMany.push(obj)
      }

      this.batchDialogVisible = true
    },

    del() {
      this.$confirm(
        this.$t('platformManagement.deleteSubscribe', {
          num: this.multipleSelection.length
        }),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(async () => {
          this.loading = true

          this.what = this.$t('platformManagement.subscribe')
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = 'delSubscribe'
          this.whatId = 'subscribeId'
          this.whatName = 'title'

          this.multipleSelectionMany = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.multipleSelectionMany.push({
              subscribeId: this.multipleSelection[i].subscribeId,
              sendType: this.$parent.choosedType
            })
          }

          this.batchDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    handleAdd() {
      this.dialogVisible_add = true
    },

    handleFind() {
      this.pageNum = 1
      this.getList()
    },

    handleRest() {
      this.searchForm = {
        title: '',
        subscribeDetail: '',
        subscribeStatus: ''
      }
    },

    handleInfo(row) {
      this.choosedSubInfo = row
      this.dialogVisible_detail = true
    },

    handleCancel(row) {
      this.cancelFlag = 'single'
      this.choosedInfo = row
      this.dialogVisible_cancel = true
    },

    handleDelete(row) {
      //仅有取消订阅的内容支持删除操作
      if (this.$parent.choosedType == 1) {
        this.$confirm(this.$t('platformManagement.isDleteSubscribe'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api
              .delSubscribe({
                subscribeId: row.subscribeId,
                sendType: this.$parent.choosedType
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.delSuccess')
                  })
                  this.getList()
                }
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          })
      } else if (row.subscribeStatus == 1) {
        this.$confirm(this.$t('platformManagement.isDleteSubscribe'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api
              .delSubscribe({
                subscribeId: row.subscribeId,
                sendType: this.$parent.choosedType
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: this.$t('public.delSuccess')
                  })
                  this.getList()
                }
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          })
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('platformManagement.isCancelledSubscribeDel')
        })
      }
    },

    // 返回
    goBack() {
      this.$parent.getViewPlatList()
      this.$parent.showSubInfo = false
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      this.delShow = this.multipleSelection.length ? false : true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].subscribeStatus != 0) {
          this.delShow = true
          break
        }
      }
      this.allocateShow = this.multipleSelection.length ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  font-family: 'Microsoft Yahei', sans-serif;
}
#subscription-list {
  .goBack {
    display: flex;
    align-items: center;
    color: #10a9ff;
    font-size: 16px;
    cursor: pointer;
    padding: 20px;
    padding-bottom: 0px;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .btnMargin {
    img {
      width: 12px;
    }
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #ebecf0;
  }
  .subscription-list {
    .el-tabs__header {
      margin-bottom: 20px;
    }
    .el-tabs__item {
      color: #7a869a;
    }
  }

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
