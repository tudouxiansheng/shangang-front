<template>
  <div class="image-config config-form" style="overflow-y: auto">
    <el-form
      v-if="showDisplayConfig"
      ref="displayForm"
      :model="displayForm"
      :rules="displayFormRules"
      label-position="top"
      style="height: auto"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('cameraConfiguration.videoChannel.screenSetting') }}</p>
      <div class="mb-4">
        <span class="text-blue-400">{{ $t('cameraConfiguration.videoChannel.settingTip') }}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('cameraConfiguration.videoChannel.brightness')"
            prop="brightness"
          >
            <el-slider
              v-model="displayForm.brightness"
              :max="displayMaxNum"
              show-input
              @change="submitDisplayForm"
            ></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('cameraConfiguration.videoChannel.contrast')" prop="contrast">
            <el-slider
              v-model="displayForm.contrast"
              :max="displayMaxNum"
              show-input
              @change="submitDisplayForm"
            ></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('cameraConfiguration.videoChannel.hue')" prop="hue">
            <el-slider
              v-model="displayForm.hue"
              :max="displayMaxNum"
              show-input
              @change="submitDisplayForm"
            ></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('cameraConfiguration.videoChannel.saturation')"
            prop="saturation"
          >
            <el-slider
              v-model="displayForm.saturation"
              :max="displayMaxNum"
              show-input
              @change="submitDisplayForm"
            ></el-slider>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      ref="osdForm"
      :model="osdForm"
      :rules="osdFormRules"
      label-position="top"
      style="height: auto"
      :disabled="!PermissionCameraManage"
    >
      <p class="form-title">{{ $t('cameraConfiguration.videoChannel.osdSetting') }}</p>
      <!-- OSD 总开关 -->
      <el-row :gutter="20">
        <el-col :span="2">
          <el-form-item prop="allEnableOsd">
            <el-checkbox
              v-model="osdForm.allEnableOsd"
              :disabled="!boardReady"
              :true-label="1"
              :false-label="0"
            >
              {{ $t('cameraConfiguration.videoChannel.enableOsd') }}
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- OSD颜色 -->
      <el-row :gutter="20" v-if="showFontColor">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="config-form-item__label">
                {{ $t('cameraConfiguration.videoChannel.osdFontColor') }}
              </span>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="fontColor">
                <el-color-picker
                  v-model="osdForm.fontColor"
                  :disabled="!boardReady || !enabledOsd"
                ></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- OSD字号 -->
      <el-row v-if="showFontSize" :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="config-form-item__label">
                {{ $t('cameraConfiguration.videoChannel.osdFontSize') }}
              </span>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="fontSize">
                <el-select
                  v-model="osdForm.fontSize"
                  :placeholder="$t('cameraConfiguration.videoChannel.osdFontSizePlaceHolder')"
                  :disabled="!boardReady || !enabledOsd"
                >
                  <el-option label="16" :value="16" />
                  <el-option label="24" :value="24" />
                  <el-option label="32" :value="32" />
                  <el-option label="48" :value="48" />
                  <el-option label="64" :value="64" />
                  <el-option label="96" :value="96" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 是否透明 -->
      <el-row v-if="showOsdTransparent" :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="config-form-item__label">
                {{ $t('cameraConfiguration.videoChannel.osdTransparent') }}
              </span>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="enableOsdTransparent">
                <el-radio-group
                  v-model="osdForm.enableOsdTransparent"
                  :disabled="!boardReady || !enabledOsd"
                >
                  <el-radio :label="1">{{ $t('cameraConfiguration.videoChannel.open') }}</el-radio>
                  <el-radio :label="0">{{ $t('cameraConfiguration.videoChannel.close') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 是否闪烁 -->
      <el-row v-if="showOsdBlink" :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="config-form-item__label">
                {{ $t('cameraConfiguration.videoChannel.osdBlink') }}
              </span>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="enableOsdBlink">
                <el-radio-group
                  v-model="osdForm.enableOsdBlink"
                  :disabled="!boardReady || !enabledOsd"
                >
                  <el-radio :label="1">{{ $t('cameraConfiguration.videoChannel.open') }}</el-radio>
                  <el-radio :label="0">{{ $t('cameraConfiguration.videoChannel.close') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 时间设置 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item prop="cameraTimeOsdInfo.enableOSDTime">
                <el-checkbox
                  v-model="osdForm.cameraTimeOsdInfo.enableOSDTime"
                  :true-label="1"
                  :false-label="0"
                  :disabled="!boardReady || !enabledOsd"
                  @change="handleEnableOSDTimeChange"
                >
                  {{ $t('cameraConfiguration.videoChannel.enableOSDTime') }}
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item v-show="osdForm.cameraTimeOsdInfo.enableOSDTime" prop="timeFormat">
                <el-select
                  v-model="osdForm.cameraTimeOsdInfo.timeFormat"
                  :placeholder="$t('cameraConfiguration.videoChannel.osdTimeFormatPlaceHolder')"
                  :disabled="!boardReady || !enabledOsd || !osdForm.cameraTimeOsdInfo.enableOSDTime"
                >
                  <el-option
                    :label="$t('cameraConfiguration.videoChannel.pleaseSelect')"
                    :value="0"
                    v-if="platType == PLATFORM_TYPE.ADS"
                  ></el-option>
                  <el-option
                    :label="$t('cameraConfiguration.videoChannel.osdTimeFormatOption1')"
                    :value="1"
                  ></el-option>
                  <el-option
                    v-if="drive !== DRIVE_TYPE.ONVIF || platType == PLATFORM_TYPE.ADS"
                    :label="$t('cameraConfiguration.videoChannel.osdTimeFormatOption2')"
                    :value="2"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="mb-5">
        <el-col :span="12">{{ $t('cameraConfiguration.videoChannel.showOSDText') }}</el-col>
        <el-col :span="12">{{ $t('cameraConfiguration.videoChannel.videoPreview') }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- OSD Text -->
        <el-col :span="12">
          <el-row :gutter="20" v-for="(item, index) in osdForm.cameraOsdInfoList" :key="index">
            <el-col :span="2">
              <el-form-item :prop="`cameraOsdInfoList.${index}.enableOSDName`">
                <el-checkbox
                  v-model="item.enableOSDName"
                  :disabled="!boardReady || !enabledOsd"
                  :true-label="1"
                  :false-label="0"
                  @change="handleEnableOSDItemChange($event, index)"
                ></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item
                :prop="`cameraOsdInfoList.${index}.osdNameText`"
                :rules="osdFormRules.osdNameText"
              >
                <el-input
                  v-model.trim="item.osdNameText"
                  :disabled="!boardReady || !enabledOsd || !item.enableOSDName"
                  :placeholder="$t('cameraConfiguration.videoChannel.osdNameTextPlaceHolder')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="text-center">
            <el-button
              type="text"
              v-show="osdForm.cameraOsdInfoList.length < osdTextMaxNum"
              :disabled="!boardReady || !enabledOsd"
              @click="handleAddOsdItemClick"
            >
              <svg-icon iconClass="add-input" className="iconClass" />
            </el-button>
          </el-row>
        </el-col>
        <!-- OSD Preview -->
        <el-col :span="12">
          <videoDrawboard
            ref="drawboard"
            :controls="[]"
            :vpaas-video-url="videoUrl"
            @board-mounted="handleBoardMounted"
            @object-mouseup="handleObjectMouseUp"
          />
        </el-col>
      </el-row>
    </el-form>

    <div class="footer" v-show="support">
      <el-button class="bt-defult" v-if="$parent.cuType !== '1'" @click="$parent.goBack">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button v-if="PermissionCameraManage" type="primary" @click="submitOSDForm">
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
import { SHAPE_TYPE } from '@/components/videoDrawboard/constant'
import { mapGetters, mapState } from 'vuex'
import { validateSpecialWord1 } from '@/utils/common/validator'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
import { DEVICE_TYPE, DRIVE_TYPE } from '@/enums/deviceEnum'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
const FractionDigits = 2 // 坐标保留小数位数
export default {
  props: {
    support: {
      type: Boolean,
      default: true
    }
  },
  components: {
    videoDrawboard
  },
  data() {
    return {
      displayForm: {
        brightness: 0,
        contrast: 0,
        hue: 0,
        saturation: 0
      },
      displayFormRules: {},
      osdForm: {
        allEnableOsd: 0,
        fontColor: null,
        fontSize: null,
        enableOsdTransparent: 0,
        enableOsdBlink: null,
        cameraTimeOsdInfo: {
          enableOSDTime: 0,
          timeFormat: 1,
          rectInfo: {
            type: SHAPE_TYPE.RECT,
            points: [
              {
                x: 0,
                y: 0
              }
            ]
          }
        },
        cameraOsdInfoList: [
          {
            enableOSDName: 0,
            osdNameText: '',
            rectInfo: {
              type: SHAPE_TYPE.RECT,
              points: [
                {
                  x: 0.01,
                  y: this.platType == PLATFORM_TYPE.ADS ? 0.01 : this.osdHeight + this.osdGutter
                }
              ]
            }
          }
        ]
      },
      videoUrl: '',
      boardReady: false,
      osdWidth: 0.35,
      osdHeight: 0.06,
      osdGutter: 0.06,
      DRIVE_TYPE: DRIVE_TYPE,
      DEVICE_TYPE: DEVICE_TYPE,
      PLATFORM_TYPE: PLATFORM_TYPE
    }
  },
  computed: {
    ...mapState({
      selectedCameraId: state => state.deviceConfig.cameraId
    }),
    ...mapGetters('deviceConfig', ['platType', 'drive', 'mainDevType', 'PermissionCameraManage']),
    osdFormRules() {
      return {
        osdNameText: [
          {
            max: 44,
            message: this.$t('public.validate.charLimit', { num: 44 }),
            trigger: 'change'
          },
          {
            validator: validateSpecialWord1,
            trigger: 'blur'
          }
        ]
      }
    },
    enabledOsd() {
      return this.osdForm.allEnableOsd === 1
    },
    osdTextMaxNum() {
      switch (this.drive) {
        case DRIVE_TYPE.T28181:
        case DRIVE_TYPE.HWSDK:
        case DRIVE_TYPE.HWSDK_ACREG:
          return 6
        case DRIVE_TYPE.DHSDK:
          return 3
        default:
          return 8
      }
    },
    displayMaxNum() {
      return ((this.drive === DRIVE_TYPE.ONVIF || this.drive === DRIVE_TYPE.HWSDK_ACREG) &&
        this.platType == PLATFORM_TYPE.VPAAS) ||
        (this.drive === DRIVE_TYPE.ONVIF && this.platType == PLATFORM_TYPE.ADS)
        ? 100
        : 255
    },
    // 是否展示图像设置
    showDisplayConfig() {
      let support = false
      switch (this.drive) {
        case DRIVE_TYPE.T28181:
          support = false
          break
        case DRIVE_TYPE.ONVIF:
        case DRIVE_TYPE.HWSDK:
        case DRIVE_TYPE.HWSDK_ACREG:
        case DRIVE_TYPE.DHSDK:
          support = true
          break
        case DRIVE_TYPE.HIKSDK:
          support = this.mainDevType === DEVICE_TYPE.IPC
          break
        default:
          break
      }
      return support
    },
    // 是否展示OSD字号
    showFontSize() {
      if (this.platType == PLATFORM_TYPE.ADS) {
        return this.drive != DRIVE_TYPE.ONVIF && this.drive != DRIVE_TYPE.T28181
      } else {
        return (
          this.drive != DRIVE_TYPE.ONVIF &&
          this.drive != DRIVE_TYPE.T28181 &&
          this.drive != DRIVE_TYPE.HWSDK_ACREG
        )
      }
    },
    // 是否展示OSD颜色
    showFontColor() {
      if (this.platType == PLATFORM_TYPE.ADS) {
        return this.drive != DRIVE_TYPE.ONVIF && this.drive != DRIVE_TYPE.T28181
      } else {
        return (
          this.drive != DRIVE_TYPE.ONVIF &&
          this.drive != DRIVE_TYPE.T28181 &&
          this.drive != DRIVE_TYPE.HWSDK_ACREG
        )
      }
    },
    // 是否展示OSD是否透明
    showOsdTransparent() {
      if (this.platType == PLATFORM_TYPE.ADS) {
        return (
          this.drive === DRIVE_TYPE.HIKSDK ||
          this.drive === DRIVE_TYPE.HWSDK ||
          this.drive === DRIVE_TYPE.HWSDK_ACREG
        )
      } else {
        return this.drive === DRIVE_TYPE.HIKSDK || this.drive === DRIVE_TYPE.HWSDK
      }
    },
    showOsdBlink() {
      return this.drive === DRIVE_TYPE.HIKSDK
    }
  },
  watch: {
    selectedCameraId: {
      handler: function () {
        this.getCameraInfo()
      },
      immediate: true
    }
  },
  methods: {
    getCameraInfo() {
      if (this.showDisplayConfig) {
        this.getCameraDisplayInfo()
      }
      this.getCameraOsdInfo()
    },
    // 获取图像设置信息
    async getCameraDisplayInfo() {
      let res = await this.$api.cameraDisplayInfo({ cameraId: this.selectedCameraId })
      if (res.resultCode === 0) {
        this.displayForm = {
          brightness: res.brightness,
          contrast: res.contrast,
          hue: res.hue,
          saturation: res.saturation
        }
      }
    },
    // 获取osd设置信息
    async getCameraOsdInfo() {
      let res = await this.$api.cameraMultiOsdInfo({ cameraId: this.selectedCameraId })
      if (res.resultCode === 0) {
        let cameraOsdInfoList = res.cameraOsdInfoList
        if (cameraOsdInfoList.length > this.osdTextMaxNum) {
          res.cameraOsdInfoList = res.cameraOsdInfoList.slice(0, this.osdTextMaxNum)
        }
        let osdForm = {
          allEnableOsd: res.allEnableOsd,
          cameraTimeOsdInfo: {
            enableOSDTime: res.enableOSDTime,
            timeFormat: res.timeFormat,
            rectInfo: {
              type: SHAPE_TYPE.RECT,
              points: [
                {
                  x: Number(Number(res.timeX).toFixed(FractionDigits)),
                  y: Number(Number(res.timeY).toFixed(FractionDigits))
                }
              ]
            }
          }
        }
        osdForm.cameraOsdInfoList = []
        if (
          res.cameraOsdInfoList &&
          res.cameraOsdInfoList.length &&
          res.cameraOsdInfoList[0].left &&
          res.cameraOsdInfoList[0].top
        ) {
          res.cameraOsdInfoList.map(item => {
            osdForm.cameraOsdInfoList.push({
              enableOSDName: item.enableOSDName,
              osdNameText: item.nameText,
              rectInfo: {
                type: SHAPE_TYPE.RECT,
                points: [
                  {
                    x: Number(Number(item.left).toFixed(FractionDigits)),
                    y: Number(Number(item.top).toFixed(FractionDigits))
                  }
                ]
              }
            })
          })
        } else {
          osdForm.cameraOsdInfoList = [
            {
              enableOSDName: 0,
              osdNameText: '',
              rectInfo: {
                type: SHAPE_TYPE.RECT,
                points: [
                  {
                    x: 0.01,
                    y: this.osdHeight + this.osdGutter
                  }
                ]
              }
            }
          ]
        }
        this.osdForm.fontColor = Object.hasOwn(res, 'fontColor')
          ? `#${res.fontColor.slice(2)}`
          : undefined
        if (res.fontSize == 0) {
          res.fontSize = null
        }
        this.osdForm.fontSize = Object.hasOwn(res, 'fontSize') ? res.fontSize : undefined
        this.osdForm.enableOsdTransparent = Object.hasOwn(res, 'enableOsdTransparent')
          ? res.enableOsdTransparent
          : 0
        this.osdForm.enableOsdBlink = Object.hasOwn(res, 'enableOsdBlink')
          ? res.enableOsdBlink
          : undefined
        this.osdForm = Object.assign({}, this.osdForm, osdForm)
        // this.$refs.drawboard?.createPlayer()
        await this.initDrawboard()
      }
    },
    handleDelOsdItemClick(index) {
      this.osdForm.cameraOsdInfoList.splice(index, 1)
      this.updateRectInfo()
      this.reRenderKlass()
    },
    handleAddOsdItemClick() {
      const { cameraOsdInfoList } = this.osdForm
      if (cameraOsdInfoList.length >= this.osdTextMaxNum) {
        this.$message({
          message: this.$t('cameraConfiguration.videoChannel.osdNameTextMaxNumPrompt', {
            num: this.osdTextMaxNum
          }),
          type: 'warning'
        })
        return
      }
      cameraOsdInfoList.push({
        enableOSDName: 1,
        osdNameText: '',
        rectInfo: {
          type: SHAPE_TYPE.RECT,
          points: [
            {
              x: 0.01,
              y:
                (cameraOsdInfoList.length + 2) * this.osdHeight +
                cameraOsdInfoList.length * this.osdGutter
            }
          ]
        }
      })
      this.$refs.drawboard.render(
        [
          this.calcRenderData(
            cameraOsdInfoList[cameraOsdInfoList.length - 1],
            cameraOsdInfoList.length - 1
          )
        ],
        false
      )
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
        this.$message.error(this.$t('cameraConfiguration.videoChannel.getLiveUrlFailed'))
      }
    },
    // 初始化画板
    async initDrawboard() {
      const url = await this.getLiveUrl()
      if (url && this.$refs.drawboard) {
        this.boardReady = false
        this.videoUrl = url
      }
    },
    // 显示时间checkbox change事件处理
    handleEnableOSDTimeChange(val) {
      if (val === 1) {
        this.$refs.drawboard.render([this.calcRenderData(this.osdForm.cameraTimeOsdInfo)], false)
      } else {
        const { fCanvas } = this.$refs.drawboard.drawboard
        const objects = this.$refs.drawboard.getObjects()
        const klass = objects.find(item => item.get('id') === 8)
        if (klass) {
          fCanvas.remove(klass)
          fCanvas.renderAll()
        }
      }
    },
    handleEnableOSDItemChange(val, index) {
      if (val === 1) {
        this.$refs.drawboard.render(
          [this.calcRenderData(this.osdForm.cameraOsdInfoList[index], index)],
          false
        )
      } else {
        const { fCanvas } = this.$refs.drawboard.drawboard
        const objects = this.$refs.drawboard.getObjects()
        const klass = objects.find(item => item.get('id') === index)
        if (klass) {
          fCanvas.remove(klass)
          fCanvas.renderAll()
        }
      }
    },
    handleBoardMounted() {
      this.boardReady = true
      this.reRenderKlass()
    },
    async handleObjectMouseUp(klass, option) {
      await this.submitOSDForm()
    },
    reRenderKlass() {
      let rectInfos = []
      // 时间开启 渲染框
      if (this.osdForm.cameraTimeOsdInfo.enableOSDTime === 1) {
        rectInfos.push(this.calcRenderData(this.osdForm.cameraTimeOsdInfo))
      }
      if (this.osdForm.cameraOsdInfoList.length) {
        this.osdForm.cameraOsdInfoList.forEach((item, index) => {
          // osdtext 开启 渲染
          if (item.enableOSDName === 1) {
            rectInfos.push(this.calcRenderData(item, index))
          }
        })
      }
      if (rectInfos.length > 0) {
        this.$refs.drawboard.render(rectInfos)
      }
    },
    calcRenderData(item, index = 8) {
      const { type, points } = item.rectInfo
      return {
        type,
        points: [
          points[0],
          {
            x: Number((points[0].x + this.osdWidth).toFixed(FractionDigits)),
            y: Number((points[0].y + this.osdHeight).toFixed(FractionDigits))
          }
        ],
        options: {
          id: index
        }
      }
    },
    async submitOSDForm() {
      const osdFormValid = await this.$refs['osdForm'].validate()
      if (osdFormValid) {
        this.updateRectInfo()
        const osdForm = this.$loadash.cloneDeep(this.osdForm)
        osdForm.cameraTimeOsdInfo.rectInfo.points.splice(1, 1)
        osdForm.cameraOsdInfoList = []
        const cameraOsdInfoList = this.$loadash.cloneDeep(this.osdForm.cameraOsdInfoList)
        const list = cameraOsdInfoList.filter(item => item.enableOSDName && !item.osdNameText)
        if (list.length) {
          return this.$alert(
            this.$t('cameraConfiguration.videoChannel.inputText'),
            this.$t('public.prompt'),
            {
              confirmButtonText: this.$t('public.confirm')
            }
          )
        }
        cameraOsdInfoList.forEach(item => {
          item.rectInfo.points.splice(1, 1)
          osdForm.cameraOsdInfoList.push(item)
        })

        const cameraMultiOsdConfig = {
          cameraId: this.selectedCameraId,
          allEnableOsd: osdForm.allEnableOsd,
          enableOSDTime: osdForm.cameraTimeOsdInfo.enableOSDTime,
          timeFormat: osdForm.cameraTimeOsdInfo.timeFormat,
          timeX: Number(osdForm.cameraTimeOsdInfo.rectInfo.points[0].x.toFixed(FractionDigits)),
          timeY: Number(osdForm.cameraTimeOsdInfo.rectInfo.points[0].y.toFixed(FractionDigits)),
          fontColor: osdForm.fontColor ? '0x' + osdForm.fontColor.slice(1) : undefined,
          fontSize: osdForm.fontSize,
          enableOsdTransparent: osdForm.enableOsdTransparent,
          enableOsdBlink: osdForm.enableOsdBlink,
          cameraOsdInfoList: osdForm.cameraOsdInfoList.map(item => {
            return {
              enableOSDName: item.enableOSDName,
              nameText: item.osdNameText,
              left: Number(item.rectInfo.points[0].x.toFixed(FractionDigits)),
              top: Number(item.rectInfo.points[0].y.toFixed(FractionDigits))
            }
          })
        }
        const res = await this.$api.cameraMultiOsdConfig(cameraMultiOsdConfig)
        if (res.resultCode === 0) {
          this.$message({
            message: this.$t('cameraConfiguration.videoChannel.osdSetupSuccessful'),
            type: 'success'
          })
        }
      }
    },
    async submitDisplayForm() {
      const formValid = await this.$refs['displayForm'].validate()
      if (formValid) {
        const displayForm = this.$loadash.cloneDeep(this.displayForm)
        const res = await this.$api.cameraDisplayConfig({
          cameraId: this.selectedCameraId,
          ...displayForm
        })
        if (res.resultCode === 0) {
          this.$message({
            message: this.$t('cameraConfiguration.videoChannel.displaySetupSuccessful'),
            type: 'success'
          })
        }
      }
    },
    updateRectInfo() {
      const drawboard = this.$refs.drawboard
      const objects = drawboard.getObjects()
      // time
      const timeKlass = objects.find(item => item.id === 8)
      if (timeKlass) {
        this.osdForm.cameraTimeOsdInfo.rectInfo = drawboard.normalizeSingleData(timeKlass)
      }
      // text
      if (this.osdForm.cameraOsdInfoList.length) {
        this.osdForm.cameraOsdInfoList.forEach((item, index) => {
          const textKlass = objects.find(item => item.id === index)
          if (textKlass) {
            this.osdForm.cameraOsdInfoList[index].rectInfo =
              drawboard.normalizeSingleData(textKlass)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.image-config {
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
  .iconClass {
    display: inline-block;
    font-size: 20px;
    margin-top: -2px;
  }
  .el-slider__runway.show-input {
    margin-left: 10px;
  }
  .config-form-item__label {
    font-size: 14px;
    line-height: 32px;
  }
}
</style>
