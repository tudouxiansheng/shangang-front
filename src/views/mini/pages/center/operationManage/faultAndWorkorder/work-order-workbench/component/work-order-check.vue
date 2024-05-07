<template>
  <div>
    <el-dialog
      :title="
        $parent.dialogType2 == 1
          ? $t('faultAndWorkorder.AcceptanceCheck')
          : $t('faultAndWorkorder.pendingCheck')
      "
      v-model="$parent.dialogVisible2"
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
        <el-form-item :label="$t('faultAndWorkorder.workorderId') + ':'" prop="woId">
          <el-input
            v-model="form.woId"
            disabled
            :placeholder="$t('faultAndWorkorder.workorderIdPrompt')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.disposeOperation') + ':'" prop="agreed">
          <el-radio-group v-model="form.agreed">
            <el-radio :label="true">{{ $t('faultAndWorkorder.agree') }}</el-radio>
            <el-radio :label="false">{{ $t('faultAndWorkorder.reject') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.auditRemark') + ':'" prop="remark">
          <el-input
            v-model="form.remark"
            clearable
            type="textarea"
            :rows="2"
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
        agreed: true,
        remark: ''
      },
      formRules: {
        woId: [{ required: true, trigger: 'change' }],
        agreed: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.disposeOperationProp'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 256,
            message: this.$t('faultAndWorkorder.remark256Prop'),
            trigger: 'change'
          }
        ]
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
          if (this.$parent.dialogType2 == 1) {
            let res = await this.$api.acceptanceAudit(this.form)
            if (res.resultCode == 0) {
              this.$refs['form'].resetFields()
              this.$parent.dialogVisible2 = false
              this.$parent.getWorkOrderList()
              if (this.form.agreed) {
                this.$message({
                  message: this.$t('faultAndWorkorder.AcceptanceCheckSuccess'),
                  type: 'success'
                })
              } else {
                this.$message({
                  message: this.$t('faultAndWorkorder.AcceptanceCheckReject'),
                  type: 'success'
                })
              }
            }
          } else {
            let res = await this.$api.suspendAudit(this.form)
            if (res.resultCode == 0) {
              this.$refs['form'].resetFields()
              this.$parent.dialogVisible2 = false
              this.$parent.getWorkOrderList()
              if (this.form.agreed) {
                this.$message({
                  message: this.$t('faultAndWorkorder.pendingCheckSuccess'),
                  type: 'success'
                })
              } else {
                this.$message({
                  message: this.$t('faultAndWorkorder.pendingCheckReject'),
                  type: 'success'
                })
              }
            }
          }
        }
      })
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.$parent.dialogVisible2 = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--medium .el-form-item__content) {
  line-height: 36px !important;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
