import { DrawMode } from './constant'

export const RenderArrowLineFun = function (ctx) {
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
