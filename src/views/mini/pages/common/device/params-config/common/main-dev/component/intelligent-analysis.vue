<template>
  <div
    id="intelligent_analysis_settings"
    v-loading="formLoading"
    :element-loading-text="$t('public.loading')"
  >
    <div class="intelligent_analysis_container" v-show="support">
      <div class="left_container">
        <config-container-left />
      </div>
      <div class="right_container">
        <div class="right_container_header">
          <!-- 好望云平台默认开启 -->
          <el-switch
            v-model="form.enable"
            :active-text="$t('mainDevConfiguration.enableIntelligentAnalysis')"
            :active-value="1"
            :inactive-value="0"
            :disabled="platType === 12 || activeType !== '0' || !PermissionCameraManage"
            @change="handleEnabledChange"
          ></el-switch>
          <el-tabs v-model="activeType" type="card" @tab-click="handleTabClick">
            <el-tab-pane
              v-for="item in currentIntelligentType"
              :key="item.value"
              :label="item.name"
              :name="item.value"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="right_container_main" ref="rightContainerMain">
          <template v-if="activeType === '0'">
            <el-form
              ref="baseForm"
              class="base_form"
              :model="form"
              :rules="formRules"
              :label-width="locale == 'en' ? '160px' : '160px'"
              label-position="left"
              :validate-on-rule-change="false"
              :disabled="!PermissionCameraManage"
            >
              <el-form-item :label="$t('mainDevConfiguration.sceneMode') + ':'" prop="sceneMode">
                <el-radio-group v-model="form.sceneMode">
                  <el-radio v-for="item in sceneModeOption" :key="item.value" :label="item.value">
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
                <p class="form_item_tips">
                  {{ $t('mainDevConfiguration.sceneModeDesc') }}
                </p>
              </el-form-item>
              <el-form-item :label="$t('mainDevConfiguration.shadowMode') + ':'" prop="shadowMode">
                <el-select v-model="form.shadowMode">
                  <el-option
                    v-for="item in shadowModeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mainDevConfiguration.minObjectSize') + ':'" prop="size">
                <el-select v-model="form.size">
                  <el-option
                    v-for="item in foregroundSizeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('mainDevConfiguration.detectionSensitivity') + ':'"
                prop="sensitivity"
              >
                <el-select v-model="form.sensitivity">
                  <el-option
                    v-for="item in sensitivityOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <p class="form_item_tips">
                  {{ $t('mainDevConfiguration.detectionSensitivityDesc') }}
                </p>
              </el-form-item>
            </el-form>
          </template>

          <template v-if="activeType !== '0'">
            <el-form
              ref="intelligentForm"
              class="intelligent_form"
              :model="intelligentForm"
              :rules="intelligentFormRules"
              :label-width="locale == 'en' ? '180px' : '160px'"
              label-position="left"
              :validate-on-rule-change="false"
              :disabled="!PermissionCameraManage"
            >
              <p class="form-title">{{ $t('mainDevConfiguration.otherParam') }}</p>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('mainDevConfiguration.alarmCheckInterval') + ':'"
                    prop="alarmInterval"
                  >
                    <el-slider
                      v-model="intelligentForm.alarmInterval"
                      :min="1"
                      :max="256"
                      :step="1"
                      show-stops
                      show-input
                      :show-input-controls="false"
                    ></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('mainDevConfiguration.recognitionMode') + ':'"
                    prop="recognitionMode"
                  >
                    <el-select v-model="intelligentForm.recognitionMode">
                      <el-option
                        v-for="item in modelOption"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <p class="form_item_tips">
                      {{ $t('mainDevConfiguration.recognitionModeDesc') }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="platType === 12 && intelligentForm.sensitivity !== 0">
                  <el-form-item
                    :label="$t('mainDevConfiguration.alarmSensitivity') + ':'"
                    prop="sensitivity"
                  >
                    <el-slider
                      v-model="intelligentForm.sensitivity"
                      :min="1"
                      :max="100"
                      :step="1"
                      show-stops
                      show-input
                      :show-input-controls="false"
                    ></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="platType === 12 && intelligentForm.stayTime !== 0">
                  <el-form-item
                    :label="$t('mainDevConfiguration.alarmStayTime') + ':'"
                    prop="stayTime"
                  >
                    <el-slider
                      v-model="intelligentForm.stayTime"
                      :min="1"
                      :max="180"
                      :step="1"
                      show-stops
                      show-input
                      :show-input-controls="false"
                    ></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="platType === 12 && intelligentForm.objType.length !== 0">
                  <el-form-item :label="$t('mainDevConfiguration.objType') + ':'" prop="objType">
                    <el-checkbox-group v-model="intelligentForm.objType">
                      <el-checkbox
                        v-for="item in objTypeOption"
                        :key="item.value"
                        :label="item.value"
                      >
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <p class="form-title">{{ currentIntelligentName }}</p>
              <draw-board
                ref="drawBoard"
                v-model="intelligentForm.rule"
                :type="activeType"
                :maxPoint="maxPoint"
                :maxArea="maxArea"
                :videoUrl="videoUrl"
              />

              <p v-if="platType !== 12" class="form-title">
                {{ $t('mainDevConfiguration.planSetting') }}
              </p>
              <el-row v-if="platType !== 12">
                <el-col :span="24">
                  <el-switch
                    v-model="planEnable"
                    :active-text="$t('mainDevConfiguration.enablePlan')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handlePlanEnableChange"
                  ></el-switch>
                  <p class="form_item_tips">
                    {{ $t('mainDevConfiguration.timePeriodNumPrompt', { num: 8 }) }}
                  </p>
                </el-col>
                <el-col :span="24">
                  <div>
                    <el-radio-group v-model="currentPlanName" @change="planTypeChange">
                      <el-radio label="oncePlan">{{ $t('mainDevConfiguration.oneOff') }}</el-radio>
                      <el-radio label="dayplan">{{ $t('mainDevConfiguration.daily') }}</el-radio>
                      <el-radio label="weekPlan">{{ $t('mainDevConfiguration.weekly') }}</el-radio>
                    </el-radio-group>
                    <el-button size="mini" type="text" class="clear" icon="el-icon-delete">
                      {{ $t('mainDevConfiguration.removeAll') }}
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-collapse-transition>
                    <div class="periodSetBox">
                      <!-- 网格时间选择控件 -->
                      <time-grid-control
                        ref="timeGridControl"
                        id="time_grid_control"
                      ></time-grid-control>
                    </div>
                  </el-collapse-transition>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </div>
      </div>
    </div>
    <div class="footer" v-show="support">
      <el-button v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
    <div class="empty-wrapper" v-show="!support">
      <el-empty
        :image="emptyImg"
        :image-size="388"
        :description="$t('mainDevConfiguration.platformNotSupported')"
      />
    </div>
  </div>
</template>

<script>
import ConfigContainerLeft from './config-container-left'
import DrawBoard from './draw-board'
import TimeGridControl from '@/components/time-grid-control'
import { mapActions, mapGetters, mapState } from 'vuex'
import { generateUuid } from '@/utils/common/utils'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
export default {
  components: {
    DrawBoard,
    ConfigContainerLeft,
    TimeGridControl
  },
  data() {
    return {
      formLoading: true,
      emptyImg: require('@/assets/img/common/analyze.png'),
      support: true,
      form: {
        enable: 0,
        sceneMode: 1,
        shadowMode: 1,
        size: 1,
        sensitivity: 1
      },
      intelligentForm: {
        alarmInterval: 3,
        sensitivity: 0,
        recognitionMode: 0,
        objType: [],
        stayTime: 0,
        oncePlan: {
          type: 0,
          times: [],
          enable: 0
        },
        dayplan: {
          type: 1,
          times: [],
          enable: 0
        },
        weekPlan: {
          type: 2,
          times: [],
          enable: 0
        },
        rule: {
          areas: [],
          lines: []
        }
      },
      activeType: '0',
      sceneModeOption: [
        {
          name: this.$t('mainDevConfiguration.longShot'),
          value: 0
        },
        {
          name: this.$t('mainDevConfiguration.closeShot'),
          value: 1
        }
      ],
      shadowModeOption: [
        {
          name: this.$t('mainDevConfiguration.weak'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.common'),
          value: 2
        },
        {
          name: this.$t('mainDevConfiguration.strong'),
          value: 3
        }
      ],
      foregroundSizeOption: [
        {
          name: this.$t('mainDevConfiguration.small'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.medium'),
          value: 2
        },
        {
          name: this.$t('mainDevConfiguration.large'),
          value: 3
        }
      ],
      sensitivityOption: [
        {
          name: this.$t('mainDevConfiguration.lowSensitivity'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.mediumSensitivity'),
          value: 2
        },
        {
          name: this.$t('mainDevConfiguration.highSensitivity'),
          value: 3
        }
      ],
      modelOption: [
        {
          name: this.$t('mainDevConfiguration.center'),
          value: 0
        },
        {
          name: this.$t('mainDevConfiguration.bottom'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.top'),
          value: 2
        }
      ],
      directionOption: [
        {
          name: this.$t('mainDevConfiguration.bidirectional'),
          value: 0
        },
        {
          name: this.$t('mainDevConfiguration.left'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.right'),
          value: 2
        }
      ],
      objTypeOption: [
        {
          name: this.$t('mainDevConfiguration.pedestrian'),
          value: 1
        },
        {
          name: this.$t('mainDevConfiguration.motorVehicle'),
          value: 2
        },
        {
          name: this.$t('mainDevConfiguration.nonMotorVehicle'),
          value: 3
        }
      ],
      timeTypeConversion: {
        0: 0,
        1: 1,
        2: 0
      },
      types: [],
      maxPoint: 10, // 最大点数限制
      maxArea: 5, // 最大区域限制
      videoUrl: '',

      planEnable: 0,
      currentPlanName: 'oncePlan'
    }
  },
  computed: {
    ...mapState({
      intelligentTypeList: state => state.dict.uvs_puconfig_intelligent_type,
      cameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['platType', 'platId', 'PermissionCameraManage']),
    formRules() {
      return {}
    },
    intelligentFormRules() {
      return {}
    },
    currentIntelligentType() {
      let types =
        this.platType !== 12
          ? [
              {
                name: this.$t('mainDevConfiguration.publicParam'),
                value: '0'
              }
            ]
          : []
      if (this.form.enable) {
        types = types.concat(
          this.intelligentTypeList.filter(item => this.types.includes(parseInt(item.value)))
        )
      }
      return types
    },
    currentIntelligentName() {
      if (this.currentIntelligentType.length) {
        return this.currentIntelligentType.filter(item => item.value === this.activeType)[0].name
      } else {
        return ''
      }
    }
  },
  watch: {
    cameraId: {
      async handler(newVal) {
        if (newVal) await this.handleCameraChange(newVal)
      },
      immediate: true
    }
  },
  created() {
    this.getDictionary()
  },
  mounted() {},
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData(['uvs_puconfig_intelligent_type'])
    },
    // 获取公共参数
    getBaseInfo() {
      this.formLoading = true
      this.$api
        .getCameraIntelligentBaseInfo({
          platId: this.platId,
          deviceId: this.cameraId
        })
        .then(res => {
          if (res.resultCode === 0) {
            this.support = true
            this.form.enable = res.enable
            res.sceneMode && (this.form.sceneMode = res.sceneMode)
            res.shadowMode && (this.form.shadowMode = res.shadowMode)
            res.size && (this.form.size = res.size)
            res.sensitivity && (this.form.sensitivity = res.sensitivity)
            this.types = res.types
            this.$nextTick(() => {
              this.activeType = this.currentIntelligentType[0].value
              this.handleTabClick({ name: this.currentIntelligentType[0].value })
            })
          } else if (res.resultCode === 212003) {
            this.support = false
          }
          this.formLoading = false
        })
        .catch(err => {
          this.formLoading = false
          this.$message.error(this.$t('mainDevConfiguration.getPublicParamError'))
        })
    },
    // 获取实时浏览url
    async getLiveUrl() {
      try {
        const res = await this.$api.getLiveUrl({
          cameraId: this.cameraId,
          streamType: 1,
          urlType: 6
        })
        return handleGetPreviewWss(res.url)
      } catch (e) {
        this.$message.error(this.$t('cameraConfiguration.videoChannel.getLiveUrlFailed'))
      }
    },
    // 初始化画板
    async initDrawboard() {
      const url = await this.getLiveUrl()
      if (url && this.$refs.drawBoard) {
        this.videoUrl = url
      }
    },
    // 获取智能参数
    async getIntelligentInfo() {
      this.formLoading = true
      await this.$api
        .getCameraIntelligentInfo({
          platId: this.platId,
          deviceId: this.cameraId,
          type: this.activeType
        })
        .then(res => {
          if (res.resultCode === 0) {
            let { info } = res
            this.maxPoint = res.maxPoint || 10
            this.maxArea = res.maxArea || 5

            info.alarmInterval && (this.intelligentForm.alarmInterval = info.alarmInterval)
            info.sensitivity && (this.intelligentForm.sensitivity = info.sensitivity)
            info.recognitionMode && (this.intelligentForm.recognitionMode = info.recognitionMode)
            info.objType && (this.intelligentForm.objType = info.objType) // 检测对象 好望云专属
            info.stayTime && (this.intelligentForm.stayTime = info.stayTime) // 容忍时间 好望云专属
            info.rule.areas &&
              (this.intelligentForm.rule.areas = info.rule.areas.map(item => {
                item.id = generateUuid()
                return item
              }))
            info.rule.lines &&
              (this.intelligentForm.rule.lines = info.rule.lines.map(item => {
                item.id = generateUuid()
                return item
              }))
            info.oncePlan && (this.intelligentForm.oncePlan = info.oncePlan)
            info.dayplan && (this.intelligentForm.dayplan = info.dayplan)
            info.weekPlan && (this.intelligentForm.weekPlan = info.weekPlan)
            this.setPlanEnable()
            this.formLoading = false
          } else {
            this.formLoading = false
          }
        })
        .catch(err => {
          this.formLoading = false
          this.$message.error(this.$t('mainDevConfiguration.getIntelligentAnalysisParamError'))
        })
    },
    handleCameraChange() {
      this.resetForm()
      this.getBaseInfo()
    },
    handleEnabledChange(val) {
      if (!val && this.platType !== 12) {
        this.activeType = '0'
      }
    },
    async handleTabClick(tab) {
      this.$refs.rightContainerMain.scrollTop = 0
      if (tab.name !== '0') {
        this.resetIntelligentForm()
        await this.getIntelligentInfo()
        await this.$nextTick()

        if (this.platType !== 12) {
          // 非好望云 加载计划
          this.currentPlanName = this.getCurrentPlanName()
          this.planTypeChange(this.currentPlanName)
        }
        this.$refs.drawboard?.createPlayer()
      }
    },
    getCurrentPlanName() {
      const { oncePlan, dayplan, weekPlan } = this.intelligentForm
      if (oncePlan.enable) {
        return 'oncePlan'
      } else if (dayplan.enable) {
        return 'dayplan'
      } else if (weekPlan.enable) {
        return 'weekPlan'
      } else {
        return 'oncePlan'
      }
    },
    // 渲染计划时间
    renderTimeGrid(planName) {
      let timeSpanList = []
      this.intelligentForm[planName].times.forEach(item => {
        item.periods.forEach(t => {
          timeSpanList.push({
            dayType: item.dayType,
            startTime: t.startTime,
            stopTime: t.endTime
          })
        })
      })
      this.$refs.timeGridControl.time_initialize(
        this.timeTypeConversion[this.intelligentForm[planName].type],
        2,
        timeSpanList
      )
    },
    // 设置计划总开关
    setPlanEnable() {
      const planList = ['oncePlan', 'dayplan', 'weekPlan']
      const hasEnable = planList.some(planName => this.intelligentForm[planName].enable === 1)
      this.planEnable = hasEnable ? 1 : 0
    },
    handlePlanEnableChange(val) {
      // 设置计划开关
      const planList = ['oncePlan', 'dayplan', 'weekPlan']
      planList.forEach(name => {
        if (val === 1) {
          this.intelligentForm[name].enable = name === this.currentPlanName ? 1 : 0
        } else {
          this.intelligentForm[name].enable = 0
        }
      })
    },
    //选择周计划或日计划
    planTypeChange(planName) {
      // 计划控件回显
      this.$refs.timeGridControl.planTypeChange(
        this.timeTypeConversion[this.intelligentForm[planName].type]
      )
      this.renderTimeGrid(planName)
    },
    resetForm() {
      this.form = {
        enable: 0,
        sceneMode: 1,
        shadowMode: 1,
        size: 1,
        sensitivity: 1
      }
      this.$resetForm('baseForm')
    },
    resetIntelligentForm() {
      this.intelligentForm = {
        alarmInterval: 3,
        sensitivity: 0,
        recognitionMode: 0,
        objType: [],
        stayTime: 0,
        oncePlan: {
          type: 0,
          times: this.currentPlanName === 'oncePlan' ? [] : this.intelligentForm.oncePlan.times,
          enable: 0
        },
        dayplan: {
          type: 1,
          times: this.currentPlanName === 'dayplan' ? [] : this.intelligentForm.dayplan.times,
          enable: 0
        },
        weekPlan: {
          type: 2,
          times: this.currentPlanName === 'weekPlan' ? [] : this.intelligentForm.weekPlan.times,
          enable: 0
        },
        rule: {
          areas: [],
          lines: []
        }
      }
      this.$refs.timeGridControl && this.$refs.timeGridControl.clearAll()
      this.$resetForm('intelligentForm')
    },
    submitBaseInfo(isHiden) {
      let form = {
        platId: this.platId,
        deviceId: this.cameraId,
        ...this.form
      }
      this.formLoading = true
      this.$api
        .setCameraIntelligentBaseInfo(form)
        .then(async res => {
          if (res.resultCode == 0) {
            if (!isHiden) {
              this.$message.success(this.$t('mainDevConfiguration.setPublicParamErrorSuccess'))
            }
          } else if (res.resultCode == 212010) {
            await this.stopVideoChannelConfig()
          }
          this.formLoading = false
        })
        .catch(error => {
          this.formLoading = false
        })
    },
    submitForm() {
      if (this.activeType !== '0') {
        // 处理计划
        if (this.platType !== 12) {
          this.handlePlanEnableChange(this.planEnable)
          let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
          this.intelligentForm[this.currentPlanName].times = []
          timeSpanList.forEach(item => {
            let i = this.intelligentForm[this.currentPlanName].times.findIndex(
              t => t.dayType === item.dayType
            )
            if (i === -1) {
              this.intelligentForm[this.currentPlanName].times.push({
                dayType: item.dayType,
                periods: [
                  {
                    startTime: item.startTime,
                    endTime: item.stopTime
                  }
                ]
              })
            } else {
              this.intelligentForm[this.currentPlanName].times[i].periods.push({
                startTime: item.startTime,
                endTime: item.stopTime
              })
            }
          })
        }
        let formData = JSON.parse(
          JSON.stringify({
            deviceId: this.cameraId,
            type: parseInt(this.activeType),
            platId: this.platId,
            info: this.intelligentForm
          })
        )
        if (this.platType === 12) {
          // 好望平台特殊处理
          delete formData.info.oncePlan // 去掉plan计划
          delete formData.info.dayplan
          delete formData.info.weekPlan
        }
        if (this.activeType !== '4') {
          delete formData.info.rule.lines
          formData.info.rule.areas = formData.info.rule.areas.map(item => {
            delete item.id
            delete item.index
            return item
          })
          if (formData.info.rule.areas.some(item => item.name === '')) {
            this.$message.warning(this.$t('mainDevConfiguration.validateName1'))
            return
          }
        } else {
          delete formData.info.rule.areas
          formData.info.rule.lines = formData.info.rule.lines.map(item => {
            delete item.id
            delete item.index
            return item
          })
          if (formData.info.rule.lines.some(item => item.name === '')) {
            this.$message.warning(this.$t('mainDevConfiguration.validateName1'))
            return
          }
        }
        this.formLoading = true
        this.$api
          .setCameraIntelligentInfo(formData)
          .then(res => {
            if (res.resultCode == 0) {
              this.$message.success(
                this.$t('mainDevConfiguration.setIntelligentAnalysisParamSuccess')
              )
              this.submitBaseInfo(true)
            }
            this.formLoading = false
          })
          .catch(error => {
            this.formLoading = false
          })
      } else {
        this.submitBaseInfo()
      }
    },
    stopVideoChannelConfig() {
      this.$confirm(this.$t('mainDevConfiguration.intelligentSetFail'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('mainDevConfiguration.stop'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res1 = await this.$api.getDevConfig({
            deviceCode: this.cameraId,
            configType: 9
          })
          const res2 = await this.$api.getDevConfig({
            deviceCode: this.cameraId,
            configType: 10
          })
          if (res1.resultCode == 0 && res1.configItem.motionDetectionEnable == 1) {
            const configItem = res1.configItem
            configItem.motionDetectionEnable = 0
            const res3 = await this.$api.setDevConfig({
              deviceCode: this.cameraId,
              configType: 9,
              configItem
            })
            if (res3.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('mainDevConfiguration.moveStopSuccess')
              })
            }
          }
          if (res2.resultCode == 0 && res2.configItem.enableVideoHide == 1) {
            const configItem = res1.configItem
            configItem.motionDetectionEnable = 0
            const res4 = await this.$api.setDevConfig({
              deviceCode: this.cameraId,
              configType: 10,
              configItem
            })
            if (res4.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('mainDevConfiguration.coverStopSuccess')
              })
            }
          }
          this.submitBaseInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('mainDevConfiguration.cancelOperate')
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/color.scss';

#intelligent_analysis_settings {
  width: 100%;
  height: 100%;
  position: relative;
  .intelligent_analysis_container {
    width: 100%;
    height: calc(100% - 68px);
    display: flex;
    overflow: hidden;
  }
  .left_container {
    margin-right: 20px;
    min-width: 300px;
    background-color: #082b40;
  }

  .right_container {
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-switch {
      margin-bottom: 10px;
      .el-switch__label {
        color: #fefefe;
      }
      .el-switch__label.is-active {
        color: #409eff;
      }
    }
    .right_container_header {
      .el-tabs.el-tabs--card.el-tabs--top {
        width: fit-content;
        .el-tabs__header {
          border-bottom: none;
        }
        .el-tabs__item {
          background: initial !important;
          color: #cccccc;
          border-bottom: none;
          border-color: #0e6294;
        }
        .el-tabs__item.is-active {
          background: #0e6294 !important;
          color: #ffffff;
        }
        .el-tabs__nav {
          border: 1px solid #0b537e;
          border-radius: 4px;
        }
      }
    }

    .right_container_main {
      flex: 1;
      overflow-y: auto;
      .el-form {
        overflow: hidden;
      }
      .el-radio {
        margin-right: 50px;
      }
      .el-form-item__label,
      .el-button--text {
        color: #fefefe;
      }
      .el-button--text:focus,
      .el-button--text:hover {
        color: #66b1ff;
      }

      .form_item_tips {
        margin: 0;
        font-size: 12px;
        color: #999999;
      }

      .form-title {
        position: relative;
        margin: 20px 0 20px 10px;
        font-size: 16px;
        font-weight: bold;
        color: #999999;
        &:before {
          content: '';
          width: 4px;
          height: 16px;
          background: linear-gradient(0deg, #879fd0 0%, #8fcbfa 100%);
          border-radius: 2px;
          position: absolute;
          left: -10px;
          top: 2.5px;
          bottom: 0;
        }
      }
      .el-row {
        display: flex;
        flex-wrap: wrap;
      }

      .el-slider {
        width: 80%;
        .el-slider__runway {
          height: 4px;
          border-radius: 2px;
          background-color: #0a314f;
          .el-slider__bar {
            height: 4px;
            background-color: #4488be;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
          }
          .el-slider__stop {
            height: 4px;
            background-color: #0a314f;
          }
        }

        .el-slider__button {
          width: 12px;
          height: 12px;
          background: #4488be;
          border: none;
        }

        .el-slider__input {
          width: 80px;
        }
        .el-slider__runway.show-input {
          margin-right: 110px;
        }
      }
      .el-input__inner {
        height: 32px;
        background: #08334d;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        border: 1px solid #08334d;
      }

      .draw_wrapper {
        background-color: #fff;
      }
      .table_wrapper {
        height: 100%;
      }
      .el-table th,
      .el-table tr,
      .el-table__empty-block {
        background: transparent;
      }
      .el-table thead {
        color: #ffffff;
      }
      .periodSetBox {
        min-height: 300px;
      }
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
