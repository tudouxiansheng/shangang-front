<template>
  <!-- 音频参数设置 -->
  <div id="audioInfo">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.notYetSupportedToView') }}
    </p>
    <div v-if="zteIfShow">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '190px' : '120px'"
        size="small"
        label-position="left"
        style="display: flex"
      >
        <div style="width: 50%; padding-right: 10px">
          <el-form-item
            :label="$t('frontParameterConfiguration.frontSystemConfig') + '：'"
            prop="audioName"
          >
            <el-input
              v-model="ruleForm.audioName"
              :placeholder="$t('frontParameterConfiguration.inputNudioName')"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.audioChannelId') + '：'"
            prop="audioIndex"
            class="flex-content"
          >
            <el-input
              v-model="ruleForm.audioIndex"
              :placeholder="$t('frontParameterConfiguration.inputAudioChannelId')"
              disabled
            ></el-input>
            <el-button class="copyBtn" type="primary" @click="copyValue(ruleForm.audioIndex)">
              {{ $t('frontParameterConfiguration.copy') }}
            </el-button>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.pitch') + '：'" prop="pitch">
            <el-input
              v-model="ruleForm.pitch"
              :placeholder="$t('frontParameterConfiguration.inputPitch')"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.volume') + '：'" prop="volume">
            <el-input
              v-model="ruleForm.volume"
              :placeholder="$t('frontParameterConfiguration.inputVolume')"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.inputType') + '：'"
            prop="inputType"
          >
            <el-input
              v-model="ruleForm.inputType"
              :placeholder="$t('frontParameterConfiguration.inputInputType')"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 50%; padding-left: 10px">
          <el-form-item
            :label="$t('frontParameterConfiguration.dataFormat') + '：'"
            prop="dataFormat"
          >
            <el-select
              v-model="ruleForm.dataFormat"
              :placeholder="$t('frontParameterConfiguration.selectDataFormat')"
            >
              <el-option label="G711A" :value="1"></el-option>
              <el-option label="G711U" :value="2"></el-option>
              <el-option label="G726" :value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.sampleRate') + '(kHz)：'"
            prop="sampleRate"
          >
            <el-input
              v-model="ruleForm.sampleRate"
              :placeholder="$t('frontParameterConfiguration.inputSampleRate') + '(kHz)'"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.channel') + '：'" prop="channel">
            <el-input
              v-model="ruleForm.channel"
              :placeholder="$t('frontParameterConfiguration.inputChannel')"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.sampleBits') + '(bps)：'"
            prop="sampleBits"
          >
            <el-input
              v-model="ruleForm.sampleBits"
              :placeholder="$t('frontParameterConfiguration.inputSampleBits') + '(bps)'"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.gain') + '：'" prop="gain">
            <el-input
              v-model="ruleForm.gain"
              :placeholder="$t('frontParameterConfiguration.inputGain')"
              disabled
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="button">
        <el-button
          v-if="PermissionManage"
          type="primary"
          class="sureBtn"
          @click="submitForm('ruleForm', 0)"
        >
          {{ $t('public.confirm') }}
        </el-button>
        <el-button class="cancelBtn" @click="cancelDialog">{{ $t('public.cancel') }}</el-button>
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
  </div>
</template>

<script>
import Clipboard from 'vue-clipboard3'
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  data() {
    return {
      //中兴判断
      zteIfShow: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),

      ruleForm: {
        audioName: '', //语音通道名称
        audioIndex: '', //音频通道编码
        pitch: '', //定率
        volume: '', //声道
        inputType: '', //输入类型
        dataFormat: '', //数据格式
        sampleRate: '', //采样率(kHz)
        channel: '', //频道
        sampleBits: '', //比特率(bps)
        gain: '' //增益
      },
      rules: {
        audioName: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputNudioName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError')
          }
        ],
        audioIndex: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputAudioChannelId'),
            trigger: 'change'
          },
          {
            pattern: /^[1-9]$/,
            message: this.$t('frontParameterConfiguration.audioCodeFormat')
          }
        ],
        pitch: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputPitch'),
            trigger: 'change'
          }
        ],
        volume: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputVolume'),
            trigger: 'change'
          }
        ],
        inputType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputInputType'),
            trigger: 'change'
          }
        ],
        dataFormat: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectDataFormat'),
            trigger: 'change'
          }
        ],
        sampleRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSampleRate') + '(kHz)',
            trigger: 'change'
          }
        ],
        channel: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputChannel'),
            trigger: 'change'
          }
        ],
        sampleBits: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSampleBits') + '(bps)',
            trigger: 'change'
          }
        ],
        gain: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputGain'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    //中兴判断
    if (this.frontPlatType == 9 && this.frontDrive == 'T28181') {
      this.zteIfShow = false
    } else {
      this.viewAudioInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(186)
  },

  methods: {
    //音频信息查看
    viewAudioInfo() {
      this.$api.cameraBasicInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (!res.audioChannelId) {
          this.$message({
            message: this.$t('frontParameterConfiguration.getAudioFail'),
            type: 'error'
          })
        }
        if (res.resultCode == 0 && res.audioChannelId) {
          let cameraAudioInfoObj = {
            cameraId: this.$route.query.cameraId,
            audioChannelId: res.audioChannelId
          }

          this.$api.cameraAudioInfo(cameraAudioInfoObj).then(res1 => {
            if (res1.resultCode == 0) {
              this.ruleForm.audioName = res1.audioName
              this.ruleForm.dataFormat = res1.dataFormat
              this.ruleForm.audioIndex = res1.audioIndex
              this.ruleForm.pitch = res1.pitch
              this.ruleForm.sampleRate = res1.sampleBits
              this.ruleForm.channel = res1.channel
              this.ruleForm.sampleBits = res1.sampleBits
              this.ruleForm.gain = res1.gain
              this.ruleForm.volume = res1.volume
              this.ruleForm.inputType = res1.inputType
              this.ruleForm.audioChannelId = res.audioChannelId
            }
          })
        }
      })
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 音频参数设置
          let data = {
            cameraId: this.$route.query.cameraId,
            audioChannelId: this.ruleForm.audioChannelId,
            audioName: this.ruleForm.audioName,
            dataFormat: this.ruleForm.dataFormat,
            audioIndex: this.ruleForm.audioIndex,
            sampleRate: this.ruleForm.sampleRate,
            pitch: this.ruleForm.pitch,
            channel: this.ruleForm.channel,
            volume: this.ruleForm.volume,
            sampleBits: this.ruleForm.sampleBits,
            inputType: this.ruleForm.inputType,
            gain: this.ruleForm.gain
          }
          this.$api.cameraAudioConfig(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewAudioInfo()
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
    //关闭谈框
    cancelDialog() {
      let param = {
        url: '/AIV-MP/#/config/pu-config' + this.$route.query.cameraId
      }
      this.$webkitProc('close_dialog', JSON.stringify(param))
    }
  }
}
</script>
