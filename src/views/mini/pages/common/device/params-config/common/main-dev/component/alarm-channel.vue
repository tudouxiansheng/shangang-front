<template>
  <!-- 告警通道 -->
  <div id="alarm-channel">
    <el-row class="alarm-channel-container">
      <el-col :span="4">
        <ul class="alarm-config">
          <li
            v-for="item in alarmConfig"
            :key="item.configType"
            :class="['alarm-item', configType == item.configType ? 'active' : '']"
            @click="getAlarmInfo(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </el-col>
      <el-col :span="20" class="h-full pl30">
        <el-form
          v-show="configType == 14"
          ref="AlarmInConfig"
          class="alarm-form"
          :model="AlarmInConfig"
          :label-width="locale == 'en' ? '190px' : '120px'"
          label-position="top"
          :disabled="!PermissionMainDevManage"
        >
          <el-row v-for="(item, index) in AlarmInConfig.AlarmInList" :key="index">
            <div class="form-title">
              <span>input{{ index + 1 }}</span>
            </div>
            <el-col :span="locale == 'en' ? 7 : 8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.alarmConfig.name') + '：'"
                :prop="`AlarmInList[${index}].alarmInName`"
                :rules="AlarmInList.alarmInName"
              >
                <el-input
                  v-model="item.alarmInName"
                  :disabled="drive != 'ONVIF' ? false : true"
                  :placeholder="$t('frontParameterConfiguration.alarmConfig.inputName')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8" class="pr50">
              <el-form-item
                v-if="drive != 'ONVIF'"
                :label="$t('frontParameterConfiguration.alarmConfig.autoClearAlarmTime') + '：'"
                :prop="`AlarmInList[${index}].autoClearAlarmTime`"
                :rules="AlarmInList.autoClearAlarmTime"
              >
                <el-input
                  v-model.number="item.autoClearAlarmTime"
                  :placeholder="
                    $t('frontParameterConfiguration.alarmConfig.inputAutoClearAlarmTime')
                  "
                  :disabled="drive != 'HWSDK-ACREG' ? false : true"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 10 : 8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.alarmConfig.switchType') + '：'"
                :prop="`AlarmInList[${index}].switchType`"
                required
              >
                <el-radio v-model="item.switchType" :label="1" border>
                  {{ $t('frontParameterConfiguration.alarmConfig.switchType1') }}
                </el-radio>
                <el-radio v-model="item.switchType" :label="0" border>
                  {{ $t('frontParameterConfiguration.alarmConfig.switchType0') }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form
          v-show="configType == 15"
          ref="AlarmOutConfig"
          class="alarm-form"
          :model="AlarmOutConfig"
          :label-width="locale == 'en' ? '190px' : '120px'"
          label-position="top"
          :disabled="!PermissionMainDevManage"
        >
          <el-row v-for="(item, index) in AlarmOutConfig.AlarmOutList" :key="index">
            <div class="form-title">
              <span>input{{ index + 1 }}</span>
            </div>
            <el-col :span="locale == 'en' ? 7 : 8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.alarmConfig.name') + '：'"
                :prop="`AlarmOutList[${index}].alarmOutName`"
                :rules="AlarmOutList.alarmOutName"
              >
                <el-input
                  v-model="item.alarmOutName"
                  :disabled="drive != 'ONVIF' ? false : true"
                  :placeholder="$t('frontParameterConfiguration.alarmConfig.inputName')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="drive != 'ONVIF'" :span="locale == 'en' ? 7 : 8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.alarmConfig.autoClearAlarmTime') + '：'"
                :prop="`AlarmOutList[${index}].holdTime`"
                :rules="AlarmOutList.holdTime"
              >
                <el-input
                  v-model.number="item.holdTime"
                  :placeholder="
                    $t('frontParameterConfiguration.alarmConfig.inputAutoClearAlarmTime')
                  "
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="drive != 'HWSDK-ACREG'" :span="locale == 'en' ? 10 : 8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.alarmConfig.switchType') + '：'"
                :prop="`AlarmOutList[${index}].switchType`"
                required
              >
                <el-radio v-model="item.switchType" :label="1" border>
                  {{ $t('frontParameterConfiguration.alarmConfig.switchType1') }}
                </el-radio>
                <el-radio v-model="item.switchType" :label="0" border>
                  {{ $t('frontParameterConfiguration.alarmConfig.switchType0') }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionMainDevManage"
        type="primary"
        :loading="maskloading"
        @click="submitForm(configType == 14 ? 'AlarmInConfig' : 'AlarmOutConfig')"
      >
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  data() {
    return {
      alarmConfig: [
        {
          name: this.$t('frontParameterConfiguration.alarmConfig.alarmIn'),
          configType: 14
        },
        {
          name: this.$t('frontParameterConfiguration.alarmConfig.alarmOut'),
          configType: 15
        }
      ],
      configType: 14,
      AlarmInConfig: {
        AlarmInList: [
          {
            alarmInName: '',
            alarmInChanIndex: 1,
            switchType: 1,
            autoClearAlarmTime: 1
          }
        ]
      },
      AlarmOutConfig: {
        AlarmOutList: [
          {
            alarmOutName: '',
            alarmOutChanIndex: 1,
            holdTime: 0
          }
        ]
      },
      AlarmInList: {
        alarmInName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.alarmConfig.inputName'),
            trigger: ['change', 'blur']
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: ['change', 'blur']
          }
        ],
        autoClearAlarmTime: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.alarmConfig.inputAutoClearAlarmTime'),
            trigger: ['change', 'blur']
          },
          {
            pattern: /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
            message: this.$t('frontParameterConfiguration.alarmConfig.autoClearAlarmTimeScope'),
            trigger: ['change', 'blur']
          }
        ]
      },
      AlarmOutList: {
        alarmOutName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.alarmConfig.inputName'),
            trigger: ['change', 'blur']
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: ['change', 'blur']
          }
        ],
        holdTime: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.alarmConfig.inputAutoClearAlarmTime'),
            trigger: ['change', 'blur']
          },
          {
            pattern: /^([0-9]|[1-9]\d|[1-5]\d\d|600)$/,
            message: this.$t('frontParameterConfiguration.alarmConfig.holdTimeScope'),
            trigger: ['change', 'blur']
          }
        ]
      },

      maskloading: false
    }
  },
  computed: {
    ...mapState({
      deviceCode: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['drive', 'PermissionMainDevManage'])
  },
  mounted() {
    this.viewAlarmInInfo()
    this.viewAlarmOutInfo()
  },
  methods: {
    async viewAlarmInInfo() {
      const res = await this.$api.getDevConfig({ deviceCode: this.deviceCode, configType: 14 })
      if (res.resultCode != 0) return
      const { configItem } = res
      this.AlarmInConfig.AlarmInList = configItem
    },
    async viewAlarmOutInfo() {
      const res = await this.$api.getDevConfig({ deviceCode: this.deviceCode, configType: 15 })
      if (res.resultCode != 0) return
      const { configItem } = res
      this.AlarmOutConfig.AlarmOutList = configItem
    },
    getAlarmInfo(item) {
      this.configType = item.configType
      this.$nextTick(() => {
        this.$refs[this.configType == 14 ? 'AlarmInConfig' : 'AlarmOutConfig'].clearValidate()
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.maskloading = true
          let data = {
            deviceCode: this.deviceCode,
            configType: this.configType,
            configItem:
              this.configType == 14
                ? this.AlarmInConfig.AlarmInList
                : this.AlarmOutConfig.AlarmOutList
          }
          const res = await this.$api.setDevConfig(data)
          if (res.resultCode == 0) {
            this.$message({
              type: 'success',
              message: this.$t('public.modifySuccess')
            })
            this.configType == 14 ? this.viewAlarmInInfo() : this.viewAlarmOutInfo()
          }
          this.maskloading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
#alarm-channel {
  width: 100%;
  height: 100%;
  position: relative;
  .alarm-channel-container {
    width: 100%;
    height: calc(100% - 68px);
    .alarm-form {
      height: 100%;
      overflow-y: auto;
    }
    .alarm-config {
      border: 1px solid #0b537e;
      border-radius: 4px 4px 0px 0px;
      .alarm-item {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
        &.active {
          background: #0e6294;
        }
      }
    }
    .form-title {
      position: relative;
      margin-bottom: 30px;
      font-size: 16px;
      font-weight: 400;
      width: 100%;
      color: #ffffff;
      span {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        margin-left: 14px;
      }
      &::before {
        content: ' ';
        position: absolute;
        width: 4px;
        height: 16px;
        left: 0;
        bottom: 3px;
        background: linear-gradient(0deg, #879fd0 0%, #8fcbfa 100%);
        border-radius: 2px;
      }
    }
    .el-form-item {
      margin-bottom: 25px;
    }
    .el-input__inner {
      background: #08334d;
      border-color: #08334d;
    }
    .el-radio {
      &.is-bordered {
        border: none;
        &.is-checked {
          border: 1px solid #18a3f4;
          border-radius: 4px;
        }
      }
      .el-radio__inner {
        background: transparent;
        width: 16px;
        height: 16px;
        &::after {
          width: 8px;
          height: 8px;
          background: #18a3f4;
        }
      }
      .el-radio__label {
        font-size: 14px;
      }
    }
    .pl30 {
      padding-left: 30px;
      overflow-y: auto;
    }
    .pr50 {
      padding-right: 50px;
    }
  }
}
</style>
