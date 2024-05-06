// 页面水印
export default class WaterMask {
  constructor() {
    this.watermark = null //水印蒙层dom对象
    this.hasWatermark = false //记录是否已存在水印
    this.targetNode = null // 要添加水印的目标节点,如果不存在则添加全局水印
    this.init() //作准备
  }
  init() {
    this.watermark = document.createElement('div') //生成一张水印容器
    this.watermark.className = 'watermark'
    this.width = 600 // 单个水印宽度 px
    this.height = 500 // 单个水印高度 px
    this.zIndex = 100000000 // 水印节点层级(默认为最大层级)
    this.backgroundPosition = '0px 0px, 0px 0px' // 水印节点的背景图片位置
    this.rotate = (45 * Math.PI) / 180
    this.fontFamily = 'sans-serif'
    this.fontSize = 14
    this.content = ''
    this.color = '#999'
    this.globalAlpha = 0.8
  }
  /**
   * 根据传入的dom 生成一张水印填充到dom中
   * @param {Object} dom 节点
   * @param {Object} data 水印参数
   * @param {Object} preview 是否预览
   */
  create(dom, data, preview) {
    this.targetNode = dom
    let { size, alpha, color, content, position } = data
    this.content = content
    if (position == '0') {
      this.rotate = (-45 * Math.PI) / 180
    } else {
      this.rotate = (45 * Math.PI) / 180
    }
    let WScale = 1
    if (typeof content == 'string') {
      if (content.length < 8) WScale = 2
    } else {
      if (content[0].length < 8 && content[1].length < 8) WScale = 2
    }

    if (6 <= size && 12 >= size) {
      this.width = 200 / WScale
      this.height = 200 / WScale
    }
    if (13 <= size && 18 >= size) {
      this.width = 240 / WScale
      this.height = 240 / WScale
    }
    if (19 <= size && 24 >= size) {
      this.width = 310 / WScale
      this.height = 310 / WScale
    }
    if (25 <= size && 30 >= size) {
      this.width = 380 / WScale
      this.height = 380 / WScale
    }
    if (31 <= size && 36 >= size) {
      this.width = 450 / WScale
      this.height = 450 / WScale
    }
    if (37 <= size && 42 >= size) {
      this.width = 520 / WScale
      this.height = 520 / WScale
    }
    if (43 <= size && 48 >= size) {
      this.width = 590 / WScale
      this.height = 590 / WScale
    }
    if (size >= 49) {
      this.width = 700 / WScale
      this.height = 700 / WScale
    }
    if (preview) {
      if (this.width > dom.clientWidth) this.width = dom.clientWidth
      if (this.height > dom.clientHeight) this.height = dom.clientHeight
    } else {
      this.width = this.width > 250 ? this.width : 250
      this.height = this.height > 250 ? this.height : 250
    }
    this.fontSize = size
    this.globalAlpha = alpha
    // this.color = color
    let target = this.targetNode
    this.watermark.style.cssText = `
            z-index: ${this.zIndex} !important;
            position: absolute !important;
            pointer-events: none !important;
            height: ${target.scrollHeight}px !important;
            min-height: 100%;
            width: 100% !important;
            top: 0px !important;
            left: 0px !important;
            background-image: url(${this.getImage()}) !important;
            background-size: ${this.width}px ${this.height}px !important;
            background-repeat: repeat !important;
            background-position: ${this.backgroundPosition} !important;
        `
    this.hasWatermark = true
    target.appendChild(this.watermark)
  }

  /**
   * 根据传入的dom 删除dom中的填充水印
   * @param {Object} dom 节点
   */
  removeWaterMask(dom) {
    if (this.hasWatermark) dom.removeChild(this.watermark)
    this.hasWatermark = false
  }
  getImage() {
    let image
    try {
      const canvas = this.draw()
      image = canvas.toDataURL('image/png', 1)
      canvas.remove()
    } catch {
      this.errCallback()
    }
    return image
  }
  draw() {
    // 1.创建canvas元素
    const canvas = this.createHDCanvas()
    // 2.获取上下文
    const context = canvas.getContext('2d')
    // 字体
    context.font = this.fontSize + 'px ' + this.fontFamily
    // 对齐方式
    context.textAlign = 'center'
    // 底部对齐方式(top  bottom middle)
    context.textBaseline = 'middle'
    // 字体颜色
    context.fillStyle = this.color
    // 设置透明度
    context.globalAlpha = this.globalAlpha
    // 平移转换,修改原点
    context.translate(this.width / 2, this.height / 2)
    // 旋转画布
    context.rotate(this.rotate)
    // 绘制填充文本(文字左下角的X坐标,文字左下角的Y坐标);
    const contentType = Object.prototype.toString.call(this.content)
    const temp = ['[object Array]', '[object Object]'] // 数组或对象
    // 如果content是数组或对象时，当做多行处理
    if (temp.includes(contentType)) {
      let posY = 0
      for (let key in this.content) {
        context.fillText(this.content[key], 0, posY)
        posY += this.fontSize + 4
      }
    } else {
      context.fillText(this.content, 0, 0)
    }
    return canvas
  }

  // 创建高清Canvas
  createHDCanvas() {
    const ratio = window.devicePixelRatio || 1
    const canvas = document.createElement('canvas')
    canvas.width = this.width * ratio // 实际渲染像素
    canvas.height = this.height * ratio // 实际渲染像素
    canvas.style.width = `${this.width}px` // 控制显示大小
    canvas.style.height = `${this.height}px` // 控制显示大小
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
    return canvas
  }
}
