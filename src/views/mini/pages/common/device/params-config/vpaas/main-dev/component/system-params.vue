<template>
  <div class="config-form" v-loading="loading" :element-loading-text="$t('public.loading')">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="!PermissionMainDevManage"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.baseInfo') }}</p>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.organization')" prop="organizationName">
            <el-input v-model="form.organizationName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.platName')" prop="platId">
            <el-select
              v-model="form.platId"
              :placeholder="$t('public.pleaseInputplatName')"
              disabled
            >
              <el-option
                v-for="(item, index) in platList"
                :key="index"
                :label="item.platName"
                :value="item.platId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.mainDevId')" prop="mainDevId">
            <el-tooltip effect="dark" :content="form.mainDevId" placement="top-start">
              <el-input v-model="form.mainDevId" disabled />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.thirdMainDevId')" prop="thirdMainDevId">
            <el-tooltip effect="dark" :content="form.thirdMainDevId" placement="top-start">
              <el-input v-model="form.thirdMainDevId" disabled />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.mainDevName')" prop="mainDevName">
            <el-input
              :placeholder="$t('mainDevConfiguration.pleaseInputmainDevName')"
              v-model="form.mainDevName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.drive')" prop="drive">
            <el-select disabled v-model="form.drive">
              <el-option
                v-for="(item, index) in driveList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.mainDevType')" prop="mainDevType">
            <el-select disabled v-model="form.mainDevType">
              <el-option
                v-for="(item, index) in mainDevTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.networkType')" prop="networkType">
            <el-select clearable v-model="form.networkType">
              <el-option
                v-for="(item, index) in networkTypeListFormattered"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.manufacturer')" prop="manufacturer">
            <el-select
              clearable
              v-model="form.manufacturer"
              :placeholder="$t('mainDevConfiguration.pleaseChoosemanufacturer')"
            >
              <el-option
                v-for="(item, index) in manufacturerList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" v-if="drive != DRIVE_TYPE.T28181">
          <el-form-item :label="$t('mainDevConfiguration.puAccount')" prop="puAccount">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputPuAccount')"
              v-model="form.puAccount"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="drive != DRIVE_TYPE.T28181">
          <el-form-item
            :label="$t('mainDevConfiguration.puPasswd')"
            prop="puPasswd"
            class="pu-passwds"
          >
            <el-input v-model="form.puPasswd" show-password @copy="handlePaste"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.mainDevSn')" prop="mainDevSn">
            <el-input
              :placeholder="$t('mainDevConfiguration.pleaseInputmainDevSn')"
              v-model="form.mainDevSn"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="drive == DRIVE_TYPE.T28181 || drive == DRIVE_TYPE.HWSDK_ACREG">
          <el-form-item
            :label="$t('mainDevConfiguration.accessInterconnectCode')"
            prop="accessInterconnectCode"
          >
            <el-input v-model="form.accessInterconnectCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" v-show="drive == 'T28181'">
          <el-form-item
            :label="$t('mainDevConfiguration.authPassword')"
            prop="puAccessPasswd"
            class="pu-passwds"
          >
            <el-input v-model="form.puAccessPasswd" show-password @copy="handlePaste"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="
          form.status === 1 &&
          !mainDevIsExDomain &&
          (drive === DRIVE_TYPE.ONVIF ||
            drive === DRIVE_TYPE.HWSDK_ACREG ||
            (drive != DRIVE_TYPE.T28181 && platType == PLATFORM_TYPE.ADS))
        "
      >
        <p
          v-if="drive === DRIVE_TYPE.HWSDK_ACREG || platType == PLATFORM_TYPE.ADS"
          class="form-title"
        >
          {{ $t('mainDevConfiguration.alarmControl') }}
        </p>
        <el-row v-if="drive == DRIVE_TYPE.HWSDK_ACREG || platType == PLATFORM_TYPE.ADS">
          <el-form-item :label="$t('mainDevConfiguration.enableAlarm')" prop="enableAlarm">
            <el-radio-group v-model="form.enableAlarm">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
            <span class="ml-5 text-blue-400">
              {{ $t('mainDevConfiguration.alarmControlTip') }}
            </span>
          </el-form-item>
        </el-row>
        <p class="form-title">
          {{ $t('mainDevConfiguration.networkSettings') }}
        </p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.puIp')" prop="puIp">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputPuIP')"
                v-model="form.puIp"
                clearable
                :disabled="platType == PLATFORM_TYPE.ADS"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.puPort')" prop="puPort">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputPuPort')"
                v-model="form.puPort"
                clearable
                :disabled="drive === DRIVE_TYPE.HWSDK_ACREG || platType == PLATFORM_TYPE.ADS"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.gateway')" prop="gateway">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputGateway')"
                v-model="form.gateway"
                clearable
                :disabled="
                  platType == PLATFORM_TYPE.AVS &&
                  (drive == DRIVE_TYPE.ONVIF || drive == DRIVE_TYPE.HWSDK_ACREG)
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.netmask')" prop="netmask">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputNetmask')"
                v-model="form.netmask"
                clearable
                :disabled="
                  platType == PLATFORM_TYPE.AVS &&
                  (drive == DRIVE_TYPE.ONVIF || drive == DRIVE_TYPE.HWSDK_ACREG)
                "
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" v-if="drive === DRIVE_TYPE.ONVIF && platType == PLATFORM_TYPE.VPAAS">
            <el-form-item label="DNS" prop="dns">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputDns')"
                v-model="form.dns"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="drive === DRIVE_TYPE.ONVIF && platType == PLATFORM_TYPE.VPAAS">
            <el-form-item :label="$t('frontParameterConfiguration.rtspEnable')" prop="rtspEnable">
              <el-radio-group v-model="form.rtspEnable">
                <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
                <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="
                (drive === DRIVE_TYPE.ONVIF && platType == PLATFORM_TYPE.VPAAS) ||
                (platType == PLATFORM_TYPE.ADS &&
                  ['DHSDK', 'HIKSDK', 'HWSDK', 'HWSDK-ACREG'].indexOf(drive) > -1)
              "
              prop="rtspPort"
            >
              <template #label>
                <span>
                  <span>{{ $t('frontParameterConfiguration.rtspPort') }}</span>
                  <span style="font-size: 12px; color: #f56c6c">
                    {{
                      drive == DRIVE_TYPE.DHSDK && platType == PLATFORM_TYPE.ADS
                        ? $t('frontParameterConfiguration.portNumber2')
                        : $t('frontParameterConfiguration.portNumber')
                    }}
                  </span>
                </span>
              </template>
              <el-input
                v-model="form.rtspPort"
                :placeholder="$t('frontParameterConfiguration.inputRtspPort')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="platType == PLATFORM_TYPE.ADS">
            <el-form-item
              :label="$t('frontParameterConfiguration.bandwidthAdaptation')"
              prop="enableBandwidthSelf"
              v-if="['HWSDK', 'HWSDK-ACREG'].indexOf(drive) > -1"
            >
              <el-radio v-model="form.enableBandwidthSelf" :label="1" text-color="#333">
                {{ $t('frontParameterConfiguration.enable') }}
              </el-radio>
              <el-radio v-model="form.enableBandwidthSelf" :label="0" text-color="#333">
                {{ $t('frontParameterConfiguration.notEnabled') }}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionMainDevManage"
        :loading="btnLoading"
        type="primary"
        @click="submitForm"
      >
        {{ $t('public.confirm') }}
      </el-button>
    </div>
    <modify-pwd
      v-model:visible="pwdDialogVisible"
      :type="type"
      :account="form.puAccount"
      @getDevPassword="getDevPassword"
    />
    <long-lat-map />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import ModifyPwd from './modify-pwd.vue'
import LongLatMap from '@/components/long-lat-map'
import { validateDeviceName } from '@/utils/common/validator'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'

export default {
  components: { ModifyPwd, LongLatMap },
  data() {
    return {
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE,
      loading: false,
      form: {},
      formRules: {
        mainDevName: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.pleaseInputmainDevName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        manufacturer: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.pleaseChoosemanufacturer'),
            trigger: 'change'
          }
        ],
        puPasswd: [
          {
            required: false,
            message: this.$t('frontParameterConfiguration.inputPuPasswd'),
            trigger: 'change'
          },
          {
            min: 5,
            message: this.$t('frontParameterConfiguration.passWordLength'),
            trigger: 'blur'
          }
        ],
        rtspPort: [
          {
            pattern:
              /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
            message: this.$t('frontParameterConfiguration.portNumber'),
            trigger: 'change'
          }
        ],
        puIp: [
          {
            pattern:
              /^-?((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
            message: this.$t('public.puIpError'),
            trigger: 'change'
          }
        ]
      },
      btnLoading: false,
      netConfigForm: {},
      pwdDialogVisible: false,
      longlatMapVisible: false,
      platList: [],
      driveList: [],
      channelList: [],
      type: undefined
    }
  },
  computed: {
    ...mapState({
      mainDevTypeList: state => state.dict['main-dev-type'],
      applicationTypeList: state => state.dict['application-type'],
      manufacturerList: state => state.dict['camera_manufacturer'],
      networkTypeList: state => state.dict['dev-access-mode'],
      deviceRegisterStatusList: state => state.dict['device-register-status'],
      ipcProtocolTypeList: state => state.dict['ipc_protocol_type'],
      timeZoneList: state => state.dict['device-timezone-type'],
      mainDevId: state => state.deviceConfig.mainDevId,
      mainDevTypeListFormattered() {
        let arr = []
        this.mainDevTypeList.forEach(item => {
          let obj = { name: item.name, value: parseInt(item.value) }
          arr.push(obj)
        })
        return arr
      },
      deviceRegisterStatusListFormattered() {
        let arr = []
        this.deviceRegisterStatusList.forEach(item => {
          let obj = { name: item.name, value: parseInt(item.value) }
          arr.push(obj)
        })
        return arr
      },
      timeZoneListFormattered() {
        let arr = []
        this.timeZoneList.forEach(item => {
          let obj = { name: item.name, value: parseInt(item.value) }
          arr.push(obj)
        })
        return arr
      },
      networkTypeListFormattered() {
        let arr = []
        this.networkTypeList.forEach(item => {
          let obj = { name: item.name, value: parseInt(item.value) }
          arr.push(obj)
        })
        return arr
      }
    }),
    ...mapGetters('deviceConfig', [
      'drive',
      'platId',
      'platType',
      'mainDevStatus',
      'PermissionMainDevManage',
      'mainDevIsExDomain'
    ]),
    ...mapState('deviceConfig', ['mainDevInfo'])
  },
  watch: {
    mainDevId: {
      handler() {
        this.mainDevBasicInfo()
      },
      immediate: true
    },
    'form.organizationId'() {
      this.getPlatList()
    },
    'form.longitude'(newVal) {
      if (newVal) this.form['longitudeAndLatitude'] = newVal + ',' + this.latitude
    },
    'form.latitude'(newVal) {
      if (newVal) this.form['longitudeAndLatitude'] = this.form.longitude + ',' + newVal
    },
    'form.longitudeAndLatitude'(newVal) {
      if (newVal === '') {
        this.form.latitude = 0
        this.form.longitude = 0
      }
    }
  },

  async created() {
    await this.getSysDictData([
      'main-dev-type',
      'application-type',
      'device-register-status',
      'dev-access-mode', //网络类型
      'camera_manufacturer',
      'device-timezone-type',
      'network-type'
    ])
  },
  mounted() {},
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    ...mapMutations('deviceConfig', {
      setMainDevInfo: 'SET_MAIN_DEV_INFO'
    }),
    handlePaste(event) {
      event.preventDefault() // 阻止粘贴操作
    },
    // 获取主设备系统参数
    async mainDevBasicInfo() {
      if (this.drive == DRIVE_TYPE.DHSDK && this.platType == PLATFORM_TYPE.ADS) {
        this.formRules.rtspPort = [
          {
            pattern:
              /^(102[5-9]|10[3-9][0-9]|1[1-9][0-9]{2}|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-4])$/,
            message: this.$t('frontParameterConfiguration.portNumber2'),
            trigger: 'change'
          }
        ]
      }
      this.loading = true
      let res1 = await this.$api.mainDevBasicInfo({
        mainDevId: this.mainDevId
      })
      if (res1.resultCode === 0) {
        this.form = res1
        this.setMainDevInfo({
          ...this.mainDevInfo,
          isExDomain: 0
        })
        this.form = { ...this.form, ...this.mainDevInfo }
        if (this.form.puPasswd) this.form.puPasswd = res1.puPasswd
        if (this.form.puAccessPasswd) this.form.puAccessPasswd = res1.puAccessPasswd
        this.form.platId = this.platId
        this.form.organizationId = this.mainDevInfo.organizationId
        this.form.organizationName = this.mainDevInfo.organizationName
        this.form.status = this.mainDevStatus
      }
      if (
        this.form.status === 1 &&
        !this.mainDevIsExDomain &&
        (this.drive === DRIVE_TYPE.ONVIF ||
          this.drive === DRIVE_TYPE.HWSDK_ACREG ||
          (this.drive != DRIVE_TYPE.T28181 && this.platType == PLATFORM_TYPE.ADS))
      ) {
        let res2 = await Promise.all([
          this.$api.mainDevBasicInfo({
            mainDevId: this.mainDevId
          }),
          this.$api.mainDevNetworkInfo({
            mainDevId: this.mainDevId
          })
        ])
        if (res2[0].resultCode === 0 && res2[0]) this.form = { ...this.form, ...res2[0] }
        if (res2[1].resultCode === 0 && res2[1]) this.form = { ...this.form, ...res2[1] }
      }
      if (this.form.longitude == undefined) {
        this.form.longitude = 0
        this.form.latitude = 0
      }
      this.loading = false
    },

    longlatFocus() {
      this.longlatMapVisible = true
    },
    modifyPwd(type) {
      this.type = type
      this.pwdDialogVisible = true
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          try {
            this.btnLoading = true
            const {
              mainDevId,
              mainDevName,
              mainDevType,
              organizationId,
              organizationName,
              platId,
              mainDevSn,
              thirdMainDevId,
              manufacturer,
              model,
              drive,
              registerType,
              enableAlarm,
              puAccount,
              puPasswd,
              puAccessPasswd,
              gbAccessIp,
              gbAccessPort,
              accessInterconnectCode,
              remark,
              applicationType,
              networkType,
              installLocate,
              status,
              ipcProtocol,
              ipcPort,
              createTime,
              updateTime,
              longitude,
              latitude
            } = this.form
            const deviceConfig = {
              deviceCode: this.mainDevId,
              configType: 1,
              mainDevId,
              mainDevName,
              mainDevType,
              organizationId,
              organizationName,
              platId,
              mainDevSn,
              thirdMainDevId,
              manufacturer,
              model,
              drive,
              registerType,
              enableAlarm,
              puAccount,
              puAccessPasswd,
              gbAccessIp,
              gbAccessPort,
              accessInterconnectCode,
              remark,
              applicationType,
              networkType,
              installLocate,
              status,
              ipcProtocol,
              ipcPort,
              createTime,
              updateTime,
              longitude,
              latitude
            }
            if (puAccount) {
              deviceConfig.puPasswd = puPasswd
            }
            if (
              this.mainDevIsExDomain ||
              this.form.status != 1 ||
              (this.drive != DRIVE_TYPE.ONVIF &&
                this.drive != DRIVE_TYPE.HWSDK_ACREG &&
                this.platType == PLATFORM_TYPE.VPAAS) ||
              (this.drive = DRIVE_TYPE.T28181 && this.platType == PLATFORM_TYPE.ADS)
            ) {
              let res = await this.$api.mainDevBasicConfig(deviceConfig)
              if (res.resultCode == 0) {
                this.$message({
                  message: this.$t('mainDevConfiguration.systemParametersModifiedSuccessfully'),
                  type: 'success'
                })
                this.btnLoading = false
              }
            } else {
              const {
                puIp,
                puPort,
                gateway,
                netmask,
                rtspEnable,
                rtspPort,
                enableBandwidthSelf,
                dns
              } = this.form
              const deviceNetConfig = {
                mainDevId: this.mainDevId,
                puIp,
                puPort,
                gateway,
                netmask,
                rtspEnable,
                rtspPort,
                enableBandwidthSelf,
                dns
              }
              let res1 = await this.$api.mainDevBasicConfig(deviceConfig)
              let res2 = await this.$api.mainDevNetworkConfig(deviceNetConfig)
              Promise.all([res1, res2]).then(() => {
                if (res1.resultCode === 0 && res2.resultCode === 0) {
                  this.$message({
                    message: this.$t('mainDevConfiguration.systemParametersSetSuccessfully'),
                    type: 'success'
                  })
                  this.btnLoading = false
                }
              })
            }
          } finally {
            this.btnLoading = false
          }
        }
      })
    },
    async getDevPassword() {
      let res = await this.$api.getDevPassword({ mainDevId: this.mainDevId, type: this.type })
      if (res.resultCode == 0) {
        this.type == 0
          ? (this.form.puPasswd = res.password)
          : (this.form.puAccessPasswd = res.password)
      }
    },
    async getSubDeviceChannelList() {
      let res = await this.$api.getSubDeviceChannelList({ mainDevId: this.mainDevId })
      if (res.resultCode == 0) {
        this.channelList = res.devChannelBriefInfos
        this.$message({
          message: this.$t('mainDevConfiguration.channelSynchronisationSuccessful'),
          type: 'success'
        })
      }
    },
    //获取平台列表
    async getPlatList() {
      let res = await this.$api.queryAccessPlatformList({
        organizationId: this.form.organizationId
      })
      if (res.platformList && res.platformList.length) {
        res.platformList = res.platformList.map(item => {
          return {
            enableStatus: item.enableStatus,
            platId: item.platformId,
            platName: item.platformName,
            platType: item.platformType,
            platStatus: item.platformStatus
          }
        })
        this.platList = res.platformList
        this.getDriveList()
      }
    },
    //获取设备协议类型
    async getDriveList() {
      let platType
      this.platList.some(item => {
        if (this.form.platId == item.platId) platType = item.platType
      })
      let res = await this.$api.getDictionary({
        type: 'access-device-protocol-' + platType
      })
      if (res.resultCode == 0) this.driveList = res.dictionaryList
    }
  }
}
</script>
<style lang="scss">
.pu-passwds {
  .el-input__suffix {
    position: static;
  }
}
</style>
