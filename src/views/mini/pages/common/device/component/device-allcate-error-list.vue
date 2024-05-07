<template>
  <!-- 调拨设备失败列表 -->
  <el-dialog
    :title="title"
    :visible.sync="$parent.allcateErrorDialogVisible"
    :close-on-click-modal="false"
    width="1000px"
    class="allcate-error-dialog"
    @closed="dialogClosed"
    @open="dialogOpen"
    :draggable="false"  
  >
    <el-table
      max-height="369"
      :data="$parent.resultlist"
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
import { i18n, getDefaultLang } from '@/i18n'
export default {
  //没有传title,默认显示
  props: {
    title: {
      type: String,
      default() {
        return this.$t('primaryDevice.transferDevErrorList')
      }
    }
  },
  methods: {
    dialogClosed() {
      this.$parent.allcateErrorDialogVisible = false
    },
    dialogOpen() {}
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
