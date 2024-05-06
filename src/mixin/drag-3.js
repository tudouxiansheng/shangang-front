export default {
  data() {
    return {
      // 缩放
      scale: 1,
      lastScale: 1,
      minL: 1,
      maxL: 20,
      bgx: 0,
      bgy: 0,

      // 拖拽
      dragSx: 0,
      dragSy: 0,
      dragEx: 0,
      dragEy: 0,

      // 聚合
      rectx_: 120,
      recty_: 120,
      rectx: 120,
      recty: 120,
      testArr: [], //格子数组
      clusterArr: [], //聚合数组

      scaleArea: {
        leftTopX: 0,
        leftTopY: 0,
        rightBottomX: 1920,
        rightBottomY: 931,
      },
    }
  },
  methods: {
    resetPos(event) {
      const { target } = event
      const className = target.className
      console.log(target)
      console.log(className)

      if (className === 'cluster') {
        this.bgx = 0
        this.bgy = 0
        this.scale = 1
        this.lastScale = 1
      }
    },
    wheel(event) {
      const { x, y, deltaY } = event

      // e.deltaY 滚轮向前-100，向后+100
      this.scale += deltaY * -0.01
      this.scale = Math.min(Math.max(this.minL, this.scale), this.maxL)

      this.setTranslate(this.scale, x, y, deltaY)

      this.alarmPopupClose(false)
      this.detailsPopupClose()

      this.rectx = this.rectx_ / this.scale
      this.recty = this.recty_ / this.scale
      this.getCurAreaPos()
    },
    setTranslate(s, x, y, deltaY) {
      const getSourePosition = (s, x, y) => {
        let x2 = (x - this.bgx) / s
        let y2 = (y - this.bgy) / s

        return { x2, y2 }
      }

      const getXY = (s, x, y, x2, y2) => {
        let x4 = x - x2 * s
        let y4 = y - y2 * s

        return { x4, y4 }
      }

      let { x2, y2 } = getSourePosition(this.lastScale, x, y)

      let { x4, y4 } = getXY(s, x, y, x2, y2)

      // 放大
      if (deltaY < 0) {
        if (this.lastScale < this.maxL) {
          this.lastScale = s
          this.bgx = x4
          this.bgy = y4
        }
      }

      // 缩小
      if (deltaY > 0) {
        if (this.lastScale > this.minL) {
          this.lastScale = s
          this.bgx = x4
          this.bgy = y4
        }
      }
    },
    dragstart(event) {
      const { x, y } = event
      this.dragSx = x
      this.dragSy = y
    },
    dragend(event) {
      const { x, y } = event
      this.dragEx = x
      this.dragEy = y

      this.bgx += (this.dragEx - this.dragSx) * this.scale
      this.bgy += (this.dragEy - this.dragSy) * this.scale
    },
    cluster(data) {
      const getGrid = () => {
        const rowCount = Math.ceil(this.iw / this.rectx),
          colCount = Math.ceil(this.ih / this.recty),
          rectArr = new Array(rowCount * colCount)

        let x = 0,
          y = -1,
          ltx = 0,
          lty = 0,
          rbx = 0,
          rby = 0
        for (let i = 0; i < rectArr.length; i++) {
          //当前第几列
          x = i % rowCount === 0 ? 0 : x + 1
          //当前第几行
          y = x === 0 ? y + 1 : y

          ltx = x * this.rectx
          lty = y * this.recty
          rbx = Math.min(this.iw, (x + 1) * this.rectx)
          rby = Math.min(this.ih, (y + 1) * this.recty)

          rectArr[i] = {
            leftTopX: ltx,
            leftTopY: lty,
            rightBottomX: rbx,
            rightBottomY: rby,
            centerX: (rbx + ltx) / 2,
            centerY: (rby + lty) / 2,
            child: [],
          }
        }
        return rectArr
      }
      // rectArr格子太多，还可优化，可使用curArea绘制
      const rectArr = getGrid()
      // this.testArr = rectArr

      // 剪枝
      const getViewGrid = () => {
        let minx = data[0].x,
          maxx = data[0].x,
          miny = data[0].y,
          maxy = data[0].y
        for (let i = 0; i < data.length; i++) {
          minx = minx < data[i].x ? minx : data[i].x
          maxx = maxx < data[i].x ? data[i].x : maxx

          miny = miny < data[i].y ? miny : data[i].y
          maxy = maxy < data[i].y ? data[i].y : maxy
        }

        const arr = rectArr
          .filter((v) => v.rightBottomX >= minx && v.rightBottomY >= miny)
          .filter((v) => v.leftTopX <= maxx && v.leftTopY <= maxy)

        return arr
      }
      const arr = getViewGrid()

      let xFlag = false,
        yFlag = false,
        count = 0
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < data.length; j++) {
          count++
          xFlag = arr[i].leftTopX < data[j].x && data[j].x <= arr[i].rightBottomX ? true : false
          yFlag = arr[i].leftTopY < data[j].y && data[j].y <= arr[i].rightBottomY ? true : false

          if (xFlag && yFlag) {
            arr[i].child.push(data[j])
          }
        }
      }
      this.clusterArr = arr.filter((v) => v.child.length > 0)
    },
    getCurAreaPos() {
      let leftTopX, leftTopY, rightBottomX, rightBottomY
      if (this.bgx < 0) {
        leftTopX = -this.bgx / this.scale
        rightBottomX = leftTopX + this.iw / this.scale
      } else {
        leftTopX = 0
        rightBottomX = leftTopX + this.iw / this.scale
      }
      if (this.bgy < 0) {
        leftTopY = -this.bgy / this.scale
        rightBottomY = leftTopY + this.ih / this.scale
      } else {
        leftTopY = 0
        rightBottomY = leftTopY + this.ih / this.scale
      }

      const curArea = {
        leftTopX,
        leftTopY,
        rightBottomX,
        rightBottomY,
      }
      this.scaleArea = curArea

      let xFlag = false,
        yFlag = false
      const arr = this.scsDeviceInfoList.filter((v) => {
        xFlag = curArea.leftTopX < v.x && v.x <= curArea.rightBottomX ? true : false
        yFlag = curArea.leftTopY < v.y && v.y <= curArea.rightBottomY ? true : false

        return xFlag && yFlag
      })

      if (arr.length > 0) this.cluster(arr)
    },
  },
}
