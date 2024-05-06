let waterStyle = `
display: block;
overflow: hidden;
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-repeat: repeat;
pointer-events: none;`

// 内容水印
export function watermarkPreview(options) {
  const rotates = options.rotateDegree
  const textAlign = options.textAlign
  const rotate = 15
  const fontSize = options.fontSize
  const canvas = document.createElement('canvas')
  const text = options.content

  const ctx = canvas.getContext('2d')
  canvas.setAttribute('id', 'water')
  if (ctx) {
    ctx.translate(0, 0)
    ctx.textAlign = textAlign

    canvas.width = 680
    canvas.height = 544
    const x = canvas.width
    var y = canvas.height
    ctx.clearRect(0, 0, canvas.width, canvas.height) //先清掉画布上的内容
    ctx.translate(x, y) //将绘图原点移到画布中点
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 10
    ctx.font = options.font
    ctx.fillStyle = '#9FA5AA'
    ctx.globalAlpha = options.opacity
    //右偏移
    if (rotates == -30) {
      if (fontSize >= 16 && fontSize <= 23) {
        ctx.rotate((parseInt(-rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 3)
      } else if (fontSize > 23 && fontSize < 30) {
        ctx.rotate((parseInt(-rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 3)
      } else if (fontSize >= 30) {
        ctx.rotate((parseInt(-rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 3, canvas.height / 3)
      } else {
        ctx.rotate((parseInt(-rotate) * Math.PI) / 180)
        ctx.translate(-x, -y) //将画布原点移动
        ctx.fillText(text, canvas.width / 2, canvas.height / 3)
      }
      //左偏移
    } else if (rotates == 30) {
      if (fontSize >= 16 && fontSize <= 23) {
        ctx.rotate((parseInt(rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 4, canvas.height / 1.8)
      } else if (fontSize > 23 && fontSize < 30) {
        ctx.rotate((parseInt(rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 4, canvas.height / 1.8)
      } else if (fontSize >= 30) {
        ctx.rotate((parseInt(rotate) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 4, canvas.height / 1.8)
      } else {
        ctx.rotate((parseInt(rotate) * Math.PI) / 180)
        ctx.translate(-x, -y) //将画布原点移动
        ctx.fillText(text, canvas.width / 4, canvas.height / 1.8)
      }
    } else {
      if (fontSize >= 16 && fontSize <= 23) {
        ctx.rotate((parseInt(0) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 3)
      } else if (fontSize > 23 && fontSize < 30) {
        ctx.rotate((parseInt(0) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 3)
      } else if (fontSize >= 30) {
        ctx.rotate((parseInt(0) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 3, canvas.height / 3)
      } else {
        ctx.rotate((parseInt(0) * Math.PI) / 180)
        ctx.translate(-x, -y)
        ctx.fillText(text, canvas.width / 2.5, canvas.height / 3)
      }
    }
  }
  return canvas.toDataURL('image/png')
}

function createImageBase(options) {
  const angle = -options.rotateDegree
  const fontSize = options.fontSize
  const textAlign = options.textAlign
  const content = options.content
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = options.font
  let width = Math.ceil(ctx.measureText(content).width)
  const hypotenuseWidth = hypotenuse(width + fontSize, Math.abs(angle))
  let height = hypotenuseWidth.a + fontSize
  width = hypotenuseWidth.b + fontSize
  if (width < 200) width = 200
  if (height < 200) height = 200
  Object.assign(canvas, { width, height })
  let textOffsetY
  if (angle < 0) {
    ctx.translate(0, canvas.height)
    ctx.textBaseline = 'bottom'
    textOffsetY = angle <= -45 ? fontSize : 0
  } else {
    ctx.translate(0, 0)
    ctx.textBaseline = 'top'
    textOffsetY = angle <= 45 ? 0 : -fontSize
  }
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 5
  ctx.font = options.font
  ctx.fillStyle = options.color
  ctx.textAlign = textAlign
  ctx.globalAlpha = options.opacity
  ctx.rotate((angle * Math.PI) / 180)
  ctx.fillText(content, fontSize, textOffsetY)
  return canvas.toDataURL('image/png')
}

export function genWaterMark(watermarkInfo) {
  const parentElement = document.getElementById('app')
  const option = {
    fontSize: watermarkInfo.fontSize,
    className: watermarkInfo.className,
    width: watermarkInfo.width,
    height: watermarkInfo.height,
    content: watermarkInfo.content,
    font: watermarkInfo.font,
    color: '#9FA5AA',
    rotateDegree: watermarkInfo.rotateDegree,
    opacity: watermarkInfo.opacity / 100,
    zIndex: watermarkInfo.zIndex,
    textAlign: watermarkInfo.textAlign
  }
  const waterMark = document.createElement('div')
  waterMark.className = watermarkInfo.className
  let style = `background-image: url(${createImageBase(option)});z-index: ${
    watermarkInfo.zIndex
  };${waterStyle}`
  waterMark.setAttribute('style', style)
  waterMark.setAttribute('id', 'waterCanvas')
  parentElement.appendChild(waterMark)
}

export function removerWaterMark() {
  const element = document.getElementById('waterCanvas')
  element.remove()
}

function hypotenuse(long, angle) {
  //获得弧度
  const radian = ((2 * Math.PI) / 360) * angle
  return {
    a: Math.sin(radian) * long, //邻边
    b: Math.cos(radian) * long //对边
  }
}
