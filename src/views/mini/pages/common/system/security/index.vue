<template>
  <div id="security" v-if="isRouterAlive" ref="systemSecurity">
    <!-- 安全管理 -->
    <div class="accountManage">
      <h2 style="align-self: start; color: #fff; margin-left: 250px; font-size: 16px">
        {{ $t('security.accountManagement') }}
      </h2>
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        :label-width="locale == 'en' ? '320px' : '210px'"
        size="small"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <el-form-item
          :label="$t('security.loginSuccessfullySendSMSSwitch') + ' ：'"
          prop="sendMessage"
        >
          <span class="lessThree" :style="locale == 'en' ? { left: '-259px' } : ''">
            {{ $t('security.noSMSMessagesWillBeSentWhenItIsOff') }}
          </span>
          <el-switch
            v-model="dataForm.sendMessage"
            active-color="#0085d0"
            inactive-color="#dee2e6"
          ></el-switch>
        </el-form-item>

        <el-form-item :label="$t('security.accountLockInterval') + ' ：'" prop="period">
          <el-input
            type="number"
            v-model="dataForm.period"
            auto-complete="off"
            :placeholder="$t('security.fillInZeroForInfiniteTime')"
          />
        </el-form-item>

        <el-form-item :label="$t('security.accountLockingThreshold') + ' ：'" prop="threshold">
          <el-input type="number" v-model="dataForm.threshold" auto-complete="off" placeholder />
        </el-form-item>

        <el-form-item :label="$t('security.accountLockingDuration') + ' ：'" prop="duration">
          <el-input type="number" v-model="dataForm.duration" auto-complete="off" placeholder />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAccount" v-if="PermissionManage">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </div>

    <!-- //密码 -->
    <div class="passwordManage">
      <h2 style="align-self: start; color: #fff; margin-left: 250px; font-size: 16px">
        {{ $t('security.passworManagement') }}
      </h2>
      <el-form
        ref="pwdDataForm"
        :model="pwdDataForm"
        :rules="rulesPwd"
        :label-width="locale == 'en' ? '390px' : '220px'"
        size="small"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <div style="margin-left: -140px">
          <el-form-item :label="$t('security.firstLoginSwitch') + ' ：'" prop="modifyOnFirstLogin">
            <el-switch
              class="alwaysLight"
              v-model="pwdDataForm.modifyOnFirstLogin"
              active-color="#0085d0"
              inactive-color="#dee2e6"
              disabled
              @click.native="handlePwdFirstLoginRuleChange"
            ></el-switch>
          </el-form-item>

          <el-form-item
            :label="$t('security.whetherToEnableThePasswordRuleSwitch') + ' ：'"
            prop="isEnable"
          >
            <el-switch
              class="alwaysLight"
              v-model="pwdDataForm.isEnableOnoff"
              active-color="#0085d0"
              inactive-color="#dee2e6"
              disabled
              @click.native="handlePwdRuleChange"
            ></el-switch>
          </el-form-item>
        </div>

        <div>
          <el-form-item
            :label="$t('security.passwordComplexityRequirement') + ' ：'"
            prop="complexity"
            style="display: flex; margin-top: 50px"
          >
            <span class="lessThree" :style="locale == 'en' ? { left: '-183px' } : ''">
              {{ $t('security.chooseAtLeastThree') }}
            </span>
            <el-checkbox
              v-model="pwdDataForm.containsUppercase"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.passwordsMustContainCapitalLetters') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsLowercase"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.passwordsMustContainLowercaseLetters') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsDigital"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.thePasswordMustContainANumber') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsSpecialCharacters"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.thePasswordMustContainSpecialSymbols') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsNoRepeatLetter"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.doNotAllowMoreThanThreeConsecutiveOrRepeatedLettersAndNumbers') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsNoKeyboardRepeatLetter"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.keyboardSortingWithMoreThanThreeCharactersIsProhibited') }}
            </el-checkbox>
            <br />
            <el-checkbox
              v-model="pwdDataForm.containsNoAccount"
              class="check"
              :disabled="!pwdDataForm.isEnableOnoff"
            >
              {{ $t('security.pwdNoAcc') }}
            </el-checkbox>
          </el-form-item>

          <el-form-item :label="$t('security.pwdLength') + ' ：'" prop="minLength">
            <el-input
              type="number"
              v-model="pwdDataForm.minLength"
              auto-complete="off"
              placeholder
              :disabled="!pwdDataForm.isEnableOnoff"
            />
          </el-form-item>

          <el-form-item :label="$t('security.repeatedTimes') + ' ：'" prop="historyRepeats">
            <el-input
              type="number"
              v-model="pwdDataForm.historyRepeats"
              auto-complete="off"
              :placeholder="$t('security.ifZeroHistoryPwd')"
              :disabled="!pwdDataForm.isEnableOnoff"
            />
            <p style="margin: 0px; color: #f56c6c">
              {{ $t('security.usedPwdCantNew') }}
            </p>
          </el-form-item>

          <el-form-item :label="$t('security.pwdExpirationSwitch') + ' ：'" prop="expireDaysOnoff">
            <el-switch
              v-model="pwdDataForm.expireDaysOnoff"
              active-color="#0085d0"
              inactive-color="#dee2e6"
              :disabled="!pwdDataForm.isEnableOnoff"
            ></el-switch>
          </el-form-item>

          <el-form-item
            :label="$t('security.shortestExpireMinutes') + ' ：'"
            prop="shortestExpireMinutes"
            v-if="pwdDataForm.expireDaysOnoff"
          >
            <el-input
              type="number"
              v-model="pwdDataForm.shortestExpireMinutes"
              auto-complete="off"
              :placeholder="$t('security.enterShortestExpireMinutes')"
            />
          </el-form-item>

          <el-form-item
            :label="$t('security.pwdExpiration') + ' ：'"
            prop="expireDays"
            v-if="pwdDataForm.expireDaysOnoff"
          >
            <el-input
              type="number"
              v-model="pwdDataForm.expireDays"
              auto-complete="off"
              :placeholder="$t('security.enterPwdExpiration')"
              :disabled="!pwdDataForm.isEnableOnoff"
            />
          </el-form-item>

          <el-form-item
            :label="$t('security.pwdExpirationAlertSwitch') + ' ：'"
            prop="modifyRemindDaysOnoff"
            v-if="pwdDataForm.expireDaysOnoff"
          >
            <el-switch
              v-model="pwdDataForm.modifyRemindDaysOnoff"
              active-color="#0085d0"
              inactive-color="#dee2e6"
              :disabled="!pwdDataForm.isEnableOnoff"
            ></el-switch>
          </el-form-item>

          <el-form-item
            :label="$t('security.pwdExpirationAlertDays') + ' ：'"
            prop="modifyRemindDays"
            v-if="pwdDataForm.modifyRemindDaysOnoff && pwdDataForm.expireDaysOnoff"
          >
            <el-input
              type="number"
              v-model="pwdDataForm.modifyRemindDays"
              auto-complete="off"
              :placeholder="$t('security.enterPwdExpirationAlertDays')"
              :disabled="!pwdDataForm.isEnableOnoff"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-bottom: 20px">
        <el-button type="primary" @click="submitPwd" v-if="PermissionManage">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
export default {
  name: 'SecurityManagement',
  data() {
    return {
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      rules: {},
      rulesPwd: {},
      dataForm: {
        sendMessage: '',
        duration: '',
        threshold: '',
        period: '10'
      },
      pwdDataForm: {
        isEnable: 6,
        isEnableOnoff: '',
        containsUppercase: '',
        containsLowercase: '',
        containsDigital: '',
        containsSpecialCharacters: '',
        containsNoRepeatLetter: '',
        containsNoKeyboardRepeatLetter: '',
        containsNoAccount: '',
        minLength: '',
        historyRepeats: '',
        modifyOnFirstLogin: '',
        modifyOnFirstLoginOnoff: '',
        expireDays: '',
        shortestExpireMinutes: '',
        expireDaysOnoff: '',
        modifyRemindDays: '',
        modifyRemindDaysOnoff: ''
      }
    }
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getAccountRules()
    this.getPwdRules()
    this.setFormRules()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(80)
    },
    setFormRules() {
      var validateDuration = (rule, value, callback) => {
        const reg = /^([1-9]|[1-9]\d{1,2}|1[0-3]\d{2}|14[0-3]\d{1}|1440)$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.accOneToOneFourFourZero')))
        } else {
          callback()
        }
      }

      var validateThreshold = (rule, value, callback) => {
        const reg = /^([1-9]|[1-9][0-9])$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.accOneToNineNine')))
        } else {
          callback()
        }
      }

      var validatePeriod = (rule, value, callback) => {
        const reg = /^([0-9]|[1-9][0-9]{1,2})$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.accZeroToNineNineNine')))
        } else {
          callback()
        }
      }

      var validateCheck = (rule, value, callback) => {
        let checks = document.getElementsByClassName('el-checkbox check is-checked')
        if (checks.length < 3) {
          callback(new Error(this.$t('security.pwdThree')))
        } else {
          callback()
        }
      }

      var validateMinLength = (rule, value, callback) => {
        const reg = /^([8-9]|1[0-6])$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.pwdFourToOneSix')))
        } else {
          callback()
        }
      }

      var validateHistory = (rule, value, callback) => {
        const reg = /^([0-9]|1[0-6])$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.pwdZeroToOneSix')))
        } else {
          callback()
        }
      }

      var validateExpireDays = (rule, value, callback) => {
        const reg = /^([1-9]|[1-9][0-9])$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.pwdOneToNineNine')))
        } else {
          if (this.pwdDataForm.shortestExpireMinutes !== '' && value != 0) {
            this.$refs.pwdDataForm.validateField('shortestExpireMinutes')
          }
          callback()
        }
      }

      var validateShortExpireDays = (rule, value, callback) => {
        const reg = /^(0|[1-9][0-9]{0,3})$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.shortestExpireMinutesPrompt1')))
        } else if (
          this.pwdDataForm.expireDays != 0 &&
          value > this.pwdDataForm.expireDays * 60 * 24
        ) {
          callback(new Error(this.$t('security.shortestExpireMinutesPrompt2')))
        } else {
          callback()
        }
      }

      var validateRemindDays = (rule, value, callback) => {
        const reg = /^([1-9]|[1-9][0-9])$/
        if (value === '' || !reg.test(value)) {
          callback(new Error(this.$t('security.pwdAlertOneToNineNine')))
        } else if (Number(value) > Number(this.pwdDataForm.expireDays)) {
          callback(new Error(this.$t('security.pwdAlertCantOver')))
        } else {
          callback()
        }
      }
      this.rules = {
        duration: [{ required: true, trigger: 'blur', validator: validateDuration }],
        threshold: [{ required: true, trigger: 'blur', validator: validateThreshold }],
        period: [{ required: true, trigger: 'blur', validator: validatePeriod }]
      }
      this.rulesPwd = {
        minLength: [{ required: true, trigger: 'blur', validator: validateMinLength }],
        historyRepeats: [{ required: true, trigger: 'blur', validator: validateHistory }],

        expireDays: [{ required: true, trigger: 'blur', validator: validateExpireDays }],
        shortestExpireMinutes: [
          {
            required: true,
            trigger: 'blur',
            validator: validateShortExpireDays
          }
        ],
        modifyRemindDays: [{ required: true, trigger: 'blur', validator: validateRemindDays }]
      }
    },
    getAccountRules() {
      this.$api.getConfigurationAcc({}).then(res => {
        if (res.resultCode == 0) {
          this.dataForm.sendMessage = Boolean(res.sendMessage)
          this.dataForm.duration = res.duration
          this.dataForm.threshold = res.threshold
          this.dataForm.period = res.period
        }
      })
    },
    submitAccount() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let obj = {}
          obj.sendMessage = Number(this.dataForm.sendMessage)
          obj.duration = Number(this.dataForm.duration)
          obj.threshold = Number(this.dataForm.threshold)
          obj.period = Number(this.dataForm.period)

          this.$api.setConfigurationAcc(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                message: this.$t('security.accSetSuccess'),
                type: 'success'
              })
              this.getAccountRules()
            }
          })
        }
      })
    },

    //密码
    getPwdRules() {
      this.$api.getConfiguration({}).then(res => {
        if (res.resultCode == 0) {
          this.pwdDataForm.isEnable = res.isEnable
          this.pwdDataForm.isEnableOnoff = Boolean(res.isEnable)

          this.pwdDataForm.containsUppercase = Boolean(res.complexity.containsUppercase)
          this.pwdDataForm.containsLowercase = Boolean(res.complexity.containsLowercase)
          this.pwdDataForm.containsDigital = Boolean(res.complexity.containsDigital)
          this.pwdDataForm.containsSpecialCharacters = Boolean(
            res.complexity.containsSpecialCharacters
          )
          this.pwdDataForm.containsNoRepeatLetter = Boolean(res.complexity.containsNoRepeatLetter)
          this.pwdDataForm.containsNoKeyboardRepeatLetter = Boolean(
            res.complexity.containsNoKeyboardRepeatLetter
          )
          this.pwdDataForm.containsNoAccount = Boolean(res.complexity.containsNoAccount)

          this.pwdDataForm.minLength = res.minLength
          this.pwdDataForm.historyRepeats = res.historyRepeats

          this.pwdDataForm.expireDays = res.expireDays
          this.pwdDataForm.shortestExpireMinutes = res.shortestExpireMinutes
          this.pwdDataForm.expireDaysOnoff =
            Boolean(res.expireDays) || Boolean(res.shortestExpireMinutes)
          this.pwdDataForm.modifyOnFirstLogin = Boolean(res.modifyOnFirstLogin)
          this.pwdDataForm.modifyRemindDays = res.modifyRemindDays
          this.pwdDataForm.modifyRemindDaysOnoff = Boolean(res.modifyRemindDays)
        }
      })
    },
    handlePwdFirstLoginRuleChange() {
      const enable = Boolean(this.pwdDataForm.modifyOnFirstLogin)
      if (!enable) {
        this.pwdDataForm.modifyOnFirstLogin = true
        return
      }
      this.$confirm(
        this.$t('security.modifyOnFirstLoginRulesClosePrompt'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        }
      )
        .then(async () => {
          this.pwdDataForm.modifyOnFirstLogin = false
        })
        .catch(() => {})
    },
    handlePwdRuleChange() {
      const enable = Boolean(this.pwdDataForm.isEnableOnoff)
      if (!enable) {
        this.pwdDataForm.isEnableOnoff = true
        return
      }
      this.$confirm(this.$t('security.pwdRulesClosePrompt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(async () => {
          this.pwdDataForm.isEnableOnoff = false
        })
        .catch(() => {})
    },
    submitPwd() {
      if (
        this.pwdDataForm.expireDaysOnoff &&
        this.pwdDataForm.modifyRemindDaysOnoff &&
        Number(this.pwdDataForm.expireDays) !== 0 &&
        Number(this.pwdDataForm.expireDays) < Number(this.pwdDataForm.modifyRemindDays)
      ) {
        this.$message({
          message: this.$t('security.pwdAlertCantOver'),
          type: 'warning'
        })
        return
      }
      this.$refs['pwdDataForm'].validate(valid => {
        let checks = document.getElementsByClassName('el-checkbox check is-checked')

        if (valid) {
          let obj = {}
          obj.isEnable = Number(this.pwdDataForm.isEnableOnoff)

          obj.complexity = {
            containsUppercase: Number(this.pwdDataForm.containsUppercase),
            containsLowercase: Number(this.pwdDataForm.containsLowercase),
            containsDigital: Number(this.pwdDataForm.containsDigital),
            containsSpecialCharacters: Number(this.pwdDataForm.containsSpecialCharacters),
            containsNoRepeatLetter: Number(this.pwdDataForm.containsNoRepeatLetter),
            containsNoKeyboardRepeatLetter: Number(this.pwdDataForm.containsNoKeyboardRepeatLetter),
            containsNoAccount: Number(this.pwdDataForm.containsNoAccount)
          }

          obj.minLength = Number(this.pwdDataForm.minLength)
          obj.historyRepeats = Number(this.pwdDataForm.historyRepeats)

          if (this.pwdDataForm.expireDaysOnoff) {
            obj.expireDays = Number(this.pwdDataForm.expireDays)
            obj.shortestExpireMinutes = Number(this.pwdDataForm.shortestExpireMinutes)
          } else {
            this.pwdDataForm.modifyRemindDaysOnoff = false
            obj.expireDays = 0
            obj.shortestExpireMinutes = 0
          }

          obj.modifyOnFirstLogin = Number(this.pwdDataForm.modifyOnFirstLogin)

          if (this.pwdDataForm.modifyRemindDaysOnoff) {
            obj.modifyRemindDays = Number(this.pwdDataForm.modifyRemindDays)
          } else {
            obj.modifyRemindDays = 0
          }

          this.$api.setConfiguration(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                message: this.$t('security.pwdRulesConfiguredSuccess'),
                type: 'success'
              })
              this.getPwdRules()
            }
          })
        }
      })
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.setFormRules()
      this.locale = localStorage.getItem('locale')
    }
  }
}
</script>

<style lang="scss">
#security {
  padding-bottom: 20px;
  .el-input__inner {
    width: 600px;
    height: 40px;
  }
  .el-checkbox {
    margin-bottom: 10px;
    color: #fff;
  }

  .el-form-item--small {
    display: flex;
  }
  .el-form-item__content {
    margin-left: 0px !important;
  }
  .accountManage .lessThree {
    left: -157px;
  }

  .accountManage,
  .passwordManage {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .passwordManage .lessThree {
    left: -96px;
  }

  .lessThree {
    position: absolute;
    color: #f56c6c;
    top: 20px;
    font-size: 12px;
  }

  .alwaysLight.el-switch {
    opacity: 1 !important;
    .el-switch__core,
    .el-switch__label {
      cursor: pointer !important;
    }
  }
}
</style>
