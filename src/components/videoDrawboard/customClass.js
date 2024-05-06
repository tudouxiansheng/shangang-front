import { fabric } from 'fabric-pure-browser'
import { DrawMode } from './constant'
import { RenderArrowLineFun } from './render'
// 双向线
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
