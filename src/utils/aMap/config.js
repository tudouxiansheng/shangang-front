import Vue from 'vue'
let amapKey = '228be28b3edf106c741848d29f29d7ee' // 高德地图key
let amapVersion = '1.4.15' // 高德地图版本
let amapPlugins = [
    'AMap.Autocomplete', // 输入提示，提供了根据关键字获得提示信息的功能
    'AMap.PlaceSearch', // 地点搜索服务，提供了关键字搜索、周边搜索、范围内搜索等功能
    'AMap.DistrictSearch', // 行政区查询服务，提供了根据名称关键字、citycode、adcode 来查询行政区信息的功能
    'AMap.MarkerClusterer', // 点聚合插件
    'AMap.ToolBar', // 工具条，控制地图的缩放、平移等
    'AMap.Scale', // 比例尺，显示当前地图中心的比例尺
    'AMap.OverView', // 鹰眼控件，在地图右下角显示地图的缩略图
    'AMap.MouseTool', // 鼠标工具插件
    'AMap.RectangleEditor', // 矩形编辑插件
    'AMap.PolyEditor', // 折线、多边形编辑插件
    'AMap.CircleEditor' // 圆编辑插件
] // 高德地图插件
let _createScript = url => {
    var tmp = document.createElement('script')
    tmp.charset = 'utf-8'
    tmp.src = url
    document.head.appendChild(tmp)
}
let _createLink = href => {
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
}
export default function loadMap() {
    return new Promise(resolve => {
        // 判断window下有没有AMap对象，再判断是否引入cdn地图
        if (!window.AMap) {
            _createScript(
                `//webapi.amap.com/maps?v=${amapVersion}&key=${amapKey}&plugin=${amapPlugins.join()}&callback=aMapInitCallback`
            )
            window.aMapInitCallback = () => {
                Vue.prototype.$AMap = window.AMap
                _createLink('./static/css/gdMap.css')
                _createScript('//webapi.amap.com/ui/1.0/main.js?v=1.0.11&callback=amapUiCallback')
                // 创建定时器 当AMapUI有值的时候 清除定时器 并resolve
                let interval = setInterval(() => {
                    if (window.AMapUI) {
                        clearInterval(interval)
                        Vue.prototype.$AMapUI = window.AMapUI
                        resolve({
                            AMap: window.AMap,
                            AMapUI: window.AMapUI
                        })
                    }
                }, 50)
            }
        } else {
            Vue.prototype.$AMap = window.AMap
            Vue.prototype.$AMapUI = window.AMapUI
            resolve({
                AMap: window.AMap,
                AMapUI: window.AMapUI
            })
        }
    })
}
