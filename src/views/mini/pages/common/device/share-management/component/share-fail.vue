<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    append-to-body
    class="allcate-error-dialog"
    @closed="dialogClosed"
    @open="dialogOpen"
    dialogDrag
  >
    <el-table
      max-height="504"
      :data="list"
      style="width: 100%; margin: 20px 0 30px"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        show-overflow-tooltip
        :label="$t('userManage.userName')"
        mix-width="130"
        prop="userName"
      />
      <el-table-column
        show-overflow-tooltip
        :label="$t('metadata.cameraName')"
        max-width="100"
        prop="deviceName"
      />
      <el-table-column
        show-overflow-tooltip
        :label="$t('lensTranscodingTask.reason')"
        prop="resultDesc"
        max-width="100"
      />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="dialogClosed(), $emit('surecb')">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  //没有传title,默认显示
  props: {
    title: {
      type: String,
      default() {
        return this.$t('primaryDevice.transferDevErrorList')
      }
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
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
