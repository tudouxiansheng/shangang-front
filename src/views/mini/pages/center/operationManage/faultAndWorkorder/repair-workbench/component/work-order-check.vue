<template>
  <div>
    <el-dialog
      :title="$t('faultAndWorkorder.handleWorkorder')"
      v-model="$parent.dialogVisible"
      top="10vh"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="$t('faultAndWorkorder.handleResult') + ':'" prop="operation">
          <el-radio-group v-model="form.operation">
            <el-radio :label="4">{{ $t('faultAndWorkorder.applyAcceptance') }}</el-radio>
            <el-radio :label="6">{{ $t('faultAndWorkorder.applyReallocate') }}</el-radio>
            <el-radio :label="8">{{ $t('faultAndWorkorder.applyPending') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.auditRemark') + ':'" prop="remark">
          <el-input
            v-model="form.remark"
            clearable
            type="textarea"
            :rows="2"
            maxlength="256"
            show-word-limit
            :placeholder="$t('faultAndWorkorder.auditRemarkPrompt')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="text-center">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('workOrder.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        woId: '',
        operation: 4,
        remark: undefined
      },
      formRules: {
        resource: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.selectDisposeOperation'),
            trigger: 'chnage'
          }
        ],
        woId: [{ required: true, trigger: 'chnage' }]
      }
    }
  },
  methods: {
    dialogOpen() {
      this.form.woId = this.$parent.woId
    },
    handleSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let res = await this.$api.handleWo(this.form)
          if (res.resultCode == 0) {
            this.$parent.dialogVisible = false
            this.$parent.getRepairList()
            if (this.form.operation == 4) {
              this.$message({
                message: this.$t('faultAndWorkorder.applyAcceptanceSuccess'),
                type: 'success'
              })
            } else if (this.form.operation == 8) {
              this.$message({
                message: this.$t('faultAndWorkorder.applyPendingSuccess'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('faultAndWorkorder.applyReallocateSuccess'),
                type: 'success'
              })
            }
          }
        }
      })
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.$parent.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--medium) .el-form-item__content {
  line-height: 36px !important;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
