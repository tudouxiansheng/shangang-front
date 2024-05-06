<template>
  <!-- 主设备基础信息 -->
  <div id="devInfo">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '250px' : '170px'"
      size="small"
      label-position="left"
      style="display: flex"
    >
      <div style="width: 50%; padding-right: 10px">
        <el-form-item :label="$t('public.mainDevName') + '：'" prop="mainDevName">
          <el-input
            v-model="ruleForm.mainDevName"
            :placeholder="$t('frontParameterConfiguration.inputMainDevName')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.mainDevId') + '：'"
          prop="mainDevId"
          class="flex-content"
        >
          <el-input
            v-model="ruleForm.mainDevId"
            :placeholder="$t('frontParameterConfiguration.inputMainDevId')"
            clearable
            disabled
          ></el-input>
          <el-button type="primary" class="copyBtn" @click="copyValue(ruleForm.mainDevId)">
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.thirdMainDevId') + '：'"
          prop="thirdMainDevId"
          class="flex-content"
        >
          <el-input
            v-model="ruleForm.thirdMainDevId"
            :placeholder="$t('frontParameterConfiguration.inputThirdMainDevId')"
            clearable
            disabled
          ></el-input>
          <el-button class="copyBtn" type="primary" @click="copyValue(ruleForm.thirdMainDevId)">
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item :label="$t('public.mainDevSn') + '：'" prop="mainDevSn" class="flex-content">
          <el-input
            v-model="ruleForm.mainDevSn"
            :placeholder="$t('public.pleaseInputmainDevSn')"
            clearable
            disabled
          ></el-input>
          <el-button class="copyBtn" type="primary" @click="copyValue(ruleForm.mainDevSn)">
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
          <el-select
            v-model="ruleForm.mainDevType"
            disabled
            :placeholder="$t('frontParameterConfiguration.inputMainDevType')"
          >
            <el-option
              v-for="(item, index) in mainDevTypeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.manufacturer') + '：'"
          prop="manufacturer"
        >
          <el-input
            v-model="ruleForm.manufacturer"
            :placeholder="$t('frontParameterConfiguration.inputManufacturer')"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.model') + '：'" prop="model">
          <el-input
            v-model="ruleForm.model"
            :placeholder="$t('frontParameterConfiguration.inputModel')"
            clearable
            disabled
          ></el-input>
        </el-form-item>
      </div>

      <div style="width: 50%; padding-left: 10px">
        <el-form-item
          :label="$t('frontParameterConfiguration.enableAlarm') + '：'"
          prop="enableAlarm"
        >
          <el-radio v-model="ruleForm.enableAlarm" :label="1" text-color="#333">
            {{ $t('alarmTypeManage.yes') }}
          </el-radio>
          <el-radio v-model="ruleForm.enableAlarm" :label="0" text-color="#333">
            {{ $t('alarmTypeManage.no') }}
          </el-radio>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.drive') + '：'" prop="drive">
          <el-input
            v-model="ruleForm.drive"
            :placeholder="$t('frontParameterConfiguration.inputDrive')"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('primaryDevice.accessInterconnectCode1') + '：'"
          prop="accessInterconnectCode"
          class="flex-content"
          v-if="ruleForm.accessInterconnectCode"
        >
          <el-input
            v-model="ruleForm.accessInterconnectCode"
            :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
            clearable
            disabled
          ></el-input>
          <el-button
            class="copyBtn"
            type="primary"
            @click="copyValue(ruleForm.accessInterconnectCode)"
          >
            {{ $t('frontParameterConfiguration.copy') }}
          </el-button>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.puAccount') + '：'"
          prop="puAccount"
          v-if="ruleForm.drive != 'T28181'"
        >
          <el-input
            v-model="ruleForm.puAccount"
            :placeholder="$t('frontParameterConfiguration.inputPuAccount')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.puPasswd') + '：'"
          prop="puPasswd"
          v-if="ruleForm.drive != 'T28181'"
        >
          <pwd-input
            v-model="ruleForm.puPasswd"
            :placeholder="$t('frontParameterConfiguration.inputPuPasswd')"
            :disabled="frontPlatType == 9"
            strength
          />
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.puAccessPasswd') + '：'"
          prop="puAccessPasswd"
          v-if="ruleForm.drive == 'T28181'"
        >
          <pwd-input
            v-model="ruleForm.puAccessPasswd"
            :placeholder="$t('frontParameterConfiguration.puAccessPasswdInput')"
            :disabled="$store.state.frontPlatType == 9"
            strength
          />
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.platformIP') + '：'"
          prop="gbAccessIp"
          v-if="ruleForm.drive == 'T28181' || ruleForm.registerType"
        >
          <el-input
            v-model="ruleForm.gbAccessIp"
            :placeholder="$t('frontParameterConfiguration.inpurPlatformIP')"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.platformIPv6') + '：'"
          prop="gbAccessIpv6"
          v-if="ruleForm.drive == 'T28181' || ruleForm.registerType"
        >
          <el-input
            v-model="ruleForm.gbAccessIpv6"
            :placeholder="$t('frontParameterConfiguration.inpurPlatformIPv6')"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.platformPort') + '：'"
          prop="gbAccessPort"
          v-if="ruleForm.drive == 'T28181' || ruleForm.registerType"
        >
          <el-input
            v-model="ruleForm.gbAccessPort"
            :placeholder="$t('frontParameterConfiguration.inpurPlatformPort')"
            clearable
            disabled
          ></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="button" :class="[$route.query.cameraId ? 'clientButton' : '']">
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="sureBtn"
        @click="submitForm('ruleForm', 0)"
      >
        {{ $t('public.confirm') }}
      </el-button>
      <el-button class="cancelBtn" @click="dialogCancel">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="cancelBtn"
        @click="submitForm('ruleForm', 1)"
      >
        {{ $t('frontParameterConfiguration.apply') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import Clipboard from 'vue-clipboard3'
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  props: ['baseInfoShow'],
  data() {
    return {
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      mainDevId: '',
      baseInfoShowFlag: this.baseInfoShow,
      ruleForm: {
        mainDevName: '', //主设备名称
        mainDevId: '', //主设备编码
        thirdMainDevId: '', //监控平台设备编码
        mainDevSn: '', //设备序列号
        mainDevType: '', //设备类型
        manufacturer: '', //设备厂商
        model: '', //设备型号
        enableAlarm: '', //是否布防告警
        drive: '', //设备注册协议(主设备基础信息)
        accessInterconnectCode: '', //主设备互联编码
        puAccount: '', //设置登录账号
        puPasswd: '', //设置登录密码
        puAccessPasswd: '', //设置向平台注册密码
        gbAccessIp: '', //平台ip
        gbAccessPort: '' //平台端口
      },
      mainDevTypeList: [
        {
          name: 'NVR',
          value: 1
        },
        {
          name: 'DVS',
          value: 2
        },
        {
          name: 'IPC',
          value: 3
        },
        {
          name: 'DVR',
          value: 4
        },
        {
          name: 'other',
          value: 0
        }
      ],
      rules: {
        mainDevName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputMainDevName'),
            trigger: 'change'
          }
        ],
        mainDevId: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputMainDevId'),
            trigger: 'change'
          }
        ],
        thirdMainDevId: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputThirdMainDevId'),
            trigger: 'change'
          }
        ],
        mainDevSn: [
          {
            required: false,
            message: this.$t('public.pleaseInputmainDevSn'),
            trigger: 'change'
          }
        ],
        mainDevType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputMainDevType'),
            trigger: 'change'
          }
        ],
        model: [
          {
            required: false,
            message: this.$t('frontParameterConfiguration.inputModel'),
            trigger: 'change'
          }
        ],
        enableAlarm: [
          {
            required: false,
            message: this.$t('frontParameterConfiguration.selectEnableAlarm'),
            trigger: 'change'
          }
        ],
        drive: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputDrive'),
            trigger: 'change'
          }
        ],
        puAccount: [
          {
            required: false,
            message: this.$t('public.puAccountPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 32,
            message: this.$t('public.puAccountError'),
            trigger: 'blur'
          }
        ],
        puPasswd: [
          {
            required: false,
            message: this.$t('public.puPasswdPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 128,
            message: this.$t('public.puPasswdError'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      frontDevId: state => state.config.frontDevId,
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    //用户权限判断
    this.PermissionManage = await permissions(162)
    this.viewMainDevInfo()
  },

  methods: {
    //主设备基础信息查看
    async viewMainDevInfo() {
      let res
      if (this.$route.query.cameraId) {
        res = await this.$api.getCameraInfoQuery({
          cameraId: this.$route.query.cameraId
        })
        this.mainDevId = res.cameraInfo.mainDevId
      }
      let mainDevViewObj = {
        mainDevId: this.frontDevId || this.mainDevId,
        cameraId: this.$route.query.cameraId
      }
      this.getBasicInfo(mainDevViewObj)
    },

    getBasicInfo(mainDevViewObj) {
      this.$api.mainDevBasicInfo(mainDevViewObj).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.mainDevName = res.mainDevName
          this.ruleForm.mainDevId = res.mainDevId
          this.ruleForm.thirdMainDevId = res.thirdMainDevId
          this.ruleForm.mainDevSn = res.mainDevSn
          this.ruleForm.gbAccessIp = res.gbAccessIp
          this.ruleForm.gbAccessPort = res.gbAccessPort
          this.ruleForm.registerType = res.registerType
          this.ruleForm.mainDevType = res.mainDevType
          this.ruleForm.manufacturer = res.manufacturer
          this.ruleForm.model = res.model
          this.ruleForm.enableAlarm = res.enableAlarm
          this.ruleForm.drive = res.drive
          this.ruleForm.puAccount = res.puAccount
          this.ruleForm.accessInterconnectCode = res.accessInterconnectCode

          this.ruleForm.puPasswd = res.puPasswd
          this.ruleForm.puAccessPasswd = res.puAccessPasswd
          this.ruleForm.gbAccessIpv6 = res.gbAccessIpv6
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let mainDevBasicConfigObj = {
            mainDevId: this.frontDevId || this.mainDevId,
            cameraId: this.$route.query.cameraId,
            mainDevName: this.ruleForm.mainDevName,
            mainDevSn: this.ruleForm.mainDevSn,
            manufacturer: this.ruleForm.manufacturer,
            model: this.ruleForm.model,
            drive: this.ruleForm.drive,
            enableAlarm: this.ruleForm.enableAlarm,
            puAccount: this.ruleForm.puAccount,
            mainDevType: this.ruleForm.mainDevType
          }

          mainDevBasicConfigObj.puPasswd = this.ruleForm.puPasswd

          mainDevBasicConfigObj.puAccessPasswd = this.ruleForm.puAccessPasswd

          //主设备基础信息设置
          this.$api.mainDevBasicConfig(mainDevBasicConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.dialogCancel()
              } else {
                this.viewMainDevInfo()
              }
            }
          })
        }
      })
    },
    //复制
     async copyValue(info) {
      const { toClipboard } = Clipboard()
      try {
        await toClipboard(info)
        this.$message({
          type: 'success',
          message: this.$t('frontParameterConfiguration.copySucc')
        })
      } catch (e) {}
    },
    dialogCancel() {
      if (!this.$route.query.cameraId) {
        //web关闭谈框
        this.$store.commit('config/set_baseInfoShow', false)
      } else {
        //客户端关闭谈框
        let param = {
          url: '/AIV-MP/#/config/pu-config' + this.$route.query.cameraId
        }
        this.$webkitProc('close_dialog', JSON.stringify(param))
      }
    }
  }
}
</script>

<style lang="scss">
#devInfo {
  height: 100%;
}
</style>
