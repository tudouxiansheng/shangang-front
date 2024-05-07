<template>
  <div id="platform-status-log">
    <el-dialog
      :title="$t('newAccess.statusLog')"
      v-model="$parent.dialogFormVisible_status"
      top="10vh"
      width="850px"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      @open="dialogOpen"
    >
      <div
        style="max-height: 443px"
        v-loading="loading"
        :element-loading-text="$t('public.loading')"
        
      >
        <div v-show="!loading && !tableData.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
          <p>{{ $t('public.noData') }}</p>
        </div>

        <!-- 表格 -->
        <el-table
          :max-height="tableHeight"
          v-if="!loading && tableData.length"
          :row-class-name="tableRowClassName"
          ref="gatewayChooseTable"
          :data="tableData"
          border
        >
          <template #empty>
            <span>{{ dataText }}</span>
          </template>
          <el-table-column :label="$t('newAccess.ifEnable')" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ $parent.setEnable(row.enable) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('newAccess.changeBefore')" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ $parent.setStatus(row.beforeStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('newAccess.changeAfter')" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ $parent.setStatus(row.afterStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('newAccess.recordTime')" prop="recordTime" />
        </el-table>

        <pagination
          v-if="!loading && tableData.length"
          :total="total"
          v-model:pageNum="queryParams.pageInfo.pageNum"
          v-model:limit="queryParams.pageInfo.pageSize"
          @pagination="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'gatewayChoose',
  components: {},
  data() {
    return {
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        gatewayName: '',
        gatewayIp: '',
        gatewayStatus: ''
      },
      pageloading: false,
      loading: false,
      tableData: [], // 表格数据
      ids: [], // 表格选中数据
      multiple: true, // 非多个禁用

      formDialogVisible: false,

      locale: '',
      screenFlag: true,
      tableHeight: 400,
      dataText: '',

      //网关集群
      dialogFormVisible: false,
      operation: true,
      maskloading: false,
      dataForm: {},
      gatewayClusterDetailVisible: false,
      spanArr: [],
      selectioned: ''
    }
  },
  async created() {},

  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
    }
  },

  methods: {
    async dialogOpen() {
      await this.getList()
    },

    async getList() {
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.queryParams.pageInfo.pageNum,
          pageSize: this.queryParams.pageInfo.pageSize
        },
        searchInfo: {
          platformId: this.$parent.choosedPlatformId
        }
      }
      let res = await this.$api.selectPlatformStatusLogInfos(obj)
      if (res.resultCode == 0) {
        this.tableData = res.platformStatusLogInfos
        this.total = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.total = 0
        this.loading = false
      }
    },

    handleFind() {
      this.queryParams.pageInfo.pageNum = 1
      this.getList()
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss">
#platform-status-log {
  height: 100%;
  .el-dialog__body {
    padding: 20px;
  }

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .has-gutter {
    .el-checkbox {
      display: none;
    }
  }
  .el-pagination .el-input__inner {
    width: 70px;
  }
  .el-pagination .el-pagination__editor.el-input .el-input__inner {
    width: 46px !important;
  }
}
</style>
