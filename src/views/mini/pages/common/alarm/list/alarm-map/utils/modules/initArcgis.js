/* import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView' */
import store from '@/store'
function init(mapId) {
  return new Promise((resolve, reject) => {
    const { arcgisForm, arcgisInitialForm } = store.state.mapConfig
    let minScale =
      arcgisForm.minimumScale !== '' ? arcgisForm.minimumScale : arcgisInitialForm.minimumScale // (层级3：73957191 - 147914381)
    let maxScale =
      arcgisForm.maximumScale !== '' ? arcgisForm.maximumScale : arcgisInitialForm.maximumScale // (层级18：1129 - 2256)
    const baseLayer = 'osm'
    const map = new Map({
      basemap: baseLayer
    })
    const mainView = new MapView({
      map,
      container: mapId,
      constraints: {
        minScale,
        maxScale
      }
    })
    mainView.ui._removeComponents(['zoom', 'attribution']) // 去掉zoom,logo

    this.map = map
    this.mainView = mainView

    this.setMapExtent()

    mainView.when(
      () => {
        resolve({
          map,
          mainView
        })
      },
      error => {
        reject(error)
      }
    )
  })
}

export { init }
