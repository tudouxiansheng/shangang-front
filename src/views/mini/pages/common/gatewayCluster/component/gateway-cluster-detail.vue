<template>
  <el-dialog
    :title="$t('gatewayCluster.gatewayClusterDetail')"
    :visible.syn="$parent.gatewayClusterDetailVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1300px' : '1000px'"
    class="gatewayClusterDetailDialog"
    :modal="false"
    :before-close="dialogClosed"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '280px' : '130px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('gatewayCluster.gatewayId') + '：'">
            <span>{{ form.gatewayId }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.gatewayName') + '：'">
            <span>{{ form.gatewayName }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.associateServer') + '：'">
            <span>{{ form.gatewayGroup }}({{ form.gatewayIp }})</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.gatewayGroupName') + '：'">
            <span>{{ form.gatewayGroup }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.nodeAvailableType') + '：'">
            <span>{{ $parent.setNodeAvailableTypeDetail(form.nodeAvailableType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.virtualIp') + '：'">
            <span>{{ form.virtualIp }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('gatewayCluster.accessPlatType') + '：'">
            <span>{{ $parent.setAccessPlatType(form.accessPlatType) }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.gatewayStatus') + '：'">
            <span>{{ $parent.setStatus(form.gatewayStatus) }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.gatewayIp') + '：'">
            <span>{{ form.gatewayIp }}</span>
          </el-form-item>

          <el-form-item :label="$t('gatewayCluster.nodeContainerType') + '：'">
            <span>{{ $parent.setNodeContainerType(form.nodeContainerType) }}</span>
          </el-form-item>

          <el-form-item style="height: 24px"></el-form-item>

          <el-form-item :label="$t('gatewayCluster.gatewayNatIp') + '：'">
            <span>{{ form.gatewayNatIp }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('gatewayCluster.platformList')" name="platformList"></el-tab-pane>
      <el-tab-pane :label="$t('gatewayCluster.statusChange')" name="statusChange"></el-tab-pane>
    </el-tabs>

    <div
      style="max-height: 443px; padding-left: 40px; padding-right: 40px"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
        <p>{{ $t('public.noData') }}</p>
      </div>

      <!-- 表格 -->

      <el-table
        :max-height="tableHeight"
        v-if="!loading && tableData.length"
        :row-class-name="$parent.tableRowClassName"
        ref="multipleTableDetail"
        :data="tableData"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column
          show-overflow-tooltip
          :label="$t('gatewayCluster.platformId')"
          v-if="activeName == 'platformList'"
        >
          <template #default="{ row }">{{ row.platformId }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('gatewayCluster.platformName')"
          prop="platformName"
          show-overflow-tooltip
          v-if="activeName == 'platformList'"
        />
        <el-table-column
          :label="$t('gatewayCluster.platformIP')"
          show-overflow-tooltip
          v-if="activeName == 'platformList'"
        >
          <template #default="{ row }">
            <div v-if="row.platformNetworkIp">
              {{ row.platformNetworkIp }}({{ $t('gatewayCluster.publicNet') }})
            </div>
            <div v-if="row.platformIntranetIp">
              {{ row.platformIntranetIp }}({{ $t('gatewayCluster.intranet') }})
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('gatewayCluster.platformStatus')"
          show-overflow-tooltip
          v-if="activeName == 'platformList'"
        >
          <template #default="{ row }">
            <span :class="setStatusClass(row.platformStatus)">
              {{ setPlatStatus(row.platformStatus) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('gatewayCluster.beforeStatus')"
          prop="beforeStatus"
          show-overflow-tooltip
          v-if="activeName == 'statusChange'"
          key="beforeStatus"
        />
        <el-table-column
          :label="$t('gatewayCluster.afterStatus')"
          prop="afterStatus"
          show-overflow-tooltip
          v-if="activeName == 'statusChange'"
          key="afterStatus"
        />
        <el-table-column
          :label="$t('gatewayCluster.eventTime')"
          prop="eventTime"
          show-overflow-tooltip
          v-if="activeName == 'statusChange'"
          key="eventTime"
        />
      </el-table>

      <pagination
        v-if="!loading && tableData.length"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      activeName: 'platformList',
      tableHeight: 400,
      loading: false,
      tableData: [],
      dataText: '',
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      tableDataStatus: [],
      totalStatus: 0,
      tableDataPlat: 0,
      totalPlat: 0
    }
  },
  computed: {
    platformStatusList() {
      return [
        {
          name: this.$t('gatewayCluster.notConnected'),
          value: 0
        },
        {
          name: this.$t('gatewayCluster.online'),
          value: 1
        },
        {
          name: this.$t('gatewayCluster.offline'),
          value: 2
        }
      ]
    }
  },

  async created() {},

  methods: {
    async getTableDataSta() {
      let obj = {
        pageInfo: this.queryParams.pageInfo,
        searchInfo: {
          gatewayGroup: this.$parent.dataForm.gatewayGroup,
          gatewayIp: this.$parent.dataForm.gatewayIp
        }
      }
      let res = await this.$api.selectGatewayStatusLogs(obj)
      if (res.resultCode == 0) {
        this.tableDataStatus = res.nodeStatusHistoryInfos
        this.tableData = JSON.parse(JSON.stringify(this.tableDataStatus))
        this.totalStatus = res.pageInfo.totalNum
      } else {
        this.tableDataStatus = []
        this.tableData = []
        this.totalStatus = 0
      }
    },
    async getTableDataPlat() {
      this.loading = true
      let res = await this.$api.selectAccessPlatforms({
        pageInfo: this.queryParams.pageInfo,
        gatewayId: this.$parent.choosedGatewayId
      })
      if (res.resultCode == 0) {
        this.tableDataPlat = JSON.parse(JSON.stringify(res.platformList))
        this.tableData = res.platformList
        this.total = res.pageInfo.totalNum
        this.totalPlat = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.tableDataPlat = []
        this.total = 0
        this.totalPlat = 0
        this.loading = false
      }
    },
    setPlatStatus(val) {
      let name = ''
      this.platformStatusList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setStatusClass(val) {
      if (val == 1) {
        return 'success'
      } else if (val == 2) {
        return 'danger'
      }
    },
    async getList() {
      if (this.activeName == 'platformList') {
        await this.getTableDataPlat()
      } else if (this.activeName == 'statusChange') {
        await this.getTableDataSta()
      }
    },
    handleTabClick(tab, event) {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      }
      if (tab.name == 'platformList') {
        this.tableData = JSON.parse(JSON.stringify(this.tableDataPlat))
        this.total = this.totalPlat
      } else if (tab.name == 'statusChange') {
        this.tableData = JSON.parse(JSON.stringify(this.tableDataStatus))
        this.total = this.totalStatus
      }
    },
    async dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })

      if (this.$parent.ifGetPlat) {
        await this.getTableDataSta()
        await this.getTableDataPlat()
      }
    },

    dialogClosed() {
      this.$parent.gatewayClusterDetailVisible = false
      this.$parent.dataForm = {}
      this.activeName = 'platformList'
    }
  }
}
</script>

<style lang="scss">
.gatewayClusterDetailDialog {
  .el-dialog__body {
    padding: 15px 0px 5px;
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
  .el-tabs__content {
    display: none;
  }
  .el-tabs {
    padding-left: 55px;
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
  .el-tabs__nav-scroll {
    padding-left: 0px !important;
  }
  .el-tabs__item {
    padding-left: 0px !important;
  }

  .el-menu .el-tabs__item,
  .el-tabs__header .el-tabs__item {
    background: none !important;
  }
}
</style>
