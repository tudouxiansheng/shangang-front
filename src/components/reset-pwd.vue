<template>
  <el-dialog
    :title="$t('changePwd.resetPwd')"
    v-model="dialogVisible"
    top="10vh"
    width="900px"
    :close-on-click-modal="false"
    :modal="false"
    @open="dialogOpen"
    @closed="dialogClosed"
    draggable
  >
    <el-form
      ref="authForm"
      :model="form"
      :rules="rules"
      class="authForm"
      :label-width="locale == 'en' ? '160px' : '110px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <p class="tips">
        {{ $t('changePwd.resetPwdTips') }}
      </p>

      <el-form-item :label="$t('public.loginPwd') + '：'" prop="authPassword">
        <pwd-input v-model="form.authPassword" :placeholder="$t('public.loginPwdPrompt')" />
      </el-form-item>

      <el-form-item :label="$t('changePwd.newPwd') + '：'" prop="newPassword">
        <el-popover
          placement="bottom"
          popper-class="break-changePwd"
          trigger="click"
          :disabled="isEnable ? false : true"
        >
          <div>
            <span v-if="minLength">
              1、{{ $t('changePwd.pwdMinLength') }} {{ minLength }};
              <br />
            </span>
            <span v-for="item in rulesLength" :key="item.inDex">
              {{ item.inDex }}、{{ item.rule }};
              <br />
            </span>
          </div>
          <template #reference>
            <pwd-input v-model="form.newPassword" :placeholder="$t('changePwd.enterNewPwd')" />
          </template>
        </el-popover>
        <strength-meter
          ref="strengthMeter"
          :password="form.newPassword"
          :min-length="this.minLength"
        />
      </el-form-item>

      <el-form-item :label="$t('public.confirmPsd') + '：'" prop="passwordSure">
        <pwd-input v-model="form.passwordSure" :placeholder="$t('changePwd.enterConfirmPwd')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import complex from '@/mixin/complex'
import StrengthMeter from '@/components/strength-meter'
const apiMap = {
  0: 'resetUserPasswd',
  1: 'resetAdminPasswd',
  2: 'resetTenantPasswd'
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: Number,
      default: 0
    }
  },
  mixins: [complex],
  components: {
    StrengthMeter
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        authPassword: undefined,
        newPassword: undefined,
        passwordSure: undefined
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
    },
    rules() {
      const validatePsw2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('changePwd.enterConfirmPwd')))
        } else if (value !== this.form.newPassword) {
          callback(new Error(this.$t('changePwd.consistentPwd')))
        } else {
          callback()
        }
      }
      return {
        authPassword: [
          {
            required: true,
            message: this.$t('public.loginPwdPrompt'),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: this.$t('changePwd.newPwdNoEmpty'),
            trigger: 'change'
          }
        ],
        passwordSure: [{ required: true, validator: validatePsw2, trigger: 'change' }]
      }
    }
  },
  async mounted() {
    await this.getComplexity_rules()
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.resetForm()
    },
    resetForm() {
      this.form = {
        authPassword: undefined,
        newPassword: undefined,
        passwordSure: undefined
      }
      this.$resetForm('authForm')
    },
    submitForm() {
      this.$refs['authForm'].validate(valid => {
        if (valid) {
          if (this.isEnable === 1 && this.$refs.strengthMeter.getPasswordStrength.score === 1) {
            // 风险密码
            if (this.form.passwordSure.length < this.minLength) {
              this.$message.warning(`${this.$t('changePwd.passWordLength') + this.minLength}`)
            } else {
              this.$message.warning(`${this.$t('changePwd.weakPwdTips')}`)
            }
            return false
          }
          this.loading = true
          let data = {
            newPassword: this.form.newPassword,
            authPassword: this.form.authPassword,
            newPasswordRepeat: this.form.passwordSure
          }
          if (this.type == 0) {
            data.userId = this.userId
          } else if (this.type == 1) {
            data.adminId = this.userId
          } else if (this.type == 2) {
            data.tenantId = this.userId
          }
          this.$api[apiMap[this.type]](data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('changePwd.resetPwdSuccess')
              })
              this.dialogVisible = false
              if (this.type == 0) {
                this.$parent.userList()
              } else if (this.type == 1) {
                this.$parent.getAdminList()
              } else if (this.type == 2) {
                this.$parent.getTenantList()
              }
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  margin: 0 0 30px 0;
}
</style>
