import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'

import devIcon from '@/utils/common/dev-icon'
const { setDevImg } = devIcon()

let _this
// 创建点标记
function createMarker(data) {
  _this = this
  clearMarker()
  let locSymbol = data.deviceType
    ? createPictureSymbol(setDevImg(data.deviceType, data.status), '32px', '32px')
    : createPictureSymbol(require('@/assets/img/amap/mark_bs.png'), '19px', '33px')
  let point = new Point(parseFloat(data.longitude), parseFloat(data.latitude))
  let cameraGraphic = new Graphic(point, locSymbol, data)
  this.markerLayer.add(cameraGraphic)

  setMapCenter(data)
}

function createPictureSymbol(url, width, height) {
  return {
    type: 'picture-marker',
    url,
    width,
    height
  }
}

// 清除点标记
function clearMarker() {
  // 删除图层重新加载
  if (_this.markerLayer) {
    _this.markerLayer.removeAll()
    _this.markerLayer = null
    let markerLayer = _this.map.findLayerById('marker-layer')
    markerLayer && _this.map.remove(markerLayer)
  }
  _this.markerLayer = new GraphicsLayer({
    id: 'marker-layer'
  })
  _this.map.add(_this.markerLayer, 8)
}

// 地图定位中心点以及层级
function setMapCenter(info) {
  if (!info.longitude) return
  _this.mainView.goTo({
    center: [parseFloat(info.longitude), parseFloat(info.latitude)],
    zoom: 16
  })
}

export { createMarker, clearMarker }
