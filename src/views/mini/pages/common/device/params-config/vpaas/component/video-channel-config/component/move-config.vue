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
        :vpaas-video-url="videoUrl"
        :before-control-exec="handleBeforeControlExec"
        @board-mounted="handleBoardMounted"
        :canvasDisabled="isShowDetection"
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
            <el-radio-group v-model="form.motionDetectionEnable">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="12" :xl="8">
          <el-form-item
            :label="$t('frontParameterConfiguration.detectInterval') + '：'"
            prop="detectInterval"
            class="long-error"
          >
            <el-input
              v-model="form.detectInterval"
              :placeholder="$t('frontParameterConfiguration.inputDetectInterval')"
              clearable
              :disabled="
                ((isShowTime || isShowDetection) && platType == PLATFORM_TYPE.ADS) ||
                (isShowTime && platType == PLATFORM_TYPE.VPAAS)
              "
              style="width: 300px"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item
            :label="$t('mainDevConfiguration.moveSensitivity') + '：'"
            prop="sensitivity"
          >
            <div style="display: flex; align-items: center">
              <el-input
                v-model="form.sensitivity"
                :placeholder="$t('mainDevConfiguration.inputMoveSensitivity')"
                style="width: 300px; margin-right: 5px"
                clearable
                :disabled="isShowDetection"
              />
              <el-tooltip
                effect="light"
                :content="
                  platType == 15
                    ? $t('frontParameterConfiguration.vmdSensitivityFormatOne')
                    : $t('frontParameterConfiguration.vmdSensitivityFormat')
                "
                placement="top"
                popper-class="tooltipStyle"
              >
                <img src="@/assets/img/common/info.png" alt />
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item
            :label="$t('mainDevConfiguration.autoClearAlarmTime')"
            prop="autoClearAlarmTime"
          >
            <el-input
              :placeholder="$t('mainDevConfiguration.inputAutoClearAlarmTime')"
              v-model.number="form.autoClearAlarmTime"
              clearable
              :disabled="
                ((isShowTime || isShowDetection) && platType == PLATFORM_TYPE.ADS) ||
                (isShowTime && platType == PLATFORM_TYPE.VPAAS)
              "
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="drive === DRIVE_TYPE.HWSDK_ACREG && platType == PLATFORM_TYPE.VPAAS">
        <el-col :span="8">
          <el-form-item :label="$t('frontParameterConfiguration.planeMode')">
            <el-radio-group v-model="planType" @change="planTypeChange">
              <el-radio :label="1" border>
                {{ $t('frontParameterConfiguration.planType1') }}
              </el-radio>
              <el-radio :label="0" border>
                {{ $t('frontParameterConfiguration.planType0') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 网格时间选择控件 -->
      <time-grid-control
        v-if="drive === DRIVE_TYPE.HWSDK_ACREG && platType == PLATFORM_TYPE.VPAAS"
        ref="timeGridControl"
        id="time_grid_control"
      ></time-grid-control>
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
import TimeGridControl from '@/components/time-grid-control'
import { ControlMethods } from '@components/videoDrawboard/constant'
import { mapState, mapGetters } from 'vuex'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'

export default {
  components: {
    TimeGridControl,
    videoDrawboard
  },
  data() {
    return {
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE,
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
      videoUrl: '',
      planType: 1,
      timeSpanList: []
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'platId', 'PermissionCameraManage']),
    drawboardControls() {
      return this.platType == PLATFORM_TYPE.ADS &&
        (this.drive == DRIVE_TYPE.DHSDK || this.drive == DRIVE_TYPE.T28181)
        ? []
        : this.platType == PLATFORM_TYPE.VPAAS
        ? [
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
        : [
            {
              text: this.$t('mainDevConfiguration.rect'),
              icon: 'rect',
              disabled: false,
              method: ControlMethods.RECT
            },
            {
              text: this.$t('public.reset'),
              icon: 'delete',
              disabled: false,
              method: ControlMethods.DELETE
            }
          ]
    },
    // 是否展示图像设置
    isShowDetection() {
      let support = false
      switch (this.drive) {
        case DRIVE_TYPE.DHSDK:
          support = true
          break
      }
      return support
    },
    //是否禁用告警检测时间间隔和移动侦测时间间隔
    isShowTime() {
      let support = false
      switch (this.drive) {
        case DRIVE_TYPE.HIKSDK:
          support = true
          break
      }
      return support
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
      //vpaas判断，如果frontPlatType为15就禁用右侧
      if (this.platType == 15) {
        this.formRules.detectInterval = [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputDetectInterval'),
            trigger: 'change'
          },
          {
            pattern: /^([1-9]|([1-2]\d)|30)$/,
            message: this.$t('mainDevConfiguration.detectIntervalProp'),
            trigger: 'change'
          }
        ]
        this.formRules.sensitivity = [
          {
            required: true,
            message: this.$t('mainDevConfiguration.inputMoveSensitivity'),
            trigger: 'change'
          },
          {
            pattern: /^[1-6]$/,
            message: this.$t('frontParameterConfiguration.vmdSensitivityFormatOne')
          }
        ]
      }
      let res = await this.$api.cameraVmdInfo({ cameraId: this.selectedCameraId })
      if (res.resultCode === 0) {
        this.form.motionDetectionEnable = res.motionDetectionEnable
        this.form['platformMotionDetection'] = res.platformMotionDetection
        this.form.autoClearAlarmTime = res.autoClearAlarmTime
        this.form.sensitivity = res.sensitivity
        this.form.detectInterval = res.detectInterval
        this.form.rectInfos = res.rectInfos
        await this.initDrawboard()
        this.timeSpanList = res.guardTimeList ? res.guardTimeList : []
        this.planType =
          res.guardTimeList && res.guardTimeList.length && res.guardTimeList[0].dayType === 0
            ? 1
            : 0
        if (this.drive === DRIVE_TYPE.HWSDK_ACREG) {
          this.$nextTick(() => {
            this.$refs.timeGridControl.time_initialize(this.planType, 2, this.timeSpanList)
          })
        }
      }
    },
    // 获取实时浏览url
    async getLiveUrl() {
      try {
        const res = await this.$api.getLiveUrl({
          cameraId: this.selectedCameraId,
          streamType: 1,
          urlType: 6,
          withSSL: window.location.protocol == 'https:' ? 1 : 0
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
      if (length >= (this.platType == PLATFORM_TYPE.VPAAS ? 8 : 1)) {
        this.$message.error(
          this.$t('mainDevConfiguration.mostTenAreaError', { num: PLATFORM_TYPE.VPAAS ? 8 : 1 })
        )
        return false
      } else {
        return true
      }
    },
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },
    submitForm() {
      // 获取画板数据
      let rectInfos = this.$refs.drawboard.normalizeData()
      if (!rectInfos || !rectInfos.length) {
        this.$message.error(this.$t('mainDevConfiguration.mustOneRect'))
        return
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const {
            motionDetectionEnable,
            platformMotionDetection,
            detectInterval,
            sensitivity,
            autoClearAlarmTime
          } = this.form
          let guardTimeList =
            this.drive === DRIVE_TYPE.HWSDK_ACREG && this.platType == PLATFORM_TYPE.VPAAS
              ? this.$refs.timeGridControl.getTimeSpanList()
              : undefined
          const motionDetection = {
            cameraId: this.selectedCameraId,
            motionDetectionEnable,
            platformMotionDetection,
            detectInterval,
            sensitivity,
            autoClearAlarmTime,
            rectInfos,
            guardTimeList
          }

          let res = await this.$api.cameraVmdConfig(motionDetection)
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
}
</style>
