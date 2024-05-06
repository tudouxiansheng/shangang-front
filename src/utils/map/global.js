/**
 * 公共变量定义
 */
export const Cesium = window.Cesium;
export const wutu3d = window.wutu3d;
export const $ = window.$ || window.jQuey;
export const echarts = window.echarts;
export const turf = window.turf;
export const Animate = window.anime;

// 全局变量定义
export const global = {
  map: null
};

window.global = global;

export function setGlobal(_global) {
  if(!_global) return;
  for(const key in _global) {
    global[key] = _global[key];
  }
}

export function getGlobal(key) {
  return global[key];
}
