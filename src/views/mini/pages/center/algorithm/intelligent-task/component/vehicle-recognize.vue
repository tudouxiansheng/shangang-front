<template>
  <div class="draw_container">
    <div class="draw_content">
      <div class="draw_toolbar" style="display: flex">
        <ul class="draw_control" style="width: 80%; padding: 10px">
          <li class="draw_control_item" v-for="(item, index) in btn" :key="index">
            <div
              class="draw_control_content"
              @click.stop="handleControlBtnClick(item)"
              style="color: #fff"
              :style="{
                cursor: item.disabled ? 'default' : 'pointer'
              }"
            >
              <svg-icon
                :icon-class="item.icon"
                :style="{ color: item.disabled ? '#9ca3af' : item.color }"
              ></svg-icon>
              <p :style="{ color: item.disabled ? '#9ca3af' : '#fff' }">
                {{ item.name }}
              </p>
            </div>
            <div v-if="item.type === 1" style="width: 90px; margin-left: 10px">
              <el-select v-model="lineDirection" :disabled="item.disabled" class="drawboard-cover">
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
        <div
          style="width: 20%; color: #fff; text-align: right; margin-top: 32px; padding-right: 10px"
          v-if="templateRule2.roi != undefined && templateRule2.roi.status == 1"
        >
          <el-tooltip
            v-if="templateRule2.roi.num === 5"
            class="item"
            effect="dark"
            :content="$t('algoTemplate.region5')"
            placement="top-start"
          >
            <p class="item-num">{{ $t('algoTemplate.region5') }}&nbsp;&nbsp;</p>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" placement="top-start">
            <template #content>
              <div>
                {{ $t('algoTemplate.maximumSupport') }}&nbsp;&nbsp;
                <span style="color: #409eff">{{ templateRule2.roi.num }}</span>
                &nbsp;&nbsp;{{ $t('algoTemplate.region2') }}
              </div>
            </template>

            <p class="item-num">
              {{ $t('algoTemplate.maximumSupport') }}&nbsp;&nbsp;
              <span style="color: #409eff">{{ templateRule2.roi.num }}</span>
              &nbsp;&nbsp;{{ $t('algoTemplate.region2') }}
            </p>
          </el-tooltip>
        </div>
      </div>
      <div
        class="draw_wrapper"
        ref="draw_wrapper"
        v-loading="img_loading"
        :element-loading-text="$t('analysisTask.imgLoading')"
      >
        <div class="question_mark" v-if="templateRule2.remark">
          <el-tooltip
            class="tip-item"
            popper-class="tip-item-popper"
            effect="dark"
            :content="templateRule2.remark"
            placement="left"
          >
            <el-icon><el-icon-question /></el-icon>
          </el-tooltip>
        </div>
        <canvas
          class="video_board_canvas"
          ref="canvas"
          :width="canvas_wh.width"
          :height="canvas_wh.height"
        >
          {{ $t('analysisTask.notSupportedCanvas') }}
        </canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { QuestionFilled as ElIconQuestion } from '@element-plus/icons-vue'
import Drawboard, { DrawMode, CustomShape } from '@/components/drawBoard/drawBoard.js'
import { get_line_draw_path } from '@/components/drawBoard/custom.js'
import { get_image_natural_wh } from '@/components/drawBoard/utils.js'
import { randomNum } from '@/utils/common/utils'

import { fabric } from 'fabric-pure-browser'
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
  components: {
    ElIconQuestion
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      templateRule: {},
      draw_content_height: 450,
      canvas_wh: { width: 800, height: 450 },
      init_zoom: DEFAULT_ZOOM / 100,
      color: DEFAULT_COLOR,
      img_loading: false,
      init_state: { img_check: true, data: '' },
      rotate_angle: DEFAULT_ANGLE,
      brush_width: DEFAULT_BRUSH_WIDTH,
      font_size: DEFAULT_FONT_SIZE,
      drawboard: null,
      processedData: [],
      lineDirection: CustomShape.LINE,
      areaNum: 0,
      isShowMessage: false,
      directionList: [],
      player: null,
      videoInfo: null
    }
  },
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
    },
    templateRule2: {
      type: Object,
      default: () => ({})
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
    playerStyle() {
      return {
        width: this.canvas_wh.width + 'px',
        height: this.canvas_wh.height + 'px'
      }
    },
    btn() {
      return [
        {
          name: this.$t('analysisTask.line'),
          icon: 'draw_line',
          color: '#e81616',
          type: 1,
          disabled: this.templateRule2.line == undefined
        },
        {
          name: this.$t('algoTemplate.identificationArea'),
          icon:
            this.templateRule2.roi == undefined
              ? 'draw_rect'
              : this.templateRule2.roi && this.templateRule2.roi.type == 0
              ? 'draw_rect'
              : 'draw-polygon2',
          color: '#7072f4',
          type: 2,
          disabled: this.templateRule2.roi == undefined || this.templateRule2.roi.status == 0
        },
        {
          name: this.$t('algoTemplate.exclusionArea'),
          icon:
            this.templateRule2.nRoi == undefined
              ? 'draw_rect'
              : this.templateRule2.nRoi && this.templateRule2.nRoi.type == 0
              ? 'draw_rect'
              : 'draw-polygon2',
          color: '#F47070',
          type: 3,
          disabled: this.templateRule2.nRoi == undefined || this.templateRule2.nRoi.status == 0
        },
        {
          name: this.$t('algoTemplate.minimumTarget'),
          icon:
            this.templateRule2.minTarget == undefined
              ? 'draw_rect'
              : this.templateRule2.minTarget && this.templateRule2.minTarget.type == 0
              ? 'draw_rect'
              : 'draw-polygon2',
          color: '#5AF99D',
          type: 4,
          disabled:
            this.templateRule2.minTarget == undefined || this.templateRule2.minTarget.status == 0
        },
        {
          name: this.$t('algoTemplate.maximumTarget'),
          icon:
            this.templateRule2.maxTarget == undefined
              ? 'draw_rect'
              : this.templateRule2.maxTarget && this.templateRule2.maxTarget.type == 0
              ? 'draw_rect'
              : 'draw-polygon2',
          color: '#4F9EEF',
          type: 5,
          disabled:
            this.templateRule2.maxTarget == undefined || this.templateRule2.maxTarget.status == 0
        },
        {
          name: this.$t('analysisTask.clear'),
          icon: 'draw_clear',
          color: '#fff',
          type: 9,
          disabled: false
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
    data: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.processedData = this.processData()
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.templateRule2.line) {
        this.directionList = []
        let type = this.templateRule2.line.type
        if (type % 2 == 1) {
          this.directionList.push({
            name: this.$t('algoTemplate.noDirection'),
            value: CustomShape.LINE
          })
        }
        if ((type >> 3) % 2 == 1) {
          this.directionList.push({
            name: this.$t('analysisTask.both'),
            value: CustomShape.DOUBLELINE
          })
        }
        if ((type >> 1) % 2 == 1) {
          this.directionList.push({
            name: this.$t('analysisTask.specified'),
            value: CustomShape.POSITIVELINE
          })
        }
        if ((type >> 2) % 2 == 1) {
          this.directionList.push({
            name: this.$t('analysisTask.theOther'),
            value: CustomShape.REVERSELINE
          })
          this.lineDirection = this.directionList[0].value
        }
      }
      this.setDialogCss()
      this.processedData = this.processData()
      this.createPlayer()
    })
  },
  methods: {
    createPlayer() {
      this.videoInfo = {
        encType: 'H265(HEVC)',
        height: 1080,
        width: 1920
      }
      this.initDrawboard(this.videoInfo)
    },
    async reLoadCanvas() {
      this.drawboard.clear()
      await this.draw_init_state()
      let areas = []
      let minTarget = this.processedData.minCarFrame.criteria.area
      minTarget.length && (areas = areas.concat(minTarget))
      let maxTarget = this.processedData.maxCarFrame.criteria.area
      maxTarget.length && (areas = areas.concat(maxTarget))
      let region = this.processedData.regionInfo[0].criteria.area
      region.length && (areas = areas.concat(region))
      areas.forEach(item => {
        let points = item.point.map(point => {
          let xy = point.split(',')
          return {
            x: xy[0] * (this.canvas_wh.width / this.init_zoom),
            y: xy[1] * (this.canvas_wh.height / this.init_zoom)
          }
        })
        if (points.length) {
          if (item.shape === 108) {
            let left = this.drawboard.findLeftPaddingForRoof(points)
            let top = this.drawboard.findTopPaddingForRoof(points)
            const draw_obj = new fabric.Polygon(points, {
              left,
              top,
              fill: 'rgba(0,0,0,0)',
              strokeWidth: this.brush_width,
              stroke:
                item.type === 18
                  ? '#4F9EEF'
                  : item.type === 19
                  ? '#5AF99D'
                  : item.type === 26
                  ? '#7072f4'
                  : '#F47070'
            })
            draw_obj.set(
              'shape',
              item.type === 18
                ? CustomShape.MAXTARGET
                : item.type === 19
                ? CustomShape.MINTARGET
                : item.type === 26
                ? CustomShape.POLYGON
                : CustomShape.POLYGONEXCLUDE
            )
            this.drawboard.fCanvas.add(draw_obj)
          } else if (item.shape === 106) {
            let left = points[0].x
            let top = points[0].y
            const draw_obj = new fabric.Rect({
              left,
              top,
              fill: 'rgba(0,0,0,0)',
              width: Math.abs(points[2].x - left),
              height: Math.abs(points[2].y - top),
              stroke:
                item.type === 18
                  ? '#4F9EEF'
                  : item.type === 19
                  ? '#5AF99D'
                  : item.type === 26
                  ? '#7072f4'
                  : '#F47070',
              strokeWidth: this.brush_width
            })
            draw_obj.set(
              'shape',
              item.type === 18
                ? CustomShape.MAXTARGET
                : item.type === 19
                ? CustomShape.MINTARGET
                : item.type === 26
                ? CustomShape.POLYGON
                : CustomShape.POLYGONEXCLUDE
            )
            this.drawboard.fCanvas.add(draw_obj)
          } else {
            let points = item.point.map(point => {
              let xy = point.split(',')
              return {
                x: parseFloat((xy[0] * (this.canvas_wh.width / this.init_zoom)).toFixed(5)),
                y: parseFloat((xy[1] * (this.canvas_wh.height / this.init_zoom)).toFixed(5))
              }
            })
            let draw_obj
            if (item.direct === 0) {
              draw_obj = new fabric.Line([points[0].x, points[0].y, points[1].x, points[1].y], {
                stroke: '#e81616',
                strokeWidth: this.brush_width
              })
            } else {
              let { path } = get_line_draw_path(
                points[0],
                points[1],
                this.brush_width,
                item.direct == 2 ? 1 : item.direct == 1 ? 2 : item.direct
              )
              draw_obj = new fabric.Path(path, {
                stroke: '#e81616',
                strokeWidth: this.brush_width,
                fill: 'rgba(0,0,0,0)'
              })
            }
            draw_obj.set(
              'type',
              item.direct === 0
                ? CustomShape.LINE
                : item.direct === 3
                ? CustomShape.DOUBLELINE
                : item.direct === 1
                ? CustomShape.REVERSELINE
                : CustomShape.POSITIVELINE
            )
            draw_obj.set('x1', points[0].x)
            draw_obj.set('x2', points[1].x)
            draw_obj.set('y1', points[0].y)
            draw_obj.set('y2', points[1].y)
            draw_obj.set('customPoints', points)
            this.drawboard.fCanvas.add(draw_obj)
          }
        }
      })
    },
    destroyPlayer() {
      this.createPlayer()
    },
    async initDrawboard(data) {
      if (this.drawboard) {
        return
      }
      this.loading = true
      try {
        let { width, height } = data
        let wh_ratio = width / height
        this.init_zoom = this.canvas_wh.width / width
        this.canvas_wh.height = this.canvas_wh.width / wh_ratio
        await this.reset_canvas()
        if (!this.drawboard) {
          return
        }
        this.drawboard.set_zoom(this.init_zoom)
      } catch (err) {
        this.reset_canvas()
      } finally {
        this.loading = false
      }
    },
    processData(data = JSON.parse(JSON.stringify(this.data))) {
      if (!data.minCarFrame) {
        data.minCarFrame = {
          criteria: {
            area: []
          }
        }
      }
      if (!data.maxCarFrame) {
        data.maxCarFrame = {
          criteria: {
            area: []
          }
        }
      }
      if (!data.regionInfo) {
        data.regionInfo = [
          {
            criteria: {
              area: []
            }
          }
        ]
      }

      return data
    },
    async reRenderCanvas() {
      this.drawboard.clear()
      await this.draw_init_state()
      let areas = []
      let minTarget = this.processedData.minCarFrame.criteria.area
      minTarget.length && (areas = areas.concat(minTarget))
      let maxTarget = this.processedData.maxCarFrame.criteria.area
      maxTarget.length && (areas = areas.concat(maxTarget))
      let region = this.processedData.regionInfo[0].criteria.area
      region.length && (areas = areas.concat(region))
      areas.forEach(item => {
        let points = item.point.map(point => {
          let xy = point.split(',')
          return {
            x: xy[0] * (this.canvas_wh.width / this.init_zoom),
            y: xy[1] * (this.canvas_wh.height / this.init_zoom)
          }
        })
        if (points.length) {
          if (item.shape === 108) {
            let left = this.drawboard.findLeftPaddingForRoof(points)
            let top = this.drawboard.findTopPaddingForRoof(points)
            const draw_obj = new fabric.Polygon(points, {
              left,
              top,
              fill: 'rgba(0,0,0,0)',
              strokeWidth: this.brush_width,
              stroke: '#F47070'
            })
            draw_obj.set('shape', CustomShape.POLYGON)
            this.drawboard.fCanvas.add(draw_obj)
          } else if (item.shape === 106) {
            let left = points[0].x
            let top = points[0].y
            const draw_obj = new fabric.Rect({
              left,
              top,
              fill: 'rgba(0,0,0,0)',
              width: Math.abs(points[2].x - left),
              height: Math.abs(points[2].y - top),
              stroke: item.type === 18 ? '#4F9EEF' : item.type === 19 ? '#5AF99D' : '#7072f4',
              strokeWidth: this.brush_width
            })
            draw_obj.set(
              'shape',
              item.type === 18
                ? CustomShape.MAXTARGET
                : item.type === 19
                ? CustomShape.MINTARGET
                : CustomShape.RECT
            )
            this.drawboard.fCanvas.add(draw_obj)
          }
        }
      })
    },
    /** 绘制 */
    async draw(src, reload = false) {
      if (this.init_state.data === src && this.drawboard && !reload) {
        await this.reRenderCanvas()
        return
      }
      const win_height = this.$refs.draw_wrapper.clientHeight
      const win_width = this.$refs.draw_wrapper.clientWidth
      this.canvas_wh = { width: win_width, height: win_height }
      this.draw_content_height = win_height
      await this.set_img(src)
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
        background_color: '#fff',
        back_event: history => {
          if (!history.length) {
            this.$message.warning(`${this.$t('analysisTask.noRevocableRecord')}`)
            this.draw_init_state()
          }
        }
      })
      this.currRuleIndex = 0
      // 画板初始化完成
      this.$nextTick(() => {
        this.$emit('board-mounted')
      })
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
    getObjects() {
      return this.drawboard.get_objects()
    },
    handleControlBtnClick(item) {
      if (!this.drawboard) {
        return
      }
      if (item.disabled) {
        return
      }
      let { type, color } = item

      let objects = this.getObjects(),
        index = -1,
        rois = []

      switch (type) {
        case 1: // 直线
          rois = objects.filter(
            item =>
              item.shape === CustomShape.LINE ||
              item.shape === CustomShape.DOUBLELINE ||
              item.shape === CustomShape.POSITIVELINE ||
              item.shape === CustomShape.REVERSELINE
          )
          this.color = color || DEFAULT_COLOR
          if (this.lineDirection == CustomShape.LINE) {
            this.drawboard.set_mode(DrawMode.LINE)
          } else if (this.lineDirection == CustomShape.DOUBLELINE) {
            this.drawboard.set_mode(DrawMode.DOUBLELINE)
          } else if (this.lineDirection == CustomShape.POSITIVELINE) {
            this.drawboard.set_mode(DrawMode.POSITIVELINE)
          } else if (this.lineDirection == CustomShape.REVERSELINE) {
            this.drawboard.set_mode(DrawMode.REVERSELINE)
          }
          break
        case 2: // 识别区域
          rois = objects.filter(item => item.shape === CustomShape.POLYGON)
          if (this.templateRule2.roi.num != 5 && rois?.length === this.templateRule2.roi.num) {
            this.$message.warning(
              this.$t('algoTemplate.mostIdentificationArea', {
                num: this.templateRule2.roi.num
              })
            )
            return
          }
          this.color = color || DEFAULT_COLOR
          if (this.templateRule2.roi.type == 0) {
            this.drawboard.set_mode(DrawMode.RECT, CustomShape.POLYGON)
          } else {
            this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.POLYGON)
          }
          break
        case 3: // 排除区域
          rois = objects.filter(item => item.shape === CustomShape.POLYGONEXCLUDE)
          if (rois?.length === this.templateRule2.nRoi.num) {
            this.$message.warning(
              this.$t('algoTemplate.mostExclusionArea', {
                num: this.templateRule2.nRoi.num
              })
            )
            return
          }
          this.color = color || DEFAULT_COLOR
          if (this.templateRule2.nRoi.type == 0) {
            this.drawboard.set_mode(DrawMode.RECT, CustomShape.POLYGONEXCLUDE)
          } else {
            this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.POLYGONEXCLUDE)
          }
          break
        case 4: // 最小运动目标
          index = objects.findIndex(item => item.shape === CustomShape.MINTARGET)
          this.color = color || DEFAULT_COLOR
          if (this.templateRule2.minTarget.type == 0) {
            this.drawboard.set_mode(DrawMode.RECT, CustomShape.MINTARGET, index)
          } else {
            this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.MINTARGET, index)
          }
          break
        case 5: // 最大运动目标
          index = objects.findIndex(item => item.shape === CustomShape.MAXTARGET)
          this.color = color || DEFAULT_COLOR
          if (this.templateRule2.maxTarget.type == 0) {
            this.drawboard.set_mode(DrawMode.RECT, CustomShape.MAXTARGET, index)
          } else {
            this.drawboard.set_mode(DrawMode.POLYGON, CustomShape.MAXTARGET, index)
          }
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
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.processedData = this.processData()
        this.draw(this.url)
      })
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    aCoords2Points(aCoords) {
      return aCoords.map(item => {
        return `${(item.x / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
          item.y /
          (this.canvas_wh.height / this.init_zoom)
        ).toFixed(5)}`
      })
    },
    submitForm() {
      if (!this.drawboard) {
        if (this.templateRule2.type != 2) {
          // 非全屏检测 要画线
          this.$message.warning(`${this.$t('analysisTask.drawboardError')}`)
          this.isShowMessage = true
        }
        return
      }
      let objects = this.getObjects()
      let minTarget = objects.find(item => item.shape === CustomShape.MINTARGET)
      if (minTarget) {
        if (this.templateRule2.minTarget.type == 0) {
          let minPoints = [
            minTarget.aCoords.tl,
            minTarget.aCoords.tr,
            minTarget.aCoords.br,
            minTarget.aCoords.bl
          ]
          this.processedData.minCarFrame.criteria['area'] = [
            {
              type: 19,
              shape: 106,
              point: this.aCoords2Points(minPoints)
            }
          ]
        } else {
          let minPoints = this.$loadash.uniqWith(minTarget.points, this.$loadash.isEqual)
          this.processedData.minCarFrame.criteria['area'] = [
            {
              type: 19,
              shape: 108,
              point: this.aCoords2Points(minPoints)
            }
          ]
        }
      } else {
        if (this.templateRule2.minTarget && this.templateRule2.minTarget.status == 1) {
          this.$message.warning(`${this.$t('analysisTask.setMinObjectPrompt')}`)
          this.isShowMessage = true
          return
        }
      }
      let maxTarget = objects.find(item => item.shape === CustomShape.MAXTARGET)
      if (maxTarget) {
        if (this.templateRule2.maxTarget.type == 0) {
          let maxPoints = [
            maxTarget.aCoords.tl,
            maxTarget.aCoords.tr,
            maxTarget.aCoords.br,
            maxTarget.aCoords.bl
          ]
          this.processedData.maxCarFrame.criteria['area'] = [
            {
              type: 18,
              shape: 106,
              point: this.aCoords2Points(maxPoints)
            }
          ]
        } else {
          let maxPoints = this.$loadash.uniqWith(maxTarget.points, this.$loadash.isEqual)
          this.processedData.maxCarFrame.criteria['area'] = [
            {
              type: 18,
              shape: 108,
              point: this.aCoords2Points(maxPoints)
            }
          ]
        }
      } else {
        if (this.templateRule2.maxTarget && this.templateRule2.maxTarget.status == 1) {
          this.$message.warning(`${this.$t('analysisTask.setMaxObjectPrompt')}`)
          this.isShowMessage = true
          return
        }
      }
      this.processedData.regionInfo[0].criteria.area = []
      let roi = objects.filter(item => item.shape === CustomShape.POLYGON)
      if (roi.length) {
        roi.forEach(element => {
          if (this.templateRule2.roi.type == 0) {
            let polygonPoints = [
              element.aCoords.tl,
              element.aCoords.tr,
              element.aCoords.br,
              element.aCoords.bl
            ]
            this.processedData.regionInfo[0].criteria.area.push({
              type: 26,
              shape: 106,
              point: this.aCoords2Points(polygonPoints)
            })
          } else {
            let polygonPoints = this.$loadash.uniqWith(element.points, this.$loadash.isEqual)
            this.processedData.regionInfo[0].criteria.area.push({
              type: 26,
              shape: 108,
              point: this.aCoords2Points(polygonPoints)
            })
          }
        })
      } else {
        if (this.templateRule2.roi && this.templateRule2.roi.status == 1) {
          this.$message.warning(`${this.$t('algoTemplate.areaCannotEmpty')}`)
          this.isShowMessage = true
          return
        }
      }
      let nRoi = objects.filter(item => item.shape === CustomShape.POLYGONEXCLUDE)
      if (nRoi.length) {
        nRoi.forEach(element => {
          if (this.templateRule2.nRoi.type == 0) {
            let polygonPoints = [
              element.aCoords.tl,
              element.aCoords.tr,
              element.aCoords.br,
              element.aCoords.bl
            ]
            this.processedData.regionInfo[0].criteria.area.push({
              type: 9,
              shape: 106,
              point: this.aCoords2Points(polygonPoints)
            })
          } else {
            let polygonPoints = this.$loadash.uniqWith(element.points, this.$loadash.isEqual)
            this.processedData.regionInfo[0].criteria.area.push({
              type: 9,
              shape: 108,
              point: this.aCoords2Points(polygonPoints)
            })
          }
        })
      } else {
        if (this.templateRule2.nRoi && this.templateRule2.nRoi.status == 1) {
          this.$message.warning(`${this.$t('algoTemplate.exclusionCannotEmpty')}`)
          this.isShowMessage = true
          return
        }
      }
      let areas = objects.filter(
        item =>
          item.get('type') === CustomShape.LINE ||
          item.get('type') === CustomShape.DOUBLELINE ||
          item.get('type') === CustomShape.POSITIVELINE ||
          item.get('type') === CustomShape.REVERSELINE
      )
      if (areas.length) {
        areas.forEach(item => {
          if (item.get('type') == 'line') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 0,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'doubleSideLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 3,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'positiveLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 2,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'reverseLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 1,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          }
        })
      } else {
        if (this.templateRule2.line) {
          this.$message.warning(`${this.$t('algoTemplate.listOneLine')}`)
          this.isShowMessage = true
          return
        }
      }
      this.isShowMessage = false
      this.$emit('change', this.processedData)
    },
    updateForm() {
      if (!this.drawboard) return
      let objects = this.getObjects()
      let minTarget = objects.find(item => item.shape === CustomShape.MINTARGET)
      if (minTarget) {
        if (this.templateRule2.minTarget.type == 0) {
          let minPoints = [
            minTarget.aCoords.tl,
            minTarget.aCoords.tr,
            minTarget.aCoords.br,
            minTarget.aCoords.bl
          ]
          this.processedData.minCarFrame.criteria['area'] = [
            {
              type: 19,
              shape: 106,
              point: this.aCoords2Points(minPoints)
            }
          ]
        } else {
          let minPoints = this.$loadash.uniqWith(minTarget.points, this.$loadash.isEqual)
          this.processedData.minCarFrame.criteria['area'] = [
            {
              type: 19,
              shape: 108,
              point: this.aCoords2Points(minPoints)
            }
          ]
        }
      }
      let maxTarget = objects.find(item => item.shape === CustomShape.MAXTARGET)
      if (maxTarget) {
        if (this.templateRule2.maxTarget.type == 0) {
          let maxPoints = [
            maxTarget.aCoords.tl,
            maxTarget.aCoords.tr,
            maxTarget.aCoords.br,
            maxTarget.aCoords.bl
          ]
          this.processedData.maxCarFrame.criteria['area'] = [
            {
              type: 18,
              shape: 106,
              point: this.aCoords2Points(maxPoints)
            }
          ]
        } else {
          let maxPoints = this.$loadash.uniqWith(maxTarget.points, this.$loadash.isEqual)
          this.processedData.maxCarFrame.criteria['area'] = [
            {
              type: 18,
              shape: 108,
              point: this.aCoords2Points(maxPoints)
            }
          ]
        }
      }
      this.processedData.regionInfo[0].criteria.area = []
      let roi = objects.filter(item => item.shape === CustomShape.POLYGON)
      if (roi.length) {
        roi.forEach(element => {
          if (this.templateRule2.roi.type == 0) {
            let polygonPoints = [
              element.aCoords.tl,
              element.aCoords.tr,
              element.aCoords.br,
              element.aCoords.bl
            ]
            this.processedData.regionInfo[0].criteria.area.push({
              type: 26,
              shape: 106,
              point: this.aCoords2Points(polygonPoints)
            })
          } else {
            let polygonPoints = this.$loadash.uniqWith(element.points, this.$loadash.isEqual)
            this.processedData.regionInfo[0].criteria.area.push({
              type: 26,
              shape: 108,
              point: this.aCoords2Points(polygonPoints)
            })
          }
        })
      }
      let nRoi = objects.filter(item => item.shape === CustomShape.POLYGONEXCLUDE)
      if (nRoi.length) {
        nRoi.forEach(element => {
          if (this.templateRule2.nRoi.type == 0) {
            let polygonPoints = [
              element.aCoords.tl,
              element.aCoords.tr,
              element.aCoords.br,
              element.aCoords.bl
            ]
            this.processedData.regionInfo[0].criteria.area.push({
              type: 9,
              shape: 106,
              point: this.aCoords2Points(polygonPoints)
            })
          } else {
            let polygonPoints = this.$loadash.uniqWith(element.points, this.$loadash.isEqual)
            this.processedData.regionInfo[0].criteria.area.push({
              type: 9,
              shape: 108,
              point: this.aCoords2Points(polygonPoints)
            })
          }
        })
      }
      let areas = objects.filter(
        item =>
          item.get('type') === CustomShape.LINE ||
          item.get('type') === CustomShape.DOUBLELINE ||
          item.get('type') === CustomShape.POSITIVELINE ||
          item.get('type') === CustomShape.REVERSELINE
      )
      if (areas.length) {
        areas.forEach(item => {
          if (item.get('type') == 'line') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 0,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'doubleSideLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 3,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'positiveLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 2,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          } else if (item.get('type') == 'reverseLine') {
            this.processedData.regionInfo[0].criteria.area.push({
              type: 1,
              shape: 102,
              direct: 1,
              point: [
                `${(item.x1 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y1 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`,
                `${(item.x2 / (this.canvas_wh.width / this.init_zoom)).toFixed(5)},${(
                  item.y2 /
                  (this.canvas_wh.height / this.init_zoom)
                ).toFixed(5)}`
              ]
            })
          }
        })
      }
      this.$emit('change', this.processedData)
    }
  }
}
</script>

<style lang="scss" scoped>
.draw_container {
  padding: 20px;
  width: 840px;
  min-height: 550px;
  .draw_sidebar {
    width: 400px;
  }
  .draw_wrapper {
    position: relative;
    .question_mark {
      position: absolute;
      top: 20px;
      right: 20px;
      color: #000;
      z-index: 1001;
    }
    .video_board_canvas,
    .video_board_player {
      position: absolute;
      top: 0;
      left: 0;
    }
    .video_board_player {
      background: rgba(13, 14, 27, 0.7);
    }
    :deep(.video_board_canvas) {
      z-index: 1;
    }
  }
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
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 30px;
      p {
        margin-bottom: 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
  .item-num {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
