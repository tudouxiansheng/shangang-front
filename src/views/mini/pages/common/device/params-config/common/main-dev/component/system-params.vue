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
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.state')" prop="status">
            <el-select disabled v-model="form.status">
              <el-option
                v-for="(item, index) in deviceRegisterStatusListFormattered"
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
          <el-form-item :label="$t('mainDevConfiguration.applicationType')" prop="applicationType">
            <el-select clearable v-model="form.applicationType">
              <el-option
                v-for="(item, index) in applicationTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
          <el-form-item :label="$t('mainDevConfiguration.installLocate')" prop="installLocate">
            <el-input
              :placeholder="$t('mainDevConfiguration.pleaseInputInstallLocate')"
              v-model="form.installLocate"
              clearable
            ></el-input>
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
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.puAccount')" prop="puAccount">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputPuAccount')"
              v-model="form.puAccount"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="$t('mainDevConfiguration.puPasswd')"
                prop="puPasswd"
                class="pu-passwd"
              >
                <el-input v-model="form.puPasswd" show-password disabled=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="outer">
              <el-button
                type="primary"
                class="inner"
                @click="modifyPwd(0)"
                :disabled="form.isExDomain === 1"
              >
                {{ $t('mainDevConfiguration.modifyPwd') }}
              </el-button>
            </el-col>
          </el-row>
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
        <el-col :span="6" v-show="drive == 'T28181' || drive == 'HWSDK-ACREG'">
          <el-form-item
            :label="$t('mainDevConfiguration.accessInterconnectCode')"
            prop="accessInterconnectCode"
          >
            <el-input v-model="form.accessInterconnectCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.createTime')" prop="createTime">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainDevConfiguration.updateTime')" prop="updateTime">
            <el-input v-model="form.updateTime" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="$t('mainDevConfiguration.longitudeAndLatitude')"
            prop="longitudeAndLatitude"
          >
            <el-input
              ref="inputBlur"
              :placeholder="$t('mainDevConfiguration.pleaseInputLongitudeAndLatitude')"
              v-model="form.longitudeAndLatitude"
              clearable
               @clear="shouldExecuteFocus = false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="drive == 'T28181'">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item
                :label="$t('mainDevConfiguration.authPassword')"
                prop="puAccessPasswd"
                class="pu-passwd"
              >
                <el-input v-model="form.puAccessPasswd" show-password disabled=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="outer">
              <el-button
                type="primary"
                class="inner"
                @click="modifyPwd(1)"
                :disabled="form.isExDomain === 1"
              >
                {{ $t('mainDevConfiguration.modifyPwd') }}
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="$t('mainDevConfiguration.remark')" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('mainDevConfiguration.inputRemark')"
            v-model="form.remark"
            clearable
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row
        v-if="
          form.status === 1 &&
          !mainDevIsExDomain &&
          !(
            drive == 'T28181' ||
            (platType == 3 && drive == 'HIKSDK') ||
            (platType == 3 && drive == 'DHSDK')
          )
        "
      >
        <p class="form-title">{{ $t('mainDevConfiguration.alarmControl') }}</p>
        <el-row>
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
        <p class="form-title" v-show="drive != 'T28181' || platType == 14">
          {{ $t('mainDevConfiguration.networkSettings') }}
        </p>
        <el-row :gutter="20" v-show="drive != 'T28181' || platType == 14">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.puIp')" prop="puIp">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputPuIP')"
                v-model="form.puIp"
                clearable
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.puPort')" prop="puPort">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputPuPort')"
                v-model="form.puPort"
                clearable
                :disabled="platType == 3 && (drive == 'ONVIF' || drive == 'HWSDK-ACREG')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.gateway')" prop="gateway">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputGateway')"
                v-model="form.gateway"
                clearable
                :disabled="platType == 3 && (drive == 'ONVIF' || drive == 'HWSDK-ACREG')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.netmask')" prop="netmask">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputNetmask')"
                v-model="form.netmask"
                clearable
                :disabled="platType == 3 && (drive == 'ONVIF' || drive == 'HWSDK-ACREG')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="form-title" v-show="!(drive == 'T28181' || platType == 14)">
          {{ $t('mainDevConfiguration.webConfigurationInfo') }}
        </p>
        <el-row :gutter="20" v-show="!(drive == 'T28181' || platType == 14)">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.ipcProtocol')" prop="ipcProtocol">
              <el-select
                clearable
                v-model="form.ipcProtocol"
                :placeholder="$t('mainDevConfiguration.pleaseSelectIpcProtocol')"
              >
                <el-option
                  v-for="(item, index) in ipcProtocolTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="text-blue-400">{{ $t('mainDevConfiguration.ipcProtocolTip') }}</span>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.ipcPort')" prop="ipcPort">
              <el-input
                :placeholder="$t('mainDevConfiguration.inputIpcPort')"
                v-model="form.ipcPort"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="form-title" v-show="drive != 'T28181'">
          {{ $t('mainDevConfiguration.timeConfiguration') }}
        </p>
        <el-row :gutter="20" v-show="drive != 'T28181'">
          <el-col :span="6">
            <el-form-item :label="$t('mainDevConfiguration.timeZones')" prop="timezone">
              <el-select
                clearable
                v-model="form.timezone"
                :placeholder="$t('mainDevConfiguration.pleaseSelectTimeZones')"
              >
                <el-option
                  v-for="(item, index) in timeZoneListFormattered"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
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
    <modify-pwd :type="type" :account="form.puAccount" @getDevPassword="getDevPassword" />
    <long-lat-map />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import ModifyPwd from './modify-pwd.vue'
import LongLatMap from '@/components/long-lat-map'
import { validateDeviceName } from '@/utils/common/validator'

export default {
  components: { ModifyPwd, LongLatMap },
  data() {
    return {
      shouldExecuteFocus: true,
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
            message: this.$t('mainDevConfiguration.pleaseChoosemanufacturer'),
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
        this.getDevConfig()
      },
      immediate: true
    },
    'form.organizationId'() {
      this.getPlatList()
    },
    'form.longitude'(newVal) {
      if (newVal) this.form['longitudeAndLatitude'] = newVal + ',' + this.form.latitude
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
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    ...mapMutations('deviceConfig', {
      setMainDevInfo: 'SET_MAIN_DEV_INFO'
    }),
    // 获取主设备系统参数
    async getDevConfig() {
      this.loading = true
      let res1 = await this.$api.getDevConfig({
        deviceCode: this.mainDevId,
        configType: 1
      })
      if (res1?.resultCode === 0) {
        this.form = res1.configItem
        this.setMainDevInfo({
          ...this.mainDevInfo,
          isExDomain: res1.configItem.isExDomain
        })
        if (this.form.puPasswd) this.form.puPasswd = res1.configItem.puPasswd
        if (this.form.puAccessPasswd) this.form.puAccessPasswd = res1.configItem.puAccessPasswd
      }
      if (
        this.form.status === 1 &&
        !this.mainDevIsExDomain &&
        !(
          this.form.drive == 'T28181' ||
          (this.form.platInfo.platType == 3 && this.form.drive == 'HIKSDK') ||
          (this.form.platInfo.platType == 3 && this.form.drive == 'DHSDK')
        )
      ) {
        let res2 = await Promise.all([
          this.$api.getDevConfig({
            deviceCode: this.mainDevId,
            configType: 2
          }),
          this.$api.getDevConfig({
            deviceCode: this.mainDevId,
            configType: 3
          })
        ])
        if (res2[0].resultCode === 0 && res2[0].configItem)
          this.form = { ...this.form, ...res2[0].configItem }
        if (res2[1].resultCode === 0 && res2[1].configItem)
          this.form = { ...this.form, ...res2[1].configItem }
      }
      if (this.form.longitude == undefined) {
        this.form.longitude = 0
        this.form.latitude = 0
      }
      this.loading = false
    },
    longlatFocus() {
      if (this.shouldExecuteFocus) {
        this.longlatMapVisible = true
      } else {
        this.shouldExecuteFocus = true
      }
        this.$refs.inputBlur.blur()
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
              configItem: {
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
              }
            }
            if (
              this.mainDevIsExDomain ||
              this.form.status != 1 ||
              this.drive == 'T28181' ||
              (this.platType == 3 && this.drive == 'HIKSDK') ||
              (this.platType == 3 && this.drive == 'DHSDK')
            ) {
              let res = await this.$api.setDevConfig(deviceConfig)
              if (res.resultCode == 0) {
                this.$message({
                  message: this.$t('mainDevConfiguration.systemParametersModifiedSuccessfully'),
                  type: 'success'
                })
                this.btnLoading = false
              }
            } else if (this.platType == 3 && this.drive == 'ONVIF') {
              const { enableNTP, timezone, enableDST } = this.form
              const deviceTimeConfig = {
                deviceCode: this.mainDevId,
                configType: 3,
                configItem: {
                  enableNTP,
                  timezone,
                  enableDST
                }
              }
              let res = await Promise.all([
                this.$api.setDevConfig(deviceTimeConfig),
                this.$api.setDevConfig(deviceConfig)
              ])
              if (res[0].resultCode === 0 && res[1].resultCode === 0) {
                this.$message({
                  message: this.$t('mainDevConfiguration.systemParametersSetSuccessfully'),
                  type: 'success'
                })
                this.btnLoading = false
              }
            } else {
              const { puIp, puPort, gateway, netmask, rtspEnable, rtspPort } = this.form
              const { enableNTP, timezone, enableDST } = this.form
              const deviceNetConfig = {
                deviceCode: this.mainDevId,
                configType: 2,
                configItem: {
                  puIp,
                  puPort,
                  gateway,
                  netmask,
                  rtspEnable,
                  rtspPort
                }
              }
              const deviceTimeConfig = {
                deviceCode: this.mainDevId,
                configType: 3,
                configItem: {
                  enableNTP,
                  timezone,
                  enableDST
                }
              }
              let res = await this.$api.setDevConfig(deviceTimeConfig)
              let res1 = await this.$api.setDevConfig(deviceConfig)
              let res2 = await this.$api.setDevConfig(deviceNetConfig)
              Promise.all([res, res1, res2]).then(() => {
                if (res.resultCode === 0 && res1.resultCode === 0 && res2.resultCode === 0) {
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
.pu-passwd {
  .el-input__suffix {
    position: static;
  }
}

.outer {
  position: relative;
  display: flex !important;
  align-items: center;
}
.inner {
  position: absolute;
}
</style>
