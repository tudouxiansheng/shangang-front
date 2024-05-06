<template>
  <!-- 操作日志详情 -->
  <el-dialog
    :title="$t('businessLog.logDetail')"
    v-model="$parent.logDetailVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1300px' : '1000px'"
    class="logDetail"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      :label-width="$parent.locale == 'en' ? '165px' : '85px'"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('businessLog.account') + '：'">
            <span>{{ form.account }}</span>
          </el-form-item>

          <el-form-item :label="$t('businessLog.accessIP') + '：'">
            <span>{{ form.accessIP }}</span>
          </el-form-item>

          <el-form-item :label="$t('businessLog.cuType') + '：'">
            <span>{{ $parent.set_cuType(form.cuType) }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('businessLog.operation') + '：'">
            <span>{{ form.operation }}</span>
          </el-form-item>

          <el-form-item :label="$t('businessLog.operationDate') + '：'">
            <span>{{ form.operationDate }}</span>
          </el-form-item>

          <el-form-item :label="$t('businessLog.result') + '：'">
            <span>{{ $parent.set_result(form.result) }}</span>
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('businessLog.params') + '：'" class="padding40">
        <span>{{ form.paramDetail }}</span>
      </el-form-item>
    </el-form>
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
      form: {
        account: '',
        operation: '',
        result: '',
        operationDate: '',
        cuType: '',
        accessIP: '',
        paramDetail: ''
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.logDetailForm
      })
    },
    dialogClosed() {
      this.$parent.logDetailVisible = false
      this.logDetailForm = {}
    }
  }
}
</script>

<style lang="scss">
.logDetail {
  .el-dialog__body {
    textarea {
      min-height: 200px !important;
    }

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
}
</style>
