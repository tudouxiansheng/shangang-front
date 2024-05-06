/*
 *  Description: 创建地图
 *  Author: chenda
 *  Date: 2022-02-17 14:50:00
 */
import loadMap from '@/utils/aMap'

function createMap(mapDivId) {
  //使用Promise对象构建（也可以不用）
  return new Promise(resolve => {
    loadMap().then(res => {
      console.log(res);
      const { AMap } = res
      let map = new AMap.Map(mapDivId, {
        resizeEnable: true,
        zoom: 12,
        zooms: [3, 20],
        lang: this.locale == 'en' ? 'en' : 'zh_cn',
        // animateEnable: false,
        // 截图白屏
        WebGLParams: {
          preserveDrawingBuffer: true
        }
      })

      map.plugin(['AMap.ToolBar', 'AMap.HawkEye', 'AMap.Scale'], () => {
        // 比例尺
        let scale = new AMap.Scale({
          visible: true,
          position: 'LB',
          offset: [10, 10]
        })
        // 工具条
        let toolBar = new AMap.ToolBar({
          visible: true,
          position: 'RB',
          offset: [20, 170]
        })
        // 鹰眼
        let overView = new AMap.HawkEye({
          visible: true,
          isOpen: true,
          width: '150px',
          height: '100px',
          offset: [10, 10],
          borderStyle: 'solid',
          borderWidth: '1px',
          buttonSize: '20px'
        })
        map.addControl(scale)
        map.addControl(toolBar)
        map.addControl(overView)
      })

      resolve({
        map
      })
    })
  })
}

export default {
  createMap
}
