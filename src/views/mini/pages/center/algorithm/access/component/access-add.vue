<template>
  <el-dialog
    :title="$parent.operation ? $t('newAccess.addAccInfo') : $t('newAccess.modifyAccInfo')"
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1000px"
    class="accessAddDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="116px" label-position="left">
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessName') + ':'" prop="accessName">
            <el-input
              v-model="form.accessName"
              auto-complete="off"
              :placeholder="$t('newAccess.accessNamePrompt')"
              clearable
            />
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('newAccess.auth') + ':'" prop="authType">
            <el-select
              v-model="form.authType"
              clearable
              :placeholder="$t('newAccess.selectAuth')"
              @focus="focusAuthType"
            >
              <el-option
                v-for="item in $parent.accessAuthTypeListFilter"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessIP') + ':'" prop="accessHost">
            <el-input
              v-model="form.accessHost"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAccIP')"
            />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('newAccess.accPort') + ':'" prop="accessPort">
            <el-input
              v-model="form.accessPort"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAccPort')"
            />
          </el-form-item>
        </div>
      </div>

      <div
        class="form-flex"
        v-if="form.accessType != 30 || form.authType == 1 || form.authType == 2"
      >
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accAccount') + ':'" prop="account">
            <el-input
              v-model="form.account"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAccAccount')"
              clearable
            />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('newAccess.accPwd') + ':'" prop="password">
            <el-input
              v-model="form.password"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAccPwd')"
              type="password"
              clearable
            />
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-if="form.accessType != 30">
        <div class="form-left">
          <el-form-item label="appKey：" prop="appKey">
            <el-input
              v-model="form.appKey"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAppKey')"
              clearable
            />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item label="appSecret：" prop="appSecret">
            <el-input
              v-model="form.appSecret"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAppSecret')"
              clearable
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item
        label="token："
        prop="token"
        v-if="form.accessType == 30 && form.authType == 3"
        class="padding40"
      >
        <el-input
          v-model="form.token"
          auto-complete="off"
          :placeholder="$t('newAccess.inputToken')"
          clearable
        />
      </el-form-item>

      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('newAccess.accessVersion') + ':'" prop="version">
            <el-input
              v-model="form.version"
              auto-complete="off"
              :placeholder="$t('newAccess.inputAccessVersion')"
              clearable
            />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('newAccess.manufacturer') + ':'" prop="vendor">
            <el-input
              v-model="form.vendor"
              auto-complete="off"
              :placeholder="$t('newAccess.inputManufacturer')"
              clearable
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item :label="$t('newAccess.description') + ':'" prop="remark" class="padding40">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('newAccess.inputDescription')"
          maxlength="256"
          show-word-limit
          v-model="form.remark"
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
export default {
  data() {
    return {
      form: {
        accessName: '',
        accessMode: [0],
        accessType: '',
        accessHost: '',
        accessPort: '',
        authType: '',
        account: '',
        password: '',
        appKey: '',
        appSecret: '',

        whiteIPs: '',
        version: '',
        vendor: '',
        remark: ''
      },

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
        
        this.form = Object.assign(this.form, this.$parent.dataForm)
        if (!this.$parent.operation) {
          this.form.accessMode = [this.form.accessMode]
          if (this.form.accessType != 30) {
            this.rules.account[0].required = false
            this.rules.password[0].required = false
            this.rules.appKey[0].required = false
            this.rules.appSecret[0].required = false
          } else {
            this.rules.account[0].required = true
            this.rules.password[0].required = true
            this.rules.appKey[0].required = true
            this.rules.appSecret[0].required = true
          }
        }
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },

    setFormRules() {
      var regManInput =
        /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
      var validateWhiteIPs = (rule, value, callback) => {
        for (let i = 0; i < value.split(',').length; i++) {
          if (!regManInput.test(value.split(',')[i])) {
            callback(new Error(this.$t('newAccess.regManInputPrompt')))
          }
        }
        callback()
      }
      this.rules = {
        accessName: [
          {
            required: true,
            message: this.$t('newAccess.inputAccName'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        accessMode: [
          {
            required: true,
            message: this.$t('newAccess.selectAccessModePrompt'),
            trigger: 'blur'
          }
        ],
        accessType: [
          {
            required: true,
            message: this.$t('newAccess.selectAccessTypePrompt'),
            trigger: 'change'
          }
        ],
        accessHost: [
          {
            required: true,
            message: this.$t('newAccess.inputAccIP'),
            trigger: 'blur'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('newAccess.accessIpPrompt'),
          },
        ],
        accessPort: [
          {
            required: true,
            message: this.$t('newAccess.inputAccPort'),
            trigger: 'blur'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('newAccess.inputAccPortPrompt')
          }
        ],
        authType: [
          {
            required: true,
            message: this.$t('newAccess.selectAuthTypePrompt'),
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: this.$t('public.accountPrompt'),
            trigger: 'blur'
          },
          {
            max: 32,
            message: this.$t('monitorManage.lessThanThirtyTwo'),
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
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        appKey: [
          {
            required: true,
            message: this.$t('newAccess.inputAppKey'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        appSecret: [
          {
            required: true,
            message: this.$t('newAccess.inputAppSecret'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],

        token: [
          {
            required: true,
            message: this.$t('newAccess.inputToken'),
            trigger: 'blur'
          }
        ],

        whiteIPs: [
          {
            required: true,
            message: this.$t('newAccess.inputWhiteIPsPrompt'),
            trigger: 'blur'
          },
          { trigger: 'blur', validator: validateWhiteIPs }
        ],
        version: [
          {
            required: false,
            message: this.$t('newAccess.inputAccessVersion'),
            trigger: 'blur'
          },
          {
            max: 32,
            message: this.$t('monitorManage.lessThanThirtyTwo'),
            trigger: 'blur'
          }
        ],
        vendor: [
          {
            required: false,
            message: this.$t('newAccess.inputManufacturer'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ]
      }
    },

    groupChange() {
      if (this.form.accessMode.length > 1) {
        this.form.accessMode.shift()
      }
    },

    accessType_change(val) {
      if (val != 0) {
        this.rules.account[0].required = false
        this.rules.password[0].required = false
        this.rules.appKey[0].required = false
        this.rules.appSecret[0].required = false
      } else {
        this.rules.account[0].required = true
        this.rules.password[0].required = true
        this.rules.appKey[0].required = true
        this.rules.appSecret[0].required = true
      }

      this.form.authType = ''
      this.form.account = ''
      this.form.password = ''
      this.form.appKey = ''
      this.form.appSecret = ''
      this.form.token = ''
      this.form.whiteIPs = ''
    },
    authType_change(val) {
      this.form.account = ''
      this.form.password = ''
      this.form.appKey = ''
      this.form.appSecret = ''
      this.form.token = ''
      this.form.whiteIPs = ''
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (
            this.form.accessType != 30 &&
            this.form.account == '' &&
            this.form.password == '' &&
            this.form.appKey == '' &&
            this.form.appSecret == ''
          ) {
            this.$message.warning(this.$t('newAccess.realPrompt'))
            return
          }
          this.$parent.maskloading = true
          let form = this.form
          let data = {
            accessName: form.accessName,
            accessMode: Number(form.accessMode.toString()),
            accessType: Number(form.accessType),
            accessHost: form.accessHost,
            accessPort: form.accessPort,
            version: form.version,
            vendor: form.vendor,
            remark: form.remark
          }
          let key = sessionStorage.getItem('key'),
            cuType = sessionStorage.getItem('cuType')

          // 如果算法接入方式为标准接入
          if (form.accessType == 30) {
            Object.assign(data, {
              authType: form.authType
            })
            if (form.authType == 1 || form.authType == 2) {
              if (form.password) {
                Object.assign(data, {
                  password: form.password
                })
              }
              Object.assign(data, {
                account: form.account
              })
            } else if (form.authType == 3) {
              Object.assign(data, {
                token: form.token
              })
            } else if (form.authType == 4) {
              Object.assign(data, {
                whiteIPs: form.whiteIPs.split(',')
              })
            }
          } else {
            Object.assign(data, {
              account: form.account,
              appKey: form.appKey,
              appSecret: form.appSecret
            })
            if (form.password) {
              Object.assign(data, {
                password: form.password
              })
            }
          }

          if (this.$parent.operation) {
            // 添加
            this.$api.addAlgorithmAccessInfo(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else {
            Object.assign(data, {
              accessId: form.accessId
            })
            // 编辑
            this.$api.modifyAlgorithmAccessInfo(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode == 0) {
        this.$parent.dialogFormVisible = false
        if (this.form.accessType != 30) {
          title += ',' + this.$t('newAccess.operatorDeployServices')
        }
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.accessAddDialog {
  .el-dialog__body {
    padding: 15px 0px 5px;
  }
}
</style>
