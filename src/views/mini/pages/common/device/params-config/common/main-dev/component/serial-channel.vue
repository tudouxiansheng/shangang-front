<template>
  <!-- 串口通道设置 -->
  <div id="serial-channel">
    <el-form
      class="serial-channel-container"
      ref="SerialChannelConfig"
      :model="SerialChannelConfig"
      :rules="serialRules"
      :label-width="locale == 'en' ? '150px' : '100px'"
      label-position="top"
      :disabled="!PermissionMainDevManage"
    >
      <el-row>
        <el-col :span="6" class="pr50">
          <el-form-item
            :label="$t('frontParameterConfiguration.serialName') + '：'"
            prop="serialName"
          >
            <el-input
              v-model="SerialChannelConfig.serialName"
              :placeholder="$t('frontParameterConfiguration.inputSerialName')"
              :disabled="drive != 'ONVIF' ? false : true"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr50">
          <el-form-item
            :label="$t('frontParameterConfiguration.serialType') + '：'"
            prop="serialType"
          >
            <el-select
              v-model="SerialChannelConfig.serialType"
              :placeholder="$t('frontParameterConfiguration.selectSerialType')"
              :disabled="drive != 'ONVIF' ? false : true"
              clearable
            >
              <el-option
                v-for="(item, index) in serialTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="drive != 'ONVIF'" :span="6" class="pr50">
          <el-form-item
            :label="$t('frontParameterConfiguration.flowControl') + '：'"
            prop="flowControl"
          >
            <el-select
              v-model="SerialChannelConfig.flowControl"
              :placeholder="$t('frontParameterConfiguration.selectFlowControl')"
              clearable
            >
              <el-option
                v-for="(item, index) in flowControlList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr50">
          <el-form-item :label="$t('frontParameterConfiguration.baudRate') + '：'" prop="baudRate">
            <el-select
              v-model="SerialChannelConfig.baudRate"
              :placeholder="$t('frontParameterConfiguration.selectBaudRate')"
              clearable
            >
              <el-option
                v-for="(item, index) in baudRateList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr50">
          <el-form-item :label="$t('frontParameterConfiguration.stopBit') + '：'" prop="stopBit">
            <el-select
              v-model="SerialChannelConfig.stopBit"
              :placeholder="$t('frontParameterConfiguration.selectStopBit')"
              clearable
            >
              <el-option
                v-for="(item, index) in stopBitList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr50">
          <el-form-item :label="$t('frontParameterConfiguration.parity') + '：'" prop="parity">
            <el-select
              v-model="SerialChannelConfig.parity"
              :placeholder="$t('frontParameterConfiguration.selectParity')"
              clearable
            >
              <el-option
                v-for="(item, index) in parityList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="pr50">
          <el-form-item :label="$t('frontParameterConfiguration.dataBit') + '：'" prop="dataBit">
            <el-select
              v-model="SerialChannelConfig.dataBit"
              :placeholder="$t('frontParameterConfiguration.selectDataBit')"
              clearable
            >
              <el-option
                v-for="(item, index) in dataBitList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionMainDevManage"
        type="primary"
        :loading="maskloading"
        @click="submitForm"
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
      SerialChannelConfig: {
        serialName: '',
        serialType: '',
        flowControl: '',
        baudRate: '',
        stopBit: '',
        parity: '',
        dataBit: ''
      },
      serialRules: {
        serialName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSerialName'),
            trigger: ['change', 'blur']
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: ['change', 'blur']
          }
        ],
        serialType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectSerialType'),
            trigger: ['change', 'blur']
          }
        ],
        flowControl: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectFlowControl'),
            trigger: ['change', 'blur']
          }
        ],
        baudRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectBaudRate'),
            trigger: ['change', 'blur']
          }
        ],
        stopBit: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStopBit'),
            trigger: ['change', 'blur']
          }
        ],
        parity: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectParity'),
            trigger: ['change', 'blur']
          }
        ],
        dataBit: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectDataBit'),
            trigger: ['change', 'blur']
          }
        ]
      },
      serialTypeList: [
        {
          name: 'RS232',
          value: 0
        },
        {
          name: 'RS485',
          value: 1
        },
        {
          name: 'RS422',
          value: 2
        }
      ],
      flowControlList: [
        {
          name: this.$t('frontParameterConfiguration.flowControlOption0'),
          value: 0
        },
        {
          name: this.$t('frontParameterConfiguration.flowControlOption1'),
          value: 1
        },
        {
          name: this.$t('frontParameterConfiguration.flowControlOption2'),
          value: 2
        }
      ],
      baudRateList: [
        {
          name: '50',
          value: 50
        },
        {
          name: '75',
          value: 75
        },
        {
          name: '110',
          value: 110
        },
        {
          name: '150',
          value: 150
        },
        {
          name: '300',
          value: 300
        },
        {
          name: '600',
          value: 600
        },
        {
          name: '1200',
          value: 1200
        },
        {
          name: '2400',
          value: 2400
        },
        {
          name: '4800',
          value: 4800
        },
        {
          name: '9600',
          value: 9600
        },
        {
          name: '19200',
          value: 19200
        },
        {
          name: '38400',
          value: 38400
        },
        {
          name: '57600',
          value: 57600
        },
        {
          name: '115200',
          value: 115200
        }
      ],
      stopBitList: [
        {
          name: '1',
          value: 1
        },
        {
          name: '2',
          value: 2
        }
      ],
      parityList: [
        {
          name: this.$t('frontParameterConfiguration.parityOption0'),
          value: 0
        },
        {
          name: this.$t('frontParameterConfiguration.parityOption1'),
          value: 1
        },
        {
          name: this.$t('frontParameterConfiguration.parityOption2'),
          value: 2
        },
        {
          name: this.$t('frontParameterConfiguration.parityOption3'),
          value: 3
        },
        {
          name: this.$t('frontParameterConfiguration.parityOption4'),
          value: 4
        }
      ],
      dataBitList: [
        {
          name: '5',
          value: 5
        },
        {
          name: '6',
          value: 6
        },
        {
          name: '7',
          value: 7
        },
        {
          name: '8',
          value: 8
        }
      ],
      maskloading: false
    }
  },
  computed: {
    ...mapState({
      deviceCode: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['drive', 'PermissionMainDevManage'])
  },
  async mounted() {
    this.viewSerialInfo()
  },
  methods: {
    async viewSerialInfo() {
      const res = await this.$api.getDevConfig({ deviceCode: this.deviceCode, configType: 13 })
      if (res.resultCode != 0) return
      const { configItem } = res
      this.SerialChannelConfig = Object.assign(this.SerialChannelConfig, configItem)
    },

    submitForm() {
      this.$refs['SerialChannelConfig'].validate(valid => {
        if (valid) {
          this.maskloading = true
          let data = {
            deviceCode: this.deviceCode,
            configType: 13,
            configItem: this.SerialChannelConfig
          }
          this.$api.setDevConfig(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              this.viewSerialInfo()
            }
            this.maskloading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
#serial-channel {
  width: 100%;
  height: 100%;
  position: relative;
  .serial-channel-container {
    width: 100%;
    height: calc(100% - 68px);
    .el-form-item {
      margin-bottom: 25px;
    }
    .el-select {
      width: 100%;
    }
    .el-input__inner {
      background: #08334d;
      border-color: #08334d;
    }
    .pr50 {
      padding-right: 50px;
    }
  }
}
</style>
