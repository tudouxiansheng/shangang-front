<template>
  <div class="login-body">
    <div class="login-form">
      <p class="login-title" :class="{'login-title-en': locale == 'en'}">
        {{ $t('login.loginTitle') }}
      </p>
      <div class="login">
        <div class="loginFront" v-show="loginState === LoginStateEnum.LOGIN">
          <el-form :model="ruleForm" status-icon ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="username" class="user">
              <el-input
                type="text"
                v-model.trim="ruleForm.username"
                autocomplete="off"
                class="username"
                :placeholder="$t('login.inputUserAccount')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password" class="pwd">
              <pwd-input
                class="password"
                v-model="ruleForm.password"
                @keydown.native.enter="submitForm('loginForm')"
                :placeholder="$t('public.psdPrompt')"
              />
            </el-form-item>
            <!-- //验证码 -->
            <div class="verify-form">
              <el-input
                type="text"
                autocomplete="off"
                class="input-verify"
                :placeholder="$t('login.inputVerifyCode')"
                v-model="ruleForm.captcha"
              ></el-input>
              <img :src="verifyImg" alt class="verify" @click="changeVerifyImg('login')" />
            </div>
            <div class="language">
              <span
                v-if="!$projectEnv.includes('SIOP')"
                style="cursor: pointer; color: #32d5ed"
                @click="retrievePasswordHandle"
              >
                {{ $t('public.forgetPassword') }}？
              </span>
              <el-checkbox
                name="type"
                v-model="ruleForm.agentType"
                :true-label="0"
                :false-label="1"
              >
                <span>{{ $t('login.VPNLogin') }}</span>
              </el-checkbox>
            </div>

            <div class="button-form">
              <el-button type="primary" @click="resetForm('loginForm')" class="reset_btn">
                {{ $t('login.reset') }}
              </el-button>
              <el-button
                type="primary"
                @click="submitForm('loginForm')"
                class="login_btn"
                v-preventReClick
              >
                {{ $t('login.login') }}
              </el-button>
            </div>
          </el-form>
          <div class="privacy">
            <div v-if="protocols.length">
              <span>{{ $t('login.Read') }}</span>
              <a v-for="(item, index) in protocols" :key="index" :href="item.url" target="_blank">
                《{{ item.title }}》
              </a>
            </div>
          </div>
        </div>
        <!-- 修改密码 -->
        <div class="loginBack" v-if="loginState === LoginStateEnum.RESET_PASSWORD">
          <el-form :model="addDataForm" :rules="rules1" ref="addDataForm">
            <el-form-item class="user" prop="password">
              <pwd-input
                class="username"
                v-model="addDataForm.password"
                :placeholder="$t('changePwd.enterOriginalPwd')"
              />
            </el-form-item>
            <el-form-item class="pwd" prop="newPassword">
              <el-popover
                placement="bottom"
                popper-class="break-changePwd"
                trigger="click"
                :disabled="isEnable ? false : true"
              >
                <div>
                  <span v-if="minLength != ''">
                    1、{{ $t('changePwd.pwdMinLength') }} {{ minLength }};
                    <br />
                  </span>
                  <span v-for="item in rulesLength" :key="item.inDex">
                    {{ item.inDex }}、{{ item.rule }};
                    <br />
                  </span>
                </div>
                <template #reference>
                  <pwd-input
                    class="password"
                    v-model="addDataForm.newPassword"
                    :placeholder="$t('changePwd.enterNewPwd')"
                  />
                </template>
              </el-popover>
              <strength-meter
                ref="strengthMeter"
                :password="addDataForm.newPassword"
                :min-length="this.minLength"
              />
            </el-form-item>
            <el-form-item class="pwd" prop="passwordSure">
              <pwd-input
                class="password"
                v-model="addDataForm.passwordSure"
                :placeholder="$t('changePwd.enterConfirmPwd')"
              />
            </el-form-item>
            <el-form-item prop="captcha">
              <div class="verify-form">
                <el-input
                  type="text"
                  class="input-verify"
                  autocomplete="off"
                  :placeholder="$t('login.inputVerifyCode')"
                  v-model="addDataForm.captcha"
                  clearable
                ></el-input>
                <img
                  :src="verifyImgForEdit"
                  alt
                  class="verify"
                  @click="changeVerifyImg('changePwd')"
                />
              </div>
            </el-form-item>
            <div class="button-form">
              <el-button type="primary" @click="backToLogin" class="reset_btn">
                {{ $t('public.cancel') }}
              </el-button>
              <el-button type="primary" @click="sureModifyPwd" class="login_btn">
                {{ $t('public.confirm') }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <el-dropdown id="client-download">
      <span class="el-dropdown-link">
        <i class="aci-cloud-download1" />
        {{ $t('public.downloadClient') }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="downloadClient('Win32')">Win32</el-dropdown-item>
          <el-dropdown-item @click="downloadClient('X64')">X64</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <app-footer
      :flavorObj="flavorObj"
      :footerStyle="{
        width: '100%',
        height: '20px'
      }"
    />

    <!-- license -->
    <license :license-data="licenseInfo" @getLicense="handleLicenseImported"></license>

    <el-dialog
      :title="protocolTitle"
      :class="protocolClass"
      :width="protocolTitleWidth"
      v-model="protocolVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @open="protocolOpen"
      @closed="protocolClosed"
      :show-close="false"
      :close-on-press-escape="false"
      draggable
    >
      <iframe
        v-if="!protocolUpdate"
        :src="protocolSrc"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
      <div v-else>
        <p>{{ $t('login.protocolContent1') }}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('login.protocolContent2') }}</p>
        {{ $t('login.protocolContent3') }}
        <el-link @click="protocolUpdate = false">{{ $t('login.protocolContent4') }}</el-link>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div v-if="!protocolUpdate" class="toggle-protocol">
            <el-link
              v-for="(item, index) in protocols"
              :key="index"
              type="primary"
              @click="toggleProtocolSrc(item.url)"
            >
              《{{ item.title }}》
              <span v-if="index != protocols.length - 1">、</span>
            </el-link>
          </div>
          <el-button
            type="primary"
            @click="handleAcceptProtocol"
            :disabled="!canSubmit"
            :loading="protocolLoading"
          >
            {{ $t('login.agreeProtocol') }}
            <span v-if="!canSubmit">({{ count + $t('login.second') }})</span>
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 签退提示弹框 -->
    <login-out v-model:logdialog-visible="loginOutVisible"></login-out>
  </div>
</template>

<script>
import { ArrowDown } from '@element-plus/icons-vue'
import { getFormatDate } from '@/utils/common/mutil'
import { genWaterMark } from '@/utils/common/watermark'
import { getClientNonce } from '@/utils/common/getClientNonce'
import complex from '@/mixin/complex'
import { mapState } from 'vuex'
import { lStorage, sStorage } from '@/utils/common/store'
import websocket from '@/utils/websocket'
import LoginOut from '@components/loginOut.vue'
import { downLoadExeFile } from '@/utils/common/download'

import license from '@/components/license' //license弹框
import appFooter from '@/components/app-footer' //底部
import strengthMeter from '@/components/strength-meter'
const LoginStateEnum = {
  LOGIN: 1,
  RESET_PASSWORD: 2
}
export default {
  components: {
    license,
    LoginOut,
    ArrowDown,
    'app-footer': appFooter,
    'strength-meter': strengthMeter
  },
  mixins: [complex],
  data() {
    return {
      locale: lStorage.get('locale') || 'zh',

      menus: [],

      verifyImg: '',
      verifyImgForEdit: '',

      ruleForm: {
        username: '',
        password: '',
        captcha: '',
        agentType: 1
      },
      addDataForm: {
        password: '',
        newPassword: '',
        passwordSure: '',
        captcha: ''
      },
      rules1: {},

      //license
      dialogVisible_license: false,
      licenseInfo: {},

      protocolLoading: false,
      protocolVisible: false,
      protocolSrc: '',
      canSubmit: false,
      count: 15,
      protocols: [],
      protocolUpdate: false,
      newData: getFormatDate(new Date()).substr(0, 10),
      loginOutVisible: false,
      LoginStateEnum: LoginStateEnum,
      loginState: LoginStateEnum.LOGIN
    }
  },
  computed: {
    ...mapState({
      flavorObj: state => state.flavor['flavorObj'],
      clientNonce: state => state.auth.clientNonce
    }),
    protocolClass() {
      return this.protocolUpdate ? 'protocol-update-dialog' : 'protocol-dialog'
    },
    protocolTitle() {
      return this.protocolUpdate ? this.$t('login.protocolTitle2') : this.$t('login.protocolTitle1')
    },
    protocolTitleWidth() {
      return this.protocolUpdate ? '600px' : '1200px'
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
      this.locale = lStorage.get('locale')
    }
  },
  async created() {
    await this.getComplexity_rules()
    this.setFormRules()
  },
  mounted() {
    this.setCuType()
    this.changeVerifyImg()
    this.getProtocols()
  },
  methods: {
    // 初始化获取水印是否开启
    async getWatermarkList() {
      const res = await this.$api.getContentWatermarkInfo({})
      if (res.resultCode !== 0 || !res.watermarkInfo) return
      this.getCanvasInfo(res.watermarkInfo)
    },
    getCanvasInfo(canvasInfo) {
      let contentDess = canvasInfo.content
      let textAlign = 'left'
      let rotateDegree = canvasInfo.angle
      let options = {
        className: 'water-mark',
        width: 1920,
        height: 1080,
        content: contentDess,
        fontSize: canvasInfo.size,
        font: canvasInfo.size + 'px' + ' ' + 'Vedana',
        color: canvasInfo.colour,
        opacity: canvasInfo.clarityLevel * 100,
        rotateDegree: rotateDegree,
        zIndex: 10000,
        textAlign: textAlign
      }

      sessionStorage.setItem('waterMark', JSON.stringify(options))
      return genWaterMark(options)
    },
    retrievePasswordHandle() {
      let Logistics = this.$router.resolve({
        path: '/retrieve_password'
      })
      const newWindow = window.open(Logistics.href, '_blank')
      newWindow.opener = null
    },
    setFormRules() {
      let validatePsw1 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('changePwd.enterOriginalPwd')))
        } else {
          callback()
        }
      }

      let validatePsw2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('changePwd.enterConfirmPwd')))
        } else if (value !== this.addDataForm.newPassword) {
          callback(new Error(this.$t('changePwd.consistentPwd')))
        } else {
          callback()
        }
      }

      let validateNewPwd = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('changePwd.enterNewPwd')))
        } else {
          callback()
        }
      }
      this.rules1 = {
        password: [{ required: true, validator: validatePsw1, trigger: 'change' }],
        newPassword: [{ required: true, validator: validateNewPwd, trigger: 'change' }],
        passwordSure: [{ required: true, validator: validatePsw2, trigger: 'change' }],
        captcha: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('login.inputVerifyCode')
          }
        ]
      }
    },
    // 判断平台类型
    setCuType() {
      const cuType = '4'
      const clientNonces = getClientNonce(4)
      sessionStorage.setItem('cuType', cuType)
      this.$store.dispatch('auth/setClientNonce', clientNonces)
    },
    //用户权限列表
    async getUserPermissions() {
      this.$api.selectUserPermissions({}).then(res => {
        if (res.resultCode == 0) {
          sStorage.set('userPermList', res.permList)
        }
      })
    },

    //获取验证码
    changeVerifyImg(type = 'login') {
      if (type == 'login') {
        this.$api.captcha({ api: '/api/user/login' }).then(res => {
          this.verifyImg = res.captchaData
        })
      } else if (type == 'changePwd') {
        this.$api.captcha({ api: '/api/udc/management/passwd' }).then(res => {
          this.verifyImgForEdit = res.captchaData
        })
      }
    },

    // 用户登录
    userLogin(data) {
      sessionStorage.setItem('account', data.username)
      this.$store
        .dispatch('user/Login', data)
        .then(async res => {
          const {
            resultCode,
            userInfo,
            accountStatus,
            accessToken,
            refreshToken,
            sessionId,
            licenseExpired,
            privacyAgreed,
            lastLoginHistoryInfo,
            waitOperateLimit,
            heartBeatInterval,
            version
          } = res
          if (resultCode == 0) {
            this.$store.dispatch('auth/setClientNonce', sessionId)
            this.$store.dispatch('auth/setRefreshToken', refreshToken)
            this.$store.dispatch('auth/setAccessToken', accessToken)
            this.$store.dispatch('user/setUserInfo', userInfo)
            sessionStorage.setItem('userId', userInfo.userId)
            sessionStorage.setItem('username', userInfo.userName)
            sessionStorage.setItem('organizationId', userInfo.organizationId)
            sessionStorage.setItem('belongTenantId', userInfo.belongTenantId)
            // websocket登录建立连接
            if (!websocket.getWebSocket() && sStorage.get('cuType') != 1) {
              websocket.Init(accessToken)
            }

            // 上次登录信息
            this.$store.commit('user/SET_VERSION', version)
            this.$store.commit('user/SET_LAST_LOGIN_INFO', lastLoginHistoryInfo)
            if (licenseExpired) {
              this.getLicense()
              return
            }
            //过期时间
            this.$store.commit('init_time/SET_EXPIRETIME', waitOperateLimit * 60)
            //心跳保活周期
            this.$store.commit('init_time/SET_HEARTBEATINT', heartBeatInterval)
            sessionStorage.setItem('pwdStrengthScore', this.checkPwdStrength(data.password))

            // 账户锁定
            if (userInfo.isLocked && userInfo.isLocked == 1) {
              this.$alert(this.$t('login.accountLocked'), this.$t('login.waring'), {
                confirmButtonText: this.$t('public.confirm'),
                type: 'warning'
              })
              return
            }

            if (userInfo.firstLogin == 1) {
              sStorage.set('firstLogin', true)
              if (this.modifyOnFirstLogin == 1 && accountStatus.remindModifyPwd == 2) {
                this.$message({
                  type: 'error',
                  message: this.$t('changePwd.firstLoginTips'),
                  duration: 5 * 1000
                })
                this.changeVerifyImg('changePwd')
                this.frontToBack()
                return
              }
            } else if (res.userInfo.firstLogin == 0) {
              sStorage.set('firstLogin', false)
            }

            if (accountStatus) {
              if (accountStatus.remindModifyPwd != 0) {
                sStorage.set('remindModifyPwd', accountStatus.remindModifyPwd)
                sStorage.set('pwdLeftDays', accountStatus.pwdLeftDays)
              }

              // 密码过期
              if (accountStatus.remindModifyPwd == 2) {
                this.$message({
                  type: 'error',
                  message: this.$t('changePwd.detectionMustChangePwdAlert')
                })
                this.changeVerifyImg('changePwd')
                this.frontToBack()
                return
              }
            }
            if (!this.$projectEnv.includes('SIOP') && !privacyAgreed) {
              this.$api.queryBehaviorState({}).then(res => {
                if (res.resultCode == 0) {
                  if (res.state != 1) {
                    this.protocols = res.protocols
                    this.protocolSrc = res.protocols[0].url
                    this.protocolUpdate = !!res.update
                    this.protocolVisible = true
                  }
                }
              })
            } else {
              await this.redirectIndex()
            }
          } else {
            this.changeVerifyImg()
          }
        })
        .catch(error => {
          if (error.response) {
            const { resultCode, resultDesc } = error.response.data
            if (resultCode == 100002) {
              this.$alert(this.$t('login.userNameOrPwdWrong'), this.$t('login.waring'), {
                confirmButtonText: this.$t('public.confirm'),
                type: 'warning'
              })
            } else {
              this.$alert(`${resultDesc}`, this.$t('login.waring'), {
                confirmButtonText: this.$t('public.confirm'),
                type: 'warning'
              })
            }
          }
          this.changeVerifyImg()
        })
    },

    // 获取菜单
    async getMenuList() {
      const res = await this.$api.selectMenus({})
      if (res.resultCode === 0) {
        sStorage.set('menuList', res.menuList)
        this.menus = res.menuList
      } else if (res.resultCode === 100021) {
        this.$api.logout({}).then(() => {
          this.refreshPage()
        })
      }
    },
    async redirectIndex() {
      await this.getMenuList()

      //用户权限列表
      await this.getUserPermissions()

      await this.getWatermarkList()
      this.$store.commit('menu/set_options')
      this.$store.commit('menu/clear_cached_views')
      let obj = {}
      if (this.menus[0].children) {
        obj = this.menus[0].children[0]
      } else {
        obj = this.menus[0]
      }
      let menuName = this.locale == 'en' ? obj.menuNameEn : obj.menuName
      this.$store.dispatch('menu/addView', {
        route: obj.path,
        name: menuName,
        id: obj.menuId.toString()
      })
      this.$router.push({
        path: obj.path
      })
    },
    submitForm(formName) {
      if (!this.ruleForm.username) {
        this.$notify({
          title: this.$t('login.waring'),
          message: this.$t('login.userNameNoEmpty'),
          type: 'warning'
        })
        this.changeVerifyImg()
        return
      }
      if (!this.ruleForm.password) {
        this.$notify({
          title: this.$t('login.waring'),
          message: this.$t('login.passwordNoEmpty'),
          type: 'warning'
        })
        this.changeVerifyImg()
        return
      }
      if (!this.ruleForm.captcha) {
        this.$notify({
          title: this.$t('login.waring'),
          message: this.$t('login.inputVerifyCode'),
          type: 'warning'
        })
        this.changeVerifyImg()
        return
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          let { username, password, captcha, agentType } = this.ruleForm
          this.userLogin({
            username,
            password,
            captcha,
            agentType
          })
        }
      })
    },
    //翻页
    frontToBack() {
      if (this.loginState === LoginStateEnum.LOGIN) {
        this.resetForm('loginForm')
      }

      if (this.loginState === LoginStateEnum.RESET_PASSWORD) {
        this.resetForm('addDataForm')
      }

      this.loginState =
        this.loginState === LoginStateEnum.LOGIN
          ? LoginStateEnum.RESET_PASSWORD
          : LoginStateEnum.LOGIN
    },
    backToLogin() {
      this.$api.logout({}).then(() => {
        sStorage.clear()
        this.$store.dispatch('auth/setClientNonce', '')
        this.$store.dispatch('auth/setRefreshToken', '')
        this.$store.dispatch('auth/setAccessToken', '')
        this.setCuType()
        this.changeVerifyImg()
        this.frontToBack()
      })
    },
    //修改密码
    sureModifyPwd() {
      this.$refs['addDataForm'].validate(valid => {
        if (valid) {
          if (this.isEnable === 1 && this.$refs.strengthMeter.getPasswordStrength.score === 1) {
            // 风险密码
            if (this.addDataForm.passwordSure.length < this.minLength) {
              this.$message.warning(`${this.$t('changePwd.passWordLength') + this.minLength}`)
            } else {
              this.$message.warning(`${this.$t('changePwd.weakPwdTips')}`)
            }
            return false
          }
          this.$api
            .firstModifyPassword({
              captcha: this.addDataForm.captcha,
              oldPasswd: this.addDataForm.password,
              newPasswd: this.addDataForm.newPassword,
              newPasswdRepeat: this.addDataForm.passwordSure
            })
            .then(res => {
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('changePwd.pwdChangeSuccessLogin')
                })
                this.changeVerifyImg()
                this.frontToBack()
              } else {
                //验证码
                this.changeVerifyImg('changePwd')
              }
            })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      if (formName === 'loginForm') {
        this.ruleForm = {
          username: '',
          password: '',
          captcha: '',
          agentType: 1
        }
      } else {
        this.addDataForm = {
          password: '',
          newPassword: '',
          passwordSure: '',
          captcha: ''
        }
      }
    },
    // 语言
    langChange(val) {
      localStorage.setItem('locale', val)
      this.$i18n.locale = val
    },
    //license
    async getLicense() {
      let res = await this.$api.getLicenseInfo({})
      if (res.resultCode == 0) {
        this.licenseInfo = res
        this.dialogVisible_license = true
      }
    },
    protocolOpen() {
      this.canSubmit = false
      this.count = 15
      let timer = setInterval(() => {
        this.count--
        if (this.count <= 0) {
          this.canSubmit = true
          clearInterval(timer)
        }
      }, 1000)
    },
    protocolClosed() {
      this.canSubmit = false
      this.count = 15
    },
    handleAcceptProtocol() {
      this.protocolLoading = true
      this.$api
        .acceptBehavior({})
        .then(res => {
          if (res.resultCode === 0) {
            this.$message({
              type: 'success',
              message: this.$t('public.operatingSuccessContent')
            })
            this.redirectIndex()
          }
        })
        .finally(() => {
          this.protocolLoading = false
        })
    },
    toggleProtocolSrc(url) {
      this.protocolSrc = url
    },
    getProtocols() {
      if (this.$projectEnv.includes('SIOP')) {
        return
      }
    },
    handleLicenseImported() {
      this.$api.logout({}).then(() => {
        this.refreshPage()
      })
    },
    refreshPage() {
      sStorage.clear()
      this.$store.dispatch('auth/setClientNonce', '')
      this.$store.dispatch('auth/setRefreshToken', '')
      this.$store.dispatch('auth/setAccessToken', '')
      window.location.reload()
    },
    downloadClient(type) {
      let name = ''
      if (type == 'X64') {
        name = 'acs_client_unified_Setup_x64.exe'
      } else {
        name = 'acs_client_unified_Setup_Win32.exe'
      }
      const url = location.origin + '/operation/pc/' + name
      downLoadExeFile(url)
    }
  }
}
</script>

<style lang="scss">
.login-body {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/common/Login1.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 14px;
  box-sizing: border-box;
  .login-form {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    width: 460px;
    height: 564px;
    background: url('~@/assets/img/common/LoginBg.png');
    background-size: 100% 100%;
  }
  .login-title {
    margin: 75px 0 23px 0;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 33px;
    font-weight: 400;
    color: rgba(206, 213, 220, 1);
  }
  .login-title-en {
    font-size: 26px;
  }
  .login {
    width: 100%;
    position: relative;
    margin: 0px auto;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .loginFront {
      text-align: center;
    }
    .el-form {
      box-sizing: content-box;
      width: 400px;
    }
    .el-input {
      height: 48px;
      border: 1px solid rgba(54, 229, 255, 1);
      box-shadow: 1px 1px 5px 1px #36e5ff;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      border-radius: 4px;
      .el-input__wrapper {
        background-color: transparent;
      }
      .el-input__inner {
        background-color: transparent;
        border: none;
      }
    }
    .el-checkbox__inner {
      background-color: transparent;
      border-color: #36e5ff;
    }
    .user,
    .pwd {
      margin-bottom: 32px;
    }
    .username,
    .password {
      width: 100%;
      height: 48px;
    }

    .verify-form {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 400px;

      img.verify {
        width: 162px;
        height: 48px;
        border-radius: 4px;
        cursor: pointer;
      }
      .input-verify {
        width: 220px;
      }
    }

    .language {
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      .el-input__inner {
        border: none;
        height: 24px;
        box-shadow: none;
        width: 110px;
        text-align: right;
      }
      .el-select .el-input .el-select__caret {
        line-height: 24px;
        color: #fff;
      }
      .lang-select {
        position: absolute !important;
        top: 20px !important;
        left: 0px !important;
        border: 1px solid #e4e7ed !important;
        background-color: #fff !important;
        .el-scrollbar {
          background-color: #fff !important;
        }
        .popper__arrow,
        .popper__arrow::after {
          border-color: transparent !important;
          border-bottom-color: #ebeef5 !important;
          border-top-color: #ebeef5 !important;
        }
        .el-select-dropdown__item {
          color: #606266 !important;
        }
        .el-select-dropdown__item.hover,
        .el-select-dropdown__item:hover {
          background-color: #f5f7fa !important;
        }
      }
      .el-checkbox__label {
        color: #fff;
      }
    }
    .el-button {
      font-size: 14px;
    }
    .button-form {
      width: 300px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 25px 0 20px 50px;
    }
    button.login_btn,
    button.reset_btn {
      background: #32d5ed;
      color: #ffffff;
      border-radius: 4px;
      width: 100px;
      height: 48px;
      border: none;
    }
    button.login_btn:hover {
      background: #32d5ed;
    }
    button.reset_btn {
      background: #737373;
    }

    .privacy {
      height: 30px;
      line-height: 30px;
      text-align: center;
      .el-checkbox {
        margin-right: 10px !important;
      }
      .el-checkbox__inner {
        background: transparent;
      }
      span {
        color: #ced5dc;
      }
      a {
        color: #32d5ed;
        text-decoration: none;
      }
    }

    .senior-set {
      width: 400px;
      padding: 0 50px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .serverAdd .el-input__inner {
        width: 220px;
      }
      .port .el-input__inner {
        width: 160px;
      }
    }
  }

  .loginFront,
  .loginBack {
    height: 480px;
  }

  .loginBack {
    .el-form-item__label {
      line-height: 45px;
    }
    .el-form-item__error {
      padding-top: 8px;
    }
  }

  .strength-meter-bar-wrapper {
    width: 400px;
    & .strength-meter-bar::before,
    & .strength-meter-bar::after {
      border-color: #062333;
    }
  }
  #client-download {
    position: fixed;
    top: 20px;
    right: 20px;
    font-size: 16px;
    color: #fff;
    .aci-cloud-download1:before {
      position: absolute;
      top: 7px;
      left: -25px;
    }
  }
}
.protocol-dialog {
  .el-dialog__body {
    padding: 0;
    height: 65vh;
    overflow: hidden;
  }

  .toggle-protocol {
    position: absolute;
    left: 40px;
    bottom: 21px;
  }
}
.protocol-update-dialog {
  .el-dialog__body {
    padding: 0 20px 20px;

    .el-link {
      vertical-align: top;
      color: #409eff;
    }
  }
}
</style>