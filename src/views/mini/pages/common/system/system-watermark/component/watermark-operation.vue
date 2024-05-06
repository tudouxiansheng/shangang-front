<template>
  <!-- 水印添加修改 -->
  <el-dialog
    :title="
      $parent.operation == 0
        ? $t('systemTatermarkManage.add')
        : $parent.operation == 1
        ? $t('systemTatermarkManage.edit')
        : $t('systemTatermarkManage.detail')
    "
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1270px"
    :close-on-click-modal="false"
    class="dialog"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal-append-to-body="true"
    :modal="true"
    draggable
    id="system-watermark-add"
    :show-close="!allLoading"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      :label-width="$parent.locale == 'en' ? '240px' : '150px'"
      size="small"
      label-position="top"
      v-loading="allLoading"
    >
      <div class="system-watermark-content">
        <div class="contentLeftNav">
          <span>{{ $t('systemTatermarkManage.watermarkPreview') }}</span>
        </div>
        <div class="contentLeft">
          <canvas v-show="form.systemType == 1" class="contentPosition" ref="content"></canvas>
          <canvas
            v-show="form.systemType == 2 || form.systemType == 3"
            class="contentPosition"
            id="canvas"
          ></canvas>
        </div>
        <div class="contentRight">
          <el-form-item
            :label="$t('systemTatermarkManage.systemType')"
            auto-complete="off"
            prop="systemType"
          >
            <el-select
              @change="systemTypeChange"
              v-model="form.systemType"
              :placeholder="$t('systemTatermarkManage.selectSystemType')"
              :disabled="$parent.operation != 0"
            >
              <el-option
                v-for="item in $parent.systemTypeArray"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('systemTatermarkManage.watermarkType')"
            prop="watermarkTypeRadio"
            v-show="form.systemType !== 3"
          >
            <el-radio-group v-model="form.watermarkTypeRadio" @change="$forceUpdate()">
              <el-radio
                @change="watermarkTypeRadioChange"
                label="1"
                :disabled="$parent.operation == 2"
              >
                {{ $t('systemTatermarkManage.writtenWords') }}
              </el-radio>
              <el-radio
                @change="watermarkTypeRadioChange"
                :style="$parent.locale == 'en' ? '0px' : ' 60px'"
                label="2"
                :disabled="$parent.operation == 2"
              >
                {{ $t('systemTatermarkManage.custom') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 30px"
            v-show="
              (form.watermarkTypeRadio == 1 && form.systemType !== 3) || form.systemType === 3
            "
            prop="content"
          >
            <template #label>
              <span>{{ $t('systemTatermarkManage.watermarkName') }}</span>
              <el-tooltip
                v-if="$parent.operation != 2"
                :content="$t('systemTatermarkManage.pleaseSegment')"
                placement="top"
              >
                <el-icon class="iStyle"><el-icon-warning-outline /></el-icon>
              </el-tooltip>
            </template>
            <el-input
              @input="watermarkNameChange"
              v-model="form.content"
              auto-complete="off"
              :placeholder="$t('systemTatermarkManage.content')"
              :disabled="$parent.operation == 2"
            />
          </el-form-item>
          <el-form-item
            style="margin-bottom: 30px"
            v-show="form.watermarkTypeRadio == 2 && form.systemType !== 3"
            prop="ruleName"
            class="selectForm"
          >
            <template #label>
              <span>{{ $t('systemTatermarkManage.ruleInformation') }}</span>
              <el-tooltip :content="$t('systemTatermarkManage.pleaseObtain')" placement="top">
                <el-icon class="iStyle"><el-icon-warning-outline /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              class="selectRule"
              v-model="form.ruleName"
              :placeholder="$t('systemTatermarkManage.pleaseSelect')"
              filterable
              allow-create
              clearable
              @change="selectRuleNameChange"
              :disabled="$parent.operation == 2"
            >
              <el-option
                v-for="item in watermarkRuleArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-show="form.systemType == 1"
            :label="$t('systemTatermarkManage.watermarkAngle')"
            prop="rotate"
          >
            <el-select
              @change="rotateChange"
              v-model="form.rotate"
              :placeholder="$t('systemTatermarkManage.pleaseAngle')"
              :disabled="$parent.operation == 2"
            >
              <el-option
                v-for="item in angleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="form.systemType == 2 || form.systemType === 3"
            :label="$t('systemTatermarkManage.watermarkDirection')"
            prop="watermarkDirectionRadio"
          >
            <el-radio-group
              v-model="form.position"
              :disabled="$parent.operation == 2"
              @change="getvideoWaterInfo"
            >
              <el-radio v-for="item in positionOption" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="form.systemType === 3" class="flex" style="margin-bottom: 23px;">
            <div style="margin-right: 10px;" class="leftTitle">{{ $t('systemTatermarkManage.timeline') }}:</div>
            <el-switch
              @change="timeLineChange"
              v-model="form.timeLine"
              :disabled="$parent.operation == 2"
            ></el-switch>
          </div>

          <el-form-item
            :label="$t('systemTatermarkManage.watermarkLayout') + ' ：'"
            prop="layout"
            v-show="form.systemType === 3 && form.timeLine"
          >
            <el-select
              :disabled="$parent.operation == 2"
              v-model="form.layout"
              :placeholder="$t('systemTatermarkManage.pleaseSelect')"
              filterable
              @change="waterDirectionChange"
            >
              <el-option
                v-for="item in layoutList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('systemTatermarkManage.transparency')" prop="opacity">
            <el-slider
              @change="sliderOpacityChange"
              :min="minOpacity"
              :max="maxOpacity"
              v-model="form.opacity"
              :disabled="$parent.operation == 2"
            ></el-slider>
            <div class="transparencyBorder">
              <span>{{ this.form.opacity }}%</span>
            </div>
          </el-form-item>

          <el-form-item :label="$t('systemTatermarkManage.watermarkSize')" prop="font">
            <el-slider
              @change="sliderFontChange"
              :min="minFont"
              :max="maxFont"
              v-model="form.font"
              :disabled="$parent.operation == 2"
            ></el-slider>

            <div class="transparencyBorder">
              <span>{{ this.form.font }}px</span>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button
          v-if="$parent.operation == 0 || $parent.operation == 1"
          type="primary"
          @click="submitForm"
          :loading="$parent.maskloading"
        >
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
import { watermarkPreview, genWaterMark, removerWaterMark } from '@/utils/common/watermark'
import { getFormatDate } from '@/utils/common/mutil'
export default {
  components: {
    ElIconWarningOutline
  },
  data() {
    return {
      minOpacity: 10,
      maxOpacity: 80,
      minFont: 12,
      maxFont: 40,

      angleList: [
        { value: 30, label: this.$t('systemTatermarkManage.tiltLeft') },
        { value: -30, label: this.$t('systemTatermarkManage.tiltRight') }
      ],
      allLoading: false,
      form: {
        watermarkTypeRadio: '1',
        systemType: '',
        watermarkType: '',
        content: '',
        tenantCheckedNum: '',
        rotate: '',
        layout: '',
        ruleName: '',
        opacity: 16,
        font: 14,
        timeLine: false,
        position: 'right-down'
      },
      positionOption: [
        {
          label: this.$t('systemTatermarkManage.lowerRight'),
          value: 'right-down'
        },
        {
          label: this.$t('systemTatermarkManage.topRight'),
          value: 'right-top'
        },
        {
          label: this.$t('systemTatermarkManage.bottomLeft'),
          value: 'left-down'
        },
        {
          label: this.$t('systemTatermarkManage.topLeft'),
          value: 'left-top'
        }
      ],
      layoutList: [
        {
          label: this.$t('systemTatermarkManage.upAndDown'),
          value: '0'
        },
        {
          label: this.$t('systemTatermarkManage.leftAndRight'),
          value: '1'
        }
      ],
      waterRuleName: '',
      colour: '#000000',
      options: [],
      value: '',
      colorarr: [],
      watermarkRuleList: [],
      watermarkRuleArray: [
        { value: 0, label: this.$t('systemTatermarkManage.organizationName') },
        { value: 1, label: this.$t('systemTatermarkManage.userNumber') }
      ],
      waterRadio: null,
      newData: this.dayjs().format('YYYY-MM-DD'),
      isSelectRule: 1,
      tenantNameList: [],
      tenantIdList: [],
      tenantRelateIdList: [],
      detailsTenantList: [],
      confirmTenantIdList: []
    }
  },
  watch: {
    'form.position'(val) {
      if (this.form.systemType == 2 && val) {
        this.getvideoWaterInfo()
      }
    }
  },
  computed: {
    rules() {
      let validateSystemType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('systemTatermarkManage.selectSystemType')))
        } else {
          if (!this.$parent.gbWatermarkEnable && this.form.systemType == 3) {
            callback(new Error(this.$t('systemTatermarkManage.needWatermark')))
          } else {
            callback()
          }
        }
      }
      return {
        content: [
          {
            required:
              (this.form.watermarkTypeRadio == 1 && this.form.systemType !== 3) ||
              this.form.systemType === 3,
            trigger: 'blur',
            message: this.$t('systemTatermarkManage.content')
          },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
            message: this.$t('systemTatermarkManage.onlyInput'),
            trigger: 'blur'
          },
          { max: 10, message: this.$t('systemTatermarkManage.tenContent'), trigger: 'blur' }
        ],
        systemType: [{ required: true, trigger: 'change', validator: validateSystemType }],
        tenantCheckedNum: [
          {
            required: true,
            message: this.$t('systemTatermarkManage.pleaseInputTenant'),
            trigger: 'change'
          }
        ],
        rotate: [
          {
            required: this.form.systemType == 1,
            message: this.$t('systemTatermarkManage.pleaseAngle'),
            trigger: 'change'
          }
        ],
        watermarkTypeRadio: [
          {
            required: this.form.systemType !== 3,
            message: this.$t('systemTatermarkManage.requiredSelect'),
            trigger: 'change'
          }
        ],
        ruleName: [
          {
            required: this.form.watermarkTypeRadio == 2 && this.form.systemType !== 3,
            message: this.$t('systemTatermarkManage.ruleInformationInput'),
            trigger: 'change'
          }
        ],
        layout: [
          {
            required: this.form.systemType === 3 && this.form.timeLine,
            message: this.$t('systemTatermarkManage.watermarkLayoutInput'),
            trigger: 'change'
          }
        ],
        opacity: [{ required: true }],
        font: [{ required: true }]
      }
    }
  },
  async mounted() {
    //判断是否有角色权限
    this.setFormRules()
  },
  methods: {
    // 获取勾选的租户信息
    getconfirmTenantClick(tenantInfo) {
      this.confirmTenantIdList = [...new Set(this.setSelectValRelateIdList(tenantInfo))]
      this.tenantRelateIdList = this.confirmTenantIdList
      this.form.tenantCheckedNum = this.$t('public.selectedTenantNum', {
        num: this.confirmTenantIdList.length
      })
    },
    // 系统类型
    systemTypeChange(systemType) {
      this.form.timeLine = false
      this.form.layout = ''
      this.form.watermarkTypeRadio = '1'
      this.newData = ''
      this.disabledDirection = true
      if (systemType == 1 || systemType == 2) {
        this.form.opacity = 16
        this.form.font = 14
      } else if (systemType == 3) {
        this.form.opacity = 40
        this.form.font = 28
      }
      this.triggerPreview(systemType)
      // this.getvideoWaterInfo()
      this.waterRadio = systemType
      this.tenantNameList = []
    },
    rotateChange(val) {
      if (this.form.systemType == 1) {
        this.triggerPreview()
      } else {
        this.getvideoWaterInfo()
      }
    },

    // 获取勾选租户信息的名称数组
    setSelectValNameList(tenantNameInfo) {
      const tenantNameList = []
      if (tenantNameInfo) {
        tenantNameInfo.filter(item => {
          tenantNameList.push(item.tenantName)
        })
      }
      return tenantNameList
    },
    // 筛选出其他水印关联租
    setSelectValRelateIdList(tenantRelateIdInfo) {
      const tenantRelateIdList = []
      if (tenantRelateIdInfo) {
        tenantRelateIdInfo.filter(item => {
          if (item.relateWatermark !== 2) {
            tenantRelateIdList.push(item.tenantId)
          }
        })
      }
      return tenantRelateIdList
    },
    // 获取勾选租户信息的ID数组
    setSelectValIdList(tenantIdInfo) {
      const tenantIdList = []
      if (tenantIdInfo) {
        tenantIdInfo.filter(item => {
          tenantIdList.push(item.tenantId)
        })
      }
      return tenantIdList
    },
    // 获取名字
    setwatermarkName(ruleNameInfo) {
      let content = ''
      if (ruleNameInfo) {
        this.watermarkRuleArray.map(item => {
          if (ruleNameInfo === item.value) {
            content = item.value
          }
        })
      } else {
        content = ''
      }
      return content
    },
    // 获取租户信息
    getTenantChange(event) {
      if (event) {
        this.$parent.addTenantVisible = true
      }
    },
    //水印自定义类型
    watermarkTypeRadioChange(val) {
      if (val == 1) {
        this.form.content = ''
      }
    },
    // 新增规则信息
    selectRuleClick() {
      if (this.isSelectRule == 1) {
        this.isSelectRule = 2
      }
    },
    // 时间线
    timeLineChange(val) {
      if (val) {
        this.disabledDirection = false
        this.newData = ''
        this.form.layout = '1'
        this.newData = getFormatDate(new Date()).substr(0, 10)
      } else {
        this.form.layout = ''
        this.newData = ''
        this.disabledDirection = true
      }
      if (this.form.systemType == 1) {
        let url = this.watermarkInfo()
        this.$refs.content.style.background = `url(${url})`
      } else if (this.form.systemType == 2 || this.form.systemType == 3) {
        this.getvideoWaterInfo()
      }
    },
    // 水印布局
    waterDirectionChange() {
      if (this.form.layout) {
        if (this.form.systemType == 1) {
          this.newData = getFormatDate(new Date()).substr(0, 10)
          let url = this.watermarkInfo()
          this.$refs.content.style.background = `url(${url})`
        } else if (this.form.systemType == 2 || this.form.systemType == 3) {
          this.newData = getFormatDate(new Date()).substr(0, 10)
          this.getvideoWaterInfo()
        }
      }
    },
    // 水印预览
    triggerPreview(systemType) {
      if (systemType) {
        if (systemType == 1) {
          let url = this.watermarkInfo()
          this.$refs.content.style.background = `url(${url})`
        } else if (systemType == 2 || systemType == 3) {
          this.getvideoWaterInfo()
        }
      } else {
        if (this.form.systemType == 1) {
          let url = this.watermarkInfo()
          this.$refs.content.style.background = `url(${url})`
        } else if (this.form.systemType == 2 || this.form.systemType == 3) {
          this.getvideoWaterInfo()
        }
      }
    },
    // 水印名称信息
    watermarkNameChange() {
      if (this.form.systemType == 1) {
        this.triggerPreview()
      } else {
        this.getvideoWaterInfo()
      }
    },

    // 水印透明度
    sliderOpacityChange() {
      if (this.form.systemType == 1) {
        this.triggerPreview()
      } else {
        this.getvideoWaterInfo()
      }
    },
    // 水印字体大小
    sliderFontChange() {
      if (this.form.systemType == 1) {
        this.triggerPreview()
      } else {
        this.getvideoWaterInfo()
      }
    },

    // 水印预览内容
    watermarkInfo() {
      let textAlign = ''
      let content = ''
      let rotates = ''
      if (this.form.watermarkTypeRadio == 1) {
        content = this.form.content
      } else if (this.form.watermarkTypeRadio == 2) {
        if (this.form.ruleName == 0) {
          content = this.$t('systemTatermarkManage.organizationName')
        } else {
          content = this.$t('systemTatermarkManage.userNumber')
        }
      }
      if (this.form.layout) {
        if (this.form.layout == '0') {
          textAlign = 'left'
        } else {
          textAlign = 'right'
        }
      }

      if (this.form.rotate == undefined) {
        rotates = 3
      } else {
        rotates = this.form.rotate
      }

      if (this.form.timeLine == false) {
        this.newData = ''
      } else {
        this.newData = getFormatDate(new Date()).substr(0, 10)
      }

      const option = {
        ruleName: this.form.ruleName,
        className: this.$refs.content,
        width: 1200,
        height: 600,
        content: content,
        fontSize: this.form.font,
        font: this.form.font + 'px' + ' ' + 'Vedana',
        color: this.colour,
        opacity: this.form.opacity / 100,
        rotateDegree: rotates,
        zIndex: 10000,
        time: this.newData,
        textAlign: textAlign
      }
      return watermarkPreview(option)
    },
    // 实行水印内容
    getCanvasInfo(canvasInfo) {
      let textAlign = ''
      if (canvasInfo.layout) {
        if (canvasInfo.layout == '0') {
          textAlign = 'left'
        } else {
          textAlign = 'right'
        }
      }
      if (canvasInfo.timesOpened == 1) {
        this.newData = ''
      } else {
        this.newData = getFormatDate(new Date()).substr(0, 10)
      }
      let options = {
        className: 'water-mark',
        width: 1920,
        height: 1080,
        fontSize: canvasInfo.size,
        content: canvasInfo.content,
        font: canvasInfo.size + 'px' + ' ' + 'Vedana',
        color: canvasInfo.colour,
        opacity: canvasInfo.clarityLevel * 100,
        rotateDegree: canvasInfo.angle + '',
        zIndex: 10000,
        textAlign: textAlign,
        time: this.newData
      }
      sessionStorage.setItem('waterMark', JSON.stringify(options))
      return genWaterMark(options)
    },
    // 详情
    async getWatermarkSelectService() {
      let res = await this.$api.getWatermarkInfoDetail(this.$parent.waterMarkInfo)
      this.allLoading = true
      if (res.resultCode != 0) return
      const resWatermarkInfo = res.watermarkInfo
      const resTenantListInfo = res.tenantList
      if (resWatermarkInfo) {
        this.form.font = resWatermarkInfo.size
        this.form.opacity = parseInt(resWatermarkInfo.clarityLevel * 100)
        this.form.systemType = resWatermarkInfo.systemType
        this.form.rotate =
          this.form.systemType === 1 ? -resWatermarkInfo.angle : resWatermarkInfo.angle
        this.form.watermarkTypeRadio = resWatermarkInfo.watermarkType + ''
        this.form.layout = resWatermarkInfo.layout != undefined ? resWatermarkInfo.layout + '' : ''
        this.form.content = resWatermarkInfo.content
        // 自定义规则信息
        if (this.form.watermarkTypeRadio == 2 && resWatermarkInfo.content) {
          let ruleName = resWatermarkInfo.content.substring(0, 1)
          this.form.ruleName = ruleName - 1
        }
        //定位
        if (resWatermarkInfo.systemType == 1) {
          this.waterRadio = 1
        } else if (resWatermarkInfo.systemType == 2) {
          this.waterRadio = 2
          this.form.position = resWatermarkInfo.position
        } else if (resWatermarkInfo.systemType == 3) {
          this.waterRadio = 3
          this.form.position = resWatermarkInfo.position
        }
        // this.form.timeLine = resWatermarkInfo.timesOpened == 0 ? true : false
        this.form.timeLine = this.form.layout != '' ? true : false
        if (this.form.timeLine) {
          this.newData = this.dayjs().format('YYYY-MM-DD')
          this.disabledDirection = false
        } else {
          this.newData = ''
          this.disabledDirection = true
        }
        if (this.$parent.operation == 1 || this.$parent.operation == 2) {
          if (resWatermarkInfo.systemType == 1) {
            let url = this.watermarkInfo()
            this.$refs.content.style.background = `url(${url})`
          } else {
            this.getvideoWaterInfo()
          }
        }
        if (this.$parent.operation == 0) {
          this.isSelectRule = 1
        }
        this.allLoading = false
      }
      // 租户详情回显数据
      if (resTenantListInfo) {
        this.detailsTenantList = resTenantListInfo
        this.tenantNameList = this.setSelectValNameList(this.detailsTenantList)
        this.tenantIdList = this.setSelectValIdList(this.detailsTenantList)
        this.tenantRelateIdList = [...this.tenantIdList]
        this.form.tenantCheckedNum =
          this.$t('systemTatermarkManage.selected') +
          [...this.tenantIdList].length +
          this.$t('systemTatermarkManage.tenants')
      }
    },
    // 水印弹窗打开
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      if (!this.$parent.operation == 0) {
        this.getWatermarkSelectService()
      } else {
        let canvasId = document.getElementById('canvas')
        if (canvasId) {
          this.getvideoWaterInfo()
        }
        this.form.rotate = null
        this.form.tenantCheckedNum = ''
        this.form.timeLine = false
      }
    },
    // 水印弹窗关闭
    dialogClosed() {
      // this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.isSelectRule = 1
      this.form.timeLine = false
      this.form.layout = ''
      this.waterRuleName = ''
      this.form.watermarkTypeRadio = '1'
      this.form.ruleName = ''
      this.form.content = ''
      this.form.systemType = ''
      this.tenantNameList = []
      this.tenantIdList = []
      this.tenantRelateIdList = []
      this.detailsTenantList = []
      this.confirmTenantIdList = []
      this.$emit('sysDialogClosed') // 添加租户弹框
      this.watermarkRuleList.forEach(it => (it['disabled'] = false)) // 强制更新水印规则信息下拉框
    },
    // 规则信息
    selectRuleNameChange(val) {
      if (val === 1) {
        this.$t('systemTatermarkManage.userNumber')
        this.triggerPreview()
      } else {
        this.$t('systemTatermarkManage.organizationName')
        this.triggerPreview()
      }
    },
    // 表单提交
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let position = ''
          let content = ''
          let angle = null
          if (this.form.watermarkTypeRadio == 1) {
            content = this.form.content
          } else if (this.form.watermarkTypeRadio == 2) {
            if (this.form.ruleName == 0) {
              content = 1 + ',' + 2
            } else {
              content = 2 + ',' + 3
            }
          }

          if (this.form.systemType == 1) {
            position = 'default'
            angle = -parseInt(this.form.rotate)
          } else {
            position = this.form.position
            angle = 0
          }
          let objwater = {
            watermarkInfo: {
              systemType: this.form.systemType,
              watermarkType: parseInt(this.form.watermarkTypeRadio),
              content,
              position: position,
              layout: this.form.layout != '' ? this.form.layout : null,
              angle,
              clarityLevel: this.form.opacity / 100,
              size: this.form.font,
              timesOpened: this.form.timeLine == true ? 0 : 1
            },
            watermarkId: this.$parent.waterMarkInfo.watermarkId,
            tenantIds: this.tenantRelateIdList
          }
          if (this.$parent.operation == 1) {
            // 编辑
            this.$api
              .updateWatermarkInfo(objwater)
              .then(res => {
                // 判断水印是否存在
                if (this.form.systemType === 1) {
                  this.$api.getContentWatermarkInfo({}).then(res1 => {
                    if (res1.resultCode != 0 || !res1.watermarkInfo) return
                    if (res1.watermarkInfo.status === 0) {
                      // 清除水印
                      removerWaterMark()
                    }
                  })
                }
                this.successResult(res, this.$t('public.modifySuccess'))
              })
              .catch(() => {
                this.$parent.maskloading = false
              })
          } else if (this.$parent.operation == 0) {
            // 添加
            this.$api
              .addWatermarkInfo(
                Object.assign({ tenantIds: this.confirmTenantIdList }, objwater.watermarkInfo)
              )
              .then(res => {
                if (res.isExist == true) {
                  this.$confirm(this.$t('systemTatermarkManage.previousOperation'), {
                    confirmButtonText: this.$t('public.confirm'),
                    cancelButtonText: this.$t('public.cancel'),
                    type: 'warning'
                  })
                } else {
                  this.successResult(res, this.$t('public.addSuccess'))
                }
              })
              .catch(() => {
                this.$parent.maskloading = false
              })
          }
        }
      })
    },
    // 添加和编辑
    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$message({
          type: 'success',
          message: title
        })
        if (this.form.systemType == 1) {
          this.$api.getContentWatermarkInfo({}).then(res1 => {
            if (res1.resultCode != 0 || !res1.watermarkInfo) return
            if (res1.watermarkInfo.status === 0 && res1.watermarkId === res.watermarkId) {
              // 更新水印
              this.getCanvasInfo(res1.watermarkInfo)
            }
          })
        }
        this.$parent.getWatermarkList()
        this.$parent.dialogFormVisible = false
      } else {
        this.$parent.maskloading = false
        this.$parent.dialogFormVisible = false
      }
    },
    // 视频水印
    getvideoWaterInfo() {
      let content = ''
      if (this.form.watermarkTypeRadio == 1) {
        content = this.form.content
      } else if (this.form.watermarkTypeRadio == 2) {
        if (this.form.ruleName == 0) {
          content = this.$t('systemTatermarkManage.organizationName')
        } else {
          content = this.$t('systemTatermarkManage.userNumber')
        }
      }
      let canvas = document.getElementById('canvas')
      if (canvas) {
        let text = content
        let ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.translate(0, 0)
          canvas.width = 680
          canvas.height = 544
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          let textWidth = 0
          ctx.font = this.form.font + 'px' + ' ' + 'Vedana'
          ctx.fillStyle = this.colour + ''
          ctx.globalAlpha = this.form.opacity / 100
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
          ctx.shadowBlur = 10
          ctx.textAlign = 'left'
          if (content) textWidth = ctx.measureText(content).width
          //左上
          if (this.form.position == 'left-top') {
            if (this.form.layout == '0') {
              ctx.fillText(text, 10, this.form.font + 10)
              ctx.fillText(this.newData, 10, this.form.font * 2 + 10 + 7)
            } else {
              ctx.fillText(text, 10, this.form.font + 10)
              ctx.fillText(this.newData, 10 + 10 + ctx.measureText(text).width, this.form.font + 10)
            }
            //左下
          } else if (this.form.position == 'left-down') {
            if (this.form.layout == '0') {
              this.newData
                ? ctx.fillText(text, 10, canvas.height - this.form.font - 10 - 7)
                : ctx.fillText(text, 10, canvas.height - 10)
              ctx.fillText(this.newData, 10, canvas.height - 10)
            } else {
              ctx.fillText(text, 10, canvas.height - 10)
              ctx.fillText(this.newData, 10 + 10 + ctx.measureText(text).width, canvas.height - 10)
            }
            //右上
          } else if (this.form.position == 'right-top') {
            if (this.form.layout == '0') {
              ctx.fillText(
                text,
                canvas.width - ctx.measureText(text).width - 10,
                this.form.font + 10
              )
              ctx.fillText(
                this.newData,
                canvas.width - ctx.measureText(this.newData).width - 10,
                this.form.font * 2 + 10 + 7
              )
            } else {
              ctx.fillText(
                text,
                canvas.width -
                  ctx.measureText(text).width -
                  ctx.measureText(this.newData).width -
                  10 -
                  10,
                this.form.font + 10
              )
              ctx.fillText(
                this.newData,
                canvas.width - ctx.measureText(this.newData).width - 10,
                this.form.font + 10
              )
            }
            //右下
          } else if (this.form.position == 'right-down') {
            if (this.form.layout == '0') {
              this.newData
                ? ctx.fillText(
                    text,
                    canvas.width - ctx.measureText(text).width - 10,
                    canvas.height - this.form.font - 10 - 7
                  )
                : ctx.fillText(
                    text,
                    canvas.width - ctx.measureText(text).width - 10,
                    canvas.height - 10
                  )
              ctx.fillText(
                this.newData,
                canvas.width - ctx.measureText(this.newData).width - 10,
                canvas.height - 10
              )
            } else {
              this.newData
                ? ctx.fillText(
                    text,
                    canvas.width -
                      ctx.measureText(text).width -
                      ctx.measureText(this.newData).width -
                      10 -
                      10,
                    canvas.height - 10
                  )
                : ctx.fillText(
                    text,
                    canvas.width - ctx.measureText(text).width - 10,
                    canvas.height - 10
                  )
              ctx.fillText(
                this.newData,
                canvas.width - ctx.measureText(this.newData).width - 10,
                canvas.height - 10
              )
            }
          } else {
            ctx.strokeText(text, 40, 40)
          }
        }
      }
    },
    // 视频水印定位
    positionInfo(row) {
      let position
      switch (row) {
        case 'left-top':
          position = 20
          break
        case 'left-down':
          position = 20
          break
        case 'right-top':
          position = 300
          break
        case 'right-down':
          position = 300
          break

        default:
          position = ''
          break
      }
      return position
    },
    // 校验
    setFormRules() {}
  }
}
</script>

<style lang="scss">
#system-watermark-add {
  .el-dialog__body {
    padding: 40px;
  }
  .el-slider__runway {
    flex: none;
    width: 67%;
    height: 2px;
    .el-slider__bar {
      height: 2px;
    }
    .el-slider__button-wrapper {
      .el-tooltip {
        position: absolute;
        top: 8px;
      }
    }
  }
  .system-watermark-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .contentLeftNav {
      position: absolute;
      top: 43px;
      left: 350px;
    }
    .contentPosition {
      width: 680px;
      height: 544px;
      position: absolute;
    }
    .contentLeft {
      width: 680px;
      height: 544px;
      border: 1px solid #ccc;
      position: relative;
    }
    .contentCanvas_leftTop {
      width: 340px;
      height: 272px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .contentCanvas_leftDown {
      width: 340px;
      height: 272px;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .contentCanvas_rightTop {
      width: 340px;
      height: 272px;
      position: absolute;
      right: 0;
      top: 0;
    }
    .contentCanvas_rightDown {
      width: 340px;
      height: 272px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .iStyle {
      margin-left: 5px;
      font-size: 16px;
      color: #c1c7d0;
      padding-right: 5px;
    }
    .contentRight {
      width: 450px;
      .leftTitle {
        display: flex;
        align-items: center;
      }
      .tips {
        position: absolute;
        top: 40px;
        i {
          font-size: 16px;
          color: #c1c7d0;
          padding-right: 5px;
        }
        span {
          font-size: 12px;
          color: #c1c7d0;
        }
      }
      .isEng {
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .ruleTips {
        position: absolute;
        top: 40px;
        i {
          font-size: 16px;
          color: #c1c7d0;
          padding-right: 5px;
        }
        span {
          font-size: 12px;
          color: #c1c7d0;
        }
      }
      .el-form-item--small.el-form-item {
        margin-bottom: 23px;
      }

      .el-input__inner {
        height: 28px !important;
      }
      .transparencyBorder {
        border: 1px solid #c1c7d0;
        width: 80px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 5px;
        position: absolute;
        right: 0;
        top: -6px;
      }
      .selectForm {
        position: relative;
        .selectRuleButton {
          position: absolute;
          top: -1px;
          left: 145px;
        }
        .selectRuleLow {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
}
</style>