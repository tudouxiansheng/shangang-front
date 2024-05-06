<template>
  <el-dialog
    :title="$parent.operation ? $t('tenantManage.addTenant') : $t('tenantManage.editTenant')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1200px' : '1000px'"
    :close-on-click-modal="false"
    class="add_tenant"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      :label-width="$parent.locale == 'en' ? '230px' : '156px'"
      label-position="left"
    >
      <collapse-card :title="$t('tenantManage.tenantInfo')" v-model:collapse="show1">
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :class="locale === 'en' && 'popover-error'"
              :label="$t('tenantManage.tenantName') + '：'"
              prop="tenantName"
            >
              <el-input
                v-model="form.tenantName"
                auto-complete="off"
                :placeholder="$t('tenantManage.namePrompt')"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="$parent.operation"
              :label="$t('public.password') + '：'"
              prop="password"
            >
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
                  <pwd-input v-model="form.password" :placeholder="$t('public.psdPrompt')" />
                </template>
              </el-popover>
              <strength-meter
                ref="strengthMeter"
                :password="form.password"
                :min-length="this.minLength"
              />
            </el-form-item>
            <el-form-item :label="$t('public.phone') + '：'" prop="mobile">
              <el-input
                v-model="form.mobile"
                auto-complete="off"
                :placeholder="$t('public.phonePrompt')"
                clearable
              />
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item
              :class="locale === 'en' && 'popover-error'"
              :label="$t('public.account') + '：'"
              prop="account"
            >
              <el-input
                v-model="form.account"
                auto-complete="off"
                :placeholder="$t('public.accountPrompt')"
                :disabled="!$parent.operation"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="$parent.operation"
              :label="$t('public.confirmPsd') + '：'"
              prop="checkPass"
            >
              <pwd-input v-model="form.checkPass" :placeholder="$t('public.confirmPsdPrompt')" />
            </el-form-item>
            <el-form-item
              v-if="$parent.industryTypeList.length"
              :label="$t('tenantManage.industryType') + '：'"
              prop="industryType"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.industryType"
                :placeholder="$t('tenantManage.industryTypePrompt')"
                clearable
                @change="industryTypeChange"
              >
                <el-option
                  v-for="(item, index) in $parent.industryTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding20">
          <el-input
            type="textarea"
            v-model="form.remark"
            auto-complete="off"
            :placeholder="$t('public.addressPrompt')"
            maxlength="256"
            clearable
            show-word-limit
          />
        </el-form-item>
      </collapse-card>
      <collapse-card :title="$t('clientManage.permissionSettings')" v-model:collapse="show2">
        <div class="form-flex">
          <div class="form-left">
            <!-- 会话控制数 -->
            <el-form-item :label="$t('session.maxSessionNum') + '：'" prop="maxSessionNum">
              <el-input
                v-model="form.maxSessionNum"
                auto-complete="off"
                :placeholder="$t('session.plInputMaxSessionNum')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="form-right">
            <!-- 账户有效期 -->
            <el-form-item
              :label="$t('public.enableAccountValidity') + '：'"
              prop="isValidityEnable"
            >
              <el-switch
                v-model="form.isValidityEnable"
                active-color="#0085d0"
                :active-value="1"
                inactive-color="#dee2e6"
                :inactive-value="0"
                @change="validityChange"
              />
            </el-form-item>
          </div>
        </div>
        <div v-if="form.isValidityEnable" class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('public.validityBeginTime') + '：'" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="date"
                :placeholder="$t('public.selectBeginTime')"
                size="medium"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('public.validityEndTime') + '：'" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="date"
                :placeholder="$t('public.selectEndTime')"
                size="medium"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>

        <el-form-item
          :label="$t('clientManage.PTZControlPriority') + '：'"
          prop="cloudMirrorPriority"
          class="padding20"
        >
          <el-slider
            v-model="form.cloudMirrorPriority"
            :min="1"
            :max="sliderMax"
            :step="1"
            :marks="sliderMarks"
            show-stops
            show-input
            :show-input-controls="false"
            :show-tooltip="false"
          ></el-slider>
        </el-form-item>
      </collapse-card>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskLoading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import complex from '@/mixin/complex'
import StrengthMeter from '@/components/strength-meter'
import CollapseCard from '@/components/collapse-card.vue'
export default {
  mixins: [complex],
  components: {
    StrengthMeter,
    CollapseCard
  },
  data() {
    var reg = /^(?![-_\s])[a-zA-Z0-9\u4e00-\u9fa5\s\-_]+(?<![-_\s])$/
    // 验证名称
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('tenantManage.namePrompt')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('public.nameError1')))
        }
        callback()
      }
    }

    var validatePass2 = (rule, value, callback) => {
      if (this.form.password) {
        if (value === '') {
          callback(new Error(this.$t('public.confirmPsdPrompt')))
        } else if (value !== this.form.password) {
          callback(new Error(this.$t('public.psdError')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var regMaxSessionNum =
      /^([0-9]|[1-9][0-9]?|[1-9][0-9][0-9]?|[1][0-9][0-9][0-9]?|[2][0][0][0]|2000)$/ // 0-2000

    var validateMaxSessionNum = (rule, value, callback) => {
      if (value === '') {
        if (value === 0) {
          callback()
        }
        callback(new Error(this.$t('session.pleaseControls')))
      } else if (!regMaxSessionNum.test(value)) {
        callback(new Error(this.$t('session.regMaxSessionNum')))
      } else {
        callback()
      }
    }

    var validateBeginTime = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error(this.$t('public.selectBeginTime')))
      } else {
        if (this.form.endTime && value >= this.form.endTime) {
          callback(new Error(this.$t('public.accEndTimeOverStart')))
        }
        callback()
      }
    }

    var validateEndTime = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error(this.$t('public.selectEndTime')))
      } else {
        if (this.form.beginTime && value <= this.form.beginTime) {
          callback(new Error(this.$t('public.accEndTimeOverStart')))
        }
        callback()
      }
    }
    return {
      locale: localStorage.getItem('locale'),
      show1: true,
      show2: true,
      form: {
        tenantName: '',
        account: '',
        password: '',
        checkPass: '',
        industryType: '',
        mobile: '',
        remark: '',
        maxSessionNum: 1,
        isValidityEnable: 0,
        beginTime: '',
        endTime: '',
        cloudMirrorPriority: 1
      },
      rules: {
        tenantName: [
          {
            required: true,
            validator: validateUsername,
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: this.$t('public.nameError2'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('public.psdPrompt'),
            trigger: 'blur'
          },
          {
            min: this.isEnable ? this.minLength || 8 : 0,
            max: 16,
            message: this.$t('public.psdPrompt1', {
              min: this.isEnable ? this.minLength || 8 : 0
            }),
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            required: true,
            message: this.$t('public.confirmPsdPrompt'),
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ],
        maxSessionNum: [{ required: true, validator: validateMaxSessionNum, trigger: 'blur' }],
        account: [
          {
            required: true,
            message: this.$t('public.accountPrompt'),
            trigger: 'blur'
          },
          {
            pattern: /^[0-9a-zA-Z_]{6,32}$/,
            message: this.$t('public.accountError'),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: this.$t('public.mobileError'),
            trigger: 'blur'
          }
        ],
        industryType: [
          {
            required: false,
            message: this.$t('tenantManage.industryTypePrompt'),
            trigger: 'change'
          }
        ],
        beginTime: [
          {
            required: false,
            validator: validateBeginTime,
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: false,
            validator: validateEndTime,
            trigger: 'change'
          }
        ]
      },
      sliderMax: 9,
      sliderMarks: {}
    }
  },
  async mounted() {
    this.getSliderMax()
    await this.getComplexity_rules()
  },
  activated() {
    this.getComplexity_rules()
  },
  methods: {
    async dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
        if (this.$parent.industryTypeList.length) {
          this.rules.industryType[0].required = true
        } else {
          this.rules.industryType[0].required = false
        }
        if (this.$parent.operation) {
          this.rules.password[0].required = true
          this.rules.checkPass[0].required = true
          this.rules.account = [
            {
              required: true,
              message: this.$t('public.accountPrompt'),
              trigger: 'blur'
            },
            {
              pattern: /^[0-9a-zA-Z_]{6,32}$/,
              message: this.$t('public.accountError'),
              trigger: 'blur'
            }
          ]
        } else {
          this.rules.password[0].required = false
          this.rules.checkPass[0].required = false
          this.rules.account = [
            {
              required: true,
              message: this.$t('public.accountPrompt'),
              trigger: 'blur'
            }
          ]
        }
        this.validityChange(this.form.isValidityEnable)
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskLoading = false
      this.$parent.dataForm = {}
      this.show1 = true
      this.show2 = true
      this.resetForm()
    },
    resetForm() {
      this.form = {
        tenantName: '',
        account: '',
        password: '',
        checkPass: '',
        industryType: '',
        mobile: '',
        remark: '',
        maxSessionNum: 1,
        isValidityEnable: 0,
        beginTime: '',
        endTime: '',
        cloudMirrorPriority: 1
      }
      this.$resetForm('form')
    },
    validityChange(val) {
      if (val) {
        this.rules.beginTime[0].required = true
        this.rules.endTime[0].required = true
      } else {
        this.rules.beginTime[0].required = false
        this.rules.endTime[0].required = false
      }
    },
    industryTypeChange(val) {
      this.form.industryType = val
      this.$forceUpdate()
    },
    // 获取云台控制优先级
    getSliderMax() {
      let sliderMarks = {}
      for (let i = 1; i <= this.sliderMax; i++) {
        sliderMarks[i] =
          i == 1
            ? '1' + '(' + this.$t('clientManage.lowest') + ')'
            : i == this.sliderMax
            ? this.sliderMax + '(' + this.$t('clientManage.highest') + ')'
            : String(i)
      }
      this.sliderMarks = sliderMarks
    },
    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const form = this.form
          if (this.$parent.operation) {
            if (this.isEnable === 1 && this.$refs.strengthMeter.getPasswordStrength.score === 1) {
              // 风险密码
              if (form.checkPass.length < this.minLength) {
                this.$message.warning(`${this.$t('changePwd.passWordLength') + this.minLength}`)
              } else {
                this.$message.warning(`${this.$t('changePwd.weakPwdTips')}`)
              }
              return false
            }
          }
          this.$parent.maskLoading = true
          let data = {
            organizationId: form.organizationId,
            tenantName: form.tenantName,
            account: form.account,
            industryType: form.industryType == '' ? undefined : form.industryType,
            mobile: form.mobile,
            remark: form.remark,
            maxSessionNum: form.maxSessionNum,
            isValidityEnable: form.isValidityEnable,
            cloudMirrorPriority: parseInt(form.cloudMirrorPriority)
          }
          if (form.password !== '') {
            data.password = form.password
          }
          if (form.isValidityEnable) {
            data.beginTime = form.beginTime
            data.endTime = form.endTime
          }

          if (!this.$parent.operation) {
            Object.assign(data, { tenantId: form.tenantId })
            // 修改租户
            this.$api.modifyTenantInfo(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          } else {
            // 添加租户
            this.$api.addTenantInfo(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.search_clear()
        this.$parent.handleFind()
      }
      this.$parent.maskLoading = false
    }
  }
}
</script>

<style lang="scss">
.add_tenant {
  .el-dialog__body {
    padding: 0px;
    .form-flex {
      padding: 0 20px;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-slider {
      padding-left: 25px;
      color: #262626;
      .el-slider__runway.show-input {
        margin-right: 80px;
      }
      .el-slider__stop {
        width: 2px;
        height: 12px;
        border-radius: 2px;
        background-color: #e4e7ed;
      }
      .el-slider__marks-text {
        color: #262626;
      }
      .el-slider__marks {
        & > :first-child,
        & > :last-child {
          min-width: 70px;
        }
      }
      .el-slider__input {
        width: 60px;
      }
    }
  }
}
</style>
