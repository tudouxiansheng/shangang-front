/*
 * @Description  : 方位角
 */
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import Circle from '@arcgis/core/geometry/Circle'
import Polygon from '@arcgis/core/geometry/Polygon'
import Polyline from '@arcgis/core/geometry/Polyline'
import * as GeometryEngine from '@arcgis/core/geometry/geometryEngine'
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils'
// 绘制方位角
function drawAzimuth(fovForm) {
  if (!this.azimuthLayer) {
    this.azimuthLayer = new GraphicsLayer({
      id: 'azimuth-layer'
    })
    this.map.add(this.azimuthLayer, 9)
  }
  const { center, pos1, leftBorderAngle, rightBorderAngle } = fovForm
  const spatialReference = this.mainView.spatialReference
  let centerPoint = new Point({
    x: lngLatToXY(center)[0],
    y: lngLatToXY(center)[1],
    spatialReference
  })
  let line = new Polyline({
    paths: [lngLatToXY(center), lngLatToXY(pos1)],
    spatialReference
  })
  let viewRange = GeometryEngine.geodesicLength(line, 'meters')
  // 绘制圆形得到对应360度每个度数对应经纬度
  let circleGeometry = new Circle({
    type: 'circle',
    center: centerPoint, // 圆心
    numberOfPoints: 360, // 圆返回点个数
    radius: viewRange, // 半径大小
    geodesic: true
  })
  let rings = circleGeometry.rings[0]
  let startAngle = parseInt(leftBorderAngle)
  let endAngle = parseInt(rightBorderAngle)
  let points = []
  if (startAngle != 360 && startAngle > endAngle) {
    points = rings.slice(startAngle).concat(rings.slice(0, endAngle + 1))
  } else {
    points = rings.slice(startAngle == 360 ? 0 : startAngle, endAngle + 1)
  }
  points.unshift(lngLatToXY(center))
  points.push(lngLatToXY(center))
  let azimuth = new Graphic({
    geometry: new Polygon({
      rings: points,
      spatialReference
    }),
    symbol: {
      type: 'simple-fill',
      color: [0, 176, 255, 0.1],
      style: 'solid',
      outline: {
        color: [128, 216, 255],
        width: 2
      }
    }
  })
  this.azimuthLayer.add(azimuth)
}
// 经纬度转化为平面坐标
function lngLatToXY(lngLat) {
  return webMercatorUtils.lngLatToXY(lngLat[0], lngLat[1])
}

// 清除方位角
function removeAzimuth() {
  this.azimuthLayer && this.azimuthLayer.removeAll()
}

export { drawAzimuth, removeAzimuth }
