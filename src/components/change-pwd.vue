<template>
  <!-- 修改密码 -->
  <CusDialog
    :visible="visible"
    :title="$t('changePwd.changePwd')"
    appendToBody
    :width="600"
    @close="dialogClosed"
    @closed="handleClosed"
    @open="handleOpen"
    @opened="handleOpened"
    destroyOnClose
  >
    <div class="custom-dialog-content" slot="body">
      <el-form
        ref="addDataForm"
        :model="addDataForm"
        :label-width="$parent.$parent.locale == 'en' ? '196px' : '100px'"
        :rules="rules1"
      >
        <el-form-item v-if="firstLogin != 1" :label="$t('changePwd.originalPwd') + '：'" prop="password">
          <el-input
            v-model.trim="addDataForm.password"
            type="password"
            auto-complete="off"
            :placeholder="$t('changePwd.enterOriginalPwd')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('changePwd.newPwd') + '：'" prop="newPassword" class="custom-form-item">
          <el-popover placement="bottom" width="200" trigger="click" disabled>
            <!--              :disabled="isEnable ? false : true"-->
            <!--              <div>-->
            <!--                <span v-if="minLength">-->
            <!--                  1、{{ $t('changePwd.pwdMinLength') }} {{ minLength }};-->
            <!--                  <br />-->
            <!--                </span>-->
            <!--                <span v-for="item in rulesLength" :key="item.inDex">-->
            <!--                  {{ item.inDex }}、{{ item.rule }};-->
            <!--                  <br />-->
            <!--                </span>-->
            <!--              </div>-->
            <!--              <div class="form-tips">-->
            <!--                提示：密码长度为6-16个字符，必须包含数字和字母，不能含有空格！-->
            <!--              </div>-->
            <el-input
              slot="reference"
              v-model.trim="addDataForm.newPassword"
              type="password"
              auto-complete="off"
              :placeholder="$t('changePwd.enterNewPwd')"
              clearable
            />
          </el-popover>
          <div class="form-tips" :class="isNewErr ? 'error' : ''">
            {{ $t('changePwd.tips') }}
          </div>
        </el-form-item>

        <el-form-item :label="$t('changePwd.surePwd') + '：'" prop="passwordSure">
          <el-input
            v-model.trim="addDataForm.passwordSure"
            type="password"
            auto-complete="off"
            :placeholder="$t('changePwd.enterConfirmPwd')"
            clearable
          />
        </el-form-item>
        <!--          <el-form-item-->
        <!--            :label="$t('changePwd.validateCode') + '：'"-->
        <!--            prop="captcha"-->
        <!--          >-->
        <!--            <div class="validateCode">-->
        <!--              <el-input-->
        <!--                type="text"-->
        <!--                autocomplete="off"-->
        <!--                :placeholder="$t('login.inputVerifyCode')"-->
        <!--                v-model="addDataForm.captcha"-->
        <!--                clearable-->
        <!--              ></el-input>-->
        <!--              <img-->
        <!--                :src="verifyImg"-->
        <!--                alt-->
        <!--                class="verify"-->
        <!--                @click="changeVerifyImg"-->
        <!--              />-->
        <!--            </div>-->
        <!--          </el-form-item>-->
      </el-form>
    </div>
    <div class="custom-dialog-footer" slot="footer">
      <el-button class="btn" v-if="closeable" @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      <el-button class="btn" type="primary" @click="submitForm('addDataForm')">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </CusDialog>
</template>

<script>
import complex from '@/mixin/complex'
import { crypto } from '@/utils/crypto'
import { modifyPassword, getLoginUserInfo } from '@/utils/api'

export default {
  mixins: [complex],
  props: {
    closeable: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //首次登录标记
      // firstLogin: JSON.parse(sessionStorage.getItem('firstLogin')),
      firstLogin: sessionStorage.getItem('firstLogin'),
      remindModifyPwd: sessionStorage.getItem('remindModifyPwd'),
      pwdLeftDays: sessionStorage.getItem('pwdLeftDays'),
      pwdStrengthScore: sessionStorage.getItem('pwdStrengthScore'),
      // 修改密码弹框数值
      addDataForm: {
        password: '',
        newPassword: '',
        passwordSure: '',
        captcha: '',
      },
      rules1: {},
      verifyImg: '',
      isNewErr: false,
    }
  },
  async mounted() {
    //获取密码校验规则
    this.setFormRules()
    // await this.getComplexity_rules()
    // this.getComplexity()
    // this.remindPrompt()
    // this.changeVerifyImg()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.addDataForm) {
        this.$nextTick(() => {
          this.$refs.addDataForm.clearValidate()
          this.isNewErr = false
        })
      }
      // this.$nextTick(() => {
      //   sessionStorage.setItem('leftTop', true) //用于弹框拖拽判断
      // })
    },
    handleOpen() {
      this.$emit('open')
    },
    handleOpened() {
      this.$emit('opened')
    },
    handleClosed() {
      this.$emit('closed')
    },
    dialogClosed() {
      // this.$parent.$parent.changePsdDialogVisible = false
      this.addDataForm = {
        password: '',
        newPassword: '',
        passwordSure: '',
        captcha: '',
      }
      this.$emit('close')
      // sessionStorage.removeItem('leftTop')
    },

    setFormRules() {
      var validatePsw1 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(`${this.$t('public.prompt')}：${this.$t('changePwd.enterOriginalPwd')}`))
        } else {
          callback()
        }
      }

      // var reg2 = /^([a-zA-Z0-9_]{5,128})$/;
      var validatePsw2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('changePwd.needSurePwd')))
        } else if (value !== this.addDataForm.newPassword) {
          callback(new Error(`${this.$t('public.prompt')}：${this.$t('changePwd.consistentPwd')}`))
        } else {
          callback()
        }
      }

      let reg3 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      let validateNewPwd = (rule, value, callback) => {
        if (value == '' || !reg3.test(value)) {
          this.isNewErr = true
          return false
        } else {
          this.isNewErr = false
          callback()
        }
      }
      this.rules1 = {
        // 原始密码
        password: [{ required: true, validator: validatePsw1, trigger: 'change' }],
        newPassword: [{ required: true, validator: validateNewPwd, trigger: 'change' }],
        passwordSure: [{ required: true, validator: validatePsw2, trigger: 'change' }],
        captcha: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('login.inputVerifyCode'),
          },
        ],
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addDataForm?.clearValidate()
          this.isNewErr = false
        }, 0)
      })
    },

    getComplexity() {
      if (sessionStorage.getItem('cuType') == 4) {
        if (this.firstLogin && this.modifyOnFirstLogin === 1) {
          // 首次登录修改密码
          this.$parent.$parent.changePwdClosable = true
          this.$parent.$parent.changePsdDialogVisible = true
          return false
        }

        if (this.isEnable === 1 && this.pwdStrengthScore == 1) {
          // 风险密码修改密码
          this.$parent.$parent.changePwdClosable = false
          this.$parent.$parent.changePsdDialogVisible = true
        }
      }
    },

    //获取验证码
    changeVerifyImg() {
      this.$api.captcha({ api: '/api/udc/management/passwd' }).then((res) => {
        this.verifyImg = res.captchaData
      })
    },

    remindPrompt() {
      if (this.remindModifyPwd == 1 && this.pwdLeftDays >= 0) {
        this.$confirm(
          this.$t('changePwd.detectionHave') + this.pwdLeftDays + this.$t('changePwd.detectionMustChangePwd'),
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('public.confirm'),
            type: 'warning',
            closeOnClickModal: false,
          }
        )
      }
      //  else if (this.remindModifyPwd == 2 || this.pwdLeftDays < 0) {
      //   this.$confirm(
      //     this.$t("changePwd.detectionMustChangePwdAlert"),
      //     this.$t("public.prompt"),
      //     {
      //       confirmButtonText: this.$t("public.confirm"),
      //       type: "warning",
      //       closeOnClickModal: false
      //     }
      //   );
      // }
    },

    //修改密码提交
    submitForm() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          // if (
          //   this.isEnable === 1 &&
          //   this.$refs.strengthMeter.getPasswordStrength.score === 1
          // ) {
          //   // 风险密码
          //   if (this.addDataForm.passwordSure.length < this.minLength) {
          //     this.$message.warning(
          //       `${this.$t('changePwd.passWordLength') + this.minLength}`
          //     )
          //   } else {
          //     this.$message.warning(`${this.$t('changePwd.weakPwdTips')}`)
          //   }
          //   return false
          // }
          let modifyPasswordObj = {
            // captcha: this.addDataForm.captcha,
            oldPasswd: crypto(this.addDataForm.password, sessionStorage.getItem('key')),
            newPasswd: crypto(this.addDataForm.newPassword, sessionStorage.getItem('key')),
          }
          modifyPassword(modifyPasswordObj).then((res) => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                // message: this.$t("changePwd.pwdChangeSuccess")
                message: this.$t('changePwd.pwdChangeSuccessLogin'),
              })
              this.$parent.$parent.changePsdDialogVisible = false
              // this.firstLogin = false;

              //修改密码后isActive=1
              getLoginUserInfo({}).then((res1) => {
                if (res1 && res1.userInfo && res1.userInfo.isActive == 1) {
                  sessionStorage.removeItem('firstLogin')
                }
              })

              // setTimeout(() => {
              //   this.$api.logout({}).then(() => {
              //     this.$router.push({ path: '/login' })
              //   })
              // }, 500)
            } else {
              //验证码
              this.changeVerifyImg()
            }
          })
        }
      })
    },
  },
  watch: {
    $route(to, from) {
      if (from.path === '/login') {
        this.firstLogin = JSON.parse(sessionStorage.getItem('firstLogin'))
        this.remindModifyPwd = sessionStorage.getItem('remindModifyPwd')
        this.pwdLeftDays = sessionStorage.getItem('pwdLeftDays')
        this.pwdStrengthScore = sessionStorage.getItem('pwdStrengthScore')

        this.getComplexity()

        if (this.remindModifyPwd == 1 || this.remindModifyPwd == 2) {
          this.remindPrompt()
        }
      }
    },
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
    },
  },
}
</script>

<style lang="scss" scoped>
.form-tips {
  color: #aaa;
}
.custom-dialog-content {
  font-size: 14px;
  padding: 30px 40px;
  box-sizing: border-box;
   .form-tips {
      margin-top: 4px;
      font-size: 12px;
      line-height: 1;
      color: #ccc;
    }
    .error {
      color: #f56c6c;
    }
}
.custom-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  .btn {
    width: 130px;
    &.el-button--default {
      background-color: transparent;
      color: #fff;
    }
  }
}
.changePwd {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;

  .firstLoginPrompt {
    margin-top: -10px;
    color: #f56c6c;
    text-align: center;
  }

  .validateCode {
    display: flex;
    justify-content: flex-start;
    .verify {
      width: 150px;
      height: 40px;
      margin-left: 15px;
      display: inline-block;
      border-radius: 6px;
      cursor: pointer;
    }
  }
}
</style>
