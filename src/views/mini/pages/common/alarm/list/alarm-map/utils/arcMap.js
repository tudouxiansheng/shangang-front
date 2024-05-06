import { init } from './modules/initArcgis.js' // 地图初始化
import { createMarker, clearMarker } from './modules/Marker.js' // 点标记
import { drawAzimuth, removeAzimuth } from './modules/azimuth.js' // 镜头可视域
import { setMapExtent } from './modules/setExtent.js' // 地图边界

function ArcGIS() {
  this.map = null // 地图
  this.mainView = null // 视图
  this.markerLayer = null
}
// 地图初始化
ArcGIS.prototype.init = init
// 点标记
ArcGIS.prototype.createMarker = createMarker
ArcGIS.prototype.clearMarker = clearMarker
// 可视域
ArcGIS.prototype.drawAzimuth = drawAzimuth
ArcGIS.prototype.removeAzimuth = removeAzimuth
// 地图边界
ArcGIS.prototype.setMapExtent = setMapExtent
export default ArcGIS
