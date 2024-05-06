<template>
  <div class="cover-config config-form">
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
          <el-form-item :label="$t('mainDevConfiguration.enableVideoHide')" prop="enableVideoHide">
            <el-radio-group v-model="form.enableVideoHide">
              <el-radio :label="1" border>{{ $t('mainDevConfiguration.start') }}</el-radio>
              <el-radio :label="0" border>{{ $t('mainDevConfiguration.stop') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :lg="12"
          :xl="8"
          v-if="drive == DRIVE_TYPE.HWSDK_ACREG || platType == PLATFORM_TYPE.ADS"
        >
          <el-form-item
            :label="$t('frontParameterConfiguration.autoClearAlarmTime')"
            prop="autoClearAlarmTime"
          >
            <el-input
              v-model="form.autoClearAlarmTime"
              :placeholder="$t('frontParameterConfiguration.inputAutoClearAlarmTime')"
              style="width: 300px"
              clearable
              :disabled="
                (platType == 5 && drive == 'T28181') || (platType == 15 && drive == 'T28181')||
                isShowTime
              "
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item :label="$t('frontParameterConfiguration.sensitivity')" prop="sensitivity">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="form.sensitivity"
                :placeholder="$t('frontParameterConfiguration.inputSensitivity')"
                style="width: 300px; margin-right: 5px"
                clearable
              />
              <el-tooltip
                effect="light"
                :content="
                  platType == 15
                    ? $t('frontParameterConfiguration.occSensitivityFormatOne')
                    : $t('frontParameterConfiguration.occSensitivityFormat')
                "
                placement="top"
                popper-class="tooltipStyle"
              >
                <img src="@/assets/img/common/info.png" alt />
              </el-tooltip>
            </div>
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
    <div class="footer">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import videoDrawboard from '@/components/videoDrawboard'
import TimeGridControl from '@/components/time-grid-control'
import { ControlMethods } from '@components/videoDrawboard/constant'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DRIVE_TYPE } from '@/enums/deviceEnum'
export default {
  components: {
    videoDrawboard,
    TimeGridControl
  },
  data() {
    return {
      form: {},
      formRules: {
        autoClearAlarmTime: [
          {
            pattern: /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-6])$/,
            message: this.$t('mainDevConfiguration.autoClearAlarmTimeProp256'),
            trigger: 'change'
          }
        ],
        sensitivity: [
          {
            pattern: /^[1-5]$/,
            message: this.$t('mainDevConfiguration.sensitivityProp'),
            trigger: 'change'
          }
        ]
      },
      videoUrl: '',
      planType: 1,
      timeSpanList: [],
      PLATFORM_TYPE: PLATFORM_TYPE,
      DRIVE_TYPE: DRIVE_TYPE
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['drive', 'platType', 'platId', 'PermissionCameraManage']),
    drawboardControls() {
      return this.platType == 15 && this.drive == 'T28181'
        ? []
        : this.platType == 16
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
      if (this.platType == 15) {
        this.formRules.sensitivity = [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSensitivity'),
            trigger: 'change'
          },
          {
            pattern: /^[1-6]$/,
            message: this.$t('frontParameterConfiguration.occSensitivityFormatOne')
          }
        ]
        this.formRules.autoClearAlarmTime = [
          {
            pattern: /^([1-9]|[1-9]\d|1\d\d|2[0-1]\d|22[0-5])$/,
            message: this.$t('mainDevConfiguration.autoClearAlarmTimeProp225'),
            trigger: 'change'
          }
        ]
      }
      let res = await this.$api.cameraOcclusionInfo({ cameraId: this.selectedCameraId })
      if (res.resultCode === 0) {
        this.form.enableVideoHide = res.enableVideoHide
        this.form.autoClearAlarmTime = res.autoClearAlarmTime
        this.form.sensitivity = res.sensitivity
        this.form.rectInfos = res.rectInfos
        await this.initDrawboard()
        this.timeSpanList = res.guardTimeList ? res.guardTimeList : []
        this.planType =
          res.guardTimeList && res.guardTimeList.length && res.guardTimeList[0].dayType === 0
            ? 1
            : 0
        if (this.drive === DRIVE_TYPE.HWSDK_ACREG && this.platType == PLATFORM_TYPE.VPAAS) {
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
    //是否禁用告警检测时间间隔
    isShowTime() {
      let support = false
      switch (this.drive) {
        case DRIVE_TYPE.HIKSDK:
          support = true
          break
      }
      return support
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
      if (length >= (this.platType == PLATFORM_TYPE.VPAAS ? 5 : 1)) {
        this.$message.error(
          this.$t('mainDevConfiguration.mostTenAreaError', {
            num: this.platType == PLATFORM_TYPE.VPAAS ? 5 : 1
          })
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
      if ((!rectInfos || !rectInfos.length) && this.platType == PLATFORM_TYPE.ADS) {
        this.$message.error(this.$t('mainDevConfiguration.coverOneRect'))
        return
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { enableVideoHide, sensitivity, autoClearAlarmTime } = this.form
          let guardTimeList =
            this.drive === DRIVE_TYPE.HWSDK_ACREG && this.platType == PLATFORM_TYPE.VPAAS
              ? this.$refs.timeGridControl.getTimeSpanList()
              : undefined

          const videoHideAlarm = {
            cameraId: this.selectedCameraId,
            enableVideoHide,
            sensitivity,
            autoClearAlarmTime,
            rectInfos,
            guardTimeList
          }

          let res = await this.$api.cameraOcclusionConfig(videoHideAlarm)
          if (res.resultCode === 0) {
            this.$message({
              message: this.$t('mainDevConfiguration.videoCoverSetSuccess'),
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
                    platId: this.platId,
                    deviceId: this.selectedCameraId,
                    enable: 0,
                    sceneMode,
                    sensitivity,
                    shadowMode,
                    size,
                    types
                  })
                  if (res2.resultCode == 0) {
                    this.$message({
                      type: 'success',
                      message: this.$t('mainDevConfiguration.intelligentStopSuccess')
                    })
                    let res3 = await this.$api.setDevConfig(videoHideAlarm)
                    if (res3.resultCode === 0) {
                      this.$message({
                        message: this.$t('mainDevConfiguration.videoCoverSetSuccess'),
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
.cover-config {
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
}
</style>
