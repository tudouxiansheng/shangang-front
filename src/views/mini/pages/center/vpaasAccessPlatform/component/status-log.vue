<template>
  <el-dialog
    :title="$t('accessPlatform.statusChangeRecord')"
    v-model="$parent.dialogFormVisible_status"
    top="10vh"
    :width="locale == 'en' ? '1100px' : '1000px'"
    id="vpaas-platform-status-log"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @open="dialogOpen"
  >
    <div
      style="max-height: 443px"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      element-loading-spinner="el-icon-loading"
    >
      <div v-show="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
        <p>{{ $t('public.noData') }}</p>
      </div>

      <!-- 表格 -->
      <el-table
        :max-height="tableHeight"
        v-show="!loading && tableData.length"
        :row-class-name="tableRowClassName"
        ref="gatewayChooseTable"
        :data="tableData"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column :label="$t('alarmTypeManage.whetherToEnable')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ $parent.setEnable(row.enable) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accessPlatform.statusBeforeChange')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ $parent.setStatus(row.beforeStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accessPlatform.statusAfterChange')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ $parent.setStatus(row.afterStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('accessPlatform.recordTime')" prop="recordTime" />
      </el-table>

      <pagination
        v-show="!loading && tableData.length"
        :total="total"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'VpaasPlatformStatusLog',
  components: {},
  data() {
    return {
      locale: localStorage.getItem('locale'),
      total: 0,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      tableData: [], // 表格数据
      tableHeight: 400,
      dataText: '',
      maskloading: false
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(async () => {
        
        await this.getList()
      })
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
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss">
#vpaas-platform-status-log {
  .el-dialog__body {
    padding: 20px;
  }
  .el-table {
    --el-table-border-color: rgb(229, 231, 235);
  }
}
</style>
