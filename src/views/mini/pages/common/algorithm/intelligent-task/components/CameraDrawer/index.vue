<style lang="scss" scoped>
.camera-drawer {
  display: inline-block;
  .actions {
    height: 40px;
    width: 100%;
  }
  .drawer-area {
    position: relative;
    .snapshot {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
<template>
  <div class="camera-drawer">
    <div class="actions">
      <el-button type="text" :disabled="actionDisabled" @click="startDraw('max')" class="table-btn_warn"
        >绘制最大目标</el-button
      >
      <el-button type="text" :disabled="actionDisabled" @click="startDraw('min')" class="table-btn_info"
        >绘制最小目标</el-button
      >
      <el-button type="text" :disabled="actionDisabled" @click="startDraw('polygon')">绘制区域</el-button>
      <el-button type="text" :disabled="actionDisabled" @click="startDraw('full')">全屏</el-button>
      <el-button type="text" @click="startDraw('back')" class="table-btn_warn">撤销区域</el-button>
      <el-button type="text" @click="startDraw('clear')" class="table-btn_warn">清空</el-button>
      <el-button type="text" @click="loadImage" style="float: right">刷新</el-button>
    </div>
    <div
      class="drawer-area"
      :style="{ width: `${width}px`, height: `${height}px` }"
      v-loading="loading"
      element-loading-text="获取图像中..."
      element-loading-spinner="el-icon-loading"
    >
      <img class="snapshot" :src="snapshotImg" style="z-index: 0" />
      <DrawROI
        ref="DrawROI"
        style="z-index: 1; position: relative"
        :canvasWidth="width"
        :canvasHeight="height"
        @drawEnd="drawEnd"
      ></DrawROI>
    </div>
  </div>
</template>

<script>
import DrawROI from '@/components/DrawROI'
// [
//   {
//     color: '#ff6b6b',
//     coordinates: [
//       { x: 84, y: 42 },
//       { x: 493, y: 42 },
//       { x: 493, y: 309 },
//       { x: 84, y: 309 },
//     ],
//     customType: 'max',
//   },
//   {
//     color: '#65BC4C',
//     coordinates: [
//       { x: 124, y: 66 },
//       { x: 464, y: 66 },
//       { x: 464, y: 287 },
//       { x: 124, y: 287 },
//     ],
//     customType: 'min',
//   },
//   {
//     color: '#409EFF',
//     coordinates: [
//       { x: 179, y: 104 },
//       { x: 220, y: 110 },
//       { x: 198, y: 135 },
//     ],
//     customType: 'polygon',
//   },
//   {
//     color: '#409EFF',
//     coordinates: [
//       { x: 326, y: 162 },
//       { x: 354, y: 177 },
//       { x: 321, y: 196 },
//     ],
//     customType: 'polygon',
//   },
//   {
//     color: '#409EFF',
//     coordinates: [
//       { x: 0, y: 0 },
//       { x: 640, y: 0 },
//       { x: 640, y: 400 },
//       { x: 0, y: 400 },
//     ],
//     customType: 'full',
//   },
//   {
//     color: '#409EFF',
//     coordinates: [
//       { x: 0, y: 0 },
//       { x: 640, y: 0 },
//       { x: 640, y: 400 },
//       { x: 0, y: 400 },
//     ],
//     customType: 'full',
//   },
// ]

export default {
  components: {
    DrawROI,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number,
      default: 640,
    },
    height: {
      type: Number,
      default: 400,
    },
    onLoadImage: {
      type: Function,
      required: true,
    },
    is1800: {
      type: Boolean,
    },
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {
    actionDisabled() {
      return !this.snapshotImg
    },
  },
  data() {
    return {
      snapshotImg: '',
      loading: false,
      currentDrawType: null,
    }
  },
  mounted() {
    this.$refs.DrawROI.allCoordinates = this.value || []
    //console.log('this.replayCoords', JSON.stringify(this.replayCoords))
    this.$refs.DrawROI.drawAllLines() //回显区域
    this.$refs.DrawROI.fillAllArea() //回显区域
  },
  created() {
    this.loadImage()
  },
  methods: {
    async loadImage() {
      this.loading = true
      try {
        this.snapshotImg = await this.onLoadImage()
      } catch (e) {
        this.snapshotImg = ''
      } finally {
        this.loading = false
      }
    },
    async startDraw(type) {
      this.currentDrawType = type
      this.$refs.DrawROI.startDraw = true
      const sameTypeObjectCount = this.value?.filter((a) => a.customType === type).length
      switch (type) {
        case 'max':
          this.$refs.DrawROI.handleChangeDrawType(2, '#ff6b6b', type)
          break
        case 'min':
          this.$refs.DrawROI.handleChangeDrawType(2, '#65BC4C', type)
          break
        case 'polygon':
          if (this.is1800) {
            if (sameTypeObjectCount >= 4) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          } else {
            if (sameTypeObjectCount >= 1) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          }
          this.$refs.DrawROI.handleChangeDrawType(1, '#409EFF', type)
          break
        case 'line':
          this.$refs.DrawROI.handleChangeDrawType(3, '#ff6b6b', type)
          break
        case 'full':
          if (this.is1800) {
            if (sameTypeObjectCount >= 4) {
              this.$message.info('区域绘制已达到限制')
              this.$refs.DrawROI.startDraw = false
            }
          } else {
            if (sameTypeObjectCount >= 1) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          }
          this.$refs.DrawROI.handleDrawAllCanvas('#409EFF')
          break
        case 'back':
          this.$refs.DrawROI.startDraw = false
          if (this.value?.length) {
            this.$emit('input', this.value.slice(0, this.value.length - 1))
            await this.$nextTick()
          }
          break
        case 'clear':
          this.$emit('input', [])
          await this.$nextTick()
          break
      }
      this.$refs.DrawROI.handleClear()
      this.$refs.DrawROI.allCoordinates = this.value || []
      //console.log('this.replayCoords', JSON.stringify(this.replayCoords))
      this.$refs.DrawROI.drawAllLines() //回显区域
      this.$refs.DrawROI.fillAllArea() //回显区域
    },
    drawEnd(drawType) {
      const value = this.$refs.DrawROI.handleSave() || []
      const sameTypeObjectCount = value.filter((a) => a.customType === this.currentDrawType).length
      if (this.currentDrawType == 'polygon') {
        if (this.is1800) {
          //1800 可以绘制4个区域
          if (sameTypeObjectCount >= 4) this.$refs.DrawROI.startDraw = false
        } else {
          //3800 可以绘制1个区域
          if (sameTypeObjectCount >= 1) this.$refs.DrawROI.startDraw = false
        }
      } else if (drawType == 2) {
        this.$refs.DrawROI.startDraw = false
      }
      this.$emit('input', value)
    },
  },
}
</script>
