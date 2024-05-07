<template>
  <el-dialog
    :title="$t('mainDevConfiguration.modifyPwd')"
    :visible.sync="dialogVisible"
    top="10vh"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
    :modal="false"
    draggable
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :label-width="locale == 'en' ? '220px' : '100px'"
      label-position="left"
    >
      <el-form-item
        :label="$t('mainDevConfiguration.identityVerification') + '：'"
        prop="authPassword"
      >
        <el-input
          type="password"
          :placeholder="$t('mainDevConfiguration.inputIdentityVerification')"
          v-model="form.authPassword"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('mainDevConfiguration.newPwd') + '：'" prop="password">
        <el-input
          type="password"
          :placeholder="$t('mainDevConfiguration.inputNewPwd')"
          v-model="form.password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('mainDevConfiguration.confirmPwd') + '：'" prop="confirmPwd">
        <el-input
          type="password"
          :placeholder="$t('mainDevConfiguration.inputConfirmPwd')"
          v-model="form.confirmPwd"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number
    },
    account: {
      type: String
    }
  },
  data() {
    let confirmPwdValidator = (rule, value, callback) => {
      if (value != this.form.password) {
        callback(new Error(this.$t('mainDevConfiguration.confirmPwdProp')))
      }
      callback()
    }
    return {
            locale: localStorage.getItem('locale'),
      form: {
        authPassword: undefined,
        password: undefined,
        confirmPwd: undefined
      },
      key: sessionStorage.getItem('key'),
      formRules: {
        authPassword: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputIdentityVerification'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputNewPwd'),
            trigger: 'change'
          }
        ],
        confirmPwd: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputConfirmPwd'),
            trigger: 'change'
          },
          {
            validator: confirmPwdValidator,
            trigger: 'change'
          }
        ]
      }
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
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const obj = {
            mainDevId: this.$parent.mainDevId,
            authPassword: this.form.authPassword,
            password: this.form.password,
            account: this.account,
            type: this.type
          }
          let res = await this.$api.setDevPassword(obj)
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('mainDevConfiguration.pwdModifySucessful'),
              type: 'success'
            })
            this.$emit('getDevPassword')
            this.dialogVisible = false
          }
        }
      })
    },
    handleClose() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px 40px;
  .el-input__inner {
    background: #ffffff !important;
    border-radius: 4px;
    border: 1px solid #e6e6e6 !important;
  }
}
</style>
