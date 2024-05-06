/*
 * @Description  : 地图导出出口
 */
import { init } from './modules/init.js' // 地图初始化
import { setMapExtent, limitMapExtent } from './modules/setExtent.js' // 地图边界
import { createMarker, clearMarker } from './modules/Marker.js'
class ArcGIS {
  constructor(options) {
    let { mapId, mapConfig = {} } = options
    if (!mapId) {
      throw new Error('mapId is required')
    }
    this.map = null // 地图
    this.mainView = null // 视图
    this.baseLayer = null // 图层
    this.mapId = mapId
    this.mapConfig = mapConfig
  }
}
// 地图初始化
ArcGIS.prototype.init = init
// 地图边界
ArcGIS.prototype.setMapExtent = setMapExtent
ArcGIS.prototype.limitMapExtent = limitMapExtent
// 点标记
ArcGIS.prototype.createMarker = createMarker
ArcGIS.prototype.clearMarker = clearMarker
export default ArcGIS
