<template>
  <div class="move-config config-form">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
      :validate-on-rule-change="false"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('mainDevConfiguration.areaConfig') }}</p>
      <videoDrawboard
        ref="drawboard"
        :controls="drawboardControls"
        :video-url="videoUrl"
        :before-control-exec="handleBeforeControlExec"
        @board-mounted="handleBoardMounted"
      >
        <template #tips>
          <div class="mb-4" v-show="!(platType == 3 && drive == 'ONVIF')">
            <span class="text-blue-400">{{ $t('mainDevConfiguration.mostTenArea') }}</span>
          </div>
        </template>
      </videoDrawboard>

      <p class="form-title">{{ $t('mainDevConfiguration.otherParam') }}</p>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.motionDetectionEnable')"
            prop="motionDetectionEnable"
          >
            <el-radio-group
              v-model="form.motionDetectionEnable"
              :disabled="platType == 3 && drive == 'ONVIF'"
            >
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('mainDevConfiguration.detectInterval')" prop="detectInterval">
            <el-input
              :placeholder="$t('mainDevConfiguration.inputDetectInterval')"
              v-model.number="form.detectInterval"
              clearable
              :disabled="platType == 3 && drive == 'ONVIF'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.moveSensitivity')"
            prop="sensitivity"
            class="long-error"
          >
            <el-input
              :placeholder="$t('mainDevConfiguration.inputMoveSensitivity')"
              v-model.number="form.sensitivity"
              clearable
              :disabled="platType == 3 && drive == 'ONVIF'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('mainDevConfiguration.autoClearAlarmTime')"
            prop="autoClearAlarmTime"
          >
            <el-input
              :placeholder="$t('mainDevConfiguration.inputAutoClearAlarmTime')"
              v-model.number="form.autoClearAlarmTime"
              clearable
              :disabled="platType == 3 && drive == 'ONVIF'"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer" v-show="support">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        type="primary"
        v-if="PermissionCameraManage"
        @click="submitForm"
        v-show="!(platType == 3 && drive == 'ONVIF')"
      >
        {{ $t('public.confirm') }}
      </el-button>
    </div>
    <div class="empty-wrapper" v-show="!support">
      <el-empty
        :image="$parent.emptyImg"
        :image-size="388"
        :description="$t('mainDevConfiguration.platformNotSupported')"
      />
    </div>
  </div>
</template>
<script>
import videoDrawboard from '@/components/videoDrawboard'
import { ControlMethods } from '@components/videoDrawboard/constant'
import { mapState, mapGetters } from 'vuex'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'

export default {
  components: {
    videoDrawboard
  },
  data() {
    return {
      support: true,
      form: {},
      formRules: {
        detectInterval: [
          {
            pattern: /^([1-9]|([1-2]\d)|30)$/,
            message: this.$t('mainDevConfiguration.detectIntervalProp'),
            trigger: 'change'
          }
        ],
        sensitivity: [
          {
            pattern: /^[1-5]$/,
            message: this.$t('frontParameterConfiguration.vmdSensitivityFormat'),
            trigger: 'change'
          }
        ],
        autoClearAlarmTime: [
          {
            pattern: /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
            message: this.$t('mainDevConfiguration.autoClearAlarmTimeProp1'),
            trigger: 'change'
          }
        ]
      },
      videoUrl: ''
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'platId', 'PermissionCameraManage']),
    drawboardControls() {
      return this.platType == 3 && this.drive == 'ONVIF'
        ? []
        : [
            {
              text: this.$t('mainDevConfiguration.rect'),
              icon: 'rect',
              disabled: false,
              method: ControlMethods.RECT
            },
            {
              text: this.$t('mainDevConfiguration.delete'),
              icon: 'delete',
              disabled: false,
              method: ControlMethods.DELETE
            }
          ]
    }
  },
  watch: {
    selectedCameraId: {
      handler() {
        this.getCameraInfo()
      },
      immediate: true
    }
  },
  methods: {
    async getCameraInfo() {
      let res = await this.$api.getDevConfig({ deviceCode: this.selectedCameraId, configType: 9 })
      if (res.resultCode === 0) this.form = res.configItem
      this.$refs.drawboard?.createPlayer()
    },
    // 获取实时浏览url
    async getLiveUrl() {
      try {
        const res = await this.$api.getLiveUrl({
          cameraId: this.selectedCameraId,
          streamType: 1,
          urlType: 6
        })
        return handleGetPreviewWss(res.url)
      } catch (e) {
        this.$message.error(this.$t('mainDevConfiguration.getLiveUrlFailed'))
      }
    },
    // 初始化画板
    async initDrawboard() {
      const url = await this.getLiveUrl()
      if (url && this.$refs.drawboard) {
        this.videoUrl = url
      }
    },
    // 画板已初始化
    handleBoardMounted() {
      if (this.form.rectInfos) {
        this.$refs.drawboard.render(this.form.rectInfos)
      }
    },
    // 按钮事件控制
    handleBeforeControlExec(method, drawboard) {
      if (
        [ControlMethods.DELETE, ControlMethods.REVOCATION, ControlMethods.CLEAR_SCREEN].includes(
          method
        )
      ) {
        return true
      }
      const length = drawboard.get_objects().length
      if (length >= 8) {
        this.$message.error(this.$t('mainDevConfiguration.mostTenAreaError', { num: 8 }))
        return false
      } else {
        return true
      }
    },
    submitForm() {
      // 获取画板数据
      let rectInfos = this.$refs.drawboard.normalizeData()
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const {
            motionDetectionEnable,
            platformMotionDetection,
            detectInterval,
            sensitivity,
            autoClearAlarmTime,
            rectNum,
            rectDetectionList
          } = this.form
          const motionDetection = {
            deviceCode: this.selectedCameraId,
            configType: 9,
            configItem: {
              motionDetectionEnable,
              platformMotionDetection,
              detectInterval,
              sensitivity,
              autoClearAlarmTime,
              rectNum,
              rectDetectionList,
              rectInfos
            }
          }

          let res = await this.$api.setDevConfig(motionDetection)
          if (res.resultCode === 0) {
            this.$message({
              message: this.$t('mainDevConfiguration.motionDetectionSetSuccess'),
              type: 'success'
            })
          } else if (res.resultCode == 212010) {
            this.$confirm(
              this.$t('mainDevConfiguration.videoChannelFail'),
              this.$t('public.prompt'),
              {
                confirmButtonText: this.$t('mainDevConfiguration.stop'),
                cancelButtonText: this.$t('public.cancel'),
                type: 'warning'
              }
            )
              .then(async () => {
                const res1 = await this.$api.getCameraIntelligentBaseInfo({
                  platId: this.platId,
                  deviceId: this.selectedCameraId
                })
                if (res1.resultCode == 0) {
                  const { sceneMode, sensitivity, shadowMode, size, types } = res1
                  const res2 = await this.$api.setCameraIntelligentBaseInfo({
                    deviceId: this.selectedCameraId,
                    platId: this.platId,
                    enable: 0,
                    sceneMode,
                    sensitivity,
                    shadowMode,
                    size,
                    types
                  })
                  if (res2.resultCode == 0) {
                    await this.$message({
                      type: 'success',
                      message: this.$t('mainDevConfiguration.intelligentStopSuccess')
                    })
                    let res3 = await this.$api.setDevConfig(motionDetection)
                    if (res3.resultCode === 0) {
                      this.$message({
                        message: this.$t('mainDevConfiguration.motionDetectionSetSuccess'),
                        type: 'success'
                      })
                    }
                  }
                }
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('mainDevConfiguration.cancelOperate')
                })
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.move-config {
  padding-right: 10px;
  height: 100%;
  overflow-y: auto;
  .el-radio-button__inner {
    background: transparent;
    color: #fffefe;
    border: 1px solid #0b537e;
    border-right: 0;
    height: auto;
  }
  .el-radio-button:first-child {
    .el-radio-button__inner {
      border-left: 1px solid #0b537e;
    }
  }
  .el-radio-button:last-child {
    .el-radio-button__inner {
      border-right: 1px solid #0b537e;
    }
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #0e6294;
    border-color: #0e6294;
    -webkit-box-shadow: -1px 0 0 0 #0e6294;
    box-shadow: -1px 0 0 0 #0e6294;
  }
  .el-button--text {
    color: #fff;
  }
  .draw_wrapper {
    background-color: #fff;
  }
  .el-form-item.long-error {
    margin-bottom: 28px;
  }
}
</style>
