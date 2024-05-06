/* import Extent from '@arcgis/core/geometry/Extent'
import SpatialReference from '@arcgis/core/geometry/SpatialReference' */
import store from '@/store'
// 地图边界
function setMapExtent() {
  const { arcgisForm, arcgisInitialForm } = store.state.mapConfig
  let extentObj = {
    xmin: null,
    ymin: null,
    xmax: null,
    ymax: null
  }
  if (
    arcgisForm.ilucLongitude &&
    arcgisForm.illcLatitude &&
    arcgisForm.itrcLongitude &&
    arcgisForm.iurqLatitude
  ) {
    extentObj = {
      xmin: arcgisForm.ilucLongitude,
      ymin: arcgisForm.illcLatitude,
      xmax: arcgisForm.itrcLongitude,
      ymax: arcgisForm.iurqLatitude
    }
  } else {
    extentObj = {
      xmin: arcgisInitialForm.ilucLongitude,
      ymin: arcgisInitialForm.illcLatitude,
      xmax: arcgisInitialForm.itrcLongitude,
      ymax: arcgisInitialForm.iurqLatitude
    }
  }
  let ext = new Extent({
    ...extentObj,
    spatialReference: new SpatialReference({ wkid: 4326 })
  })
  this.mainView.extent = ext
}
export { setMapExtent }
