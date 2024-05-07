<template>
  <el-dialog
    :title="
      $parent.operation
        ? $t('deviceManagement.addCollectionSystem')
        : $t('deviceManagement.reviseCollectionSystem')
    "
    v-model="$parent.addApsVisible"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1050px'"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    :close-on-click-modal="false"
    draggable
    class="apsAddDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="locale == 'en' ? '270px' : '144px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <!-- 组织 -->
          <el-form-item :label="$t('platformManagement.Affiliation') + ':'" prop="organizationName">
            <el-cascader
              v-model="form.organizationName"
              :props="propsCas"
              clearable
              @change="changeOrg"
              ref="orgCas"
            ></el-cascader>
          </el-form-item>
        </div>

        <div class="form-right">
          <!-- 平台名称 -->
          <el-form-item
            :label="$t('platformManagement.organizationCode') + ':'"
            prop="organizationId"
          >
            <el-input
              v-model="form.organizationId"
              :placeholder="$t('platformManagement.selectOrganizationCode')"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <!-- 注册方式 -->
          <el-form-item :label="$t('deviceManagement.systemName') + ':'" prop="apsName">
            <el-input
              v-model="form.apsName"
              :placeholder="$t('deviceManagement.inputSystemName')"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-right">
          <!-- 设备协议类型 -->
          <el-form-item :label="$t('platformManagement.encoding') + ':'" prop="apsId">
            <el-input
              v-model="form.apsId"
              :placeholder="$t('platformManagement.inputInterconnectionCode')"
              clearable
              :disabled="!$parent.operation"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.auth') + ':'" prop="authority">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.authority"
              :placeholder="$t('newAccess.selectAuth')"
              @change="accessAuthTypeChange"
            >
              <el-option
                v-for="(item, index) in $parent.authorityList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <p class="safe" v-if="isShowTip">{{ $t('accessPlatform.anthModeTip') }}</p>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('deviceManagement.accessType') + ':'" prop="apsAccessType">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.apsAccessType"
              :placeholder="$t('deviceManagement.selectAccessType')"
            >
              <el-option
                v-for="(item, index) in $parent.apsAccessTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="form-flex">
        <div class="form-left">
          <el-form-item
            :label="$t('deviceManagement.authenticateAccount') + ':'"
            prop="account"
            v-if="form.authority && form.authority != '1'"
          >
            <el-input
              v-model="form.account"
              :placeholder="$t('deviceManagement.inputAuthenticateAccount')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item
            :label="$t('deviceManagement.authenticationPassword') + ':'"
            prop="password"
            v-if="form.authority && form.authority != '1'"
          >
            <el-input
              :type="passw"
              v-model="form.password"
              :placeholder="$t('deviceManagement.inputAuthenticationPassword')"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-if="form.authority && form.authority != '1'">
        <div class="form-left">
          <el-form-item
            :label="$t('deviceManagement.confirmAuthentication') + ':'"
            prop="confirmPwd"
          >
            <el-input
              :type="passw"
              v-model="form.confirmPwd"
              :placeholder="$t('deviceManagement.inputConfirmAuthentication')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-right"></div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('deviceManagement.v4Address') + ':'" prop="ipAddr">
            <el-input
              v-model="form.ipAddr"
              :placeholder="$t('deviceManagement.inputV4Address')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('deviceManagement.v6Address') + ':'" prop="ipv6Addr">
            <el-input
              v-model="form.ipv6Addr"
              :placeholder="$t('deviceManagement.inputV6Address')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.portNumber') + ':'" prop="port">
            <el-input
              v-model="form.port"
              :placeholder="$t('platformManagement.inputPortNumber')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-right"></div>
      </div>

      <el-form-item :label="$t('public.remark') + '：'" prop="remark">
        <el-input
          v-model="form.remark"
          :placeholder="$t('public.pleaseInputremark')"
          type="textarea"
          maxlength="256"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">
          {{ $t('public.cancel') }}
        </el-button>

        <el-button type="primary" @click="addMainDevSubmit" :loading="$parent.maskloading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,
      isShowTip: false,
      form: {
        organizationId: '',
        organizationName: '',
        apsName: '',
        apsId: '',
        authority: '4',
        apsAccessType: '',
        account: '',
        password: '',
        confirmPwd: '',
        ipAddr: '',
        ipv6Addr: '',
        port: '',
        remark: ''
      },
      dataText: this.$t('platformManagement.noData'),

      rules: {},

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,

      propsCas: {
        checkStrictly: true,
        lazy: true,
        value: 'id',
        label: 'label',
        lazyLoad(node, resolve) {
          _this.$api
            .getOrganizationTree({
              withTenant: 2,
              type: 1,
              parentId: node.level == 0 ? null : node.data.id
            })
            .then(res => {
              if (res.resultCode == 0) {
                const nodes = res.nodeList.map(item => ({
                  ...item
                }))
                resolve(nodes)
              }
            })
        }
      }
    }
  },
  mounted() {
    this.setFormRules()
  },

  watch: {},

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }

      this.$nextTick(() => {
        this.setDialogCss()
        if (!this.$parent.operation) {
          this.form = this.$parent.modifyApsForm
        } else {
          Object.assign(this.form, {
            organizationName: this.$parent.organizationName,
            organizationId: this.$parent.organizationId,
            apsAccessType: this.$parent.apsAccessTypeList[0].value
          })
        }
      })
    },
    dialogClosed() {
      this.$parent.addApsVisible = false
    },
    accessAuthTypeChange(val) {
      if (['4',''].indexOf(val) > -1) {
        this.isShowTip = false
      } else {
        this.isShowTip = true
      }
    },
    setFormRules() {
      var regApsID = /^[0-9]{20}$/
      var validateApsID = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('platformManagement.inputInterconnectionCode')))
        } else if (!regApsID.test(value)) {
          callback(new Error(this.$t('platformManagement.encode20Digits')))
        } else {
          callback()
        }
      }
      var validatePwd = (rule, value, callback) => {
        if (this.form.password) {
          if (value === '') {
            callback(new Error(this.$t('deviceManagement.inputConfirmAuthentication')))
          } else if (value != this.form.password) {
            callback(new Error(this.$t('platformManagement.confirmPwd')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      this.rules = {
        organizationId: [
          {
            required: true,
            message: this.$t('platformManagement.organizationEncodeNotEmpty'),
            trigger: 'change'
          }
        ],
        organizationName: [
          {
            required: true,
            message: this.$t('platformManagement.organizationNotEmpty'),
            trigger: 'change'
          }
        ],
        apsName: [
          {
            required: true,
            message: this.$t('deviceManagement.systemNotEmpty'),
            trigger: 'change'
          },
          {
            max: 64,
            message: this.$t('platformManagement.length64'),
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.namePattern'),
            trigger: 'change'
          }
        ],
        apsId: [
          {
            required: true,
            validator: validateApsID,
            trigger: 'change'
          }
        ],
        authority: [
          {
            required: true,
            message: this.$t('newAccess.selectAuth'),
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: this.$t('deviceManagement.inputAuthenticateAccount'),
            trigger: 'change'
          },
          {
            max: 64,
            message: this.$t('platformManagement.length64'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('deviceManagement.inputAuthenticationPassword'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('platformManagement.length32'),
            trigger: 'change'
          }
        ],
        ipAddr: [
          {
            required: true,
            message: this.$t('deviceManagement.inputV4Address'),
            trigger: 'change'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('deviceManagement.inputTurev4Address'),
            trigger: 'change'
          }
        ],
        ipv6Addr: [
          {
            required: false,
            message: this.$t('deviceManagement.inputV6Address'),
            trigger: 'change'
          },
          {
            pattern:
              /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('deviceManagement.inputTurev6Address'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('platformManagement.inputPortNumber'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('deviceManagement.portNumberFormat'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: false,
            message: this.$t('public.pleaseInputremark'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('deviceManagement.length256'),
            trigger: 'change'
          }
        ],

        confirmPwd: [
          {
            required: true,
            validator: validatePwd,
            trigger: 'change'
          }
        ]
      }
    },

    changeOrg(val) {
      this.form.organizationId = JSON.parse(JSON.stringify(val)).pop()
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.addSubmit()
        }
      })
    },
    addSubmit() {
      let form = JSON.parse(JSON.stringify(this.form))
      form.organizationName = this.$refs['orgCas'].getCheckedNodes()[0].label
      delete form.confirmPwd

      if (form.authority != '1' && form.authority != '') {
        if (form.password !== '' && form.password !== null) {
          form.password = form.password
        }
      } else {
        form.password = null
        form.account = null
      }

      this.$parent.maskloading = true
      if (this.$parent.operation) {
        this.$api.addAps(form).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      } else {
        form.platformId = this.$parent.choosedId
        this.$api.updateAps(form).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      }
    },
    successBack() {
      this.$message({
        type: 'success',
        message: this.$parent.operation
          ? this.$t('public.addSuccess')
          : this.$t('public.modifySuccess')
      })
      this.$parent.addApsVisible = false
      this.$parent.search_clear()
      this.$parent.getApsList()
      this.$parent.maskloading = false
    }
  }
}
</script>
<style lang="scss">
.apsAddDialog {
  .el-dialog__body .form-flex {
    padding: 0;
  }
  .el-cascader--small {
    width: 100%;
  }
}
</style>
