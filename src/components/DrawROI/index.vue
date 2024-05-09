<template>
    <div class="draw-roi-wrapper">
        <canvas
            class="roi-canvas"
            ref="ROICanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @mousedown="handleMouseDown($event)"
            @mousemove="handleMouseMove($event)"
            @mouseup="handleMouseUp($event)"
            @contextmenu="handleContextMenu($event)"
            >浏览器不持之canvas</canvas
        >
        <!-- <div class="tools-wrapper">
            <el-button type="primary" @click="handleChangeDrawType(1)">绘制多边形</el-button>
            <el-button type="primary" @click="handleChangeDrawType(2)">绘制矩形</el-button>
            <el-button type="primary" @click="handleChangeDrawType(3)">绘制直线</el-button>
            <el-select
                v-if="drawType === 3"
                v-model="direction"
                @change="handleChangeDirection"
                placeholder="请选择"
                style="width: 100px"
            >
                <el-option label="双向" :value="1"></el-option>
                <el-option label="A-B" :value="2"></el-option>
                <el-option label="B-A" :value="3"></el-option>
            </el-select>
            <el-button type="primary" @click="handleDrawAllCanvas">全屏</el-button>
            <el-button type="danger" @click="handleClear">清空</el-button>
            <el-button type="danger" @click="handleChangeColor">更换颜色</el-button>
            <el-button type="warning" v-if="allCoordinates.length > 1" @click="handleRevoke">撤销</el-button>
            <el-button type="success" @click="handleSave">保存</el-button>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'canvas-roi',
    props: {
        canvasWidth: {
            type: Number,
            default: 640,
        },
        canvasHeight: {
            type: Number,
            default: 480,
        },
        img: {
            type: String,
            default: '', //require("./ces.jpg")
        },
    },
    data() {
        return {
            startDraw: false, //开始绘制
            drawType: 1, //图形绘制模式；1：多边形  2：矩形   3:带箭头的线段
            isDrawing: false, //是否在画图形
            isFillArea: false, //是否填充区域
            ctx: null, //canvas对象
            coordinates: [], //一个多边形的坐标信息
            currentIndex: 0, //当前多边形的索引
            endDraw: false, //是否结束一个多边形的绘制
            allCoordinates: [], //所有多边形的信息
            isDrag: false, //是否拖动编辑
            dragIndex: [-1, -1],
            // img: require('./ces.jpg'), //摄像机截取画面
            scale: {
                x: 1,
                y: 1,
            },
            downPoint: { x: '', y: '' }, //鼠标按下
            upPoint: { x: '', y: '' }, //鼠标抬起
            closeDistance: 15,
            isShowRect: true, //是否显示可拖动矩形
            isFullScreen: false, //是否全屏绘制
            coordinatesData: [], //需要回显的坐标
            maxArea: 4, //最多可绘制多少个图形
            maxPoints: 5,
            lineColor: 'rgb(235, 57, 65)',
            fillColor: 'rgba(255, 77, 79,0.1)',
            direction: 1, //越线方向1:A<->B  2:A->B  3:A<-B  根据此值可换算高低位，例如1：0,0  2:1,0 3:0,1
        }
    },
    mounted() {
        this.initDraw()
    },
    methods: {
        handleSave() {
            console.log(this.allCoordinates)
            console.log(this.coordinates)
            console.log(this.scale)
            let jsonArr = [...this.allCoordinates]
            //保存时换算比例
            // jsonArr.map((polygon) => {
            //   //注意小数可能会有影响，可在计算比例时做相应处理
            //   let pointsArr = polygon.coordinates;
            //   pointsArr.map((point) => {
            //     point.x = parseInt(point.x / this.scale.x);
            //     point.y = parseInt(point.y / this.scale.y);
            //   });
            // });
            console.log(JSON.stringify(jsonArr))
            return jsonArr
        },
        handleChangeDirection() {
            //重新绘制箭头方向
            this.drawLineWithVerticalLine(this.direction)
        },
        handleRevoke() {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.allCoordinates.pop()
            this.drawAllLines()
            this.fillAllArea()
        },
        handleChangeDrawType(type, color, customType) {
            // this.startDraw = true
            this.isFullScreen = false
            this.handleChangeColor(color)
            if (type == 2) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
                this.allCoordinates = []
            }
            this.coordinates = []
            this.isDrawing = false
            this.endDraw = true
            this.drawType = type
            this.customType = customType
            if (this.drawType == 3) {
                this.maxArea = 1
            } else {
                this.maxArea = 4
            }
        },
        handleDrawAllCanvas(color) {
            if (!this.startDraw) return
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            let arr = [
                { x: 0, y: 0 },
                { x: this.canvasWidth, y: 0 },
                { x: this.canvasWidth, y: this.canvasHeight },
                { x: 0, y: this.canvasHeight },
            ]
            // this.allCoordinates = []
            this.lineColor = color
            this.allCoordinates.push({
                color: this.lineColor,
                coordinates: arr,
                customType: 'full',
            })
            this.$emit('drawEnd', 1) //绘制完成事件
            this.drawAllLines()
            this.fillAllArea()
            this.isFullScreen = true
        },
        //鼠标按下
        handleMouseDown(e) {
            if (!this.startDraw) return
            //点击右键不做处理
            if (e.button === 2) return
            if (this.isFullScreen) return
            let x = e.offsetX
            let y = e.offsetY
            this.downPoint.x = x
            this.downPoint.y = y

            if (this.handleClosePath(x, y)) return
            //判断是否点击的是可拖动端点
            // if (this.drawType === 1 && (this.isDragPoint(x, y) === 0 || this.isDragPoint(x, y))) {
            //     this.isDrag = true
            //     return
            // }
            //画布中鼠标按下
            if (this.endDraw) {
                //已经结束了上个多边形的绘制，把上个多边形的坐标放入数组，同时清空单个多边形数组信息
                this.endDraw = false
            }
            //判断落点是否在已有区域内
            // let selectedIndex = 0
            // let inside = this.allCoordinates.some((polygonObj, index) => {
            //     let polygon = polygonObj.coordinates
            //     selectedIndex = index
            //     return this.isPointInPolygon([x, y], polygon)
            // })
            // if (inside && this.drawType === 1) {
            //     this.isShowRect = true
            //     this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            //     this.drawAllLines()
            //     this.fillAllArea()
            //     this.drawCircle(this.allCoordinates[selectedIndex].coordinates)
            //     return
            // }
            //获取鼠标按下的坐标，放入数组中,限制绘制个数
            // if (this.allCoordinates.length == this.maxArea) {
            //     return
            // }
            console.log(this.coordinates)
            if (this.coordinates.length == this.maxPoints) {
                return
            }
            this.coordinates.push({ x: x, y: y })
            this.isDrawing = true //正在画多边形
        },
        handleMouseMove(e) {
            if (!this.isDrawing && !this.isDrag) return
            //画布中鼠标移动
            let x = e.offsetX
            let y = e.offsetY
            switch (this.drawType) {
                case 1:
                    this.drawPolygon(x, y)
                    break
                case 2:
                    this.drawRect(x, y)
                    break
                case 3:
                    this.drawPolygon(x, y)
                    break
            }
        },
        //鼠标抬起
        handleMouseUp(e) {
            //鼠标抬起时，判断是否是拖动
            this.upPoint.x = e.offsetX
            this.upPoint.y = e.offsetY
            if (!this.isShowRect) return
            this.dragIndex = [-1, -1]
            if (this.isDrag) {
                if (this.allCoordinates.length) {
                    // if (this.isCrossed(this.upPoint)) {
                    //   this.handleMouseMove({
                    //     offsetX: this.downPoint.x,
                    //     offsetY: this.downPoint.y,
                    //   });
                    //   this.isDrag = false;
                    //
                    //   return;
                    // }
                }
                this.isDrag = false
            }
        },
        //取消当前绘制
        handleContextMenu(event) {
            event.preventDefault()
            if (this.drawType === 3) {
                return
            }
            if (!this.endDraw && this.isDrawing) {
                if (this.coordinates.length > 2) {
                    this.drawClosePath()
                    this.isDrawing = false
                    this.endDraw = true
                    this.coordinates = []
                    this.$emit('drawEnd', this.drawType) //绘制完成事件
                } else {
                    this.coordinates = []
                    this.drawClosePath()
                }
            }
        },
        //更换颜色
        handleChangeColor(color) {
            this.lineColor = color || 'rgb(4,211,248)'
            this.fillColor = color || 'rgba(4,211,248,0.1)'
            this.ctx.strokeStyle = this.lineColor
            this.ctx.fillStyle = this.fillColor
        },
        //清空
        handleClear() {
            this.allCoordinates = []
            this.coordinates = []
            this.isDrawing = false
            this.endDraw = false
            this.isFullScreen = false
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        },
        //绘制多边形
        drawPolygon(x, y) {
            //没开始画或者结束画之后不进行操作
            if (this.isDrag) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
                this.allCoordinates[this.dragIndex[0]]['coordinates'][this.dragIndex[1]].x = x
                this.allCoordinates[this.dragIndex[0]]['coordinates'][this.dragIndex[1]].y = y
                this.drawAllLines()
                this.drawCircle(this.allCoordinates[this.dragIndex[0]].coordinates)
                this.fillAllArea()
            }
            if (this.coordinates.length == 0 || !this.isDrawing || this.endDraw) {
                return 0
            }
            if (this.coordinates.length > 2) {
                if (
                    x > this.coordinates[0].x - this.closeDistance &&
                    x < this.coordinates[0].x + this.closeDistance &&
                    y > this.coordinates[0].y - this.closeDistance &&
                    y < this.coordinates[0].y + this.closeDistance
                ) {
                    x = this.coordinates[0].x
                    y = this.coordinates[0].y
                }
            }
            if (this.coordinates.length > 1 && this.drawType === 3) {
                //处理绘制线段
                // console.log(432);
                this.allCoordinates.push({
                    color: this.lineColor,
                    coordinates: this.coordinates,
                    customType: this.customType,
                })
                this.$emit('drawEnd', this.drawType) //绘制完成事件
                this.coordinates = []
                this.drawLineWithVerticalLine(this.direction)
                return
            }
            //获取上一个点
            let last_x = this.coordinates[this.coordinates.length - 1].x
            let last_y = this.coordinates[this.coordinates.length - 1].y
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight) //清空画布
            this.drawLine() //把之前的点连线

            if (this.allCoordinates.length != 0) {
                //不止一个多边形，把多边形们画出来
                this.drawAllLines()
                this.fillAllArea()
            }
            //获取鼠标移动时的点，画线，实现线段跟踪效果。
            this.ctx.beginPath()
            this.ctx.moveTo(last_x, last_y)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
            this.ctx.closePath()
        },
        //绘制矩形
        drawRect(x, y) {
            if (this.coordinates.length == 0 || !this.isDrawing || this.endDraw) {
                return 0
            }
            let width = x - this.downPoint.x
            let height = y - this.downPoint.y
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            //绘制已有矩形
            if (this.allCoordinates.length != 0) {
                this.drawAllLines()
                if (this.drawType !== 3) {
                    this.fillAllArea()
                }
            }
            this.ctx.strokeStyle = this.lineColor
            this.ctx.beginPath()
            this.ctx.rect(this.downPoint.x, this.downPoint.y, width, height)
            this.ctx.stroke()
            this.ctx.closePath()
        },
        //绘制带箭头的线段
        drawLineWithVerticalLine(type = 1) {
            // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.allCoordinates
                .filter((coo) => coo.customType == 'line')
                .map((polygonObj) => {
                    if (polygonObj.customType != 'line') return
                    if (polygonObj.color) {
                        this.ctx.strokeStyle = polygonObj.color
                    }
                    //做个简单排序，防止方向异常
                    const polygon = polygonObj.coordinates
                    const points = [...polygon].sort((a, b) => a.y - b.y)
                    let startX = points[0].x
                    let startY = points[0].y
                    let endX = points[1].x
                    let endY = points[1].y
                    this.drawSingleLine(startX, startY, endX, endY)
                    this.drawArrowLine(startX, startY, endX, endY, type)
                })
            // this.ctx.strokeStyle = this.lineColor
        },
        /**
         *
         * @param startX 开始点位x
         * @param startY 开始点位y
         * @param endX 结束点位x
         * @param endY 结束点位y
         * @param type 1:A<->B  2:A->B  3:A<-B
         */
        drawArrowLine(startX, startY, endX, endY, type = 1) {
            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2
            const dx = endY - startY
            const dy = -(endX - startX)
            const len = Math.sqrt(dx ** 2 + dy ** 2)
            const vx = dx / len
            const vy = dy / len
            const fromX = midX + vx * 30
            const fromY = midY + vy * 30
            const toX = midX - vx * 30
            const toY = midY - vy * 30

            this.drawSingleLine(fromX, fromY, toX, toY)
            this.ctx.fillStyle = 'blue'
            this.ctx.font = 'bold 16px Arial'
            this.ctx.fillText('A', toX - 12, toY + 5)
            this.ctx.fillText('B', fromX + 2, fromY + 5)
            if (type === 1 || type === 3) {
                //左边
                this.drawArrow(toX, toY, fromX, fromY)
            }
            //右边
            if (type === 1 || type === 2) {
                this.drawArrow(fromX, fromY, toX, toY)
            }
        },
        drawArrow(fromX, fromY, toX, toY) {
            //绘制箭头
            const headlen = 10
            const angle = Math.atan2(toY - fromY, toX - fromX) // 线段倾斜角度
            this.ctx.beginPath()
            this.ctx.moveTo(toX, toY)
            this.ctx.lineTo(fromX, fromY)
            this.ctx.lineTo(
                fromX + headlen * Math.cos(angle - Math.PI / 6),
                fromY + headlen * Math.sin(angle - Math.PI / 6)
            )
            this.ctx.moveTo(fromX, fromY)
            this.ctx.lineTo(
                fromX + headlen * Math.cos(angle + Math.PI / 6),
                fromY + headlen * Math.sin(angle + Math.PI / 6)
            )
            this.ctx.stroke()
            this.ctx.closePath()
        },
        //绘制单根线段
        drawSingleLine(startX, startY, endX, endY) {
            this.ctx.beginPath()
            this.ctx.moveTo(startX, startY)
            this.ctx.lineTo(endX, endY)
            this.ctx.stroke()
            this.ctx.closePath()
        },
        //判断是否点击在区域内
        isPointInPolygon(point, polygon) {
            let x = point[0],
                y = point[1]
            let inside = false
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                let xi = polygon[i].x,
                    yi = polygon[i].y
                let xj = polygon[j].x,
                    yj = polygon[j].y
                let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
                if (intersect) inside = !inside
            }
            return inside
        },
        //填充
        fillAllArea() {
            if (!this.isFillArea) return
            this.ctx.fillStyle = this.fillColor
            for (let i = 0; i < this.allCoordinates.length; i++) {
                //todo:填充色
                let cors = this.allCoordinates[i].coordinates
                let x0 = cors[0].x
                let y0 = cors[0].y
                this.ctx.beginPath()
                this.ctx.moveTo(x0, y0)
                for (let j = 1; j < cors.length; j++) {
                    let x = cors[j].x
                    let y = cors[j].y
                    this.ctx.lineTo(x, y)
                }
                this.ctx.fill()
                this.ctx.closePath()
            }
        },
        initDraw() {
            //初始化画布对象
            const canvas = this.$refs.ROICanvas
            this.ctx = canvas.getContext('2d')
            this.ctx.strokeStyle = this.lineColor
            if (this.allCoordinates.length > 0) {
                this.drawClosePath()
            }
            // let img = new Image()
            // img.crossOrigin = 'anonymous'
            // img.onload = (ev) => {
            //     let oriWidth = ev.target.width
            //     let oriHeight = ev.target.height
            //     this.scale.x = this.canvasWidth / oriWidth
            //     this.scale.y = this.canvasHeight / oriHeight
            // }
            // img.src = this.img
        },
        //判断的是否是同一个点
        isDragPoint(x, y) {
            if (this.allCoordinates.length === 0) {
                return false
            }
            for (let i = 0; i < this.allCoordinates.length; i++) {
                for (let j = 0; j < this.allCoordinates[i]['coordinates'].length; j++) {
                    let px = this.allCoordinates[i]['coordinates'][j].x
                    let py = this.allCoordinates[i]['coordinates'][j].y
                    if (Math.abs(x - px) <= 8 && Math.abs(y - py) <= 8) {
                        this.dragIndex[0] = i
                        this.dragIndex[1] = j
                        return j
                    }
                }
            }
            return false
        },
        //手动闭合路径
        handleClosePath(x, y) {
            switch (this.drawType) {
                case 1:
                    if (this.coordinates.length > 2) {
                        if (
                            x > this.coordinates[0].x - this.closeDistance &&
                            x < this.coordinates[0].x + this.closeDistance &&
                            y > this.coordinates[0].y - this.closeDistance &&
                            y < this.coordinates[0].y + this.closeDistance
                        ) {
                            if (this.isDrawing) {
                                this.drawClosePath()
                                this.$emit('drawEnd', this.drawType) //绘制完成事件
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                    break
                case 2:
                    if (this.isDrawing) {
                        //计算矩形的点位
                        if (this.coordinates.length) {
                            let x0 = this.coordinates[0].x || 0
                            let y0 = this.coordinates[0].y || 0
                            let width = parseInt(x - x0)
                            let height = parseInt(y - y0)
                            let x1 = x0 + width
                            let y1 = y0
                            this.coordinates.push({ x: x1, y: y1 })
                            let x2 = x0 + width
                            let y2 = y0 + height
                            this.coordinates.push({ x: x2, y: y2 })
                            let x3 = x0
                            let y3 = y0 + height
                            this.coordinates.push({ x: x3, y: y3 })
                        }
                        this.drawClosePath()
                        this.$emit('drawEnd', this.drawType) //绘制完成事件
                        return true
                    } else {
                        return false
                    }
                case 3:
                    if (this.isDrawing) {
                        if (this.coordinates.length > 1) {
                            this.isDrawing = false
                            this.endDraw = true
                            return true
                        } else {
                            return false
                        }
                    }
            }

            return false
        },
        drawAllLines() {
            // let lines = this.allCoordinates.filter(a=>a.customType == 'line')
            let polygons = this.allCoordinates.filter((a) => a.customType != 'line')
            //把所有多边形画出来
            for (let i = 0; i < polygons.length; i++) {
                let cors = polygons[i]['coordinates']
                if (polygons[i].color) {
                    this.ctx.strokeStyle = polygons[i].color
                }

                //前后坐标连线
                for (let j = 0; j < cors.length - 1; j++) {
                    this.ctx.beginPath()
                    let x0 = cors[j].x
                    let y0 = cors[j].y
                    let x1 = cors[j + 1].x
                    let y1 = cors[j + 1].y
                    this.ctx.moveTo(x0, y0)
                    this.ctx.lineTo(x1, y1)
                    this.ctx.stroke()
                    this.ctx.closePath()
                }
                // if (this.drawType === 3) {
                //     return
                // }
                //最后一个与第一个连线
                let begin_x = cors[0].x
                let begin_y = cors[0].y
                let end_x = cors[cors.length - 1].x
                let end_y = cors[cors.length - 1].y
                this.ctx.beginPath()
                this.ctx.moveTo(begin_x, begin_y)
                this.ctx.lineTo(end_x, end_y)
                this.ctx.stroke()
                this.ctx.closePath()
                this.ctx.strokeStyle = this.lineColor
            }
            this.drawLineWithVerticalLine(this.direction)
            if (!this.allCoordinates.length) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            }
        },
        //绘制当前多边形线段
        drawLine() {
            //把当前绘制的多边形之前的坐标线段绘制出来
            for (let i = 0; i < this.coordinates.length - 1; i++) {
                this.ctx.beginPath()
                let x0 = this.coordinates[i].x
                let y0 = this.coordinates[i].y
                let x1 = this.coordinates[i + 1].x
                let y1 = this.coordinates[i + 1].y
                this.ctx.moveTo(x0, y0)
                this.ctx.lineTo(x1, y1)
                this.ctx.stroke()
                this.ctx.closePath()
            }
        },
        //为当前的多边形端点画圆
        drawCircle(polygon) {
            this.ctx.strokeStyle = this.lineColor
            this.ctx.fillStyle = '#fff'
            for (let i = 0; i < polygon.length; i++) {
                let x = polygon[i].x
                let y = polygon[i].y
                this.ctx.beginPath()
                this.ctx.moveTo(x, y)
                this.ctx.rect(x - 6, y - 6, 12, 12)
                this.ctx.stroke()
                this.ctx.fill()
                this.ctx.closePath()
            }
        },
        // 辅助函数 检查两个线是否交叉
        isIntersect(line1, line2) {
            // 转换成一般式: Ax+By = C
            let a1 = line1.y2 - line1.y1
            let b1 = line1.x1 - line1.x2
            let c1 = a1 * line1.x1 + b1 * line1.y1
            //转换成一般式: Ax+By = C
            let a2 = line2.y2 - line2.y1
            let b2 = line2.x1 - line2.x2
            let c2 = a2 * line2.x1 + b2 * line2.y1
            // 计算交点
            let d = a1 * b2 - a2 * b1
            // 当d==0时，两线平行
            if (d == 0) {
                return false
            } else {
                let x = (b2 * c1 - b1 * c2) / d
                let y = (a1 * c2 - a2 * c1) / d
                // 检测交点是否在两条线段上
                if (
                    (this.isInBetween(line1.x1, x, line1.x2) || this.isInBetween(line1.y1, y, line1.y2)) &&
                    (this.isInBetween(line2.x1, x, line2.x2) || this.isInBetween(line2.y1, y, line2.y2))
                ) {
                    return true
                }
            }
            return false
        },
        isInBetween(a, b, c) {
            // 如果b几乎等于a或c，返回false.为了避免浮点运行时两值几乎相等，但存在相差0.00000...0001的这种情况出现使用下面方式进行避免
            if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
                return false
            }
            return (a < b && b < c) || (c < b && b < a)
        },
        //绘制闭合路径
        drawClosePath() {
            this.isDrawing = false
            this.endDraw = true
            if (this.coordinates.length) {
                this.allCoordinates.push({
                    color: this.lineColor,
                    coordinates: this.coordinates,
                    customType: this.customType,
                })
            }

            this.isShowRect = false
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.ctx.fillStyle = this.fillColor
            this.drawLineWithVerticalLine(this.direction)
            this.allCoordinates
                .filter((coord) => coord.customType != 'line')
                .map((polygonObj) => {
                    if (polygonObj.color) {
                        this.ctx.strokeStyle = polygonObj.color
                    }
                    const polygon = polygonObj.coordinates
                    this.ctx.beginPath()
                    let bx = polygon[0].x
                    let by = polygon[0].y
                    this.ctx.moveTo(bx, by)
                    polygon.map((point) => {
                        this.ctx.lineTo(point.x, point.y)
                    })
                    this.ctx.closePath()
                    this.ctx.stroke()
                    if (this.isFillArea) {
                        this.ctx.fill()
                    }
                })
            this.ctx.strokeStyle = this.lineColor
            this.coordinates = []
            this.isFullScreen = false
        },
    },
}
</script>

<style scoped>
.roi-canvas {
    border: 1px solid rgb(110, 110, 110);
    margin: auto;
    display: block;
    box-sizing: border-box;
}
.tools-wrapper {
    margin-top: 50px;
}
</style>
