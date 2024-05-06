<template>
  <div class="video_board">
    <div class="video_board_control">
      <el-link
        v-for="(btn, index) in controls"
        :key="index"
        :underline="false"
        type="primary"
        :disabled="btn.disabled"
        @click="handleControl(btn, index)"
      >
        <svg-icon v-if="btn.icon" :iconClass="btn.icon" class-name="link-class" />
        {{ btn.text }}
      </el-link>
    </div>
    <div class="tips">
      <slot name="tips"></slot>
    </div>
    <div
      class="video_board_wrapper"
      ref="video_board_wrapper"
      :style="{ height: canvas_wh.height + 'px' }"
      v-loading="loading"
      :element-loading-text="$t('mainDevConfiguration.imgLoading')"
    >
      <canvas
        class="video_board_canvas"
        ref="canvas"
        :width="canvas_wh.width"
        :height="canvas_wh.height"
      >
        {{ $t('mainDevConfiguration.notSupportedCanvas') }}
      </canvas>
      <div
        class="canvas_overlay"
        v-if="canvasDisabled"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          cursor: not-allowed;
        "
      ></div>
      <div v-show="vpaasVideoUrl" class="video_board_player" ref="player" :style="playerStyle"></div>
    </div>
  </div>
</template>

<script>
import Drawboard from './drawBoard'
import { DrawMode, ControlMethods, DefaultControls, SHAPE_TYPE } from './constant'
export default {
  name: 'VideoDrawboard',
  props: {
    value: {
      type: Object,
      default: () => ({ areas: [], lines: [] })
    },
    videoUrl: {
      type: String,
      default: ''
    },
    vpaasVideoUrl: {
      type: String,
      default: ''
    },
    controls: {
      type: Array,
      default: () => {
        return DefaultControls
      }
    },
    maxPoint: {
      type: Number,
      default: 10
    },
    canvasDisabled: {
      type: Boolean,
      default: false
    },
    beforeControlExec: Function,
    // 输出结果保留几位小数
    resultDecimals: {
      type: Number,
      default: 2
    },
    // 矩形输出结果返回对角线两个点还是4个点
    reactDiagonal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      player: null,
      loading: false,
      init_zoom: 1,
      canvas_wh: { width: 569, height: 320 },
      current_button_index: -1,
      drawboard: null,
      color: '#ff0000',
      brushWidth: 6,
      videoInfo: null
    }
  },
  computed: {
    playerStyle() {
      return {
        width: this.canvas_wh.width + 'px',
        height: this.canvas_wh.height + 'px'
      }
    }
  },
  watch: {
    videoUrl() {
      this.createPlayer()
    },
    vpaasVideoUrl() {
      this.destroyPlayer()
      setTimeout(() => {
        this.play()
      }, 100)
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy()
    }
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
    createVpaasPlayer() {
      this.player = new window.Jessibuca({
        container: this.$refs.player,
        videoBuffer: 0.2, // 缓存时长
        isResize: false,
        loadingText: this.$t('public.loading'),
        timeout: 10,
        isFlv: true
      })
      this.player.on('videoInfo', data => {
        this.videoInfo = data
        this.initDrawboard(data)
      })
    },
    destroyPlayer() {
      if (this.player) {
        this.player.destroy()
      }
      this.createVpaasPlayer()
    },
    async initDrawboard(data) {
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
        brush_width: this.brushWidth,
        maxPoint: this.maxPoint,
        mode: DrawMode.SELECT,
        enableSelect: true,
        background_color: this.vpaasVideoUrl ? 'transparent' : '#fff',
        back_event: history => {
          if (!history.length) {
            this.$message.warning('没有可撤销的记录了')
          }
        },
        drag_event: status => {
          if (status) {
            this.in_move_mode = false
          }
        },
        object_mouseup_event: (obj, options) => {
          this.$emit('object-mouseup', obj, options)
        }
      })
      this.current_button_index = -1
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
    play() {
      this.player.play(this.vpaasVideoUrl)
    },
    destroy() {
      if (this.player) {
        this.player.destroy()
      }
    },
    // 按钮点击事件
    handleControl(btn, button_index) {
      if (!this.drawboard) {
        return
      }
      const { disabled, method } = btn
      if (disabled) {
        return
      }

      if (this.beforeControlExec) {
        const before = this.beforeControlExec(method, this.drawboard)
        if (before && before.then) {
          before.then(
            () => {
              this.setMode(method, button_index)
            },
            () => {}
          )
        } else if (before !== false) {
          this.setMode(method, button_index)
        }
      } else {
        this.setMode(method, button_index)
      }
    },
    setMode(method, button_index) {
      // 退出移动模式
      if (
        this.in_move_mode &&
        method !== ControlMethods.CLEAR_SCREEN &&
        method !== ControlMethods.REVOCATION
      ) {
        this.in_move_mode = false
      }
      switch (method) {
        case ControlMethods.LINE:
          this.drawboard.set_mode(DrawMode.LINE)
          this.current_button_index = button_index
          break
        case ControlMethods.POSITIVELINE:
          this.drawboard.set_mode(DrawMode.POSITIVELINE)
          this.current_button_index = button_index
          break
        case ControlMethods.DOUBLELINE:
          this.drawboard.set_mode(DrawMode.DOUBLELINE)
          this.current_button_index = button_index
          break
        case ControlMethods.REVERSELINE:
          this.drawboard.set_mode(DrawMode.REVERSELINE)
          this.current_button_index = button_index
          break
        case ControlMethods.RECT:
          this.drawboard.set_mode(DrawMode.RECT)
          this.current_button_index = button_index
          break
        case ControlMethods.POLYGON:
          this.drawboard.set_mode(DrawMode.POLYGON)
          this.current_button_index = button_index
          break
        case ControlMethods.CIRCLE:
          this.drawboard.set_mode(DrawMode.CIRCLE)
          this.current_button_index = button_index
          break
        case ControlMethods.TEXT:
          this.drawboard.set_mode(DrawMode.TEXT)
          this.current_button_index = button_index
          break
        case ControlMethods.REVOCATION: // 撤销
          this.drawboard.back()
          break
        case ControlMethods.CLEAR_SCREEN: // 清屏
          this.drawboard.clear()
          break
        case ControlMethods.DELETE: // 删除当前
          this.drawboard.delete_selected()
          break
      }
    },
    aCoords2Points(aCoords) {
      let ratioX = this.canvas_wh.width / this.init_zoom,
        ratioY = this.canvas_wh.height / this.init_zoom
      return aCoords.map(item => {
        return {
          x: Number((item.x / ratioX).toFixed(this.resultDecimals)),
          y: Number((item.y / ratioY).toFixed(this.resultDecimals))
        }
      })
    },
    points2aCoords(points) {
      let ratioX = this.canvas_wh.width / this.init_zoom,
        ratioY = this.canvas_wh.height / this.init_zoom
      return points.map(item => {
        return {
          x: parseFloat(item.x) * ratioX,
          y: parseFloat(item.y) * ratioY
        }
      })
    },
    // 处理数据 输出后端接收的类型
    normalizeData() {
      const objects = this.drawboard.get_objects()
      return objects.map(item => {
        return this.normalizeSingleData(item)
      })
    },
    normalizeSingleData(klass) {
      const type = klass.get('type')
      let points = []
      let data = {}
      switch (type) {
        case DrawMode.RECT:
          points = this.aCoords2Points(
            this.$loadash.uniqWith(
              [klass.aCoords.tl, klass.aCoords.tr, klass.aCoords.br, klass.aCoords.bl],
              this.$loadash.isEqual
            )
          )
          if (this.reactDiagonal) {
            points = [points[0], points[2]]
          }
          data = {
            type: SHAPE_TYPE.RECT,
            width: this.videoInfo.width,
            height: this.videoInfo.height,
            points
          }
          break
        case DrawMode.POLYGON:
          points = this.aCoords2Points(
            this.$loadash.uniqWith(klass.get('points'), this.$loadash.isEqual)
          )
          data = {
            type: SHAPE_TYPE.POLYGON,
            width: this.videoInfo.width,
            height: this.videoInfo.height,
            points
          }
          break
      }
      return data
    },
    // 根据后端传来的数据渲染图形
    render(data = [], clear = true) {
      if (clear) {
        this.drawboard.clear()
        !this.vpaasVideoUrl && this.drawboard.fCanvas.setBackgroundColor('#fff')
      }
      data.forEach(item => {
        switch (item.type) {
          case SHAPE_TYPE.RECT:
            this.drawboard.createRect(this.points2aCoords(item.points), item.options)
            break
          case SHAPE_TYPE.POLYGON:
            this.drawboard.createPolygon(this.points2aCoords(item.points), item.options)
            break
        }
      })
    },
    getObjects() {
      return this.drawboard.get_objects()
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
