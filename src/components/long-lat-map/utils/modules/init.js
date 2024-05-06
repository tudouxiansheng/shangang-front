import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import store from '@store'
function init() {
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
      container: this.mapId,
      constraints: {
        minScale,
        maxScale
      }
    })
    const scaleBar = new ScaleBar({
      view: mainView,
      unit: 'metric'
    })
    mainView.ui.add(scaleBar, {
      position: 'bottom-left'
    })

    mainView.ui.move('zoom', 'bottom-right')
    mainView.ui._removeComponents(['attribution']) // 去掉logo

    this.map = map
    this.mainView = mainView
    this.baseLayer = baseLayer

    this.setMapExtent('max')

    mainView.when(
      () => {
        this.maxExtent = mainView.extent
        this.setMapExtent()
        this.limitMapExtent(mainView)
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
