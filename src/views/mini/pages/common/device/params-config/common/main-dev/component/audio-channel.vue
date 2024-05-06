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
            <el-icon class="status"><el-icon-remove-outline /></el-icon>
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
            <el-col v-if="audioParam.dataFormat" :span="8" class="pr50">
              <el-form-item
                :label="$t('frontParameterConfiguration.dataFormat') + '：'"
                prop="dataFormat"
              >
                <el-select
                  v-model="audioParam.dataFormat"
                  :placeholder="$t('frontParameterConfiguration.selectDataFormat')"
                  :disabled="activeAudio.status && drive == 'HWSDK-ACREG' ? false : true"
                >
                  <el-option
                    v-for="(item, index) in dataFormatList"
                    :key="index"
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
            <el-col v-if="audioParam.inputType" :span="8" class="pr50">
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
            <el-col v-if="audioParam.gain" :span="8" class="pr50">
              <el-form-item :label="$t('frontParameterConfiguration.gain') + '：'" prop="gain">
                <el-input
                  v-model="audioParam.gain"
                  :placeholder="$t('frontParameterConfiguration.inputGain')"
                  disabled
                ></el-input>
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
import { mapState, mapGetters } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  data() {
    return {
      loading: false,
      AudioList: [],
      activeAudio: {},
      activeIndex: 0,
      audioParam: {
        audioName: '',
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
            pattern: /^[1-9]$/,
            message: this.$t('frontParameterConfiguration.audioCodeFormat'),
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
            message: this.$t('frontParameterConfiguration.inputInputType'),
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
        }
      ],
      maskloading: false,
      emptyImg: require('@/assets/img/common/analyze.png')
    }
  },
  computed: {
    ...mapState({
      deviceCode: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['drive', 'PermissionMainDevManage'])
  },
  mounted() {
    this.viewAudioInfo()
  },
  methods: {
    async viewAudioInfo() {
      this.loading = true
      const res = await this.$api.getDevConfig({ deviceCode: this.deviceCode, configType: 12 })
      if (res.resultCode != 0) {
        this.loading = false
        return
      }
      this.loading = false
      const { configItem } = res
      this.AudioList = configItem.filter(item => item.audioName != undefined)
      this.activeAudio = configItem[0]
      this.audioParam = Object.assign(this.audioParam, {
        audioName: this.activeAudio.audioName,
        audioIndex: this.activeAudio.audioIndex,
        ...this.activeAudio.audioParam
      })
    },
    getAudioInfo(item, index) {
      this.$nextTick(() => {
        this.$refs.audioParam.clearValidate()
      })
      this.activeAudio = item
      this.activeIndex = index
      this.audioParam = Object.assign(this.audioParam, {
        audioName: item.audioName,
        audioIndex: item.audioIndex,
        ...item.audioParam
      })
    },

    submitForm() {
      this.$refs['audioParam'].validate(valid => {
        if (valid) {
          this.maskloading = true
          let audioParam = this.$loadash.cloneDeep(this.audioParam)
          delete audioParam.audioName
          delete audioParam.audioIndex
          let data = {
            deviceCode: this.deviceCode,
            configType: 12,
            configItem: {
              audioName: this.activeAudio.audioName,
              audioIndex: this.activeAudio.audioIndex,
              audioCode: this.activeAudio.audioCode,
              audioParam
            }
          }
          this.$api.setDevConfig(data).then(res => {
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
