<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-button v-if="type === '4'" type="text" :icon="ElIconPlus" @click="startDrawLine">
        {{ $t('mainDevConfiguration.newTripwire') }}
      </el-button>
      <el-button v-else type="text" :icon="ElIconPlus" @click="startDrawArea">
        {{ $t('mainDevConfiguration.newDetectionArea') }}
      </el-button>
    </el-col>

    <el-col :span="12">
      <div
        class="draw_wrapper"
        ref="draw_wrapper"
        v-loading="img_loading"
        :element-loading-text="$t('mainDevConfiguration.imgLoading')"
        
      >
        <canvas
          class="board_canvas"
          ref="canvas"
          :width="canvas_wh.width"
          :height="canvas_wh.height"
        >
          {{ $t('mainDevConfiguration.notSupportedCanvas') }}
        </canvas>
        <div class="board_player" ref="player" :style="playerStyle"></div>
      </div>
    </el-col>
    <el-col :span="12">
      <div
        class="table_wrapper"
        v-loading="img_loading"
        :element-loading-text="$t('public.loading')"
        
      >
        <el-table
          :height="this.canvas_wh.height"
          :row-class-name="tableRowClassName"
          :data="type === '4' ? value.lines : value.areas"
          border
          @cell-click="cellClick"
        >
          <el-table-column prop="name" :label="$t('mainDevConfiguration.name')">
            <template #default="{ row }">
              <el-tooltip
                v-if="
                  row.index === cellClickIndex && cellClickLabel === $t('mainDevConfiguration.name')
                "
                effect="dark"
                :content="
                  $t('public.validate.charLimit', { num: 32 }) +
                  ',' +
                  $t('mainDevConfiguration.validateName')
                "
                placement="top"
              >
                <el-input
                  v-model.trim="row.name"
                  clearable
                  @blur="inputBlur"
                  @input="handleLineNameChange($event, row.id)"
                  :disabled="loading"
                  maxlength="32"
                ></el-input>
              </el-tooltip>

              <span v-else class="cell_span" :title="row.name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === '4'"
            prop="direction"
            :label="$t('mainDevConfiguration.direction')"
          >
            <template #default="{ row }">
              <el-select
                v-if="
                  row.index === cellClickIndex &&
                  cellClickLabel === $t('mainDevConfiguration.direction')
                "
                v-model="row.direction"
                :disabled="loading"
                @blur.capture.native="inputBlur"
                @change="handleDirectionChange($event, row.id)"
              >
                <el-option
                  v-for="item in $parent.$parent.directionOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span v-else class="cell_span">{{ directionFormat(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enable" :label="$t('mainDevConfiguration.status')">
            <template #default="{ row }">
              <el-switch
                v-model="row.enable"
                :active-value="1"
                :inactive-value="0"
                :disabled="loading"
                @change="handleEnableChange($event, row.id)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operating')">
            <template #default="{ row }">
              <el-button type="text" :disabled="loading" :title="$t('public.delete')">
                <svg-icon icon-class="trash" @click="handleDelete(row.id)" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Plus as ElIconPlus } from '@element-plus/icons-vue'
import Drawboard, {
  DrawMode,
  DoubleSideLine,
  PositiveLine,
  ReverseLine,
  Polygon
} from '@/components/drawBoard/drawBoard.js'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({ areas: [], lines: [] })
    },
    type: {
      type: String,
      default: '1'
    },
    maxPoint: {
      type: Number,
      default: 10
    },
    maxArea: {
      type: Number,
      default: 5
    },
    videoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      canvas_wh: { width: 640, height: 320 },
      init_zoom: 1,
      drawboard: null,
      color: '#ff0000',
      brushWidth: 6,
      img_loading: false,
      loading: false,
      cellClickIndex: null, // 点击的单元格
      cellClickLabel: '', // 当前点击的列名
      ElIconPlus
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
      this.destroyPlayer()
      setTimeout(() => {
        this.play()
      }, 100)
    }
  },
  mounted() {
    this.bindEvent()
    this.calcBounds()
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy()
    }
    this.unBindEvent()
  },
  methods: {
    bindEvent() {
      window.addEventListener('resize', this.onWindowResize)
    },
    unBindEvent() {
      window.removeEventListener('resize', this.onWindowResize)
    },
    destroyPlayer() {
      if (this.player) {
        this.player.destroy()
      }
      this.createPlayer()
    },
    play() {
      this.player.play(this.videoUrl)
    },
    calcBounds() {
      const win_width = this.$refs.draw_wrapper.clientWidth
      this.$refs.draw_wrapper.style.height = win_width * (1080 / 1920) + 'px'
      const win_height = this.$refs.draw_wrapper.clientHeight
      this.canvas_wh = { width: win_width, height: win_height }
    },
    createPlayer() {
      this.calcBounds()
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
        enableSelect: false,
        background_color: 'transparent',
        draw_complete_event: draw_obj => {
          // 手动画 完成后触发
          if (!draw_obj) {
            return
          }
          let value = JSON.parse(JSON.stringify(this.value))
          let name = '',
            id = draw_obj.get('id'),
            type = draw_obj.get('type'),
            index = -1,
            points = [],
            direction = 0

          switch (this.type) {
            case '4': // 越线检测
              index = value.lines.findIndex(item => item.id === id)
              name = this.$t('mainDevConfiguration.tripwireName', {
                num: this.value.lines.length + 1
              })
              points = this.aCoords2Points([
                { x: draw_obj.get('x1'), y: draw_obj.get('y1') },
                { x: draw_obj.get('x2'), y: draw_obj.get('y2') }
              ])
              if (points.some(item => parseFloat(item.x) > 1 || parseFloat(item.y) > 1)) {
                this.$message.warning(this.$t('mainDevConfiguration.tripwireScope'))
                this.drawboard.fCanvas.remove(draw_obj)
                return
              }
              direction = type === DrawMode.DOUBLELINE ? 0 : type === DrawMode.POSITIVELINE ? 1 : 2
              if (index !== -1) {
                value.lines[index].points = points
                value.lines[index].name = name
                value.lines[index].direction = direction
              } else {
                value.lines.push({
                  id: id,
                  points: points,
                  name: name,
                  direction: direction,
                  enable: 1
                })
              }
              break
            default:
              index = value.areas.findIndex(item => item.id === id)
              name = this.$t('mainDevConfiguration.areaName', { num: this.value.areas.length + 1 })
              points = this.aCoords2Points(this._.uniqWith(draw_obj.points, this._.isEqual))
              if (index !== -1) {
                value.areas[index].points = points
                value.areas[index].name = name
              } else {
                value.areas.push({
                  id: id,
                  points: points,
                  name: name,
                  enable: 1
                })
              }
              break
          }
          draw_obj.set({
            label: name,
            dirty: true
          })
          this.drawboard.fCanvas.renderAll()
          this.$emit('input', value)
        }
      })
      this.reRenderCanvas()
    },
    // 名称变更 => value更新 canvas更新
    handleLineNameChange(val, id) {
      this.$nextTick(() => {
        let reg = /[^\u4e00-\u9fa5A-Za-z0-9]/gim
        if (reg.test(val)) {
          this.$message.warning(this.$t('mainDevConfiguration.validateName'))
        }
        val = val.replace(reg, '')
        let { fCanvas } = this.drawboard,
          index = fCanvas.getObjects().findIndex(item => item.get('id') === id),
          value = JSON.parse(JSON.stringify(this.value)),
          dIndex = -1
        if (index !== -1) {
          switch (this.type) {
            case '4': // 越线检测
              dIndex = this.value.lines.findIndex(item => item.id === id)
              if (dIndex !== -1) {
                // 改变label
                fCanvas.item(index).set({
                  label: val,
                  dirty: true
                })
                // 数据更新
                value.lines[dIndex].name = val
              }
              break
            default:
              dIndex = this.value.areas.findIndex(item => item.id === id)
              if (dIndex !== -1) {
                // 改变label
                fCanvas.item(index).set({
                  label: val,
                  dirty: true
                })
                // 数据更新
                value.areas[dIndex].name = val
              }
              break
          }
          fCanvas.renderAll()
          this.$emit('input', value)
        }
      })
    },
    // 方向变更 => value更新 canvas更新
    handleDirectionChange(val, id) {
      let { fCanvas } = this.drawboard,
        index = fCanvas.getObjects().findIndex(item => item.get('id') === id),
        value = JSON.parse(JSON.stringify(this.value)),
        dIndex = -1
      if (index !== -1) {
        // 越线检测
        dIndex = this.value.lines.findIndex(item => item.id === id)
        if (dIndex !== -1) {
          let data = value.lines[dIndex],
            old_draw_obj = fCanvas.item(index),
            draw_obj = null,
            points = [
              old_draw_obj.get('x1'),
              old_draw_obj.get('y1'),
              old_draw_obj.get('x2'),
              old_draw_obj.get('y2')
            ],
            options = {
              id: data.id,
              label: data.name,
              stroke: data.enable === 1 ? this.color : '#ffffff',
              strokeWidth: this.brushWidth
            }
          // 移除旧线
          fCanvas.remove(old_draw_obj)
          if (val === 0) {
            // 双向
            draw_obj = new DoubleSideLine(points, options)
          } else if (val === 1) {
            // 正向
            draw_obj = new PositiveLine(points, options)
          } else {
            // 反向
            draw_obj = new ReverseLine(points, options)
          }
          // 添加新线
          fCanvas.add(draw_obj)

          // 数据更新
          value.lines[dIndex].direction = val
          this.$emit('input', value)
        }
        fCanvas.renderAll()
      }
    },
    // 状态变更 => value更新 canvas更新
    handleEnableChange(val, id) {
      let { fCanvas } = this.drawboard,
        index = fCanvas.getObjects().findIndex(item => item.get('id') === id),
        value = JSON.parse(JSON.stringify(this.value)),
        dIndex = -1
      if (index !== -1) {
        switch (this.type) {
          case '4': // 越线检测
            dIndex = this.value.lines.findIndex(item => item.id === id)
            if (dIndex !== -1) {
              // 改变颜色
              fCanvas.item(index).set({
                stroke: val === 1 ? this.color : '#ffffff',
                dirty: true
              })
              // 数据更新
              value.lines[dIndex].enable = val
            }
            break
          default:
            dIndex = this.value.areas.findIndex(item => item.id === id)
            if (dIndex !== -1) {
              // 改变颜色
              fCanvas.item(index).set({
                stroke: val === 1 ? this.color : '#ffffff',
                dirty: true
              })
              // 数据更新
              value.areas[dIndex].enable = val
            }
            break
        }
        fCanvas.renderAll()
        this.$emit('input', value)
      }
    },
    // 删除
    handleDelete(id) {
      let { fCanvas } = this.drawboard,
        index = fCanvas.getObjects().findIndex(item => item.get('id') === id),
        value = JSON.parse(JSON.stringify(this.value)),
        dIndex = -1
      if (index !== -1) {
        switch (this.type) {
          case '4': // 越线检测
            dIndex = this.value.lines.findIndex(item => item.id === id)
            if (dIndex !== -1) {
              // 删除线段
              fCanvas.remove(fCanvas.item(index))
              // 数据更新
              value.lines.splice(dIndex, 1)
            }
            break
          default:
            dIndex = this.value.areas.findIndex(item => item.id === id)
            if (dIndex !== -1) {
              // 删除区域
              fCanvas.remove(fCanvas.item(index))
              // 数据更新
              value.areas.splice(dIndex, 1)
            }
            break
        }
        fCanvas.renderAll()
        this.$emit('input', value)
      }
    },
    aCoords2Points(aCoords) {
      let ratioX = this.canvas_wh.width / this.init_zoom,
        ratioY = this.canvas_wh.height / this.init_zoom
      return aCoords.map(item => {
        return {
          x: Number((item.x / ratioX).toFixed(6)),
          y: Number((item.y / ratioY).toFixed(6))
        }
      })
    },
    linePointsFormat(points) {
      let arr = [],
        ratioX = this.canvas_wh.width / this.init_zoom,
        ratioY = this.canvas_wh.height / this.init_zoom
      points.forEach(item => {
        arr.push(parseFloat(item.x) * ratioX, parseFloat(item.y) * ratioY)
      })
      return arr
    },
    polygonPointsFormat(points) {
      let ratioX = this.canvas_wh.width / this.init_zoom,
        ratioY = this.canvas_wh.height / this.init_zoom
      return points.map(item => {
        return {
          x: parseFloat(item.x) * ratioX,
          y: parseFloat(item.y) * ratioY
        }
      })
    },
    getObjects() {
      return this.drawboard.get_objects()
    },
    destroy_drawboard() {
      if (this.drawboard) {
        this.drawboard.destroyed()
      }
      this.drawboard = null
    },
    reRenderCanvas() {
      this.drawboard.clear()
      if (this.type === '4') {
        //  回显线段
        this.value.lines.forEach(line => {
          let draw_obj = null,
            points = this.linePointsFormat(line.points),
            options = {
              id: line.id,
              label: line.name,
              stroke: line.enable === 1 ? this.color : '#ffffff',
              strokeWidth: this.brushWidth,
              hasRotatingPoint: false,
              hasControls: false,
              strokeUniform: true
            }
          switch (line.direction) {
            case 0:
              // 双向
              draw_obj = new DoubleSideLine(points, options)
              break
            case 1:
              // 正向
              draw_obj = new PositiveLine(points, options)
              break
            case 2:
              // 反向
              draw_obj = new ReverseLine(points, options)
              break
            default:
              break
          }
          this.drawboard.fCanvas.add(draw_obj)
        })
      } else {
        //  回显区域
        this.value.areas.forEach(area => {
          let draw_obj,
            points = this.polygonPointsFormat(area.points),
            options = {
              id: area.id,
              label: area.name,
              left: this.drawboard.findLeftPaddingForRoof(points),
              top: this.drawboard.findTopPaddingForRoof(points),
              fill: 'rgba(0, 0, 0, 0)',
              stroke: area.enable === 1 ? this.color : '#ffffff',
              strokeWidth: this.brushWidth,
              hasRotatingPoint: false,
              hasControls: false,
              strokeUniform: true
            }
          draw_obj = new Polygon(points, options)
          this.drawboard.fCanvas.add(draw_obj)
        })
      }
    },
    onWindowResize() {
      if (this.drawboard) {
        this.destroyPlayer()
        setTimeout(() => {
          this.play()
        }, 100)
      }
    },
    startDrawLine() {
      if (!this.drawboard) {
        return
      }
      if (this.value.lines.length >= this.maxArea) {
        this.$message.warning(
          this.$t('mainDevConfiguration.tripwireLengthLimit', { num: this.maxArea })
        )
        return
      }
      this.drawboard.set_mode(DrawMode.DOUBLELINE)
    },
    startDrawArea() {
      if (!this.drawboard) {
        return
      }
      if (this.value.areas.length >= this.maxArea) {
        this.$message.warning(
          this.$t('mainDevConfiguration.areaLengthLimit', { num: this.maxArea })
        )
        return
      }
      this.drawboard.set_mode(DrawMode.POLYGON)
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    cellClick(row, column) {
      this.cellClickIndex = row.index
      this.cellClickLabel = column.label
    },
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time))
    },
    // 延迟失去焦点
    inputBlur() {
      this.sleep(300).then(() => {
        this.cellClickIndex = null
        this.cellClickLabel = ''
      })
    },
    directionFormat(row) {
      return this.selectDictLabel(this.$parent.$parent.directionOption, row.direction, {
        key: 'name',
        value: 'value'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cell_span {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.draw_wrapper {
  position: relative;
  .board_canvas,
  .board_player {
    position: absolute;
    top: 0;
    left: 0;
  }
  .board_player {
    background: rgba(13, 14, 27, 0.7);
  }
  :deep(.board_canvas) {
    z-index: 1;
  }
}
</style>
