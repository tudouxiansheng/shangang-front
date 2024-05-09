<template>
  <!-- 录像信息添加失败列表 -->
  <el-dialog
    :title="$t('primaryDevice.failedToAddRecordInfoList')"
    :visible.sync="$parent.recordPolicyDialogVisible"
    :close-on-click-modal="false"
    width="1000px"
    class="allcate-error-dialog"
    @closed="dialogClosed"
     :draggable="false"  
  >
    <el-table
      max-height="769"
      :data="$parent.recordPolicyFailList"
      style="width: 100%; margin: 20px 0 30px"
      :row-class-name="$parent.tableRowClassName"
      border
    >
      <el-table-column show-overflow-tooltip :label="$t('primaryDevice.cameraId')" mix-width="130">
        <template #default="{ row }">
          <span>{{ row.cameraId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        :label="$t('primaryDevice.cameraName')"
        max-width="100"
      >
        <template #default="{ row }">
          <span>{{ row.cameraName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        :label="$t('primaryDevice.resultCode')"
        max-width="100"
      >
        <template #default="{ row }">
          <span>{{ row.resultCode }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        :label="$t('primaryDevice.resultDesc')"
        max-width="100"
      >
        <template #default="{ row }">
          <span>{{ row.resultDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    dialogClosed() {
      this.$parent.recordPolicyDialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.allcate-error-dialog {
  .el-dialog__body {
    padding: 15px 30px 5px !important;
  }
}
</style>
