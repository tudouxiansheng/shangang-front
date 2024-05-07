<template>
  <div id="behavior-analysis">
    <el-checkbox-group v-model="selRules" @change="handleRuleTypeChange">
      <div class="rule-line-item" v-for="(item, index) in rules" :key="index">
        <el-checkbox
          class="rule-checkbox"
          :label="item.ruleType"
          :disabled="ruleCheckboxDisabled(item.type)"
          :style="{ width: locale == 'en' ? '190px' : '120px' }"
        >
          {{ item.ruleName }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <draw-board
      v-show="ruleForm.length"
      ref="drawboard"
      :form-data="processForm"
      @change="handleFormChange"
    />
    <el-dialog
      :title="$t('analysisTask.advancedRuleSettings')"
      v-model="globalAlarmVisible"
      top="15vh"
      width="650px"
      :close-on-click-modal="false"
      @open="globalAlarmDialogOpen"
      :modal="false"
      draggable
    >
      <el-form ref="globalAlarmForm" :model="globalAlarmFormTemp" label-position="top">
        <el-form-item>
          <template #label>
            <p>
              {{ $t('analysisTask.detSensitivity') }}
              <span class="label-desc">
                {{
                  `(0:${$t('analysisTask.low')} 1:${$t('analysisTask.medium')} 2:${$t(
                    'analysisTask.high'
                  )} 3:${$t('analysisTask.lower')} 4:${$t('analysisTask.lowest')})`
                }}
              </span>
            </p>
          </template>

          <el-slider
            v-model="globalAlarmFormTemp.detSensitivity"
            :min="0"
            :max="4"
            :step="1"
            :marks="detSensitivityMarks"
            show-stops
            show-input
          ></el-slider>
        </el-form-item>
        <el-form-item :label="$t('analysisTask.backgroundRefreshRate')">
          <el-input-number
            v-model="globalAlarmFormTemp.backgroundUpdateRate"
            :min="0"
            :max="5"
            :step="1"
            step-strictly
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="globalAlarmVisible = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitGlobalAlarmForm">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { generateUuid } from '@/utils/common/utils'
import DrawBoard from './drawBoard'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    url: {
      type: String,
      default: ''
    }
  },
  components: {
    DrawBoard
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      step: 0,
      ruleForm: [],
      selRules: [],
      globalAlarmVisible: false,
      globalAlarmForm: {
        minSizeWidth: undefined,
        minSizeHeight: undefined,
        maxSizeWidth: undefined,
        maxSizeHeight: undefined,
        detSensitivity: 2,
        backgroundUpdateRate: 1
      },
      globalAlarmFormTemp: {
        minSizeWidth: undefined,
        minSizeHeight: undefined,
        maxSizeWidth: undefined,
        maxSizeHeight: undefined,
        detSensitivity: 2,
        backgroundUpdateRate: 1
      },
      detSensitivityMarks: {
        0: '0',
        2: '2',
        4: '4'
      },
      isShowMessage: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    processForm() {
      return {
        ...this.data,
        ...{
          extendsData: {
            rule: this.ruleForm,
            globalAlarm: this.globalAlarmForm
          }
        }
      }
    },
    ruleFormRules() {
      return {}
    },
    rules() {
      return [
        {
          ruleName: this.$t('analysisTask.intrusionDetection'),
          ruleType: 34,
          type: 1
        },
        {
          ruleName: this.$t('analysisTask.abnormalSpeedDetection'),
          ruleType: 33,
          type: 1
        },
        {
          ruleName: this.$t('analysisTask.tripwireCrossingDetection'),
          ruleType: 1,
          type: 1
        },
        {
          ruleName: this.$t('analysisTask.loiteringDetection'),
          ruleType: 15,
          type: 1
        },
        {
          ruleName: this.$t('analysisTask.twoWayHeadCounting'),
          ruleType: 4,
          type: 2
        },
        {
          ruleName: this.$t('analysisTask.queueLengthDetection'),
          ruleType: 31,
          type: 2
        },
        {
          ruleName: this.$t('analysisTask.crowdDensityDetection'),
          ruleType: 2,
          type: 2
        },
        {
          ruleName: this.$t('analysisTask.headCountingInArea'),
          ruleType: 32,
          type: 2
        }
      ]
    },
    focusedPartList() {
      return [
        {
          name: this.$t('analysisTask.targetCenter'),
          value: 0
        },
        {
          name: this.$t('analysisTask.bottomCenter'),
          value: 1
        },
        {
          name: this.$t('analysisTask.topCenter'),
          value: 2
        }
      ]
    },
    filterFlagList() {
      return [
        {
          name: this.$t('analysisTask.none'),
          value: 0
        },
        {
          name: this.$t('analysisTask.vehicle'),
          value: 6
        },
        {
          name: this.$t('analysisTask.person'),
          value: 1
        }
      ]
    },
    autoClearList() {
      return [
        {
          name: this.$t('analysisTask.no'),
          value: 0
        },
        {
          name: this.$t('analysisTask.yes'),
          value: 1
        }
      ]
    },
    formItemIndex() {
      return ruleType => {
        return this.ruleForm.findIndex(form => form.ruleType === ruleType)
      }
    },
    formItemVisible() {
      return ruleType => {
        return this.ruleForm.findIndex(form => form.ruleType === ruleType) !== -1
      }
    },
    formItemModel() {
      return ruleType => {
        return this.ruleForm[this.ruleForm.findIndex(form => form.ruleType === ruleType)]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.setDialogCss()
      this.processData()
    })
  },
  watch: {
    step(newV) {
      if (newV === 1) {
        this.$nextTick(() => {
          this.getCover()
        })
      }
    },
    ruleForm(newV) {
      this.getCover()
      if (newV.length == 0) {
        this.$refs.drawboard.reRenderCanvas()
      }
    }
  },
  methods: {
    processData(data = JSON.parse(JSON.stringify(this.data))) {
      if (data.extendsData) {
        this.ruleForm = data.extendsData.rule
        this.globalAlarmForm = data.extendsData.globalAlarm
        if (this.ruleForm.length) {
          this.selRules = this.ruleForm.map(item => item.ruleType)
        }
      }
      return data
    },
    previousStep() {
      if (this.step > 0) this.step--
    },
    nextStep() {
      if (this.step === 0 && !this.ruleForm.length) {
        this.$message.warning(`${this.$t('analysisTask.selectAnalysisTypePrompt')}`)
        return
      }
      if (this.step === 1) {
        const drawboard = this.$refs.drawboard
        if (!drawboard) {
          return
        }
        let Objects = drawboard.getObjects()

        return
      }
      if (this.step < 1) this.step++
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.processData()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
      this.ruleForm = []
      this.selRules = []
      this.globalAlarmForm = {
        minSizeWidth: undefined,
        minSizeHeight: undefined,
        maxSizeWidth: undefined,
        maxSizeHeight: undefined,
        detSensitivity: 2,
        backgroundUpdateRate: 1
      }
      this.step = 0
    },
    handleValueChange(val, prop, index) {
      this.$nextTick(() => {
        if (this.ruleForm[index].ruleType === 2) {
          if (isNaN(val)) {
            val = val.substr(0, val.length - 1)
          }
          if (Number(val) > 1) {
            val = '0'
          }
          if (val.charAt(0) === '0' && val.charAt(1) !== '.') {
            val = '0'
          }
          if (val.charAt(1) === '.' && val.length > 6) {
            val = val.slice(0, val.indexOf('.' + 5))
          }
        } else {
          if (/^\D*$/.test(val) && val !== '') {
            // 输入的内容都是非数字时，输入框设置缺省值
            switch (prop) {
              case 'alarmInterval':
              case 'averProcessTime':
                val = 1
                break
              case 'sensitivity':
              case 'alarmThreshold':
                val = 0
                break
            }
          } else {
            if (!/^\d*$/.test(val)) {
              // 去除非数字的字符
              val = parseInt(val.replace(/[^\d]/g, ''))
            }
            if (val === '') {
              val = ''
            } else {
              switch (prop) {
                case 'alarmInterval':
                  // 超过1200默认显示1200
                  val = parseInt(val) > 1200 ? 1200 : parseInt(val)
                  val <= 0 && (val = 1)
                  break
                case 'sensitivity':
                  val = parseInt(val) > 100 ? 100 : parseInt(val)
                  val < 0 && (val = 0)
                  break
                case 'alarmThreshold':
                  val = parseInt(val) > 9999 ? 9999 : parseInt(val)
                  val < 0 && (val = 0)
                  break
                case 'averProcessTime':
                  val = parseInt(val) > 9999 ? 9999 : parseInt(val)
                  val <= 0 && (val = 1)
                  break
              }
            }
          }
        }
        this.ruleForm[index][prop] = val
      })
    },
    handleValueBlur(event, prop, index) {
      let val = event.target.value
      let alarmIntervalReg = /^([1-9]|[1-9]\d|[1-9]\d\d|1[0-1]\d\d|1200)$/,
        sensitivityReg = /^([1-9]|[1-9]\d|100)$/,
        alarmThresholdReg = /^([1-9]|[1-9]\d|[1-9]\d\d|[1-9]\d\d\d)$/
      if (val === '' || !eval(`${prop}Reg.test(val)`)) {
        if (isNaN(val) || val === '') {
          switch (prop) {
            case 'alarmInterval':
              val = 1
              break
            case 'sensitivity':
            case 'alarmThreshold':
              val = 0
          }
          this.ruleForm[index][prop] = val
        }
      }
    },
    handleRuleTypeChange(val) {
      if (val.length) {
        this.ruleForm = this.ruleForm.filter(item => val.includes(item.ruleType))
        val.forEach(ruleType => {
          let index = this.ruleForm.findIndex(form => form.ruleType === ruleType)
          if (index === -1) {
            switch (ruleType) {
              case 34:
                // 入侵检测
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  objTypeFilterFlag: 0,
                  alarmInterval: 2,
                  sort: 0
                })
                break
              case 1:
                // 越线检测
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  objTypeFilterFlag: 0,
                  alarmInterval: 2,
                  sort: 3
                })
                break
              case 33:
                // 快速移动
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  objTypeFilterFlag: 0,
                  alarmInterval: 2,
                  sensitivity: 50,
                  sort: 1
                })
                break
              case 15:
                // 徘徊检测
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  objTypeFilterFlag: 0,
                  alarmInterval: 2,
                  alarmThreshold: 10,
                  sort: 2
                })
                break
              case 4:
                // 过线统计
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  alarmThreshold: 10,
                  autoClearFlag: 0,
                  sort: 4
                })
                break
              case 31:
                // 排队长度
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  alarmInterval: 2,
                  alarmThreshold: 10,
                  averProcessTime: 1,
                  sort: 5
                })
                break
              case 2:
                // 区域人群密度
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  alarmInterval: 2,
                  alarmThreshold: 0.5,
                  sort: 6
                })
                break
              case 32:
                // 区域人群数量
                this.ruleForm.push({
                  ruleType: ruleType,
                  focusedPart: 0,
                  alarmInterval: 2,
                  alarmThreshold: 10,
                  sort: 7
                })
                break
            }
          }
          this.ruleForm.sort((a, b) => a.sort - b.sort)
        })
        this.nextStep()
      } else {
        this.ruleForm = []
      }
    },
    // 判断规则多选框是否禁用
    ruleCheckboxDisabled(type) {
      if (this.ruleForm.length > 0) {
        return this.rules.find(item => item.ruleType === this.ruleForm[0].ruleType).type !== type
      } else {
        return false
      }
    },
    globalAlarmDialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
      this.globalAlarmFormTemp = JSON.parse(JSON.stringify(this.globalAlarmForm))
    },
    submitGlobalAlarmForm() {
      this.globalAlarmVisible = false
      this.globalAlarmForm = JSON.parse(JSON.stringify(this.globalAlarmFormTemp))
    },
    getCover() {
      const drawboard = this.$refs.drawboard
      if (!drawboard) {
        return
      }
      drawboard.draw(this.url)
    },
    submitForm() {
      if (this.ruleForm.length == 0) {
        return
      }
      this.$refs.drawboard.submit()
    },
    handleFormChange(form) {
      this.ruleForm = form.extendsData.rule
      this.globalAlarmForm = Object.assign({}, this.globalAlarmForm, form.extendsData.globalAlarm)
      this.$emit('change', this.processForm)
    }
  }
}
</script>

<style lang="scss">
#behavior-analysis {
  .el-dialog__body {
    padding: 15px 20px 5px;
    max-height: initial;
  }

  .el-steps {
    width: 100%;
    margin-bottom: 20px;
  }
  .el-step__icon.is-text {
    width: 68px;
    height: 68px;
    background: transparent;
  }
  .el-step.is-center .el-step__line {
    left: 60%;
    right: -40%;
    top: 33px;
  }
  .el-step__head.is-process .el-step__icon.is-text {
    border-color: #64befd !important;
    color: #64befd;
  }
  .el-step__title.is-process {
    color: #64befd;
  }
  .el-step__title.is-success {
    color: #ccc;
  }
  .el-step__head.is-success .el-step__icon.is-text {
    border-color: #64befd !important;
    background: #64befd;
  }
  .el-step__head.is-success {
    border-color: #bfbfbf;
  }
  .el-step__icon-inner {
    font-size: 20px;
  }
  .el-date-editor .el-range-separator {
    color: #4d4d4d;
  }
  .el-range-input {
    color: #262626;
  }
  .el-icon-check:before {
    color: #fff;
  }
  .el-icon-success:before {
    color: #67c23a;
  }

  .form-title {
    position: relative;
    margin: 20px 0 20px 10px;
    font-size: 16px;
    &:before {
      content: '';
      width: 2px;
      height: 16px;
      position: absolute;
      left: -10px;
      top: 2.5px;
      bottom: 0;
      background-color: #00a1ff;
    }
    > span {
      margin-left: 10px;
      font-size: 12px;
      color: #c0c4cc;
    }
    .el-button {
      float: right;
    }
  }
  .el-checkbox-group {
    display: flex;
  }
  .rule-line-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: 100%;
    .el-form {
      flex: 1 1 0;
    }

    .rule-checkbox {
      width: 120px;
      height: 52px;
      line-height: 30px;
      color: #fff;
    }
  }

  .el-form-item__label {
    color: #1a1a1a;
  }

  .el-input__inner {
    border: 1px solid #aaaaaa;
    background: #ffffff;
    color: #666666;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #eaeaea;
    border-color: #eaeaea;
    color: #666666;
  }

  .label-desc {
    color: #c0c4cc;
    font-size: 12px;
  }
}
</style>
