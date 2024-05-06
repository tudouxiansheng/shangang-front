/*
 *  Description: 地图点聚合
 */
import devIcon from '@/utils/dev-icon.js'
const { setDevImg, setDevImg1 } = devIcon()

class MapCluster {
  constructor() {
    this.cluster = null // 点聚合
  }
  addMarkerCluster(tag, markers, markerLabelShow, map, AMap) {
    if (this.cluster) {
      this.cluster.setMap(null)
    }
    let opts = {
      gridSize: 30, // 聚合计算时网格的像素大小，默认60
    } // 默认样式

    if (tag == 2) {
      // 完全自定义
      let count = markers.length
      let _renderClusterMarker = function (context) {
        let div = document.createElement('div')
        let factor = Math.pow(context.count / count, 1 / 18)
        let Hue = 180 - factor * 180
        let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
        let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
        let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
        let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
        let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
        div.style.backgroundColor = bgColor
        div.style.width = div.style.height = size + 'px'
        div.style.border = 'solid 1px ' + borderColor
        div.style.borderRadius = size / 2 + 'px'
        div.style.boxShadow = '0 0 1px ' + shadowColor
        div.style.lineHeight = size + 'px'
        div.style.color = fontColor
        div.style.fontSize = '14px'
        div.style.textAlign = 'center'
        div.innerHTML = context.count
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
        context.marker.setContent(div)
      }
      Object.assign(opts, {
        renderClusterMarker: _renderClusterMarker,
      })
    } else if (tag == 1) {
      // 自定义图标
      let sts = [
        {
          url: require('../images/blue.png'),
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16),
        },
        {
          url: require('../images/green.png'),
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16),
        },
        {
          url: require('../images/orange.png'),
          size: new AMap.Size(36, 36),
          offset: new AMap.Pixel(-18, -18),
        },
        {
          url: require('../images/red.png'),
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24),
        },
        {
          url: require('../images/darkRed.png'),
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24),
        },
      ]
      let _renderMarker = (context) => {
        let data = context.data[0]
        context.marker.setTitle(data.deviceName)
        context.marker.setTop(true)
        context.marker.setContent(
          data.alarmId
            ? this.getAlarmIcon(data.deviceType)
            : `<img style="width:48px;" src="${setDevImg(data.deviceType, data.status)}" />`
        )
        // 此处为设置标记在地图上的偏移，根据标记物大小处理
        context.marker.setOffset(new AMap.Pixel(-16, -16))
        context.marker.setExtData({
          ...data,
        })
        // 是否展示资源名称
        context.marker.setLabel({
          offset: new AMap.Pixel(3, 3), // 设置文本标注偏移量
          content: !markerLabelShow ? '' : "<div class='info'>" + data.deviceName + '</div>', // 设置文本标注内容
          direction: 'right', // 设置文本标注方位
        })
        context.marker.setzIndex(1100)
      }
      Object.assign(opts, {
        styles: sts,
        renderMarker: _renderMarker,
      })
    }
    this.cluster = new AMap.MarkerCluster(map, markers, opts)
  }
  // 获取告警图标
  getAlarmIcon(deviceType) {
    var markerImg = document.createElement('img')
    var markerContent = document.createElement('div')
    var pluse1 = document.createElement('i')
    var pluse2 = document.createElement('i')
    pluse1.className = 'pulse'
    pluse2.className = 'pulse1'
    markerContent.className = 'alarmMarker'
    markerImg.className = 'markerImg'
    markerImg.style.width = '48px'
    markerImg.src = setDevImg1(deviceType)
    markerContent.appendChild(markerImg)
    markerContent.appendChild(pluse1)
    markerContent.appendChild(pluse2)
    markerContent.appendChild(markerImg)
    return markerContent
  }
  clearCluster() {
    if (this.cluster) {
      this.cluster.clearMarkers()
    }
  }
}

export default MapCluster
