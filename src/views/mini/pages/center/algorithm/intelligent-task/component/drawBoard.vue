<template>
  <div class="draw_container">
    <div class="draw_sidebar">
      <div
        :class="[
          'draw_rule_item',
          currRuleIndex === index && 'active',
          item.complete && 'complete'
        ]"
        v-for="(item, index) in processedData.extendsData.rule"
        :key="item.ruleId"
        @click="handleDrawRuleClick(item, index)"
      >
        <div class="draw_rule_wrapper">
          <div
            class="draw_rule_img"
            :style="{ backgroundImage: `url(${drawRuleImg(item.ruleType)})` }"
          >
            <div class="draw_rule_img_mask"></div>
          </div>
          <div class="draw_rule_title">
            <span>{{ formatRuleName(item.ruleType) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="draw_content">
      <div class="draw_toolbar">
        <ul class="draw_control">
          <li
            :class="[
              'draw_control_item',
              item.disabled && 'disabled',
              currentRule.drawType === 4 && item.type === 1 && 'with_select'
            ]"
            v-for="(item, index) in btn"
            :key="index"
          >
            <div class="draw_control_content" @click.stop="handleControlBtnClick(item)">
              <svg-icon :icon-class="item.icon" :style="{ color: item.color }"></svg-icon>
              <p :style="{ color: item.disabled ? '#9ca3af' : '#fff' }">
                {{ item.name }}
              </p>
            </div>
            <div v-if="currentRule.drawType === 4 && item.type === 1">
              <el-select v-model="lineDirection" class="drawboard-cover">
                <el-option
                  v-for="item in directionList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="draw_wrapper"
        ref="draw_wrapper"
        v-loading="img_loading"
        :element-loading-text="$t('analysisTask.imgLoading')"
      >
        <canvas ref="canvas" :width="canvas_wh.width" :height="canvas_wh.height">
          {{ $t('analysisTask.notSupportedCanvas') }}
        </canvas>
      </div>
    </div>
    <div class="draw_right">
      <div style="height: 300px; width: 180px; margin-top: 60px; padding-left: 30px">
        <div v-for="(item, index) in processedData.extendsData.rule" :key="item.ruleId">
          <el-form
            v-if="currRuleIndex === index"
            ref="ruleForm"
            :model="ruleForm[formItemIndex(item.ruleType)]"
            :rules="ruleFormRules"
            label-width="100px"
            label-position="left"
          >
            <el-row>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].focusedPart !== undefined"
                :span="24"
              >
                <el-form-item :label="$t('analysisTask.reference')" required>
                  <el-select
                    v-model="ruleForm[formItemIndex(item.ruleType)].focusedPart"
                    :disabled="item.type === 2"
                  >
                    <el-option
                      v-for="item in focusedPartList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].objTypeFilterFlag !== undefined"
                :span="24"
              >
                <el-form-item :label="$t('analysisTask.exclude')">
                  <el-select v-model="ruleForm[formItemIndex(item.ruleType)].objTypeFilterFlag">
                    <el-option
                      v-for="item in filterFlagList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].alarmInterval !== undefined"
                :span="24"
              >
                <el-form-item :label="$t('analysisTask.alarmInterval')">
                  <el-input
                    type="text"
                    :title="$t('analysisTask.alarmIntervalPrompt')"
                    v-model="ruleForm[formItemIndex(item.ruleType)].alarmInterval"
                    @input="
                      handleValueChange($event, 'alarmInterval', formItemIndex(item.ruleType))
                    "
                    @blur="handleValueBlur($event, 'alarmInterval', formItemIndex(item.ruleType))"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].sensitivity !== undefined"
                :span="24"
              >
                <el-form-item :label="$t('analysisTask.sensitivity')">
                  <el-input
                    type="text"
                    :title="$t('analysisTask.sensitivityPrompt')"
                    v-model="ruleForm[formItemIndex(item.ruleType)].sensitivity"
                    @input="handleValueChange($event, 'sensitivity', formItemIndex(item.ruleType))"
                    @blur="handleValueBlur($event, 'sensitivity', formItemIndex(item.ruleType))"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].alarmThreshold !== undefined"
                :span="24"
              >
                <el-form-item
                  :label="$t('analysisTask.alarmThreshold')"
                  :label-width="locale == 'en' ? '120px' : '100px'"
                >
                  <el-input
                    type="text"
                    :title="
                      item.ruleType === 15
                        ? $t('analysisTask.processingDurationPerPersonPrompt')
                        : item.ruleType === 2
                        ? $t('analysisTask.alarmThresholdPrompt')
                        : item.ruleType === 31
                        ? $t('analysisTask.alarmThresholdPrompt1')
                        : $t('analysisTask.alarmThresholdPrompt2')
                    "
                    v-model="ruleForm[formItemIndex(item.ruleType)].alarmThreshold"
                    @input="
                      handleValueChange($event, 'alarmThreshold', formItemIndex(item.ruleType))
                    "
                    @blur="handleValueBlur($event, 'alarmThreshold', formItemIndex(item.ruleType))"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].autoClearFlag !== undefined"
                :span="24"
              >
                <el-form-item
                  :label="$t('analysisTask.autoMarkEarlyMorningCount')"
                  :label-width="locale == 'en' ? '225px' : '120px'"
                >
                  <el-select v-model="ruleForm[formItemIndex(item.ruleType)].autoClearFlag">
                    <el-option
                      v-for="item in autoClearList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="ruleForm[formItemIndex(item.ruleType)].averProcessTime !== undefined"
                :span="24"
              >
                <el-form-item
                  :label-width="locale == 'en' ? '225px' : '100px'"
                  :label="$t('analysisTask.processingDurationPerPerson')"
                >
                  <el-input
                    type="text"
                    :title="$t('analysisTask.processingDurationPerPersonPrompt')"
                    v-model="ruleForm[formItemIndex(item.ruleType)].averProcessTime"
                    @input="
                      handleValueChange($event, 'averProcessTime', formItemIndex(item.ruleType))
                    "
                    @blur="handleValueBlur($event, 'averProcessTime', formItemIndex(item.ruleType))"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Drawboard, { DrawMode, CustomShape } from '@/components/drawBoard/drawBoard.js'
import { get_image_natural_wh } from '@/components/drawBoard/utils.js'
import { fabric } from 'fabric-pure-browser'
import {
  register_arror_draw,
  register_right_draw,
  register_wrong_draw,
  register_aplus_draw,
  register_aminus_draw,
  register_double_line_draw,
  register_positive_line_draw,
  register_reverse_line_draw,
  get_line_draw_path
} from '@/components/drawBoard/custom.js'
const DEFAULT_MODE = null // 默认画笔模式
const DEFAULT_ANGLE = 0 // 默认旋转角度
const DEFAULT_ZOOM = 100 // 默认缩放比例
const DEFAULT_COLOR = '#FF0000' // 默认颜色

// 字体大小
const DEFAULT_FONT_SIZE = 16 // 默认字体大小
const DEFAULT_MAX_FONT_SIZE = 128
const DEFAULT_MIN_FONT_SIZE = 32

// 线宽大小
const DEFAULT_BRUSH_WIDTH = 6
const DEFAULT_MAX_BRUSH_WIDTH = 32
const DEFAULT_MIN_BRUSH_WIDTH = 4
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      draw_content_height: 360,
      canvas_wh: { width: 640, height: 360 },
      init_zoom: DEFAULT_ZOOM / 100,
      color: DEFAULT_COLOR,
      img_loading: false,
      init_state: { img_check: true, data: '' },
      rotate_angle: DEFAULT_ANGLE,
      brush_width: DEFAULT_BRUSH_WIDTH,
      font_size: DEFAULT_FONT_SIZE,
      in_move_mode: false,
      drawboard: null,
      draw_img: [
        require('@/assets/img/common/draw_type1.png'),
        require('@/assets/img/common/draw_type2.png'),
        require('@/assets/img/common/draw_type3.png'),
        require('@/assets/img/common/draw_type4.png')
      ],
      processedData: [],
      currRuleIndex: 0,
      lineDirection: CustomShape.DOUBLELINE,
      ruleForm: []
    }
  },
  computed: {
    rules() {
      // drawType 1: 画区域 2: 画矩形区域 3：画线段   4: 画线段 带类型选择
      return [
        {
          ruleName: this.$t('analysisTask.intrusionDetection'),
          ruleType: 34,
          drawType: 1
        },
        {
          ruleName: this.$t('analysisTask.abnormalSpeedDetection'),
          ruleType: 33,
          drawType: 1
        },
        {
          ruleName: this.$t('analysisTask.tripwireCrossingDetection'),
          ruleType: 1,
          drawType: 4
        },
        {
          ruleName: this.$t('analysisTask.loiteringDetection'),
          ruleType: 15,
          drawType: 1
        },
        {
          ruleName: this.$t('analysisTask.twoWayHeadCounting'),
          ruleType: 4,
          drawType: 3
        },
        {
          ruleName: this.$t('analysisTask.queueLengthDetection'),
          ruleType: 31,
          drawType: 1
        },
        {
          ruleName: this.$t('analysisTask.crowdDensityDetection'),
          ruleType: 2,
          drawType: 2
        },
        {
          ruleName: this.$t('analysisTask.headCountingInArea'),
          ruleType: 32,
          drawType: 1
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
    },
    ruleFormRules() {
      return {}
    },
    currentRule() {
      let currRule = {}
      if (this.processedData.extendsData.rule.length) {
        currRule = this.processedData.extendsData.rule[this.currRuleIndex]
        let rule = this.rules.find(item => item.ruleType === currRule.ruleType)
        rule && (currRule.drawType = rule.drawType)
      }
      return currRule
    },
    btn() {
      return [
        {
          name: this.$t('analysisTask.line'),
          icon: 'draw_line',
          color: '#e81616',
          type: 1,
          disabled: this.currentRule.drawType !== 3 && this.currentRule.drawType !== 4
        },
        {
          name: this.$t('analysisTask.rectangleArea'),
          icon: 'draw_rect',
          color: '#F47070',
          type: 2,
          disabled: this.currentRule.drawType !== 2
        },
        {
          name: this.$t('analysisTask.area'),
          icon: 'draw_polygon',
          color: '#F47070',
          type: 3,
          disabled: this.currentRule.drawType !== 1
        },
        {
          name: this.$t('analysisTask.minObject'),
          icon: 'draw_min',
          color: '#5AF99D',
          type: 4,
          disabled: false
        },
        {
          name: this.$t('analysisTask.maxObject'),
          icon: 'draw_max',
          color: '#4F9EEF',
          type: 5,
          disabled: false
        },
        {
          name: this.$t('analysisTask.rectangleExcludeArea'),
          icon: 'draw_exclude_rect',
          color: '#eccc33',
          type: 6,
          disabled: this.currentRule.ruleType !== 2
        },
        {
          name: this.$t('analysisTask.excludeArea'),
          icon: 'draw_exclude_polygon',
          color: '#eccc33',
          type: 7,
          disabled: this.currentRule.ruleType !== 31 && this.currentRule.ruleType !== 32
        },
        {
          name: this.$t('analysisTask.undo'),
          icon: 'draw_revoke',
          color: '#fff',
          type: 8,
          disabled: false
        },
        {
          name: this.$t('analysisTask.clear'),
          icon: 'draw_clear',
          color: '#fff',
          type: 9,
          disabled: false
        }
      ]
    },
    directionList() {
      return [
        {
          name: this.$t('analysisTask.both'),
          value: CustomShape.DOUBLELINE
        },
        {
          name: this.$t('analysisTask.specified'),
          value: CustomShape.POSITIVELINE
        },
        {
          name: this.$t('analysisTask.theOther'),
          value: CustomShape.REVERSELINE
        }
      ]
    }
  },
  watch: {
    color(newV) {
      if (!this.drawboard) {
        return
      }
      this.drawboard.set_brush({ color: newV, width: this.brush_width })
    },
    formData(val) {
      this.processedData = this.processData()
      this.currRuleIndex = 0
    },
    currRuleIndex: {
      handler: function (newV) {
        let objects = this.drawboard.get_objects()
        // 清除当前画布
        objects.forEach(item => {
          if (item.shape !== CustomShape.MINTARGET && item.shape !== CustomShape.MAXTARGET) {
            this.drawboard.fCanvas.remove(item)
          }
        })
        // 回显下一规则项
        let next_draw_type = this.currentRule.drawType
        switch (next_draw_type) {
          case 1: // 区域
          case 2: // 矩形
            let areaList = this.processedData.extendsData.rule[newV].areaList
            if (areaList?.length) {
              areaList.forEach(item => {
                let points = item.point.map(point => {
                  let xy = point.split(',')
                  return {
                    x: xy[0] * (this.canvas_wh.width / this.init_zoom),
                    y: xy[1] * (this.canvas_wh.height / this.init_zoom)
                  }
                })
                if (points.length) {
                  if (next_draw_type === 1) {
                    let left = this.drawboard.findLeftPaddingForRoof(points)
                    let top = this.drawboard.findTopPaddingForRoof(points)
                    const draw_obj = new fabric.Polygon(points, {
                      left,
                      top,
                      fill: 'rgba(0,0,0,0)',
                      strokeWidth: this.brush_width,
                      stroke: item.areaType === 0 ? '#F47070' : '#eccc33'
                    })
                    draw_obj.set(
                      'shape',
                      item.areaType === 0 ? CustomShape.POLYGON : CustomShape.POLYGONEXCLUDE
                    )
                    this.drawboard.fCanvas.add(draw_obj)
                  } else {
                    let left = points[0].x
                    let top = points[0].y
                    const draw_obj = new fabric.Rect({
                      left,
                      top,
                      fill: 'rgba(0,0,0,0)',
                      width: Math.abs(points[2].x - left),
                      height: Math.abs(points[2].y - top),
                      stroke: item.areaType === 0 ? '#F47070' : '#eccc33',
                      strokeWidth: this.brush_width
                    })
                    draw_obj.set(
                      'shape',
                      item.areaType === 0 ? CustomShape.RECT : CustomShape.RECTEXCLUDE
                    )
                    this.drawboard.fCanvas.add(draw_obj)
                  }
                }
              })
            }
            break
          case 3:
          case 4: // 线段
            let line = this.processedData.extendsData.rule[newV].line
            if (line?.length) {
              line.forEach(item => {
                if (item.lineType === 1) {
                  let points = item.point.map(point => {
                    let xy = point.split(',')
                    return {
                      x: parseFloat((xy[0] * (this.canvas_wh.width / this.init_zoom)).toFixed(5)),
                      y: parseFloat((xy[1] * (this.canvas_wh.height / this.init_zoom)).toFixed(5))
                    }
                  })
                  let { path } = get_line_draw_path(
                    points[0],
                    points[1],
                    this.brush_width,
                    item.direct
                  )
                  let draw_obj = new fabric.Path(path, {
                    stroke: '#e81616',
                    strokeWidth: this.brush_width,
                    fill: 'rgba(0,0,0,0)'
                  })
                  draw_obj.set(
                    'shape',
                    item.direct === 0
                      ? CustomShape.DOUBLELINE
                      : item.direct === 1
                      ? CustomShape.POSITIVELINE
                      : CustomShape.REVERSELINE
                  )
                  draw_obj.set('customPoints', points)
                  this.drawboard.fCanvas.add(draw_obj)
                }
              })
            }
            break
        }
      }
    }
  },
  created() {
    this.processedData = this.processData()
  },
  mounted() {},
  destroyed() {
    if (!this.drawboard) {
      return
    }
    this.drawboard.destroyed()
  },
  methods: {
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
    processData(data = JSON.parse(JSON.stringify(this.formData))) {
      this.ruleForm = data.extendsData.rule
      data.extendsData.rule.forEach(item => {
        delete item.sort
      })
      return data
    },
    async reRenderCanvas() {
      this.drawboard.clear()
      await this.draw_init_state()
    },
    /** 绘制 */
    async draw(src) {
      if (this.init_state.data === src && this.drawboard) {
        return
      }
      const win_height = this.$refs.draw_wrapper.clientHeight
      const win_width = this.$refs.draw_wrapper.clientWidth
      this.canvas_wh = { width: win_width, height: win_height }
      this.draw_content_height = win_height
      this.set_img(src)
    },
    /** 设置图片 */
    async set_img(src, angle = DEFAULT_ANGLE, imgcheck = true) {
      this.img_loading = true
      const img_src = src

      const set_error_img = () => {}
      const finish = () => {
        this.img_loading = false
      }

      try {
        let { width, height } = await get_image_natural_wh(img_src)
        if (width < this.canvas_wh.width) {
          width = this.canvas_wh.width
        }
        if (height < this.canvas_wh.height) {
          height = this.canvas_wh.height
        }

        if (angle === 90 || angle === 270) {
          const tempw = width
          width = height
          height = tempw
        }

        let zoom = 1
        if (width > this.canvas_wh.width) {
          zoom = this.canvas_wh.width / width
          height = height * zoom
        }
        this.init_zoom = zoom

        if (height > this.draw_content_height) {
          this.canvas_wh.height = height
        }

        await this.reset_canvas()
        if (!this.drawboard) {
          finish()
          return
        }
        this.drawboard.set_bg_img({
          src: img_src,
          angle,
          catch: set_error_img,
          finish
        })
        this.drawboard.set_min_zoom(0.2 * zoom)
        this.drawboard.set_max_zoom(3 * zoom)
        this.drawboard.set_zoom(zoom)
      } catch (err) {
        this.reset_canvas()
        set_error_img()
        finish()
      }

      this.init_state.is_img = true
      this.init_state.img_check = imgcheck
      this.init_state.data = src
    },
    async reset_canvas() {
      await this.$nextTick()
      this.destroy_drawboard()
      this.init_drawboard()
    },
    init_drawboard() {
      if (this.drawboard) {
        return
      }
      const $canvas = this.$refs.canvas
      if (!$canvas) {
        return
      }

      this.drawboard = new Drawboard({
        canvas: $canvas,
        brush_color: this.color,
        brush_width: DEFAULT_BRUSH_WIDTH,
        back_event: history => {
          if (!history.length) {
            this.$message.warning(`${this.$t('analysisTask.noRevocableRecord')}`)
            this.draw_init_state()
          }
        },
        zoom_change: zoom => {
          const scale = zoom / this.init_zoom
          const z = parseInt(`${scale * 100}`, 10)
          this.zoom = z
          this.set_zoom_size()
        },
        drag_event: status => {
          if (status) {
            this.in_move_mode = false
          }
        }
      })
      this.register_custom_draw_func()
      this.currRuleIndex = 0
      window.drawboard = this.drawboard
    },
    /** 注册自定义绘图函数 */
    register_custom_draw_func() {
      if (!this.drawboard) {
        return
      }
      register_double_line_draw(CustomShape.DOUBLELINE, this.drawboard)
      register_positive_line_draw(CustomShape.POSITIVELINE, this.drawboard)
      register_reverse_line_draw(CustomShape.REVERSELINE, this.drawboard)
    },
    destroy_drawboard() {
      if (this.drawboard) {
        this.drawboard.destroyed()
      }
      this.drawboard = null
    },
    /** 绘制初始状态 */
    async draw_init_state() {
      if (this.init_state.is_img) {
        await this.set_img(this.init_state.data, this.rotate_angle, this.init_state.img_check)
      }
    },
    /** 按比例设置线宽和字体大小 */
    set_zoom_size() {
      if (!this.drawboard) {
        return
      }
      const zoom = this.zoom / 100
      this.drawboard.set_brush({ width: this.brush_width / zoom })
      this.drawboard.set_font_size(this.font_size / zoom)
    },
    getObjects() {},
    handleControlBtnClick(item) {
      if (!this.drawboard) {
        return
      }
      if (item.disabled) {
        return
      }
      let { type, color } = item

      // 退出移动模式
      if (this.in_move_mode && [8, 9].indexOf(type) === -1) {
        this.in_move_mode = false
      }
      let objects = this.drawboard.get_objects(),
        index = -1

      switch (type) {
        case 1: // 线段
          let shape = CustomShape.DOUBLELINE
          if (this.currentRule.drawType === 4) {
            // 越线检测 方向选择
            shape = this.lineDirection
          }
          index = objects.findIndex(
            item =>
              item.shape === CustomShape.DOUBLELINE ||
              item.shape === CustomShape.POSITIVELINE ||
              item.shape === CustomShape.REVERSELINE
          )
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_custom_draw_func_enable(shape, shape, index)
          break
        case 2: // 矩形
          index = objects.findIndex(item => item.shape === CustomShape.RECT)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.RECT, CustomShape.RECT, index)
          break
        case 3: // 区域 多边形
          index = objects.findIndex(item => item.shape === CustomShape.POLYGON)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.POLYGON, index)
          break
        case 4: // 最小运动目标
          index = objects.findIndex(item => item.shape === CustomShape.MINTARGET)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.RECT, CustomShape.MINTARGET, index)
          break
        case 5: // 最大运动目标
          index = objects.findIndex(item => item.shape === CustomShape.MAXTARGET)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.RECT, CustomShape.MAXTARGET, index)
          break
        case 6: // 矩形排除区域
          index = objects.findIndex(item => item.shape === CustomShape.RECTEXCLUDE)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.RECT, CustomShape.RECTEXCLUDE, index)
          break
        case 7: // 排除区域
          index = objects.findIndex(item => item.shape === CustomShape.POLYGONEXCLUDE)
          this.color = color || DEFAULT_COLOR
          this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.POLYGONEXCLUDE, index)
          break
        case 8: // 撤销
          this.drawboard.back()
          break
        case 9: // 清屏
          this.drawboard.clear()
          this.draw_init_state()
          break
      }
    },
    drawRuleImg(ruleType) {
      let draw_type = this.rules.find(item => item.ruleType === ruleType).drawType
      return this.draw_img[draw_type - 1]
    },
    formatRuleName(ruleType) {
      return this.rules.find(item => item.ruleType === ruleType).ruleName || ''
    },
    handleDrawRuleClick(rule, index) {
      if (!this.drawboard) {
        return
      }

      // 校验最大最小目标
      let objects = this.drawboard.get_objects()
      let minTarget = objects.find(item => item.shape === CustomShape.MINTARGET)
      let maxTarget = objects.find(item => item.shape === CustomShape.MAXTARGET)
      if (!minTarget) {
        this.$message.warning(`${this.$t('analysisTask.setMinObjectPrompt')}`)
        this.$parent.isShowMessage = true
        return
      }
      let minTargetCoords = minTarget.getCoords()
      this.processedData.extendsData.globalAlarm['minSizeWidth'] = parseFloat(
        Math.abs((minTargetCoords[1].x - minTargetCoords[0].x / this.canvas_wh.width).toFixed(5))
      )
      this.processedData.extendsData.globalAlarm['minSizeHeight'] = parseFloat(
        Math.abs((minTargetCoords[3].y - minTargetCoords[0].y / this.canvas_wh.height).toFixed(5))
      )
      if (!maxTarget) {
        this.$message.warning(`${this.$t('analysisTask.setMaxObjectPrompt')}`)
        this.$parent.isShowMessage = true
        return
      }
      let maxTargetCoords = maxTarget.getCoords()
      this.processedData.extendsData.globalAlarm['maxSizeWidth'] = parseFloat(
        Math.abs((maxTargetCoords[1].x - maxTargetCoords[0].x / this.canvas_wh.width).toFixed(5))
      )
      this.processedData.extendsData.globalAlarm['maxSizeHeight'] = parseFloat(
        Math.abs((maxTargetCoords[3].y - maxTargetCoords[0].y / this.canvas_wh.height).toFixed(5))
      )
      // 保存当前规则项数据
      let draw_type = this.currentRule.drawType
      switch (draw_type) {
        case 1: // 区域
          let polygon = objects.find(item => item.shape === CustomShape.POLYGON)
          if (!polygon) {
            this.$message.warning(`${this.$t('analysisTask.drawRequiredPrompt')}`)
            this.$parent.isShowMessage = true
            return
          }
          let polygonPoints = this.$loadash.uniqWith(polygon.points, this.$loadash.isEqual)
          this.processedData.extendsData.rule[this.currRuleIndex]['areaNum'] = 1

          this.processedData.extendsData.rule[this.currRuleIndex]['areaList'] = [
            {
              areaType: 0,
              direct: 0,
              pointNum: polygonPoints.length,
              point: polygonPoints.map(item => {
                return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              })
            }
          ]

          let polygonExclude = objects.find(item => item.shape === CustomShape.POLYGONEXCLUDE)
          if (polygonExclude) {
            let polygonExcludePoints = this.$loadash.uniqWith(
              polygonExclude.points,
              this.$loadash.isEqual
            )
            this.processedData.extendsData.rule[this.currRuleIndex]['areaNum'] = 2

            this.processedData.extendsData.rule[this.currRuleIndex].areaList.push({
              areaType: 1,
              direct: 0,
              pointNum: polygonExcludePoints.length,
              point: polygonExcludePoints.map(item => {
                return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              })
            })
          }

          this.processedData.extendsData.rule[this.currRuleIndex]['complete'] = 1

          break
        case 2: //矩形
          let rect = objects.find(item => item.shape === CustomShape.RECT)
          if (!rect) {
            this.$message.warning(`${this.$t('analysisTask.drawRequiredPrompt')}`)
            this.$parent.isShowMessage = true
            return
          }
          let rectPoints = [rect.aCoords.tl, rect.aCoords.tr, rect.aCoords.br, rect.aCoords.bl]
          this.processedData.extendsData.rule[this.currRuleIndex]['areaNum'] = 1

          this.processedData.extendsData.rule[this.currRuleIndex]['areaList'] = [
            {
              areaType: 0,
              direct: 0,
              pointNum: rectPoints.length,
              point: rectPoints.map(item => {
                return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              })
            }
          ]

          let rectExclude = objects.find(item => item.shape === CustomShape.RECTEXCLUDE)
          if (rectExclude) {
            let rectExcludePoints = [
              rectExclude.aCoords.tl,
              rectExclude.aCoords.tr,
              rectExclude.aCoords.br,
              rectExclude.aCoords.bl
            ]
            this.processedData.extendsData.rule[this.currRuleIndex]['areaNum'] = 2

            this.processedData.extendsData.rule[this.currRuleIndex].areaList.push({
              areaType: 1,
              direct: 0,
              pointNum: rectExcludePoints.length,
              point: rectExcludePoints.map(item => {
                return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              })
            })
          }

          this.processedData.extendsData.rule[this.currRuleIndex]['complete'] = 1

          break
        case 3: // 线段
        case 4:
          if (
            !objects.find(
              item =>
                item.shape === CustomShape.DOUBLELINE ||
                item.shape === CustomShape.POSITIVELINE ||
                item.shape === CustomShape.REVERSELINE
            )
          ) {
            this.$message.warning(`${this.$t('analysisTask.drawRequiredPrompt')}`)
            this.$parent.isShowMessage = true
            return
          }
          let line = objects.find(
            item =>
              item.shape === CustomShape.DOUBLELINE ||
              item.shape === CustomShape.POSITIVELINE ||
              item.shape === CustomShape.REVERSELINE
          )
          this.lineDirection = line.shape
          let linePoints = line.customPoints
          this.processedData.extendsData.rule[this.currRuleIndex]['lineNum'] = 1

          this.processedData.extendsData.rule[this.currRuleIndex]['line'] = [
            {
              lineType: 1,
              direct:
                line.shape === CustomShape.DOUBLELINE
                  ? 0
                  : line.shape === CustomShape.POSITIVELINE
                  ? 1
                  : 2,
              point: linePoints.map(item => {
                return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              })
            }
          ]
          this.processedData.extendsData.rule[this.currRuleIndex]['complete'] = 1

          break
      }

      if (this.currRuleIndex !== index) {
        this.currRuleIndex = index
      }
    },
    submit() {
      let rules = this.processedData.extendsData.rule
      this.handleDrawRuleClick(rules[this.currRuleIndex], this.currRuleIndex)
      let { minSizeWidth, minSizeHeight, maxSizeWidth, maxSizeHeight } =
        this.processedData.extendsData.globalAlarm
      if (!minSizeWidth || !minSizeHeight) {
        this.$message.warning(`${this.$t('analysisTask.setMinObjectPrompt')}`)
        this.$parent.isShowMessage = true
        return
      }
      if (!maxSizeWidth || !maxSizeHeight) {
        this.$parent.isShowMessage = true
        this.$message.warning(`${this.$t('analysisTask.setMaxObjectPrompt')}`)
        return
      }

      for (const rule of rules) {
        let draw_type = this.rules.find(item => item.ruleType === rule.ruleType).drawType
        switch (draw_type) {
          case 1: // 区域
          case 2: // 矩形
            if (!rule.areaList?.length) {
              this.$parent.isShowMessage = true
              this.$message.warning(`${this.$t('analysisTask.drawRequiredPrompt')}`)
              return
            }
            break
          case 3:
          case 4:
            if (!rule.line?.length) {
              this.$parent.isShowMessage = true
              this.$message.warning(`${this.$t('analysisTask.drawRequiredPrompt')}`)
              return
            }
            break
        }
      }
      this.$parent.isShowMessage = false
      this.$emit('change', this.processedData)
    }
  }
}
</script>

<style lang="scss">
.draw_container {
  background-color: #093b5c;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  .el-form-item__label {
    color: #fff !important;
  }
  .el-input__inner {
    border: none !important;
    color: #fff !important;
    background: #0b537e !important;
  }
  .draw_content {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    width: 100%;

    .draw_toolbar {
      width: 100%;
      height: 60px;
      .draw_control {
        width: 100%;
        height: 100%;
        display: flex;
        .draw_control_item {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s linear;
          &.with_select {
            flex: initial;
            padding: 0 10px;
            .el-select {
              width: 80px !important;
              margin-left: 10px;
            }
          }

          .draw_control_content {
            text-align: center;
            color: #000;
            p {
              margin-bottom: 0;
            }
          }

          &:not(.disabled):active {
            color: #019bfd;
            p,
            svg {
              transform: scale(1.1);
            }
          }
          &.disabled {
            cursor: not-allowed;
            color: #9ca3af;
            pointer-events: none;
            .svg-icon {
              color: #9ca3af !important;
            }
          }
        }
      }
    }

    .draw_wrapper {
      flex: 1 1 0;
    }
  }

  .draw_sidebar {
    width: 15%;
    .draw_rule_item {
      padding: 10px;
      box-sizing: border-box;
      &.active {
        background-color: #0c4e78;
      }
      &.complete .draw_rule_img_mask {
        height: 100%;
        width: 100%;
        background: rgba(96, 165, 250, 0.4);
      }
      .draw_rule_wrapper {
        width: 100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow:
          0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);

        .draw_rule_img {
          width: 100%;
          height: 50px;
          position: relative;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .draw_rule_title {
          width: 100%;
          text-align: center;
          color: #fff;
          background: #186699;
        }
      }
    }
  }
  .draw_right {
    width: 20%;
  }
}
</style>
