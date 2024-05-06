const ControlMethods = {
  LINE: 'line', // 画直线
  DOUBLELINE: 'doubleSideLine', // 双向线
  POSITIVELINE: 'positiveLine', // 正向线
  REVERSELINE: 'reverseLine', // 反向线
  RECT: 'rect', // 画矩形
  POLYGON: 'polygon', // 画多边形
  CIRCLE: 'circle',
  TEXT: 'text', // 绘制文字
  DELETE: 'delete', // 删除当前
  REVOCATION: 'revocation', // 撤销
  CLEAR_SCREEN: 'clearScreen' // 清屏
}

const DefaultControls = [
  {
    text: '直线',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.LINE
  },
  {
    text: '正向线',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.POSITIVELINE
  },
  {
    text: '反向线',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.REVERSELINE
  },
  {
    text: '双向线',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.DOUBLELINE
  },
  {
    text: '矩形',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.RECT
  },
  {
    text: '多边形',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.POLYGON
  },
  {
    text: '圆形',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.CIRCLE
  },
  {
    text: '文字',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.TEXT
  },
  {
    text: '撤销',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.REVOCATION
  },
  {
    text: '清屏',
    icon: 'rect',
    disabled: false,
    method: ControlMethods.CLEAR_SCREEN
  },
  {
    text: '删除',
    icon: 'delete',
    disabled: false,
    method: ControlMethods.DELETE
  }
]

const DrawMode = {
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

// 默认笔刷样式
const DEFAULT_BRUSH_COLOR = '#000'
const DEFAULT_BRUSH_WIDTH = 1
// 默认背景色
const DEFAULT_BACKGROUND_COLOR = '#fff'
// 透明色
const TRANSPARENT_COLOR = 'rgba(0, 0, 0, 0)'
// 默认字体大小
const DEFAULT_FONT_SIZE = 16
// 默认缩放比例
const DEFAULT_ZOOM = 1
const DEFAULT_MIN_ZOOM = 0.2
const DEFAULT_MAX_ZOOM = 3

const SHAPE_TYPE = {
  RECT: 0,
  POLYGON: 1
}

export {
  ControlMethods,
  DefaultControls,
  DrawMode,
  DEFAULT_BRUSH_COLOR,
  DEFAULT_BRUSH_WIDTH,
  DEFAULT_BACKGROUND_COLOR,
  TRANSPARENT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_ZOOM,
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
  SHAPE_TYPE
}
