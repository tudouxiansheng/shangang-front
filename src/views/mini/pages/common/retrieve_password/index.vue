<template>
  <div id="retrieve-password">
    <div class="password">
      <div class="password-header">
        <img
          src="@/assets/img/common/password/password-monitor.png"
          alt
          style="display: inline-block"
        />
        <span class="header-title">{{ $t('rePassword.retrievePassword') }}</span>
      </div>
      <div class="password-content">
        <el-steps :active="active" finish-status="success" style="padding: 0 50px 50px 0">
          <el-step :title="$t('rePassword.retrieveWay')"></el-step>
          <el-step :title="$t('rePassword.resetPassword')"></el-step>
          <el-step :title="$t('rePassword.finish')"></el-step>
        </el-steps>
        <!-- 第一步 -->
        <div class="password-buttom" v-show="active == 0">
          <div class="buttom" @click="rePassword('mobile')">
            <img
              src="@/assets/img/common/password/password-mobile.png"
              alt
              style="display: inline-block; margin-right: 32px"
            />
            {{ $t('rePassword.backPhone') }}
          </div>
          <div class="buttom" @click="rePassword('email')">
            <img
              src="@/assets/img/common/password/password-email.png"
              alt
              style="display: inline-block; margin-right: 32px"
            />
            {{ $t('rePassword.backEmail') }}
          </div>
        </div>
        <!-- 手机重置（第二步） -->
        <el-form
          style="width: 80%; margin: 0 auto"
          v-show="active == 1"
          label-position="left"
          label-width="200px"
          ref="mobileForm"
          :model="mobileForm"
          :rules="mobileRules"
        >
          <!-- 绑定的手机号码 -->
          <el-form-item
            :label="$t('rePassword.mobile') + '：'"
            prop="mobile"
            v-if="isWay === 'mobile'"
          >
            <el-input
              v-model="mobileForm.mobile"
              :placeholder="$t('rePassword.inputMobile')"
              clearable
            />
          </el-form-item>

          <!-- 绑定邮箱 -->
          <el-form-item
            :label="$t('rePassword.email') + '：'"
            prop="email"
            v-if="isWay === 'email'"
          >
            <el-input
              v-model="mobileForm.email"
              :placeholder="$t('rePassword.inputEmail')"
              clearable
            />
          </el-form-item>

          <!-- 用户账户 -->
          <el-form-item :label="$t('rePassword.account') + '：'" prop="account">
            <el-input
              v-model="mobileForm.account"
              :placeholder="$t('rePassword.inputAccount')"
              clearable
            />
            <span style="font-size: 16px">（{{ $t('rePassword.tips') }}）</span>
          </el-form-item>

          <!-- 短信验证码 -->
          <el-form-item
            v-if="isWay === 'mobile'"
            :label="$t('rePassword.smsCode') + '：'"
            prop="smsCode"
            class="passwordCode"
          >
            <el-input
              v-model="mobileForm.smsCode"
              :placeholder="$t('rePassword.inputSmsCode')"
              clearable
            />
            <button
              @click.prevent="getShortMessageCode('mobile')"
              :disabled="!show || !show1"
              :class="[show ? '' : 'yanzhengma1', 'yanzhengma', show1 ? '' : 'yanzhengma2']"
            >
              <span v-show="show">{{ $t('rePassword.verificationCode') }}</span>
              <span v-show="!show">{{ $t('rePassword.sendAgain') }}({{ count }}s)</span>
            </button>
          </el-form-item>

          <!-- 邮箱验证码 -->
          <el-form-item
            v-if="isWay === 'email'"
            :label="$t('rePassword.emailCode') + '：'"
            prop="emailCode"
            class="passwordCode"
          >
            <el-input
              v-model="mobileForm.emailCode"
              :placeholder="$t('rePassword.inputEmailCode')"
              clearable
            />
            <button
              @click.prevent="getShortMessageCode('email')"
              :disabled="!show || !show1"
              :class="[show ? '' : 'yanzhengma1', 'yanzhengma', show1 ? '' : 'yanzhengma2']"
            >
              <span v-show="show">{{ $t('rePassword.verificationCode') }}</span>
              <span v-show="!show">{{ $t('rePassword.sendAgain') }}({{ count }}s)</span>
            </button>
          </el-form-item>

          <el-form-item :label="$t('rePassword.newPasswd') + '：'" prop="newPasswd">
            <el-input
              type="password"
              v-model="mobileForm.newPasswd"
              :placeholder="$t('rePassword.inputNewPasswd')"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('rePassword.checkPasswd') + '：'" prop="checkPasswd">
            <el-input
              type="password"
              v-model="mobileForm.checkPasswd"
              :placeholder="$t('rePassword.inputCheckPasswd')"
              clearable
            />
          </el-form-item>

          <div style="display: flex; justify-content: center; margin-left: 46px">
            <el-button type="primary" @click="previousStep">
              {{ $t('rePassword.lastStep') }}
            </el-button>
            <el-button type="primary" @click="submitForm">
              {{ $t('rePassword.finish') }}
            </el-button>
          </div>

          <ul class="tips" v-show="isEnable == 0 ? false : true">
            <li>{{ $t('rePassword.passwordTips') }}：</li>
            <span v-if="minLength">
              1、{{ $t('changePwd.pwdMinLength') }} {{ minLength }};
              <br />
            </span>
            <span v-for="item in rulesLength" :key="item.inDex">
              {{ item.inDex }}、{{ item.rule }};
              <br />
            </span>
          </ul>
        </el-form>
        <!-- 完成 （第三步）-->
        <div v-show="active == 2" class="step3">
          <div v-if="resultStatus" style="text-align: center">
            <img src="@/assets/img/common/password/password-success.png" alt />
            <h3 style="color: rgb(46, 119, 238)" class="text">
              {{ $t('rePassword.resetSuccess') }}！
            </h3>
          </div>
          <div v-if="!resultStatus" style="text-align: center">
            <img src="@/assets/img/common/password/password-error.png" alt />
            <h3 style="color: #f23a42" class="text">{{ $t('rePassword.resetError') }}！</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClientNonce } from '@/utils/common/getClientNonce'
import complex from '@/mixin/complex'
export default {
  name: 'ForgotPassword',
  mixins: [complex],
  props: {},
  data() {
    return {
      /**
       * 键盘字符表(小写)
       * 非shift键盘字符表
       */
      TABLE1: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\0', '\0'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\0', '\0', '\0']
      ],
      /**
       * shift键盘的字符表
       */
      TABLE2: [
        ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '\0', '\0'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '\0', '\0', '\0']
      ],
      active: 0,
      show: true,
      timer: 0,
      count: 0,
      mobileForm: {
        mobile: undefined,
        email: undefined,
        account: undefined,
        smsCode: undefined,
        emailCode: undefined,
        newPasswd: undefined,
        checkPasswd: undefined
      },
      resultStatus: false,
      mobileRules: null,
      isWay: '',
      show1: false
    }
  },
  computed: {},
  watch: {
    'mobileForm.mobile': {
      handler(val) {
        if (val) {
          this.$refs.mobileForm.validateField(['mobile'], valid => {
            if (valid) {
              this.show1 = false
            } else {
              this.show1 = true
            }
          })
        } else {
          this.show1 = false
        }
      }
    },
    'mobileForm.email': {
      handler(val) {
        if (val) {
          this.$refs.mobileForm.validateField(['email'], valid => {
            if (valid) {
              this.show1 = false
            } else {
              this.show1 = true
            }
          })
        } else {
          this.show1 = false
        }
      }
    }
  },
  async mounted() {
    const cuType = '4'
    const clientNonce = getClientNonce(4)
    sessionStorage.setItem('cuType', cuType)
    this.$store.dispatch('auth/setClientNonce', clientNonce)
 await this.getComplexity_rules()
    await this.setFormRules()
    //规避问题（未找到核心原因）
    this.$nextTick(() => {
      if (this.$refs.mobileForm) {
        this.$refs.mobileForm.resetFields()
      }
    })
  },
  methods: {
    setFormRules() {
      let reg = /^1\d{10}$/
      let mobileValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('rePassword.plInputMobile')))
        } else if (!reg.test(value)) {
          callback(new Error(this.$t('rePassword.plInput11')))
        } else {
          callback()
        }
      }
      let containsDigital = /^(?=.*[0-9])/
      let containsLowercase = /^(?=.*[a-z])/
      let containsUppercase = /^(?=.*[A-Z])/
      let containsSpecialCharacters =
        /^(?=.*[a-z])(?=.*[[ _`~!@#$%^&*()+=|{}':;,[\].<>/?！￥…（）—【】‘；：”“’。，、？]| | | ])/
      let newPasswdValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('rePassword.plInputNewPassword')))
        } else if (this.isEnable != 0) {
          if (this.minLength && value.length < this.minLength) {
            callback(new Error(`${this.$t('changePwd.pwdMinLength')}${this.minLength}`))
          } else if (this.rulesPassword.containsDigital && !containsDigital.test(value)) {
            callback(new Error(this.$t('changePwd.mustNum')))
          } else if (this.rulesPassword.containsLowercase && !containsLowercase.test(value)) {
            callback(new Error(this.$t('changePwd.mustLower')))
          } else if (this.rulesPassword.containsUppercase && !containsUppercase.test(value)) {
            callback(new Error(this.$t('changePwd.mustCaps')))
          } else if (
            this.rulesPassword.containsSpecialCharacters &&
            !containsSpecialCharacters.test(value)
          ) {
            callback(new Error(this.$t('changePwd.mustSpecial') + ": _`~!@#$%^&*()+=|{}':;,\\[].<>/?！￥…（）—【】‘；：”“’。，、？"))
          } else if (
            this.rulesPassword.containsNoRepeatLetter &&
            this.isContinuousChar(value)
          ) {
            callback(new Error(this.$t('changePwd.cantThreeRepeat')))
          } else if (
            this.rulesPassword.containsNoKeyboardRepeatLetter &&
            this.isKeyBoardContinuousChar(value)
          ) {
            callback(new Error(this.$t('changePwd.cantThreeKeyBoard')))
          } else {
            if (this.mobileForm.checkPasswd !== '') {
              this.$refs.mobileForm.validateField('checkPasswd')
            }
            callback()
          }
        } else {
          if (this.mobileForm.checkPasswd !== '') {
            this.$refs.mobileForm.validateField('checkPasswd')
          }
          callback()
        }
      }
      let checkPasswdValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('rePassword.plInputCheckPassword')))
        } else if (value !== this.mobileForm.newPasswd) {
          callback(new Error(this.$t('rePassword.twoPassword')))
        } else if (this.isEnable != 0) {
          if (this.minLength && value.length < this.minLength) {
            callback(new Error(`${this.$t('changePwd.pwdMinLength')}${this.minLength}`))
          } else if (this.rulesPassword.containsDigital && !containsDigital.test(value)) {
            callback(new Error(this.$t('changePwd.mustNum')))
          } else if (this.rulesPassword.containsLowercase && !containsLowercase.test(value)) {
            callback(new Error(this.$t('changePwd.mustLower')))
          } else if (this.rulesPassword.containsUppercase && !containsUppercase.test(value)) {
            callback(new Error(this.$t('changePwd.mustCaps')))
          } else if (
            this.rulesPassword.containsSpecialCharacters &&
            !containsSpecialCharacters.test(value)
          ) {
            callback(new Error(this.$t('changePwd.mustSpecial') + ": _`~!@#$%^&*()+=|{}':;,\\[].<>/?！￥…（）—【】‘；：”“’。，、？"))
          } else if (
            this.rulesPassword.containsNoRepeatLetter &&
            this.isContinuousChar(value)
          ) {
            callback(new Error(this.$t('changePwd.cantThreeRepeat')))
          } else if (
            this.rulesPassword.containsNoKeyboardRepeatLetter &&
            this.isKeyBoardContinuousChar(value)
          ) {
            callback(new Error(this.$t('changePwd.cantThreeKeyBoard')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      this.mobileRules = {
        mobile: [
          {
            required: true,
            validator: mobileValidator,
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('rePassword.plInputEmail'),
            trigger: 'blur'
          }
        ],
        smsCode: [
          {
            required: true,
            message: this.$t('rePassword.plInputSmsCode'),
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            required: true,
            message: this.$t('rePassword.plInputEmailCode'),
            trigger: 'blur'
          }
        ],
        newPasswd: [
          {
            required: true,
            validator: newPasswdValidator,
            trigger: 'change'
          }
        ],
        checkPasswd: [
          {
            required: true,
            validator: checkPasswdValidator,
            trigger: 'change'
          }
        ]
      }
    },
    isContinuousChar(password) {
      let chars = password.split('')
      for (let i = 0; i < chars.length - 2; i++) {
        let n1 = chars[i].charCodeAt()
        let n2 = chars[i + 1].charCodeAt()
        let n3 = chars[i + 2].charCodeAt()
        // 判断重复字符
        if (n1 == n2 && n1 == n3) {
          return true
        }
        // 判断连续字符： 正序 + 倒序
        if ((n1 + 1 == n2 && n1 + 2 == n3) || (n1 - 1 == n2 && n1 - 2 == n3)) {
          return true
        }
      }
      return false
    },
    isKeyBoardContinuousChar(password) {
      let lpStrChars = password.toLowerCase().split('')
      // 获取字符串长度
      let nStrLen = lpStrChars.length
      // 定义位置数组：row - 行，col - column 列
      let pRowCharPos = []
      let pColCharPos = []
      for (let i = 0; i < nStrLen; i++) {
        let chLower = lpStrChars[i]
        pColCharPos[i] = -1
        // 检索在表1中的位置，构建位置数组
        for (let nRowTable1Idx = 0; nRowTable1Idx < 4; nRowTable1Idx++) {
          for (let nColTable1Idx = 0; nColTable1Idx < 13; nColTable1Idx++) {
            if (chLower == this.TABLE1[nRowTable1Idx][nColTable1Idx]) {
              pRowCharPos[i] = nRowTable1Idx
              pColCharPos[i] = nColTable1Idx
            }
          }
        }
        // 在表1中没找到，到表二中去找，找到则continue
        if (pColCharPos[i] >= 0) {
          continue
        }
        // 检索在表2中的位置，构建位置数组
        for (let nRowTable2Idx = 0; nRowTable2Idx < 4; nRowTable2Idx++) {
          for (let nColTable2Idx = 0; nColTable2Idx < 13; nColTable2Idx++) {
            if (chLower == this.TABLE2[nRowTable2Idx][nColTable2Idx]) {
              pRowCharPos[i] = nRowTable2Idx
              pColCharPos[i] = nColTable2Idx
            }
          }
        }
      }
      // 匹配坐标连线
      for (let j = 1; j <= nStrLen - 2; j++) {
        //同一行
        if (pRowCharPos[j - 1] == pRowCharPos[j] && pRowCharPos[j] == pRowCharPos[j + 1]) {
          // 键盘行正向连续（asd）或者键盘行反向连续（dsa）
          if (
            (pColCharPos[j - 1] + 1 == pColCharPos[j] &&
              pColCharPos[j] + 1 == pColCharPos[j + 1]) ||
            (pColCharPos[j + 1] + 1 == pColCharPos[j] && pColCharPos[j] + 1 == pColCharPos[j - 1])
          ) {
            return true
          }
        }
        //同一列
        if (pColCharPos[j - 1] == pColCharPos[j] && pColCharPos[j] == pColCharPos[j + 1]) {
          //键盘列连续（qaz）或者键盘列反向连续（zaq）
          if (
            (pRowCharPos[j - 1] + 1 == pRowCharPos[j] &&
              pRowCharPos[j] + 1 == pRowCharPos[j + 1]) ||
            (pRowCharPos[j - 1] - 1 == pRowCharPos[j] && pRowCharPos[j] - 1 == pRowCharPos[j + 1])
          ) {
            return true
          }
        }
      }
      return false
    },
    rePassword(val) {
      this.isWay = val
      this.active = 1
    },
    previousStep() {
      if (this.active == 0) return
      this.active--
      if (this.$refs.mobileForm) {
        this.$refs.mobileForm.resetFields()
      }
    },
    submitForm() {
      let { mobile, email, account, smsCode, emailCode, newPasswd } = this.mobileForm
      this.$refs.mobileForm.validate(valid => {
        if (valid) {
          if (this.isWay === 'mobile') {
            this.$api
              .resetPassword({
                mobile,
                account: account ? account : undefined,
                smsCode,
                newPasswd: newPasswd
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.active++
                  this.resultStatus = true
                } else {
                  this.resultStatus = false
                }
              })
              .catch(() => {
                this.resultStatus = false
              })
          } else if (this.isWay === 'email') {
            this.$api
              .resetPasswordByEmail({
                email,
                account: account ? account : undefined,
                emailCode,
                newPasswd: newPasswd
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.active++
                  this.resultStatus = true
                } else {
                  this.resultStatus = false
                }
              })
              .catch(() => {
                this.resultStatus = false
              })
          }
        }
      })
    },
    // 获取短信验证码
    getShortMessageCode(data) {
      if (data === 'mobile') {
        this.$refs.mobileForm.validateField('mobile', valid => {
          if (!valid) {
            // 表单验证通过
            this.$api
              .fetchSmsCode({
                api: '/api/udc/management/passwd/reset',
                mobile: this.mobileForm.mobile
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: `${this.$t('rePassword.sendMobile')}...`
                  })
                  this.time()
                } else {
                  this.$message.error(`${this.$t('rePassword.sendError')}!`)
                }
              })
              .catch(() => {
                this.$message.error(`${this.$t('rePassword.sendError')}!`)
              })
          }
        })
      } else if (data === 'email') {
        this.$refs.mobileForm.validateField('email', valid => {
          if (!valid) {
            // 表单验证通过
            this.$api
              .fetchEmailCode({
                api: '/api/udc/management/passwd/reset-by-email',
                email: this.mobileForm.email
              })
              .then(res => {
                if (res.resultCode === 0) {
                  this.$message({
                    type: 'success',
                    message: `${this.$t('rePassword.sendEmail')}...`
                  })
                  this.time()
                } else {
                  this.$message.error(`${this.$t('rePassword.sendError')}!`)
                }
              })
              .catch(() => {
                this.$message.error(`${this.$t('rePassword.sendError')}!`)
              })
          }
        })
      }
    },
    time() {
      // 验证码倒计时
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
#retrieve-password {
  height: 100vh;
  width: 100vw;
  font-size: 18px;
  font-family: Source Han Sans CN;
  background-color: #f5f5f5;
  color: #999999;
  position: relative;
  .password {
    width: 1200px;
    height: 766px;
    position: absolute;
    top: -moz-calc((100vh - 766px) / 2);
    left: -moz-calc((100vw - 1200px) / 2);
    top: -webkit-calc((100vh - 766px) / 2);
    left: -webkit-calc((100vw - 1200px) / 2);
    top: calc((100vh - 766px) / 2);
    left: calc((100vw - 1200px) / 2);
  }
  .password-header {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }
  .header-title {
    font-size: 26px;
    font-weight: 400;
    color: #333333;
    vertical-align: middle;
    padding-left: 20px;
    margin-left: 20px;
    border-left: 1px solid #b3b3b3;
  }
  .password-content {
    min-height: 700px;
    min-width: 1200px;
    padding: 50px 109px;
    border-radius: 6px;
    background: #ffffff;
    .password-buttom {
      padding-top: 114px;
    }
    .buttom {
      font-size: 22px;
      width: 400px;
      height: 70px;
      background: hsla(212, 83%, 59%, 1);
      border-radius: 6px;
      margin: 0 auto;
      margin-bottom: 76px;
      text-align: center;
      line-height: 70px;
      color: #fff;
      cursor: pointer;
      &:hover {
        background: hsla(212, 83%, 59%, 0.8);
      }
    }
  }

  .el-step__icon.is-text {
    width: 24px;
    height: 24px;
    border: 1px solid #b3b3b3;
    border-radius: 50%;
    .el-step__icon-inner {
      font-size: 16px;
      font-weight: 400;
    }
  }
  .el-step__head.is-process,
  .el-step__head.is-success {
    color: #ffffff;
    border-color: hsla(212, 83%, 59%, 1);
    .el-step__icon.is-text {
      background: hsla(212, 83%, 59%, 1);
      border: 1px solid hsla(212, 83%, 59%, 1);
    }
  }
  .el-step__title.is-process,
  .el-step__title.is-success {
    font-weight: normal;
    color: hsla(212, 83%, 59%, 1);
    font-size: 20px;
  }
  .el-step__head.is-success {
    .el-step__line {
      height: 1px;
      background-color: hsla(212, 83%, 59%, 1);
      .el-step__line-inner {
        display: none !important;
      }
    }
  }
  .el-step__main {
    white-space: normal;
    text-align: left;
    position: absolute;
    top: -7px;
    left: 30px;
    width: 100%;
    word-break: keep-all;
  }
  .el-step__line {
    margin-right: 20px !important;
    margin-left: 126px;
    height: 1px;
    background-color: #cccccc;
  }
  .el-step__title {
    letter-spacing: 2px;
    font-size: 20px;
  }

  .el-form-item__error {
    font-size: 16px;
    top: 12px;
    left: 410px;
    width: 300px;
  }
  .el-form-item__label {
    font-weight: 400;
    color: #333333;
    font-size: 18px;
    line-height: 48px;
  }
  .el-input,
  .el-input--small .el-input__inner {
    width: 400px;
    height: 46px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 18px;
  }
  .passwordCode {
    .el-input,
    .el-input--small .el-input__inner {
      width: 258px;
    }
  }
  .el-form-item__content {
    display: flex;
    line-height: 40px;
  }
  .el-input__inner {
    color: #333;
    border-color: #cccccc;
  }
  .el-input__inner:focus,
  .el-input__inner:hover {
    border-color: hsla(212, 83%, 59%, 1);
  }
  .el-form-item.is-error .el-input__inner {
    border-color: #f56c6c;
  }

  .yanzhengma {
    display: inline-block;
    width: 132px;
    height: 46px;
    font-size: 18px;
    background: hsla(212, 83%, 59%, 1);
    border-radius: 4px;
    text-align: center;
    color: #ffffff;
    line-height: 46px;
    cursor: pointer;
    margin-left: 10px;
  }
  .yanzhengma1 {
    background: hsla(212, 100%, 87%, 1);
  }
  .yanzhengma2 {
    background: hsla(0, 0%, 78%, 1);
  }
  .el-button {
    width: 180px;
    height: 50px;
    background: #4292ed;
    border-radius: 4px;
    margin-right: 30px;
    font-size: 20px;
  }
  .tips {
    padding-top: 30px;
    font-size: 12px;
  }
  .step3 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 100px;
    .text {
      font-weight: bold;
      font-size: 20px;
      margin: 10px 0 0 35px;
    }
  }
}
</style>
