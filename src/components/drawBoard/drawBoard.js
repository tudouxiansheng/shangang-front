import { fabric } from 'fabric-pure-browser'
import { generateUuid } from '@/utils/common/utils'

const W = window

export const DrawMode = {
  SELECT: 'select', // 选择
  LINE: 'line', // 画直线
  DOUBLELINE: 'doubleSideLine', // 双向线
  POSITIVELINE: 'positiveLine', // 正向线
  REVERSELINE: 'reverseLine', // 反向线
  PEN: 'pen', // 画笔，自由绘图
  RECT: 'rect', // 画矩形
  POLYGON: 'polygon', // 画多边形
  CIRCLE: 'circle', // 画圆形
  TEXT: 'text', // 绘制文字
  CUSTOM: 'custom' // 自定义绘制
}

export const CustomShape = {
  LINE: 'line', // 线
  DOUBLELINE: 'doubleSideLine', // 双向线
  POSITIVELINE: 'positiveLine', // 正向线
  REVERSELINE: 'reverseLine', // 反向线
  RECT: 'rect', // 矩形区域
  POLYGON: 'polygon', // 区域
  RECTEXCLUDE: 'rectExclude', // 矩形排除区域
  POLYGONEXCLUDE: 'polygonExclude', // 排除区域
  MINTARGET: 'minTarget', // 最小运动目标
  MAXTARGET: 'maxTarget' // 最大运动目标
}

// 默认笔刷样式
export const DEFAULT_BRUSH_COLOR = '#000'
export const DEFAULT_BRUSH_WIDTH = 2
// 默认背景色
export const DEFAULT_BACKGROUND_COLOR = '#fff'
// 透明色
export const TRANSPARENT_COLOR = 'rgba(0, 0, 0, 0)'
// 默认字体大小
export const DEFAULT_FONT_SIZE = 16
// 默认缩放比例
export const DEFAULT_ZOOM = 1
export const DEFAULT_MIN_ZOOM = 0.2
export const DEFAULT_MAX_ZOOM = 3

const noop = () => {}

export const DoubleSideLine = fabric.util.createClass(fabric.Line, {
  type: DrawMode.DOUBLELINE,
  initialize: function (points, options) {
    options || (options = {})

    this.callSuper('initialize', points, options)
    this.set('id', options.id || '')
    this.set('label', options.label || '')
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id'),
      label: this.get('label')
    })
  },

  _render: function (ctx) {
    this.callSuper('_render', ctx)
    RenderArrowLineFun.apply(this, arguments)
  }
})

export const PositiveLine = fabric.util.createClass(fabric.Line, {
  type: DrawMode.POSITIVELINE,
  initialize: function (points, options) {
    options || (options = {})

    this.callSuper('initialize', points, options)
    this.set('id', options.id || '')
    this.set('label', options.label || '')
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id'),
      label: this.get('label')
    })
  },

  _render: function (ctx) {
    this.callSuper('_render', ctx)
    RenderArrowLineFun.apply(this, arguments)
  }
})

export const ReverseLine = fabric.util.createClass(fabric.Line, {
  type: DrawMode.REVERSELINE,
  initialize: function (points, options) {
    options || (options = {})

    this.callSuper('initialize', points, options)
    this.set('id', options.id || '')
    this.set('label', options.label || '')
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id'),
      label: this.get('label')
    })
  },

  _render: function (ctx) {
    this.callSuper('_render', ctx)
    RenderArrowLineFun.apply(this, arguments)
  }
})

export const Polygon = fabric.util.createClass(fabric.Polygon, {
  type: DrawMode.POLYGON,
  initialize: function (points, options) {
    options || (options = {})

    this.callSuper('initialize', points, options)
    this.set('id', options.id || '')
    this.set('label', options.label || '')
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id'),
      label: this.get('label')
    })
  },

  _render: function (ctx) {
    this.callSuper('_render', ctx)
    let zoom = 1
    if (this.strokeWidth > 2) {
      zoom = this.strokeWidth / 2
    }

    ctx.font = `${zoom * 16}px Microsoft YaHei`
    ctx.fillStyle = this.stroke
    ctx.fillText(this.label, -this.width / 6, -this.height / 4 + 20)
  }
})

const RenderArrowLineFun = function (ctx) {
  let zoom = 1

  if (this.strokeWidth > 2) {
    zoom = this.strokeWidth / 2
  }
  let p = this.calcLinePoints()
  let middleX = (p.x1 + p.x2) * 0.5
  let middleY = (p.y1 + p.y2) * 0.5
  // 根据x、y的值 计算是x1-x2 还是x2-x1 以及y2-y1 还是 y1-y2
  let borderX = null
  let borderY = null
  if (p.x1 > p.x2 && p.y2 > p.y1) {
    borderX = p.x2 - p.x1
    borderY = p.y2 - p.y1
  } else if (p.x1 > p.x2 && p.y1 > p.y2) {
    borderX = p.x1 - p.x2
    borderY = p.y2 - p.y1
  } else if (p.x2 > p.x1 && p.y1 > p.y2) {
    borderX = p.x2 - p.x1
    borderY = p.y1 - p.y2
  } else {
    borderX = p.x1 - p.x2
    borderY = p.y1 - p.y2
  }
  // 斜边l1的长度为
  let l1 = Math.sqrt(Math.pow(borderX, 2) + Math.pow(borderY, 2))
  // 定义l2的默认长度为50
  let l2 = 80
  let h2 = (l2 * borderX) / l1
  let s2 = Math.sqrt(Math.pow(l2, 2) - Math.pow(h2, 2))
  // 中间上方顶点x,y坐标
  let endX = p.x2 >= p.x1 ? s2 + middleX : middleX - s2
  let endY = middleY + h2
  // 中间下方顶点x,y坐标
  let end2X = 2 * middleX - endX
  let end2Y = 2 * middleY - endY

  // 箭头线与直线的夹角
  const theta = 30 * 1
  // 箭头线长度
  const headlen = 8 * 1

  const angle1 = ((Math.atan2(middleY - endY, middleX - endX) * 180) / Math.PI) * 1
  const angle11 = (((angle1 + theta) * Math.PI) / 180) * 1
  const angle12 = (((angle1 - theta) * Math.PI) / 180) * 1
  const topX = headlen * Math.cos(angle11) * zoom
  const topY = headlen * Math.sin(angle11) * zoom
  const botX = headlen * Math.cos(angle12) * zoom
  const botY = headlen * Math.sin(angle12) * zoom
  const angle2 = ((Math.atan2(middleY - end2Y, middleX - end2X) * 180) / Math.PI) * 1
  const angle21 = (((angle2 + theta) * Math.PI) / 180) * 1
  const angle22 = (((angle2 - theta) * Math.PI) / 180) * 1
  const top2X = headlen * Math.cos(angle21) * zoom
  const top2Y = headlen * Math.sin(angle21) * zoom
  const bot2X = headlen * Math.cos(angle22) * zoom
  const bot2Y = headlen * Math.sin(angle22) * zoom
  const angle3 = ((Math.atan2(p.y1 - p.y2, p.x1 - p.x2) * 180) / Math.PI) * 1
  const angle31 = (((angle3 + theta) * Math.PI) / 180) * 1
  const angle32 = (((angle3 - theta) * Math.PI) / 180) * 1
  const top3X = headlen * Math.cos(angle31) * zoom
  const top3Y = headlen * Math.sin(angle31) * zoom
  const bot3X = headlen * Math.cos(angle32) * zoom
  const bot3Y = headlen * Math.sin(angle32) * zoom

  let arrowX = p.x2 + top3X
  let arrowY = p.y2 + top3Y
  ctx.beginPath()
  ctx.moveTo(arrowX, arrowY)
  ctx.lineTo(p.x2, p.y2)
  arrowX = p.x2 + bot3X
  arrowY = p.y2 + bot3Y
  ctx.lineTo(arrowX, arrowY)

  // 画中间上方直线
  ctx.moveTo(middleX, middleY)
  ctx.lineTo(endX, endY)
  if (
    this.type === DrawMode.DOUBLELINE ||
    (this.type === DrawMode.POSITIVELINE &&
      ((p.x1 > p.x2 && p.y2 > p.y1) || (p.x2 > p.x1 && p.y1 > p.y2))) ||
    (this.type === DrawMode.REVERSELINE &&
      ((p.x1 > p.x2 && p.y1 > p.y2) || (p.x2 > p.x1 && p.y2 > p.y1)))
  ) {
    // 画中间上方箭头
    arrowX = endX + topX
    arrowY = endY + topY
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(endX, endY)
    arrowX = endX + botX
    arrowY = endY + botY
    ctx.lineTo(arrowX, arrowY)
  }
  // 画中间下方直线
  ctx.moveTo(middleX, middleX)
  ctx.lineTo(end2X, end2Y)
  if (
    this.type === DrawMode.DOUBLELINE ||
    (this.type === DrawMode.POSITIVELINE &&
      ((p.x1 > p.x2 && p.y1 > p.y2) || (p.x2 > p.x1 && p.y2 > p.y1))) ||
    (this.type === DrawMode.REVERSELINE &&
      ((p.x1 > p.x2 && p.y2 > p.y1) || (p.x2 > p.x1 && p.y1 > p.y2)))
  ) {
    arrowX = end2X + top2X
    arrowY = end2Y + top2Y
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(end2X, end2Y)
    arrowX = end2X + bot2X
    arrowY = end2Y + bot2Y
    ctx.lineTo(arrowX, arrowY)
  }

  ctx.stroke()

  ctx.font = `${zoom * 16}px Microsoft YaHei`
  ctx.fillStyle = this.stroke
  let textY = -this.height / 2 - 20
  if (this.y1 > this.y2) {
    textY = this.height / 2 - 20
  }
  let textX = -this.width / 2
  if (this.x1 > this.x2) {
    textX = this.width / 2
  }
  ctx.fillText(this.label, textX, textY)
}

export default class {
  /** 用于控制绘画频率 */
  draw_rate = 0
  /** 窗口中页面的当前显示大小(缩放系数) */
  window_zoom = W.zoom ? W.zoom : 1
  /** canvas zoom */
  canvas_zoom = DEFAULT_ZOOM
  canvas_min_zoom = DEFAULT_MIN_ZOOM
  canvas_max_zoom = DEFAULT_MAX_ZOOM
  /** canvas element */
  canvas = null
  /** fabric.Canvas 画板对象 */
  fCanvas = null

  /** 当前是否正在绘制中 */
  in_drawing = false
  /** 当前是否正在拖拽中 */
  in_dragging = false
  /** 移动图像的坐标 */
  drag_last_posx = 0
  drag_last_posy = 0

  /** 存储鼠标 xy pos 信息 */
  from_mouse_info = { x: 0, y: 0 }
  to_mouse_info = { x: 0, y: 0 }
  /** 绘制模式 */
  draw_mode = DrawMode.SELECT
  /** 自定义图形类型 */
  custom_shape = null
  /** 绘制前需要删除的对象下标 */
  need_delete_obj_index = -1
  /** 笔刷样式 */
  brush_color = DEFAULT_BRUSH_COLOR
  brush_width = DEFAULT_BRUSH_WIDTH
  font_size = DEFAULT_FONT_SIZE
  /** 当前正在绘制的 obj */
  current_draw_obj = null
  /** 当前正在输入文本 */
  current_text_obj = null
  /** 历史记录 */
  history = []
  point_array = []
  maxPoint = 10
  /** 事件 */
  back_event = noop
  zoom_change = noop
  drag_event = noop
  draw_complete_event = noop
  object_mouseup_event = noop
  /** 自定义绘制 */
  custom_draw_store = []

  /** 获取适配后的鼠标 from/to pos */
  get_fix_mouse_info() {
    const from_pos = this.from_mouse_info
    const to_pos = this.to_mouse_info
    const zoom = this.canvas_zoom
    const vtfx = this.fCanvas.viewportTransform ? this.fCanvas.viewportTransform[4] : 0
    const vtfy = this.fCanvas.viewportTransform ? this.fCanvas.viewportTransform[5] : 0

    return {
      from: {
        x: from_pos.x / zoom - vtfx / zoom,
        y: from_pos.y / zoom - vtfy / zoom
      },
      to: {
        x: to_pos.x / zoom - vtfx / zoom,
        y: to_pos.y / zoom - vtfy / zoom
      }
    }
  }

  constructor(options) {
    if (!options.canvas) {
      throw new Error('[drawboard] canvas element not found!')
    }
    this.canvas = options.canvas
    this.fCanvas = new fabric.Canvas(this.canvas, {
      selection: false,
      skipTargetFind: true
    })
    // 取消缓存，解决缩放拖拽时样式问题
    fabric.Object.prototype.objectCaching = false

    // 初始化画板样式
    this.init_style(options)
    // 初始化画板事件
    this.init_event()
    // 初始化 mode
    this.set_mode(options.mode || DrawMode.PEN)

    if (options.back_event) {
      this.back_event = options.back_event
    }
    if (options.zoom_change) {
      this.zoom_change = options.zoom_change
    }
    if (options.drag_event) {
      this.drag_event = options.drag_event
    }
    if (options.draw_complete_event) {
      this.draw_complete_event = options.draw_complete_event
    }
    if (options.object_mouseup_event) {
      this.object_mouseup_event = options.object_mouseup_event
    }
    if (options.maxPoint) {
      this.maxPoint = options.maxPoint
    }

    this.enableSelect = options.enableSelect ? true : false
    this.enable_select()
  }

  /**
   * 清空画板
   * state: 是否会清空历史记录
   */
  clear(state = false) {
    this.fCanvas.clear()
    this.current_text_obj = null
    this.current_draw_obj = null

    if (state) {
      this.save_state()
    } else {
      this.history = []
    }
  }

  /**
   * destroy
   */
  destroyed() {
    this.clear()
    this.fCanvas.dispose()
  }

  /**
   * 初始化事件
   */
  init_event() {
    this.fCanvas.on('mouse:down', options => {
      const ev = options.e

      if (ev.altKey) {
        this.in_drawing = false
        this.fCanvas.isDrawingMode = false

        this.in_dragging = true
        this.fCanvas.selection = false
        this.fCanvas.skipTargetFind = true
        this.drag_last_posx = ev.clientX
        this.drag_last_posy = ev.clientY
        if (this.drag_event) {
          this.drag_event(true)
        }

        if (this.current_text_obj) {
          // 退出文本编辑状态
          this.current_text_obj.exitEditing()
          this.current_text_obj = null
        }

        ev.preventDefault()
        ev.stopPropagation()
        return
      }

      this.save_mouse_info(options)
      this.in_drawing = true
      if (
        (this.draw_mode !== DrawMode.POLYGON && this.draw_mode !== undefined) ||
        (this.draw_mode === DrawMode.POLYGON && !this.point_array.length)
      ) {
        this.save_state()
      }
      if (this.need_delete_obj_index !== -1) {
        let object = this.get_objects()
        this.fCanvas.remove(object[this.need_delete_obj_index])
        this.need_delete_obj_index = -1
      }
      this.draw_in_down()
      ev.preventDefault()
      ev.stopPropagation()
    })

    this.fCanvas.on('mouse:up', options => {
      const ev = options.e

      if (this.in_dragging) {
        this.in_dragging = false
        if (this.drag_event) {
          this.drag_event(false)
        }
        ev.preventDefault()
        ev.stopPropagation()
        return
      }

      if (this.draw_mode === DrawMode.POLYGON) {
        return
      }

      if (
        this.custom_shape === CustomShape.MINTARGET ||
        this.custom_shape === CustomShape.MAXTARGET
      ) {
        let object = this.get_objects()
        let minTargetObj = object.find(item => item.shape === CustomShape.MINTARGET)
        let maxTargetObj = object.find(item => item.shape === CustomShape.MAXTARGET)
        if (minTargetObj && maxTargetObj) {
          let minTarget = minTargetObj.getBoundingRect()
          let maxTarget = maxTargetObj.getBoundingRect()
          if (minTarget.width * minTarget.height >= maxTarget.width * maxTarget.height) {
            if (this.custom_shape === CustomShape.MINTARGET) {
              this.fCanvas.remove(minTargetObj)
            } else {
              this.fCanvas.remove(maxTargetObj)
            }
            // Message.error(this.$t('analysisTask.objectAreaPrompt)')
          }
        }
      }

      this.save_mouse_info(options, false)
      this.draw_in_up()

      this.dispatchCompleteEvent()
      this.current_draw_obj = null // 鼠标抬起时，置空当前正在绘制的 obj，避免该对象在下次绘制时被删除
      this.in_drawing = false
      this.enable_select()
      ev.preventDefault()
      ev.stopPropagation()
    })

    this.fCanvas.on('mouse:move', options => {
      const ev = options.e

      if (this.in_dragging) {
        if (!this.fCanvas.viewportTransform) {
          return
        }
        const current_x = this.fCanvas.viewportTransform[4] + ev.clientX - this.drag_last_posx
        const current_y = this.fCanvas.viewportTransform[5] + ev.clientY - this.drag_last_posy

        this.fCanvas.viewportTransform[4] = current_x
        this.fCanvas.viewportTransform[5] = current_y
        this.drag_last_posx = ev.clientX
        this.drag_last_posy = ev.clientY
        this.fCanvas.requestRenderAll()
        ev.preventDefault()
        ev.stopPropagation()
        return
      }

      if (this.draw_rate % 2 !== 0 && !this.in_drawing) {
        return
      }
      this.save_mouse_info(options, false)

      this.draw_in_move()
      this.draw_rate++
      ev.preventDefault()
      ev.stopPropagation()
    })

    this.fCanvas.on('mouse:dblclick', options => {
      const ev = options.e
      this.save_mouse_info(options, false)
      this.draw_in_dblclick()
      this.current_draw_obj = null // 鼠标抬起时，置空当前正在绘制的 obj，避免该对象在下次绘制时被删除
      this.in_drawing = false
      this.enable_select()
      ev.preventDefault()
      ev.stopPropagation()
    })
  }

  /**
   * 初始化画板样式
   */
  init_style(options) {
    this.fCanvas.setBackgroundColor(options.background_color || DEFAULT_BACKGROUND_COLOR, () => {})
    this.set_brush({
      color: options.brush_color || DEFAULT_BRUSH_COLOR,
      width: options.brush_width || DEFAULT_BRUSH_WIDTH
    })
  }

  /**
   * 设置笔刷属性
   */
  set_brush({ color, width }) {
    if (color) {
      this.fCanvas.freeDrawingBrush.color = color
      this.brush_color = color
    }
    if (width) {
      this.fCanvas.freeDrawingBrush.width = width
      this.brush_width = width
    }
  }

  set_min_zoom(zoom) {
    this.canvas_min_zoom = zoom
  }

  set_max_zoom(zoom) {
    this.canvas_max_zoom = zoom
  }

  set_font_size(size) {
    this.font_size = size
  }

  /**
   * 设置绘制模式
   */
  set_mode(mode, shape, delIndex = -1) {
    this.in_drawing = false
    this.fCanvas.isDrawingMode = false
    this.draw_mode = mode
    this.custom_shape = shape
    this.need_delete_obj_index = delIndex
    switch (mode) {
      // 画笔模式
      case DrawMode.PEN:
        break
      // 选择模式
      case DrawMode.SELECT:
        this.fCanvas.selection = true
        this.fCanvas.skipTargetFind = false
        break
      default: // 画板元素不能被选中
        this.fCanvas.skipTargetFind = true
        this.fCanvas.selection = false // 画板不显示选中
    }

    if (this.current_text_obj) {
      // 退出文本编辑状态
      this.current_text_obj.exitEditing()
      this.current_text_obj = null
    }
  }

  /**
   * 可选择模块
   */
  enable_select() {
    this.set_mode(this.enableSelect ? DrawMode.SELECT : undefined)
  }

  /**
   * 删除选中的元素
   */
  delete_selected() {
    const objs = this.fCanvas.getActiveObjects()

    if (objs && objs.length) {
      objs.forEach(el => {
        this.fCanvas.remove(el)
      })
    }
  }

  /**
   * 撤销
   */
  back() {
    if (this.back_event) {
      this.back_event(this.history)
    }
    if (!this.history.length) {
      this.clear()
      return
    }
    if (this.current_text_obj) {
      this.current_text_obj.exitEditing()
    }
    this.current_text_obj = null
    this.current_draw_obj = null

    const last_state = this.history.pop()
    this.fCanvas.loadFromJSON(last_state, () => {
      this.fCanvas.renderAll()
    })
  }

  /** img to base64 */
  to_img(zoom) {
    // 还原缩放和移动位置
    this.canvas_zoom = DEFAULT_ZOOM
    this.fCanvas.setZoom(zoom || this.canvas_zoom)

    this.drag_last_posx = 0
    this.drag_last_posy = 0
    if (this.fCanvas.viewportTransform) {
      this.fCanvas.viewportTransform[4] = 0
      this.fCanvas.viewportTransform[5] = 0
    }

    const multiplier = Math.floor((1 / zoom) * 100) / 100

    const params = { format: 'jpeg', quality: 1, multiplier }
    return this.fCanvas.toDataURL(params)
  }

  /** 设置文本 */
  set_text(options, state = false) {
    const box = this.draw_text(options)

    this.fCanvas.add(box)
    if (state) {
      this.save_state()
    }
  }

  /** 设置背景图片 */
  set_bg_img({ src = '', catch: catchfn, finish: finishfn }, state = false) {
    const temp_img = new Image()
    temp_img.src = src
    temp_img.crossOrigin = 'anonymous'

    temp_img.onload = () => {
      fabric.Image.fromURL(
        src,
        img => {
          this.fCanvas.setBackgroundImage(img, this.fCanvas.renderAll.bind(this.fCanvas))
          this.fCanvas.requestRenderAll()

          if (state) {
            this.save_state()
          }
          if (finishfn) {
            finishfn(src)
          }
        },
        { crossOrigin: 'anonymous' }
      )
    }

    temp_img.onerror = () => {
      if (catchfn) {
        catchfn(src)
      }
      if (finishfn) {
        finishfn(src)
      }
    }
  }

  /**
   * 获取鼠标的坐标信息
   */
  save_mouse_info(options, from = true) {
    const x = options.e.offsetX / this.window_zoom
    const y = options.e.offsetY / this.window_zoom

    if (from) {
      this.from_mouse_info = { x, y }
    } else {
      this.to_mouse_info = { x, y }
    }
  }

  /**
   * 存储当前状态
   */
  save_state() {
    const state = this.fCanvas.toJSON()
    this.history.push(state)
  }

  draw_in_down() {
    if (!this.in_drawing) {
      return
    }
    let draw_obj = null
    if (this.current_draw_obj) {
      this.fCanvas.remove(this.current_draw_obj)
    }
    switch (this.draw_mode) {
      case DrawMode.POLYGON:
        draw_obj = this.draw_polygon()
        break
    }

    if (draw_obj) {
      this.fCanvas.add(draw_obj)
      this.current_draw_obj = draw_obj
    }
  }

  /** 绘制方法 - mouse move */
  draw_in_move() {
    if (!this.in_drawing) {
      return
    }
    if (this.current_draw_obj) {
      this.fCanvas.remove(this.current_draw_obj)
    }
    let draw_obj = null
    this.fCanvas.isDrawingMode = false

    switch (this.draw_mode) {
      case DrawMode.RECT:
        draw_obj = this.draw_rect()
        break
      case DrawMode.CIRCLE:
        draw_obj = this.draw_circle()
        break
      case DrawMode.LINE:
        draw_obj = this.draw_line()
        break
      case DrawMode.DOUBLELINE:
        draw_obj = this.draw_double_line()
        break
      case DrawMode.POSITIVELINE:
        draw_obj = this.draw_positive_line()
        break
      case DrawMode.REVERSELINE:
        draw_obj = this.draw_reverse_line()
        break
      case DrawMode.PEN:
        this.draw_pen()
        break
      case DrawMode.CUSTOM:
        this.call_custom_draw_funcs('move')
        break
      case DrawMode.POLYGON:
        draw_obj = this.draw_polygon(true)
        break
    }

    if (draw_obj) {
      this.fCanvas.add(draw_obj)
      if (this.object_mouseup_event && this.draw_mode !== DrawMode.POLYGON) {
        draw_obj.on('mouseup', options => {
          this.object_mouseup_event(draw_obj, options)
        })
      }
      this.current_draw_obj = draw_obj
    }
  }

  /** 绘制方法 - mouse up */
  draw_in_up() {
    if (!this.in_drawing) {
      return
    }
    if (this.draw_mode === DrawMode.POLYGON) {
      return
    }
    let draw_obj = null

    switch (this.draw_mode) {
      case DrawMode.TEXT:
        draw_obj = this.draw_text({ edit: true })
        break
      case DrawMode.CUSTOM:
        this.call_custom_draw_funcs('up')
        break
    }

    if (draw_obj) {
      this.fCanvas.add(draw_obj)
      if (this.object_mouseup_event) {
        draw_obj.on('mouseup', options => {
          this.object_mouseup_event(draw_obj, options)
        })
      }
      this.current_draw_obj = draw_obj
    }
  }

  draw_in_dblclick() {
    if (!this.in_drawing) {
      return
    }
    let draw_obj = null
    if (this.current_draw_obj) {
      this.fCanvas.remove(this.current_draw_obj)
    }
    switch (this.draw_mode) {
      case DrawMode.POLYGON:
        draw_obj = this.draw_polygon_done()
        break
    }

    if (draw_obj) {
      this.fCanvas.add(draw_obj)
      this.current_draw_obj = draw_obj
    }
  }
  findTopPaddingForRoof(roofPoints) {
    return Math.min(...roofPoints.map(item => item.y))
  }
  findLeftPaddingForRoof(roofPoints) {
    return Math.min(...roofPoints.map(item => item.x))
  }

  /** 绘制-矩形 */
  draw_rect() {
    const pos_info = this.get_fix_mouse_info()
    let left = pos_info.from.x
    let top = pos_info.from.y
    let to_x = pos_info.to.x
    let to_y = pos_info.to.y
    if (to_x - left < 0) {
      left = pos_info.to.x
      to_x = pos_info.from.x
    }
    if (to_y - top < 0) {
      top = pos_info.to.y
      to_y = pos_info.from.y
    }
    const draw_obj = new fabric.Rect({
      left,
      top,
      fill: TRANSPARENT_COLOR,
      width: Math.abs(to_x - left),
      height: Math.abs(to_y - top),
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })

    draw_obj.set('shape', this.custom_shape)
    draw_obj.toObject = function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        shape: this.get('shape')
      })
    }
    return draw_obj
  }

  draw_polygon(move = false) {
    const pos_info = this.get_fix_mouse_info()
    if (move) {
      this.point_array[this.point_array.length - 1] = {
        x: pos_info.to.x,
        y: pos_info.to.y
      }
    } else {
      if (!this.point_array.length) {
        this.point_array.push(
          {
            x: pos_info.from.x,
            y: pos_info.from.y
          },
          {
            x: pos_info.from.x,
            y: pos_info.from.y
          }
        )
      } else {
        if (this.point_array.length < this.maxPoint) {
          this.point_array.push({
            x: pos_info.to.x,
            y: pos_info.to.y
          })
        } else {
          return this.draw_polygon_done(true)
        }
      }
    }

    let left = this.findLeftPaddingForRoof(this.point_array)
    let top = this.findTopPaddingForRoof(this.point_array)
    const points = this.point_array
    return new Polygon(points, {
      left,
      top,
      fill: TRANSPARENT_COLOR,
      strokeWidth: this.brush_width,
      stroke: this.brush_color,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
  }

  draw_polygon_done(fromLineLimit = false) {
    const pos_info = this.get_fix_mouse_info()
    let left = this.findLeftPaddingForRoof(this.point_array)
    let top = this.findTopPaddingForRoof(this.point_array)
    this.point_array[this.point_array.length - 1] = {
      x: pos_info.to.x,
      y: pos_info.to.y
    }
    const draw_obj = new Polygon(this.point_array, {
      id: generateUuid(),
      left,
      top,
      fill: TRANSPARENT_COLOR,
      strokeWidth: this.brush_width,
      stroke: this.brush_color,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
    draw_obj.set('shape', this.custom_shape)
    draw_obj.toObject = function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        shape: this.get('shape')
      })
    }
    //clear arrays
    this.point_array = []
    if (this.draw_complete_event && this.in_drawing) {
      this.draw_complete_event(draw_obj)
    }
    if (this.object_mouseup_event) {
      draw_obj.on('mouseup', options => {
        this.object_mouseup_event(draw_obj, options)
      })
    }
    if (fromLineLimit) {
      this.current_draw_obj = null // 鼠标抬起时，置空当前正在绘制的 obj，避免该对象在下次绘制时被删除
      this.in_drawing = false
      this.enable_select()
    }
    return draw_obj
  }

  /** 绘制-直线 */
  draw_line() {
    const pos_info = this.get_fix_mouse_info()
    const points = [pos_info.from.x, pos_info.from.y, pos_info.to.x, pos_info.to.y]
    const draw_obj = new fabric.Line(points, {
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
    draw_obj.set('shape', this.custom_shape)
    draw_obj.toObject = function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        shape: this.get('shape')
      })
    }
    return draw_obj
  }

  /** 绘制-带箭头双向直线 */
  draw_double_line() {
    const pos_info = this.get_fix_mouse_info()
    const points = [pos_info.from.x, pos_info.from.y, pos_info.to.x, pos_info.to.y]
    return new DoubleSideLine(points, {
      id: generateUuid(),
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
  }

  /** 绘制-带箭头正向直线 */
  draw_positive_line() {
    const pos_info = this.get_fix_mouse_info()
    const points = [pos_info.from.x, pos_info.from.y, pos_info.to.x, pos_info.to.y]
    return new PositiveLine(points, {
      id: generateUuid(),
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
  }

  /** 绘制-带箭头反向直线 */
  draw_reverse_line() {
    const pos_info = this.get_fix_mouse_info()
    const points = [pos_info.from.x, pos_info.from.y, pos_info.to.x, pos_info.to.y]
    return new ReverseLine(points, {
      id: generateUuid(),
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
  }

  /** 绘制-画笔 */
  draw_pen() {
    if (this.draw_mode !== DrawMode.PEN) {
      return
    }
    this.fCanvas.isDrawingMode = true
  }

  /** 绘制-圆 */
  draw_circle() {
    const pos_info = this.get_fix_mouse_info()
    const left = pos_info.from.x
    const top = pos_info.from.y
    const to_x = pos_info.to.x
    const to_y = pos_info.to.y
    const radius = Math.sqrt((to_x - left) * (to_x - left) + (to_y - top) * (to_y - top)) / 2

    return new fabric.Circle({
      left,
      top,
      radius,
      fill: TRANSPARENT_COLOR, // 填充透明
      stroke: this.brush_color,
      strokeWidth: this.brush_width,
      hasRotatingPoint: false,
      hasControls: false,
      strokeUniform: true
    })
  }

  /** 绘制-文本 */
  draw_text({ left, top, width = 150, text = [''], edit = false, color, font_size, angle = 0 }) {
    const pos_info = this.get_fix_mouse_info()
    const leftv = left || pos_info.from.x
    const topv = top || pos_info.from.y

    if (this.current_text_obj) {
      this.current_text_obj.exitEditing()
      const content = this.current_text_obj.text || ''

      if (!content.length) {
        this.fCanvas.remove(this.current_text_obj)
      }
    }

    const plus = angle > 0 ? 100 : 0

    const ssize = font_size || this.font_size
    this.current_text_obj = new fabric.Textbox(text.join('\n'), {
      angle,
      left: leftv + plus,
      top: topv + plus,
      width,
      fill: color || this.brush_color,
      fontSize: ssize,
      hasControls: true,
      fontFamily: 'Microsoft YaHei'
    })

    if (edit) {
      this.current_text_obj.enterEditing()
      if (this.current_text_obj.hiddenTextarea) {
        this.current_text_obj.hiddenTextarea.focus()
      }
    }

    return this.current_text_obj
  }

  /** 绘制自定义图形 */
  draw_path({ path, stroke, stroke_width, fill = TRANSPARENT_COLOR }) {
    if (!path) {
      throw new Error('[drawboard] draw path error')
    }
    const strokev = stroke || this.brush_color
    const stroke_widthv = stroke_width || this.brush_width
    return new fabric.Path(path, {
      stroke: strokev,
      strokeWidth: stroke_widthv,
      fill
    })
  }

  /** 获取可调用的自定义绘制函数 */
  call_custom_draw_funcs(event) {
    const funcs = this.custom_draw_store.filter(c => c.enable && c.event === event)
    const pos_info = this.get_fix_mouse_info()

    funcs.forEach(f => {
      let obj = null

      if (f.type === 'path') {
        obj = this.draw_path(
          f.get_draw_path_options(pos_info.from, pos_info.to, this.brush_width, this.canvas_zoom)
        )
        obj.set('shape', this.custom_shape)
        obj.set('customPoints', [
          {
            x: pos_info.from.x,
            y: pos_info.from.y
          },
          {
            x: pos_info.to.x,
            y: pos_info.to.y
          }
        ])
        obj.toObject = function () {
          return fabric.util.object.extend(this.callSuper('toObject'), {
            shape: this.get('shape'),
            customPoints: this.get('customPoints')
          })
        }
      } else if (f.type === 'text') {
        obj = this.draw_text(f.get_draw_text_options(this.font_size, this.canvas_zoom))
      }

      if (obj) {
        this.fCanvas.add(obj)
        this.current_draw_obj = obj
      }
    })
  }

  /** 注册自定义绘制函数 */
  register_custom_draw_func({
    name,
    type = 'path',
    get_draw_path_options,
    get_draw_text_options,
    event = 'move',
    enable = false
  }) {
    if (!name) {
      throw new Error('[drawboard] register_custom_draw_func error (name not found)')
    }

    // draw path
    if (type === 'path') {
      if (!get_draw_path_options) {
        throw new Error(
          '[drawboard] register_custom_draw_func error (path get_draw_path_options not found)'
        )
      }

      this.custom_draw_store.push({
        name,
        type,
        get_draw_path_options,
        event,
        enable
      })
    }

    // draw text
    if (type === 'text') {
      if (!get_draw_text_options) {
        throw new Error(
          '[drawboard] register_custom_draw_func error (text get_draw_text_options not found)'
        )
      }

      this.custom_draw_store.push({
        name,
        type,
        get_draw_text_options,
        event,
        enable
      })
    }
  }

  /** 切换自定义绘制函数 */
  set_custom_draw_func_enable(names, shape, index) {
    this.set_mode(DrawMode.CUSTOM, shape, index)
    this.custom_draw_store.forEach(c => {
      if (names.indexOf(c.name) !== -1) {
        c.enable = true
      } else {
        c.enable = false
      }
    })
  }

  /** 设置缩放比例 */
  set_zoom(z, dont_trigger_change_event = false, set_origin = false) {
    let zoom = z
    if (zoom > this.canvas_max_zoom) {
      zoom = this.canvas_max_zoom
    }
    if (zoom < this.canvas_min_zoom) {
      zoom = this.canvas_min_zoom
    }

    this.canvas_zoom = zoom
    if (!dont_trigger_change_event) {
      if (this.zoom_change) {
        this.zoom_change(this.canvas_zoom)
      }
    }
    this.fCanvas.setZoom(this.canvas_zoom)

    // 重置为坐标 0,0
    if (set_origin && this.fCanvas.viewportTransform) {
      this.fCanvas.viewportTransform[4] = 0
      this.fCanvas.viewportTransform[5] = 0
    }
  }

  /** 判断鼠标是在在图片范围内 */
  check_mouse_is_in_draw_area(x, y) {
    const width = this.fCanvas.getWidth() * this.canvas_zoom
    const height = this.fCanvas.getHeight() * this.canvas_zoom

    if (this.fCanvas.viewportTransform) {
      if (
        x < this.fCanvas.viewportTransform[4] ||
        y < this.fCanvas.viewportTransform[5] ||
        x > this.fCanvas.viewportTransform[4] + width ||
        y > this.fCanvas.viewportTransform[5] + height
      ) {
        return false // 绘制在图片范围外
      }
    }

    return true
  }
  /** 获取当前画布上的所有元素对象 */
  get_objects() {
    return this.fCanvas.getObjects()
  }
  dispatchCompleteEvent() {
    if (this.draw_complete_event) {
      if (
        this.draw_mode !== DrawMode.SELECT &&
        this.draw_mode !== '' &&
        this.draw_mode !== undefined
      ) {
        this.draw_complete_event(this.current_draw_obj)
      }
    }
  }
}
