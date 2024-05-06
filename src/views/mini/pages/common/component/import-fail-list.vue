<template>
  <!-- 批量导入失败 -->
  <el-dialog
    :title="$t('public.importFailed')"
    v-model="$parent.failDialog"
    :close-on-click-modal="false"
    width="820px"
    class="fail-dialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-table
      max-height="469"
      :data="$parent.failList"
      style="margin: 20px 0 30px"
      :row-class-name="$parent.tableRowClassName"
      border
    >
      <el-table-column show-overflow-tooltip :label="$t('public.errorMsg')" min-width="150">
        <template #default="{ row }">
          <span>{{ row.errorMsg }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip :label="$t('public.errorLine')" min-width="50">
        <template #default="{ row }">
          <span>{{ row.rowNum }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.$parent.failDialog = false
    }
  }
}
</script>

<style lang="scss">
.fail-dialog {
  .el-dialog__body {
    padding: 15px 30px 5px 30px !important;
  }
}
</style>
