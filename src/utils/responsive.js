let enquire;
if(typeof window !== 'undefined'){
  const matchMediaPolyfill = mediaQuery => {
    return {
      media:mediaQuery,
      matches:false,
      addListener(){},
      removeListeners(){}
    }
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
  enquire = require('enquire.js')
}

//支持的响应式类型
export const responsiveArray = ['xxl','xl','lg','md','sm','xs'];

export const responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
}
let subscribers = [] //[{token,func}]
let subUid = -1;
let screens = {};

const responsiveObserve = {
  /**
   * 派发事件
   * @param {Object} pointMap 媒体断点，如：{xxl:false, xl:true}
   * @return {boolean}
   */
  fire(pointMap) {
    screens = pointMap
    if (subscribers.length < 1) {
      return false
    }
    subscribers.forEach(item => {
      item.func(screens)
    })
    return true
  },
  /**
   * 订阅事件
   * @param {Function} func
   * @return {string}
   */
  on(func) {
    console.log(func,subscribers);
    if (subscribers.length === 0) {
      this.register()
    }
    const token = (++subUid).toString()
    subscribers.push({
      token,
      func
    })
    console.log(screens,subUid,token);
    func(screens)
    return token
  },
  /**
   * 取消事件订阅
   * @param {string} token
   */
  off(token) {
    subscribers = subscribers.filter(item => item.token !== token);
    if (subscribers.length === 0) {
      this.unregister();
    }
  },
  register() {
    Object.keys(responsiveMap).forEach(screen => {
      enquire.register(responsiveMap[screen], {
        match: () => {
          const pointMap = {
            ...screens,
            [screen]: true
          }
          this.fire(pointMap)
        },
        unmatch: () => {
          const pointMap = {
            ...screens,
            [screen]: false
          }
          this.fire(pointMap)
        },
        // Keep a empty destroy to avoid triggering unmatch when unregister
        destroy() {
        }
      })
    })
  },
  unregister() {
    Object.keys(responsiveMap).map(screen =>
      enquire.unregister(responsiveMap[screen])
    )
  }
}

export default responsiveObserve
