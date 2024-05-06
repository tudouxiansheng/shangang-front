import app from '@/main.js'
import store from '@/store'
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
let handleList = []
const httpRequest = () => {
  return new Promise((resolve, reject) => {
    // 判断window下有没有AMap对象，再判断是否引入cdn地图
    if (!window.AMap) {
      store
        .dispatch('mapConfig/get_gis_config_initial')
        .then(res => {
          if (res.resultCode == 0) {
            let { jsApi, uiLibraryAddress, keyProxyAddress } = res.gdMapForm
            window._AMapSecurityConfig = {
              serviceHost: keyProxyAddress
            }
            _createScript(jsApi)
            window.aMapInitCallback = () => {
              app.config.globalProperties.$AMap = window.AMap
              _createLink('./static/css/gdMap.css')
              _createScript(uiLibraryAddress)
              // 创建定时器 当AMapUI有值的时候 清除定时器 并resolve
              let interval = setInterval(() => {
                if (window.AMapUI) {
                  clearInterval(interval)
                  app.config.globalProperties.$AMapUI = window.AMapUI
                  resolve({
                    AMap: window.AMap,
                    AMapUI: window.AMapUI
                  })
                }
              }, 50)
            }
          } else {
            reject('map init error')
          }
        })
        .catch(err => {
          reject(err)
        })
    } else {
      app.config.globalProperties.$AMap = window.AMap
      app.config.globalProperties.$AMapUI = window.AMapUI
      resolve({
        AMap: window.AMap,
        AMapUI: window.AMapUI
      })
    }
  })
}

export default function loadMap(request = 'amap') {
  const sameHandle = handleList.find(item => item.request === request)
  if (sameHandle) return sameHandle.handle
  const handle = new Promise((resolve, reject) => {
    httpRequest()
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        handleList = handleList.filter(item => item.request !== request)
      })
  })
  handleList.push({ request, handle })
  return handle
}
