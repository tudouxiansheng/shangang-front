<template>
  <!-- 音频通道设置 -->

  <div id="audio-channel" v-loading="loading" :element-loading-text="$t('public.loading')">
    <el-row v-show="AudioList.length != 0 && !loading" class="audio-channel-container">
      <el-col :span="4">
        <ul class="audio-config">
          <li
            v-for="(item, index) in AudioList"
            :key="index"
            :class="['audio-item', activeIndex == index ? 'active' : '']"
            @click="getAudioInfo(item, index)"
          >
            <span class="audioName">{{ item.audioName }}</span>
            <el-icon v-if="item.status" class="status"><el-icon-remove-outline /></el-icon>
          </li>
        </ul>
      </el-col>
      <el-col :span="20" class="pl30">
        <el-form
          ref="audioParam"
          :model="audioParam"
          :rules="audioRules"
          :label-width="locale == 'en' ? '190px' : '120px'"
          label-position="top"
          :disabled="!PermissionMainDevManage"
        >
          <el-row>
            <el-col
              v-if="audioParam.audioCode && platType == PLATFORM_TYPE.VPAAS"
              :span="8"
              class="pr50"
            >
              <el-form-item
                :label="$t('frontParameterConfiguration.audioCode') + '：'"
                prop="audioCode"
              >
                <el-input
                  v-model="audioParam.audioCode"
                  :placeholder="$t('frontParameterConfiguration.inputAudioCode')"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.audioName" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.audioName') + '：'"
                prop="audioName"
              >
                <el-input
                  v-model="audioParam.audioName"
                  :placeholder="$t('frontParameterConfiguration.inputNudioName')"
                  clearable
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                (audioParam.status || audioParam.status === 0) && platType == PLATFORM_TYPE.VPAAS
              "
              :span="8"
              class="pr50"
            >
              <el-form-item :label="$t('frontParameterConfiguration.status') + '：'" prop="status">
                <el-select
                  v-model="audioParam.status"
                  :placeholder="$t('frontParameterConfiguration.selectStatus')"
                  disabled
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.dataFormat" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.dataFormat') + '：'"
                prop="dataFormat"
              >
                <el-select
                  v-model="audioParam.dataFormat"
                  :placeholder="$t('frontParameterConfiguration.selectDataFormat')"
                  :disabled="
                    (activeAudio.status && drive == 'HWSDK-ACREG') ||
                    platType == PLATFORM_TYPE.VPAAS
                      ? false
                      : true
                  "
                >
                  <el-option
                    label="G711A"
                    :value="1"
                    v-if="drive != DRIVE_TYPE.ONVIF && platType == PLATFORM_TYPE.ADS"
                  />
                  <el-option
                    label="G711U"
                    :value="2"
                    v-if="
                      drive != DRIVE_TYPE.T28181 &&
                      drive != DRIVE_TYPE.ONVIF &&
                      platType == PLATFORM_TYPE.ADS
                    "
                  />
                  <el-option
                    label="G711"
                    :value="10"
                    v-if="drive == DRIVE_TYPE.ONVIF && platType == PLATFORM_TYPE.ADS"
                  />
                  <el-option
                    :label="$t('frontParameterConfiguration.other')"
                    :value="99"
                    v-if="platType == PLATFORM_TYPE.ADS"
                  />
                  <el-option
                    v-if="platType == PLATFORM_TYPE.VPAAS"
                    v-for="item in dataFormatList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.audioIndex" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.audioChannelId') + '：'"
                prop="audioIndex"
                class="flex-content"
              >
                <el-input
                  v-model="audioParam.audioIndex"
                  :placeholder="$t('frontParameterConfiguration.inputAudioChannelId')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.sampleRate" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.sampleRate') + '(kHz)：'"
                prop="sampleRate"
              >
                <el-input
                  v-model="audioParam.sampleRate"
                  :placeholder="$t('frontParameterConfiguration.inputSampleRate') + '(kHz)'"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.pitch" :span="8" class="pr50">
              <el-form-item :label="$t('frontParameterConfiguration.pitch') + '：'" prop="pitch">
                <el-input
                  v-model="audioParam.pitch"
                  :placeholder="$t('frontParameterConfiguration.inputPitch')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.channel" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.channel') + '：'"
                prop="channel"
              >
                <el-input
                  v-model="audioParam.channel"
                  :placeholder="$t('frontParameterConfiguration.inputChannel')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.volume" :span="8" class="pr50">
              <el-form-item :label="$t('frontParameterConfiguration.volume') + '：'" prop="volume">
                <el-input
                  v-model="audioParam.volume"
                  :placeholder="$t('frontParameterConfiguration.inputVolume')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.sampleBits" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.sampleBits') + '(bps)：'"
                prop="sampleBits"
              >
                <el-input
                  v-model="audioParam.sampleBits"
                  :placeholder="$t('frontParameterConfiguration.inputSampleBits') + '(bps)'"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="audioParam.inputType && platType == PLATFORM_TYPE.ADS"
              :span="8"
              class="pr50"
            >
              <el-form-item
                :label="$t('frontParameterConfiguration.inputType') + '：'"
                prop="inputType"
              >
                <el-input
                  v-model="audioParam.inputType"
                  :placeholder="$t('frontParameterConfiguration.inputInputType')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                (audioParam.inputType || audioParam.inputType === 0) &&
                platType == PLATFORM_TYPE.VPAAS
              "
              :span="8"
              class="pr50"
            >
              <el-form-item
                :label="$t('frontParameterConfiguration.inputType') + '：'"
                prop="inputType"
              >
                <el-select
                  v-model="audioParam.inputType"
                  :placeholder="$t('frontParameterConfiguration.selectInputType')"
                  disabled
                >
                  <el-option
                    v-for="item in inputTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="audioParam.gain && platType == PLATFORM_TYPE.ADS" :span="8" class="pr50">
              <el-form-item :label="$t('frontParameterConfiguration.gain') + '：'" prop="gain">
                <el-input
                  v-model="audioParam.gain"
                  :placeholder="$t('frontParameterConfiguration.inputGain')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="(audioParam.gain || audioParam.gain === 0) && platType == PLATFORM_TYPE.VPAAS"
              :span="8"
              class="pr50"
            >
              <el-form-item :label="$t('frontParameterConfiguration.gain') + '：'" prop="gain">
                <el-select
                  v-model="audioParam.gain"
                  :placeholder="$t('frontParameterConfiguration.inputGain')"
                  disabled
                >
                  <el-option
                    v-for="item in gainList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <div v-show="AudioList.length != 0 && !loading" class="footer">
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

    <div v-show="AudioList.length == 0 && !loading" class="empty-wrapper">
      <el-empty
        :image="emptyImg"
        :image-size="388"
        :description="$t('mainDevConfiguration.audioNameNoConfigure')"
      />
    </div>
  </div>
</template>

<script>
import { RemoveFilled as ElIconRemoveOutline } from '@element-plus/icons-vue'
import { mapState, mapGetters } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'
export default {
  components: {
    ElIconRemoveOutline
  },
  data() {
    return {
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE,
      loading: false,
      AudioList: [],
      activeAudio: {},
      activeIndex: 0,
      audioParam: {
        audioCode: '',
        audioName: '',
        status: undefined,
        dataFormat: '',
        audioIndex: '',
        sampleRate: '',
        pitch: '',
        channel: '',
        volume: '',
        sampleBits: '',
        inputType: '',
        gain: ''
      },
      statusList: [
        {
          name: this.$t('frontParameterConfiguration.status0'),
          value: 0
        },
        {
          name: this.$t('frontParameterConfiguration.status1'),
          value: 1
        },
        {
          name: this.$t('frontParameterConfiguration.status2'),
          value: 2
        }
      ],
      dataFormatList: [
        {
          name: 'G711A',
          value: 1
        },
        {
          name: 'G711U',
          value: 2
        },
        {
          name: 'G726',
          value: 3
        },
        {
          name: 'AAC',
          value: 4
        },
        {
          name: 'OPUS',
          value: 5
        }
      ],
      gainList: [
        {
          name: this.$t('frontParameterConfiguration.gain0'),
          value: 0
        },
        {
          name: this.$t('frontParameterConfiguration.gain1'),
          value: 1
        }
      ],
      inputTypeList: [
        {
          name: 'Line in',
          value: 0
        },
        {
          name: 'Mic in',
          value: 1
        }
      ],
      audioRules: {
        audioName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputNudioName'),
            trigger: ['change', 'blur']
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: ['change', 'blur']
          }
        ],
        dataFormat: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectDataFormat'),
            trigger: ['change', 'blur']
          }
        ],
        audioIndex: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputAudioChannelId'),
            trigger: ['change', 'blur']
          },
          {
            pattern: /^[a-zA-Z0-9_-]{1,20}$/,
            message: this.$t('frontParameterConfiguration.audioIndex'),
            trigger: ['change', 'blur']
          }
        ],
        sampleRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSampleRate') + '(kHz)',
            trigger: ['change', 'blur']
          }
        ],
        pitch: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputPitch'),
            trigger: ['change', 'blur']
          }
        ],
        channel: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputChannel'),
            trigger: ['change', 'blur']
          }
        ],
        volume: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputVolume'),
            trigger: ['change', 'blur']
          }
        ],
        sampleBits: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSampleBits') + '(bps)',
            trigger: ['change', 'blur']
          }
        ],
        inputType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectInputType'),
            trigger: ['change', 'blur']
          }
        ],
        gain: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputGain'),
            trigger: ['change', 'blur']
          }
        ]
      },
      maskloading: false,
      emptyImg: require('@/assets/img/common/analyze.png')
    }
  },
  computed: {
    ...mapState({
      deviceCode: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['platType', 'drive', 'PermissionMainDevManage'])
  },
  mounted() {
    this.viewAudioInfo()
  },
  methods: {
    async viewAudioInfo() {
      this.loading = true
      this.$api
        .cameraAudioInfo({ mainDevId: this.deviceCode })
        .then(res => {
          if (res.resultCode == 0) {
            const { audioConfigInfoList } = res
            this.AudioList = audioConfigInfoList.filter(item => item.audioName != undefined)
            this.activeAudio = audioConfigInfoList[0]
            this.audioParam = Object.assign(this.audioParam, {
              audioCode: this.activeAudio.audioCode,
              audioName: this.activeAudio.audioName,
              status: this.activeAudio.status,
              audioIndex: this.activeAudio.audioIndex,
              ...this.activeAudio.audioParam
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getAudioInfo(item, index) {
      this.$nextTick(() => {
        this.$refs.audioParam.clearValidate()
      })
      this.activeAudio = item
      this.activeIndex = index
      this.audioParam = Object.assign(this.audioParam, {
        audioCode: this.activeAudio.audioCode,
        audioName: item.audioName,
        status: this.activeAudio.status,
        audioIndex: item.audioIndex,
        ...item.audioParam
      })
    },
    removeEmptyValues(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
          delete obj[key]
        }
      }
      return obj
    },
    submitForm() {
      this.$refs['audioParam'].validate(valid => {
        if (valid) {
          this.maskloading = true
          let audioParam = this.$loadash.cloneDeep(this.audioParam)
          delete audioParam.audioName
          delete audioParam.audioIndex
          delete audioParam.audioCode
          delete audioParam.status
          const audioParamResult = this.removeEmptyValues(audioParam)
          let data = {
            mainDevId: this.deviceCode,
            audioName: this.activeAudio.audioName,
            status: this.activeAudio.status,
            audioIndex: this.activeAudio.audioIndex,
            audioCode: this.activeAudio.audioCode,
            ...audioParamResult
          }
          this.$api.cameraAudioConfig(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              this.viewAudioInfo()
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
#audio-channel {
  width: 100%;
  height: calc(100% - 15px);
  position: relative;
  .audio-channel-container {
    width: 100%;
    height: calc(100% - 68px);

    .audio-config {
      border: 1px solid #0b537e;
      border-radius: 4px 4px 0px 0px;
      .audio-item {
        position: relative;
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
        .audioName {
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
          max-width: 200px;
          display: inline-block;
          vertical-align: bottom;
        }
        .status {
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 14px;
          color: #f25858;
        }
      }
    }
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
    .pl30 {
      padding-left: 30px;
    }
    .pr50 {
      padding-right: 50px;
    }
  }
  .empty-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-empty {
      .el-empty__description p {
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
</style>
