<template>
  <!-- 添加或修改对话框 -->
  <el-dialog
    draggable
    :title="
      $parent.operation ? $t('monitorManage.addPlatform') : $t('monitorManage.modifyPlatform')
    "
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
  >
    <div id="newUser">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        :label-width="$parent.locale == 'en' ? '241px' : '128px'"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item :label="$t('public.platName') + '：'" prop="platName">
          <el-input
            v-model="form.platName"
            :placeholder="$t('monitorManage.inputPlatformName')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('monitorManage.platformType') + '：'" prop="platType">
          <el-select
            :popper-append-to-body="false"
            v-model="form.platType"
            :placeholder="$t('monitorManage.pleaseSelectAPlatformType')"
            @change="selectMonitor"
            :disabled="!$parent.operation"
          >
            <el-option
              v-for="(item, index) in $parent.plaTypesList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.eSDKIntranetIP') + '：'"
          prop="serverIntranetIp"
          v-if="form.platType == '5'"
        >
          <el-input
            v-model="form.serverIntranetIp"
            :placeholder="$t('monitorManage.inputESDKIntranetIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.eSDKPublicNetworkIP') + '：'"
          prop="serverPublicIp"
          v-if="form.platType == '5'"
        >
          <el-input
            v-model="form.serverPublicIp"
            :placeholder="$t('monitorManage.inputESDKPublicNetworkIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.eSDKPort') + '：'"
          prop="serverPort"
          v-if="form.platType == '5'"
        >
          <el-input
            v-model="form.serverPort"
            :placeholder="$t('monitorManage.inputESDKPort')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.eSDKAuthenticationAccount') + '：'"
          prop="platAccount"
          v-if="form.platType == '5'"
        >
          <el-input
            v-model="form.platAccount"
            :placeholder="$t('monitorManage.inputESDKAuthenticationAccount')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.eSDKAuthenticationPassword') + '：'"
          prop="password"
          v-if="form.platType == '5'"
        >
          <pwd-input
            v-model="form.password"
            :placeholder="$t('monitorManage.inputESDKAuthenticationPassword')"
            strength
          />
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.WSUServiceAddress') + '：'"
          prop="serverAddr"
          v-if="form.platType == '2'"
        >
          <el-input
            v-model="form.serverAddr"
            :placeholder="$t('monitorManage.inputWSUServiceAddress')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.SDKSIPIntranetIP') + '：'"
          prop="serverIntranetIp"
          v-if="form.platType == '2'"
        >
          <el-input
            v-model="form.serverIntranetIp"
            :placeholder="$t('monitorManage.inputSDKSIPIntranetIP')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.SDKSIPPublicIP') + '：'"
          prop="serverPublicIp"
          v-if="form.platType == '2'"
        >
          <el-input
            v-model="form.serverPublicIp"
            :placeholder="$t('monitorManage.inputSDKSIPPublicNetworkIP')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.SDKSIPPort') + '：'"
          prop="serverPort"
          v-if="form.platType == '2'"
        >
          <el-input
            v-model="form.serverPort"
            :placeholder="$t('monitorManage.inputSDKSIPPort')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.SVSIntranetIP') + '：'"
          prop="serverIntranetIp"
          v-if="form.platType == '1'"
        >
          <el-input
            v-model="form.serverIntranetIp"
            :placeholder="$t('monitorManage.inputSVSIntranetIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.SVSPublicNetworkIP') + '：'"
          prop="serverPublicIp"
          v-if="form.platType == '1'"
        >
          <el-input
            v-model="form.serverPublicIp"
            :placeholder="$t('monitorManage.inputSVSPublicNetworkIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.SVSPort') + '：'"
          prop="serverPort"
          v-if="form.platType == '1'"
        >
          <el-input
            v-model="form.serverPort"
            :placeholder="$t('monitorManage.inputSVSPort')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.serviceAddress') + '：'"
          prop="serverAddr"
          v-if="form.platType == '12'"
        >
          <el-input
            v-model="form.serverAddr"
            :placeholder="$t('monitorManage.pleaseEnterServiceAddress')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.platformUserID') + '：'"
          prop="platUserId"
          v-if="form.platType == '12'"
        >
          <el-input
            v-model="form.platUserId"
            :placeholder="$t('monitorManage.pleaseEnterplatformUserID')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.accessMode') + '：'"
          prop="accessMode"
          v-if="form.platType == '12'"
        >
          <el-select
            :popper-append-to-body="false"
            v-model="form.accessMode"
            :placeholder="$t('monitorManage.pleaseSelectAccessMode')"
          >
            <el-option :label="$t('monitorManage.exclusiveAccess')" :value="0"></el-option>
            <el-option :label="$t('monitorManage.sharedAccess')" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.AKAccountNumber') + '：'"
          prop="platAccount"
          v-if="form.platType == '12'"
        >
          <el-input
            v-model="form.platAccount"
            :placeholder="$t('monitorManage.pleaseEnterAKAccountNumber')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.SkPassword') + '：'"
          prop="password"
          v-if="form.platType == '12'"
        >
          <pwd-input
            v-model="form.password"
            :placeholder="$t('monitorManage.pleaseEnterSkPassword')"
            strength
          />
        </el-form-item>

        <!-- ivs1800 -->
        <el-form-item
          :label="$t('monitorManage.accessMode') + '：'"
          prop="accessMode"
          v-if="form.platType == '14'"
        >
          <el-select
            :popper-append-to-body="false"
            v-model="form.accessMode"
            :placeholder="$t('monitorManage.pleaseSelectAccessMode')"
          >
            <el-option :label="$t('monitorManage.exclusiveAccess')" :value="0"></el-option>
            <el-option :label="$t('monitorManage.sharedAccess')" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.platformPublicNetworkIP') + '：'"
          prop="serverPublicIp"
          v-if="form.platType == '14'"
        >
          <el-input
            v-model="form.serverPublicIp"
            :placeholder="$t('monitorManage.inputThePublicIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.platformPort') + '：'"
          prop="serverPort"
          v-if="form.platType == '14'"
        >
          <el-input
            v-model="form.serverPort"
            :placeholder="$t('monitorManage.inputThePort')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.anAuthenticationAccount') + '：'"
          prop="platAccount"
          v-if="form.platType == '14'"
        >
          <el-input
            v-model="form.platAccount"
            :placeholder="$t('monitorManage.inputAnAuthenticationAccount')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('monitorManage.theAuthenticationPassword') + '：'"
          prop="password"
          v-if="form.platType == '14'"
        >
          <pwd-input
            v-model="form.password"
            :placeholder="$t('monitorManage.inputTheAuthenticationPassword')"
            strength
          />
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.artemisIntranetIP') + '：'"
          prop="serverIntranetIp"
          v-if="form.platType == '6' || form.platType == '8'"
        >
          <el-input
            v-model="form.serverIntranetIp"
            :placeholder="$t('monitorManage.inputArtemisIntranetIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.artemisPublicIP') + '：'"
          prop="serverPublicIp"
          v-if="form.platType == '6' || form.platType == '8'"
        >
          <el-input
            v-model="form.serverPublicIp"
            :placeholder="$t('monitorManage.inputArtemisPublicNetworkIP')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.artemisPort') + '：'"
          prop="serverPort"
          v-if="form.platType == '6' || form.platType == '8'"
        >
          <el-input
            v-model="form.serverPort"
            :placeholder="$t('monitorManage.inputArtemisPort')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.appKey') + '：'"
          prop="platAccount"
          v-if="form.platType == '6' || form.platType == '8' || form.platType == '10'"
        >
          <el-input
            v-model="form.platAccount"
            :placeholder="$t('monitorManage.inputAppKey')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('monitorManage.appSecret') + '：'"
          prop="password"
          v-if="form.platType == '6' || form.platType == '8' || form.platType == '10'"
        >
          <pwd-input
            v-model="form.password"
            :placeholder="$t('monitorManage.inputAppSecret')"
            strength
          />
        </el-form-item>

        <el-form-item :label="$t('monitorManage.platformVersion') + '：'" prop="platVersion">
          <el-input
            v-model="form.platVersion"
            :placeholder="$t('monitorManage.inputPlatformVersion')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('monitorManage.deviceAccesProtocol') + '：'" prop="streamProtocol">
          <el-select
            :popper-append-to-body="false"
            v-model="form.streamProtocol"
            :placeholder="$t('monitorManage.selectDeviceAccesProtocol')"
          >
            <el-option :label="$t('monitorManage.realTimeProtocol')" :value="0"></el-option>
            <el-option :label="$t('monitorManage.privateProtocol')" :value="1"></el-option>
            <el-option
              :label="$t('monitorManage.equipmentDirectConnection')"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('public.remark') + '：'" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            :placeholder="$t('public.pleaseInputremark')"
            maxlength="512"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
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
        platName: '', //平台名称
        platType: '', //平台类型
        platAccount: '', //鉴权账号
        password: '', //鉴权密码
        serverPort: '', //端口
        serverIntranetIp: '', //内网IP
        serverPublicIp: '', //公网IP
        serverAddr: '', //服务地址
        platVersion: '', //平台版本
        remark: '', //备注
        platUserId: '',
        accessMode: '',
        streamProtocol: ''
      },
      rules: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.rules = {
        platName: [
          {
            required: true,
            message: this.$t('monitorManage.inputPlatformName'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        serverIntranetIp: [
          {
            required: true,
            message: this.$t('monitorManage.intranetIP'),
            trigger: 'blur'
          },
          {
            max: 16,
            message: this.$t('monitorManage.lessThanSixteen'),
            trigger: 'blur'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('monitorManage.inputLegalIp'),
            trigger: 'blur'
          }
        ],
        platType: [
          {
            required: true,
            message: this.$t('monitorManage.pleaseSelectAPlatformType'),
            trigger: 'blur'
          }
        ],
        serverPublicIp: [
          {
            required: true,
            message: this.$t('monitorManage.publicIP'),
            trigger: 'blur'
          },
          {
            max: 16,
            message: this.$t('monitorManage.lessThanSixteen'),
            trigger: 'blur'
          },
          {
            pattern:
              /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('monitorManage.inputLegalIp'),
            trigger: 'blur'
          }
        ],
        serverPort: [
          {
            required: true,
            message: this.$t('monitorManage.inputThePort'),
            trigger: 'blur'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('monitorManage.inputLegalPort'),
            trigger: 'blur'
          }
        ],
        serverAddr: [
          {
            required: true,
            message: this.$t('monitorManage.inputServiceAddress'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        platAccount: [
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
            min: 5,
            max: 64,
            message: this.$t('monitorManage.fiveAndSixtyFour'),
            trigger: 'blur'
          }
        ],

        platVersion: [
          {
            required: true,
            message: this.$t('monitorManage.inputPlatformVersion'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'blur'
          }
        ],
        remark: [
          {
            max: 512,
            message: this.$t('monitorManage.fiveHundredAndTwelve'),
            trigger: 'blur'
          }
        ],
        accessMode: [
          {
            required: true,
            message: this.$t('monitorManage.pleaseSelectAccessMode'),
            trigger: 'blur'
          }
        ],
        platUserId: [
          {
            required: true,
            message: this.$t('monitorManage.pleaseEnterplatformUserID'),
            trigger: 'blur'
          },
          {
            pattern: /^([1-9][0-9]*)$/,
            message: this.$t('turning.enterPositiveInteger'),
            trigger: 'blur'
          }
        ]
      }
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }

      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
        if (this.$parent.operation) {
          this.rules.password[0].required = true
        } else {
          this.rules.password[0].required = false
        }
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },

    selectMonitor(val) {
      Object.assign(this.form, {
        platAccount: '',
        password: '',
        serverPort: '',
        serverIntranetIp: '',
        serverPublicIp: '',
        serverAddr: ''
      })
      if (val == 2) {
        this.form.serverPort = '5060'
      } else if (val == 5) {
        this.form.serverPort = '9900'
      } else if (val == 1) {
        this.form.serverPort = '2003'
      } else if (val == 6 || val == 8) {
        this.form.serverPort = '443'
      } else if (val == 3) {
        this.form.serverPort = '2003'
      }
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.search_clear()
        this.$parent.showTable()
      }
      this.$parent.maskloading = false
    },

    // 添加或编辑设施确认按钮事件
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = this.form
          //添加平台
          let obj = {
            organizationId: this.$parent.organizationId,
            platName: form.platName,
            platType: Number(form.platType),
            platVersion: form.platVersion,
            serverPublicIp: form.serverPublicIp,
            serverIntranetIp: form.serverIntranetIp,
            serverPort: form.serverPort,
            streamProtocol: form.streamProtocol,
            remark: form.remark
          }
          if (form.platType == 14) {
            obj.serverIntranetIp = obj.serverPublicIp
            obj.accessMode = form.accessMode
          }
          if (
            form.platType == 5 ||
            form.platType == 6 ||
            form.platType == 8 ||
            form.platType == 10 ||
            form.platType == 9 ||
            form.platType == 12 ||
            form.platType == 14
          ) {
            obj.platAccount = form.platAccount
            if (form.password !== undefined && form.password != '') {
              obj.platPasswd = form.password
            }
          }

          if (form.platType == 2 || form.platType == 12) {
            obj.serverAddr = form.serverAddr
          }

          if (form.platType == 12) {
            obj.platUserId = form.platUserId
            obj.accessMode = form.accessMode
          }

          this.$parent.maskloading = true
          if (this.$parent.operation) {
            this.$api.addPlatformInfo(obj).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else {
            obj.platId = form.platId
            this.$api.modifyPlatformInfo(obj).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    }
  }
}
</script>
