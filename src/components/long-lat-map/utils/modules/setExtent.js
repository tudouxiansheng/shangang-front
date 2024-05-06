import Extent from '@arcgis/core/geometry/Extent'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import store from '@/store'

// 地图边界
function setMapExtent(type = 'init') {
  const { arcgisForm, arcgisInitialForm } = store.state.mapConfig
  let extentObj = {
    xmin: null,
    ymin: null,
    xmax: null,
    ymax: null
  }
  if (type === 'init') {
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
  } else if (type === 'max') {
    if (
      arcgisForm.lucLongitude &&
      arcgisForm.llcLatitude &&
      arcgisForm.trcLongitude &&
      arcgisForm.urqLatitude
    ) {
      extentObj = {
        xmin: arcgisForm.lucLongitude,
        ymin: arcgisForm.llcLatitude,
        xmax: arcgisForm.trcLongitude,
        ymax: arcgisForm.urqLatitude,
        spatialReference: { wkid: 4326 }
      }
    } else {
      extentObj = {
        xmin: arcgisInitialForm.lucLongitude,
        ymin: arcgisInitialForm.llcLatitude,
        xmax: arcgisInitialForm.trcLongitude,
        ymax: arcgisInitialForm.urqLatitude,
        spatialReference: { wkid: 4326 }
      }
    }
  }

  this.mainView.extent = new Extent({
    ...extentObj,
    spatialReference: new SpatialReference({ wkid: 4326 })
  })
}

function limitMapExtent(view) {
  view.watch('stationary', event => {
    if (!event) {
      return
    }
    //当地图的范围发生变化时，检查地图是否在最大范围内。如果超出，回滚到最大值
    const currentExtent = view.extent
    if (
      currentExtent.xmin < this.maxExtent.xmin ||
      currentExtent.ymin < this.maxExtent.ymin ||
      currentExtent.xmax > this.maxExtent.xmax ||
      currentExtent.ymax > this.maxExtent.ymax
    ) {
      view.extent = this.maxExtent
    }
  })
}

export { setMapExtent, limitMapExtent }
