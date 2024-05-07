<template>
  <el-dialog
    draggable
    :title="$t('platformManagement.cancelSubscription')"
    v-model="$parent.dialogVisible_cancel"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    class="subscription-cancel"
  >
    <el-form
      :model="form"
      ref="form"
      :label-width="locale == 'en' ? '160px' : '88px'"
      label-position="left"
      :rules="rules"
    >
      <el-form-item :label="$t('platformManagement.canceler') + ':'" prop="subscribeCancelPerson">
        <el-input
          v-model="form.subscribeCancelPerson"
          :placeholder="$t('platformManagement.inputCanceler')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platformManagement.cancelUnits') + ':'">
        <el-input
          v-model="form.subscribeCancelOrg"
          :placeholder="$t('platformManagement.inputCancelUnits')"
          prop="subscribeCancelOrg"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platformManagement.cancelCancellation') + ':'" prop="cancelReason">
        <el-input
          :placeholder="$t('platformManagement.inputCancelCancellation')"
          v-model="form.cancelReason"
          type="textarea"
          maxlength="256"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getFormatDate } from '@/utils/common/mutil'

export default {
  data() {
    return {
      form: {
        subscribeCancelPerson: '',
        subscribeCancelOrg: '',
        cancelReason: ''
      },
      locale: localStorage.getItem('locale'),
      rules: {}
    }
  },

  mounted() {
    this.setFormRules()
  },

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        
      })
    },

    dialogClosed() {
      this.$parent.dialogVisible_cancel = false
      this.$parent.maskloading = false
    },

    setFormRules() {
      this.rules = {
        subscribeCancelPerson: [
          {
            required: false,
            message: this.$t('platformManagement.inputCanceler'),
            trigger: 'blur'
          }
        ],
        subscribeCancelOrg: [
          {
            required: false,
            message: this.$t('platformManagement.inputCancelUnits'),
            trigger: 'blur'
          }
        ],
        cancelReason: [
          {
            required: false,
            message: this.$t('platformManagement.inputCancelCancellation'),
            trigger: 'blur'
          }
        ]
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.$parent.cancelFlag == 'batch') {
            this.$parent.batchOperate()
            this.$parent.maskloading = false
            this.$parent.dialogVisible_cancel = false
          } else {
            this.$parent.maskloading = true
            let info = JSON.parse(JSON.stringify(this.$parent.choosedInfo))
            info.subscribeCancelPerson = this.form.subscribeCancelPerson
            info.cancelReason = this.form.cancelReason
            info.subscribeCancelOrg = this.form.subscribeCancelOrg
            info.cancelTime = getFormatDate(Date.now())

            delete info.subscribeDetail_zh
            delete info.subscribeType

            this.$api.sendCancelSubscribe({ subscribeInfo: info }).then(res => {
              this.successResult(res, this.$t('platformManagement.unsubscribeSuccessfully'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogVisible_cancel = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.getList()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.subscription-cancel {
  .el-dialog__body {
    padding: 15px 140px 5px !important;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>
