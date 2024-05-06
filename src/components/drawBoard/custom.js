import DrawBoard from './drawBoard'

const base_width = 2

// 绘制双向线
export function register_double_line_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    get_draw_path_options: get_line_draw_path
  })
}

// 绘制正向线
export function register_positive_line_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    get_draw_path_options(from, to, width) {
      let zoom = 1

      if (width > base_width) {
        zoom = width / base_width
      }

      let middleX = (from.x + to.x) * 0.5
      let middleY = (from.y + to.y) * 0.5
      // 根据x、y的值 计算是x1-x2 还是x2-x1 以及y2-y1 还是 y1-y2
      let borderX = null
      let borderY = null
      if (from.x > to.x && to.y > from.y) {
        borderX = to.x - from.x
        borderY = to.y - from.y
      } else if (from.x > to.x && from.y > to.y) {
        borderX = from.x - to.x
        borderY = to.y - from.y
      } else if (to.x > from.x && from.y > to.y) {
        borderX = to.x - from.x
        borderY = from.y - to.y
      } else {
        borderX = from.x - to.x
        borderY = from.y - to.y
      }
      // 斜边l1的长度为
      let l1 = Math.sqrt(Math.pow(borderX, 2) + Math.pow(borderY, 2))
      // 定义l2的默认长度为50
      let l2 = 80
      let h2 = (l2 * borderX) / l1
      let s2 = Math.sqrt(Math.pow(l2, 2) - Math.pow(h2, 2))
      // 中间上方顶点x,y坐标
      let endX = to.x >= from.x ? s2 + middleX : middleX - s2
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

      let arrowX = from.x - topX
      let arrowY = from.y - topY

      let path = ' M ' + from.x + ' ' + from.y
      path += ' L ' + to.x + ' ' + to.y

      // 画中间上方直线
      path += ' M ' + middleX + ' ' + middleY
      path += ' L ' + endX + ' ' + endY

      if ((from.x > to.x && to.y > from.y) || (to.x > from.x && from.y > to.y)) {
        // 画中间上方箭头
        arrowX = endX + topX
        arrowY = endY + topY
        path += ' M ' + arrowX + ' ' + arrowY
        path += ' L ' + endX + ' ' + endY
        arrowX = endX + botX
        arrowY = endY + botY
        path += ' L ' + arrowX + ' ' + arrowY
      }

      // 画中间下方直线
      path += ' M ' + middleX + ' ' + middleY
      path += ' L ' + end2X + ' ' + end2Y

      if ((from.x > to.x && from.y > to.y) || (to.x > from.x && to.y > from.y)) {
        arrowX = end2X + top2X
        arrowY = end2Y + top2Y
        path += ' M ' + arrowX + ' ' + arrowY
        path += ' L ' + end2X + ' ' + end2Y
        arrowX = end2X + bot2X
        arrowY = end2Y + bot2Y
        path += ' L ' + arrowX + ' ' + arrowY
      }

      return {
        path
      }
    }
  })
}

// 绘制反向线
export function register_reverse_line_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    get_draw_path_options(from, to, width) {
      let zoom = 1

      if (width > base_width) {
        zoom = width / base_width
      }

      let middleX = (from.x + to.x) * 0.5
      let middleY = (from.y + to.y) * 0.5
      // 根据x、y的值 计算是x1-x2 还是x2-x1 以及y2-y1 还是 y1-y2
      let borderX = null
      let borderY = null
      if (from.x > to.x && to.y > from.y) {
        borderX = to.x - from.x
        borderY = to.y - from.y
      } else if (from.x > to.x && from.y > to.y) {
        borderX = from.x - to.x
        borderY = to.y - from.y
      } else if (to.x > from.x && from.y > to.y) {
        borderX = to.x - from.x
        borderY = from.y - to.y
      } else {
        borderX = from.x - to.x
        borderY = from.y - to.y
      }
      // 斜边l1的长度为
      let l1 = Math.sqrt(Math.pow(borderX, 2) + Math.pow(borderY, 2))
      // 定义l2的默认长度为50
      let l2 = 80
      let h2 = (l2 * borderX) / l1
      let s2 = Math.sqrt(Math.pow(l2, 2) - Math.pow(h2, 2))
      // 中间上方顶点x,y坐标
      let endX = to.x >= from.x ? s2 + middleX : middleX - s2
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

      let arrowX = from.x - topX
      let arrowY = from.y - topY

      let path = ' M ' + from.x + ' ' + from.y
      path += ' L ' + to.x + ' ' + to.y

      // 画中间上方直线
      path += ' M ' + middleX + ' ' + middleY
      path += ' L ' + endX + ' ' + endY

      if ((from.x > to.x && from.y > to.y) || (to.x > from.x && to.y > from.y)) {
        // 画中间上方箭头
        arrowX = endX + topX
        arrowY = endY + topY
        path += ' M ' + arrowX + ' ' + arrowY
        path += ' L ' + endX + ' ' + endY
        arrowX = endX + botX
        arrowY = endY + botY
        path += ' L ' + arrowX + ' ' + arrowY
      }

      // 画中间下方直线
      path += ' M ' + middleX + ' ' + middleY
      path += ' L ' + end2X + ' ' + end2Y

      if ((from.x > to.x && to.y > from.y) || (to.x > from.x && from.y > to.y)) {
        arrowX = end2X + top2X
        arrowY = end2Y + top2Y
        path += ' M ' + arrowX + ' ' + arrowY
        path += ' L ' + end2X + ' ' + end2Y
        arrowX = end2X + bot2X
        arrowY = end2Y + bot2Y
        path += ' L ' + arrowX + ' ' + arrowY
      }

      return {
        path
      }
    }
  })
}

export function get_line_draw_path(from, to, width, direction = 0) {
  let zoom = 1

  if (width > base_width) {
    zoom = width / base_width
  }

  let middleX = (from.x + to.x) * 0.5
  let middleY = (from.y + to.y) * 0.5
  // 根据x、y的值 计算是x1-x2 还是x2-x1 以及y2-y1 还是 y1-y2
  let borderX = null
  let borderY = null
  if (from.x > to.x && to.y > from.y) {
    borderX = to.x - from.x
    borderY = to.y - from.y
  } else if (from.x > to.x && from.y > to.y) {
    borderX = from.x - to.x
    borderY = to.y - from.y
  } else if (to.x > from.x && from.y > to.y) {
    borderX = to.x - from.x
    borderY = from.y - to.y
  } else {
    borderX = from.x - to.x
    borderY = from.y - to.y
  }
  // 斜边l1的长度为
  let l1 = Math.sqrt(Math.pow(borderX, 2) + Math.pow(borderY, 2))
  // 定义l2的默认长度为50
  let l2 = 80
  let h2 = (l2 * borderX) / l1
  let s2 = Math.sqrt(Math.pow(l2, 2) - Math.pow(h2, 2))
  // 中间上方顶点x,y坐标
  let endX = to.x >= from.x ? s2 + middleX : middleX - s2
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

  let arrowX = from.x - topX
  let arrowY = from.y - topY

  let path = ' M ' + from.x + ' ' + from.y
  path += ' L ' + to.x + ' ' + to.y

  if (direction === 1) {
    // 画中间上方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + endX + ' ' + endY

    if ((from.x > to.x && to.y > from.y) || (to.x > from.x && from.y > to.y)) {
      // 画中间上方箭头
      arrowX = endX + topX
      arrowY = endY + topY
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + endX + ' ' + endY
      arrowX = endX + botX
      arrowY = endY + botY
      path += ' L ' + arrowX + ' ' + arrowY
    }

    // 画中间下方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + end2X + ' ' + end2Y

    if ((from.x > to.x && from.y > to.y) || (to.x > from.x && to.y > from.y)) {
      arrowX = end2X + top2X
      arrowY = end2Y + top2Y
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + end2X + ' ' + end2Y
      arrowX = end2X + bot2X
      arrowY = end2Y + bot2Y
      path += ' L ' + arrowX + ' ' + arrowY
    }
  } else if (direction === 2) {
    // 画中间上方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + endX + ' ' + endY

    if ((from.x > to.x && from.y > to.y) || (to.x > from.x && to.y > from.y)) {
      // 画中间上方箭头
      arrowX = endX + topX
      arrowY = endY + topY
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + endX + ' ' + endY
      arrowX = endX + botX
      arrowY = endY + botY
      path += ' L ' + arrowX + ' ' + arrowY
    }

    // 画中间下方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + end2X + ' ' + end2Y

    if ((from.x > to.x && to.y > from.y) || (to.x > from.x && from.y > to.y)) {
      arrowX = end2X + top2X
      arrowY = end2Y + top2Y
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + end2X + ' ' + end2Y
      arrowX = end2X + bot2X
      arrowY = end2Y + bot2Y
      path += ' L ' + arrowX + ' ' + arrowY
    }
  } else {
    // 画中间上方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + endX + ' ' + endY

    // 画中间上方箭头
    arrowX = endX + topX
    arrowY = endY + topY
    path += ' M ' + arrowX + ' ' + arrowY
    path += ' L ' + endX + ' ' + endY
    arrowX = endX + botX
    arrowY = endY + botY
    path += ' L ' + arrowX + ' ' + arrowY

    // 画中间下方直线
    path += ' M ' + middleX + ' ' + middleY
    path += ' L ' + end2X + ' ' + end2Y

    arrowX = end2X + top2X
    arrowY = end2Y + top2Y
    path += ' M ' + arrowX + ' ' + arrowY
    path += ' L ' + end2X + ' ' + end2Y
    arrowX = end2X + bot2X
    arrowY = end2Y + bot2Y
    path += ' L ' + arrowX + ' ' + arrowY
  }

  return {
    path
  }
}

// 绘制箭头
export function register_arror_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    get_draw_path_options(from, to, width) {
      let zoom = 1

      if (width > base_width) {
        zoom = width / base_width
      }

      const theta = 30 * 1
      const headlen = 10 * 1
      const angle = ((Math.atan2(from.y - to.y, from.x - to.x) * 180) / Math.PI) * 1
      const angle1 = (((angle + theta) * Math.PI) / 180) * 1
      const angle2 = (((angle - theta) * Math.PI) / 180) * 1
      const topX = headlen * Math.cos(angle1) * zoom
      const topY = headlen * Math.sin(angle1) * zoom
      const botX = headlen * Math.cos(angle2) * zoom
      const botY = headlen * Math.sin(angle2) * zoom

      let arrowX = from.x - topX
      let arrowY = from.y - topY

      let path = ' M ' + from.x + ' ' + from.y
      path += ' L ' + to.x + ' ' + to.y
      arrowX = to.x + topX
      arrowY = to.y + topY
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + to.x + ' ' + to.y
      arrowX = to.x + botX
      arrowY = to.y + botY
      path += ' L ' + arrowX + ' ' + arrowY

      return {
        path
      }
    }
  })
}

// 绘制勾
export function register_right_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    event: 'up',
    get_draw_path_options(from, _, width) {
      let modify = 20

      if (width > base_width) {
        modify = (width / base_width) * modify
      }

      const path =
        'M ' +
        (from.x - modify) +
        ' ' +
        (from.y - modify) +
        ' L ' +
        from.x +
        ' ' +
        from.y +
        ' L ' +
        (from.x + modify * 2) +
        ' ' +
        (from.y - modify * 2)

      return {
        path
      }
    }
  })
}

// 绘制叉
export function register_wrong_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    event: 'up',
    get_draw_path_options(from, _, width) {
      let modify = 20

      if (width > base_width) {
        modify = (width / base_width) * modify
      }

      const path =
        'M ' +
        (from.x - modify) +
        ' ' +
        (from.y - modify) +
        ' L ' +
        (from.x + modify) +
        ' ' +
        (from.y + modify) +
        'M ' +
        (from.x + modify) +
        ' ' +
        (from.y - modify) +
        ' L ' +
        (from.x - modify) +
        ' ' +
        (from.y + modify)

      return {
        path
      }
    }
  })
}

// 绘制 A+
export function register_aplus_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    type: 'text',
    event: 'up',
    get_draw_text_options(size) {
      let fsize = 40

      if (size > 40) {
        fsize = (size / 40) * fsize * 2
      }

      return {
        text: ['A+'],
        width: fsize,
        font_size: fsize
      }
    }
  })
}

// 绘制 A-
export function register_aminus_draw(name, drawBoard = DrawBoard) {
  drawBoard.register_custom_draw_func({
    name,
    type: 'text',
    event: 'up',
    get_draw_text_options(size) {
      let fsize = 40

      if (size > 40) {
        fsize = (size / 40) * fsize * 2
      }

      return {
        text: ['A-'],
        width: fsize,
        font_size: fsize
      }
    }
  })
}
