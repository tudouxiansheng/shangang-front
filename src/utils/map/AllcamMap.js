/**
 * allcam map js api doc
 * @version 1.0.1
 * @tutorial hikerme
 */

import { Evented } from './Event'
import dayjs from 'dayjs'
import { global } from './global'

// 引入dtroe
import store from '@/store'

// 导入固定配置
import { MapConfig } from '../mapConfig'
import TrackAnimal from './TrackAnimal.js'

/**
 * 公共变量定义
 */
export const Cesium = window.Cesium
export const wutu3d = window.wutu3d
export const $ = window.$ || window.jQuey
export const echarts = window.echarts
export const turf = window.turf
export const Animate = window.anime

/**
 * 获取CESIUM开始时钟
 * @param {String | Null} time 时间
 * @param {String | Null} date 日期
 */
function getDayTimeClock(time, date) {
  const dateString =
    dayjs(date || new Date())
      .format('YYYY-MM-DD')
      .toString() +
    'T' +
    (time || '09:30:00')
  const startTime = Cesium.JulianDate.fromDate(new Date(dateString))
  return new Cesium.Clock({
    startTime: startTime,
  })
}

/**
 * 获取CESIUM时钟ViewModel
 * @param {String} time 时间
 * @return {Cesium.ClockViewModel}
 */
function getClockViewModel(time) {
  const startTimeClock = getDayTimeClock(time)
  return new Cesium.ClockViewModel(startTimeClock)
}

const SINGLE_MAP_IMAGE = './static/libs/map/Cesium/Assets/Textures/waterNormalsSmall.jpg'

function setEntityAttributes(entity, properties) {
  if (!entity || !properties) return
  if (!entity.attribute.attr) {
    entity.attribute.attr = {}
  }
  for (const key in properties) {
    entity.attribute.attr[key] = properties[key]
  }
}

// function getEntityAttribute(entity, key) {
//     if(!entity || !key) return null;
//     if(!entity.attribute.attr) {
//         entity.attribute.attr = {};
//     }
//     return entity.attribute.attr[key];
// }

/**
 * Cartesian3转WGS84
 * @param {Cartesian3} point
 * @return {Object}
 */
export function Cartesian3_to_WGS84(point) {
  if (!point) return null
  let cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z || 0.0)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
  let lat = Cesium.Math.toDegrees(cartographic.latitude)
  let lng = Cesium.Math.toDegrees(cartographic.longitude)
  let alt = cartographic.height
  return {
    x: lng,
    y: lat,
    z: alt,
  }
}

/*---------------------*/
// 全局变量定义
export const AllcamMap = {
  map: null,
}

window.AllcamMap = AllcamMap

export function setAllcamMap(_global) {
  if (!_global) return
  for (const key in _global) {
    AllcamMap[key] = _global[key]
  }
}

export function getAllcamMap(key) {
  return AllcamMap[key]
}

/*
 * 动态立体墙类
 */
class Fence {
  constructor(viewer, positions, fenceHeight, cesiumColor, showDynamicFence) {
    this.viewer = viewer
    this.fenceHeight = fenceHeight
    this.cesiumColor = cesiumColor
    this.showDynamicFence = showDynamicFence === undefined ? true : showDynamicFence
    this.setPositions(positions)
    this.createEntity()
  }

  setPositions(value) {
    this.positions = value ? value : []
    this.initHeights()
  }

  initHeights() {
    let minimumHeights = []
    this.positions.forEach((position) => {
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      minimumHeights.push(cartographic.height)
    })

    let maximumHeights = [] //最大高度集合
    let dayMaximumHeights = [] //动态最大高度集合 长度与最大高度对应
    for (let i = 0; i < minimumHeights.length; i++) {
      maximumHeights.push(minimumHeights[i] + this.fenceHeight)
      dayMaximumHeights.push(minimumHeights[i])
    }

    this.minimumHeights = minimumHeights
    this.maximumHeights = maximumHeights
    this.dayMaximumHeights = dayMaximumHeights
  }

  createEntity() {
    this.initFence()
    if (this.showDynamicFence) {
      this.initDynamicFence()
    }
  }

  initFence() {
    this.fenceEntity = this.viewer.entities.add({
      wall: {
        positions: new Cesium.CallbackProperty(() => {
          return this.positions
        }, false),
        minimumHeights: new Cesium.CallbackProperty(() => {
          return this.minimumHeights
        }, false),
        maximumHeights: new Cesium.CallbackProperty(() => {
          return this.maximumHeights
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image:
            'data:image/png;base64,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',
          transparent: true,
          color: this.cesiumColor || Cesium.Color.RED,
        }),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    })
  }

  initDynamicFence() {
    this.dynamicFenceEntity = this.viewer.entities.add({
      wall: {
        positions: new Cesium.CallbackProperty(() => {
          return this.positions
        }, false),
        minimumHeights: new Cesium.CallbackProperty(() => {
          return this.minimumHeights
        }, false),
        maximumHeights: new Cesium.CallbackProperty(() => {
          for (let i = 0; i < this.minimumHeights.length; i++) {
            this.dayMaximumHeights[i] += this.fenceHeight * 0.012
            if (this.dayMaximumHeights[i] > this.maximumHeights[i]) {
              this.dayMaximumHeights[i] = this.minimumHeights[i]
            }
          }
          return this.dayMaximumHeights
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAtlSURBVHja7N1Zmts6DoZho5/a/xqzgt5Bor7JOV1J2WUNHADq/S4zWAAI/CIpDvHjx4//Pq4Tl39ha/Ir03hq/vaIOj599WByk8SCaTI1ds/4eDwevxoU8dbc5MEtffFxEc992irnTAxMxL05Vbv4/82yGPCg3QKwNSniFgX7+TfGF/9wASzyNpv7YijZ9XsVu5gUl9dGfu4BzB4EjKiG+OYPt0qVNdCcbZVq7NJM8e2Tt9xN21IA6o3ODCWXi0uczdS42otpFbTRVdRQAELCr+D39thWj0gkzoddD2+oEh+Px+NniiAM70A8fWCqafApOadf1D8SV/OqoWV7egBRPNxnHhiKYU/Q+ijk37/a4ykHfzNGP7i5zy9+sOEQQHf6fj7HkGBGngaLUQ8eNZXZWgCWKppOI4DI93rQ1nf1+4sAZM2td3ZtrxbjzG69QwGNfSZUnXImFun8/jIJGEkbJdpHL4ZURSROsqjaobi9oERLAfgl4E3Mb+T3+HIMxXXbHsjMOYAcjZZuyjnGJ+IYzdG1TyoAP9/kQNyqeXp8AIzcibjF+AUoii+HT//2ACKxg7vzLm+Cpt7aenKO8qafPsv1vPb1ADI3bFz/h7F+Ni3/9ovzlZVgKdFzjzq20T77sswBRIfw6npW8GnIBr7o4FNUba541wNI4e0ab8ehMlZTdGLy/FOnJnrxs+naqEMPoFlEY6xdPTIh5jZ+f/2JFnZNPQyq07xG5jm1Mz2AAz8ciV6KR5ok1uu2DzqRcDt6+GF8nxZTt+uWWoZx3a/xcwCxQDDH5kp6YYoGPZ3I48waQ6udPZ0rPYB7jVVfO2LCr7o/NWecm1h8RgAkPJ/WsjfuG/8/hgC3+PRWy8l9n0dz+LTTgnT3D3xn5fIvhj96AFGliFs+YfBMeZfToKJQ/McPsmvPSZwyb3+W9ZgDyD9Le/z+gchierNeg+FBLZ+unSvRRQBiSopHg/8VS2RxFKuehYp42A0/X6J3ocLi7RxAjTb+NgQmvvg0wNZ5003RyLh/bJvxGfCiA6EoVrB37LgkigUxRtn2vQD0baQ5RdHPp/NHjM0ZpM8VpShmb8U22JFX3wtALJBox6yJKW0cCxd6E3tL3z8wZ435Tmc+tsfjZ9NroGtMOXublLJ3+v0DUa5RYt+/+IhjcwBRLA1LFMUBzRx78Oh1MTf3kdynaXcDZj18e/qm4bP+9PhOHI3in69XeOPTkr4KwK8iFkcGuxpfEhfFUvrSKowJOqDQdwjAtM+ArRc11Gq4tFeARbEfNp9zoeqmCsDsD/5ThyF7Hu7rwM3nHL5Jkjf58/qvo1UP4Fz5PPlfUSxbqn0cTVMUjY53v9HE4vnvEnsfekEA4tR/yNx6BxO0TCJm2dp6cI7SF4S+iR2zhgBRrAWrHRIVtcytPBR5upRo8GG21yLcQABeGljtG7w3zsr+tJ9QjUNLieaHJToJQO3TdKN+YUWxHf9RLEpt7B13/8Chp7QcAgxu2MsRjTl2nbY7stXUnjFmJrsuHgaVck3k1aQofCjo7i8oydaeRJH4NnO54SrNIfcPTD2nf7S0fCcAMdmx1mEpO8Yv0sEfsIc9WhppO/TOHkDkSoMqPZR29sbNCn1Zf9ooefQSALPg/GFvHguG2PusB3DbnYCDnKz7ebTUWQ+l7h+Ylt9TdgPeYgNQzM2+DvcPRK0WiBILombPSRQ8FLTQeO3zkuE6xR8zQ2YoMlsA8vSTYmqqtZilzX3/QBTL7BvO+fTP868CMP7whqRng9Re4rxo0dzsjd///oGXQ4BoW0YFGy0Uzgr2jnuTVdrWHr3mAM5NvMwbdvR76nCfdlxXdcez+WKNIh83BDgTiC5X3hZvuOGn+UTm9C1SOH3u/Bt0/8Cpz4nvBCBaPLmL019/0HiXvRftnX7/wNVnHP7p6+sAxk85x4LlPsSbhiIcTZ+44hV0RfIl4zoAb79ORX/w1NIGE6FD3w4KvagA+KzW0d5aWzp3PTdymrXD3naLy9IJQOrCOBGze/U+vgQoMrgRhaIbw7KqcW/pHwGIFGXXqdlmZ9L4sffBhxt/3/bF8HsSsP8FBOcd2B7dr8ob2wpRKGVLFvCbtq+2u7FrO/3uAXS9gCBm+JZ5XXqjCzLSvdmyLB+PJElSQWz3zgFEtgyo3J3rlKBRLKBm7U9La7tC+7QOoO8FBB3eL6USaGd0ffqs7lOXl+ClpUSxswcQyYMdpZMjlkj4El286Yd9dohS9Gqi3YeCrjNfctSNrJ7/YVeMsTvmtlHepoiG9w8MbaLdS4EjbYFONmdf68b4MMV67TRog9Wg+wfGROxNfrbZDZh4UN3dn7zdopgb0rqCE+PO7p6+D3bKoaBN3Kg/HokFDbLwJ93o8HufbrEUmE8K9FY+HZwE/LVqoApOXNZe8tiqjUr5VPv+gSs9gNW+B9V8m3w/5Zz+kpcOx65Ovww2pqfy/h/I1AO4Z/e09RbR+fcPVLtZ6tbDjI67Aae3YpRItbZbRGNKFg1+TCxSfBl4vxuwlwPj7x+42laD1nlLVj6N8/m3AMzb6xP1dqI1bpRQWCv4XXSp7KE5gEicaLGoSrx1b979A73jHIu0UGq/P38FyB/wPvcP1H5zDV8ilXZPY6F2bKba8d2v7nnKqx5AFEn2/L9eeBdV0WvdCmTblPsH4vIQYKWx3766bHBBaOEDCaNEW3dX2Jjh09ZkR0LTOYC3gS4lBA2PcY0FHO1RhjGmgGPBaMcwrw4IQJRtlfuVYyrHol/xpx6XzVvWfeB3XgvAtX3u2x2r+1PIxOW595Hw/oE8+hnj3XstAGUOpMwzyzZ7zDw1Env2IMTNBTDhi+GzAMTF5r+WonPvH3icnfDbYfY93msrfmJtJbiJb7L++JSk29QUjdnJHafUOdZM0FYublP9mpQwOyK4ZRKAeucB9OkOLNc9jb1xiVpxiRyPWyJf/hKAfhcQ/D+YXe8faNAoaVfuXHmZG3uv9mJotNz6LwGI3tfYbfmHhWmP/t8yGDEm6M1FeD0BjCYrNbePv4KzHQpprjuFM6y5W7Dnsb0Z7jaxe0vVlFlOnH5jV/wVuzNm75kDGDq/G9MKcPbbL5LqQ7yJ7YI3BbV1aXv9F/PvH/jYUTjbbjdXvG21v1/bhKScGt/BqZL2xRANltZfjeOzHkDK+7inNbytrc3jG7PrrgZDhOtZD2D6PEDxhlv1rRViu14bfFwKSCzfcIsfNHQo+lvlUyIK3j/wzNittfkfrQtrsWIY/emtzhUfEwby0bqNSt0I2efop+YCYB9w0l5Oi9WTue4fSC86Fcoqtm1TdsBN+Y8QAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAABAEAAABAAAAQAAAEAQAAAEAAABADAEvxvANtG/U5OQyQ2AAAAAElFTkSuQmCC',
          transparent: true,
          color: this.cesiumColor || Cesium.Color.RED,
        }),
      },
    })
  }

  //移除动态墙体对象

  remove() {
    this.viewer.entities.remove(this.fenceEntity)
    this.viewer.entities.remove(this.dynamicFenceEntity)
  }
}

/*----------------------------------*/
/**
 * 地图主类
 * @extends {Evented}
 */
export class Map extends Evented {
  constructor(container, option) {
    super()
    this.option = {
      sceneModePicker: false, // 视图模型选择按钮
      fullscreenButton: false, // 全屏按钮
      homeButton: false,
      baseLayerPicker: false, // 底图选择按钮
      navigationHelpButton: false, // 导航工具按钮
      // 底图
      imageryProvider: null,
      // 背景色，只有在底图无效的情况下才有用
      backgroundColor: null,
      // 初始化视图值
      viewpoint: null,
      // // 最大缩放限制
      // maximumZoomDistance: 20000,
      // // 最小缩放限制
      // minimumZoomDistance: 5,
      // 显示罗盘控件
      showCompass: false,
      // 当前时间
      currentTime: undefined,
    }
    Object.assign(this.option, option)

    // 视图控制器
    const viewer = (this.viewer = this._initViewer(container))

    // 隐藏Cesium官网信息
    this.viewer._cesiumWidget._creditContainer.style.display = 'none'

    if (!this.option.imageryProvider) {
      viewer.scene.skyBox = null
      viewer.scene.sun.show = false
      viewer.scene.moon.show = false
      viewer.scene.globe.show = false
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString(
        this.option.backgroundColor || 'rgba(0, 13, 22, 1)'
      )
      viewer.scene.globe.depthTestAgainstTerrain = false
      viewer.scene.logarithmicDepthBuffer = false
    }

    // 实始化地图初始点
    this.viewer.camera.flyHome = () => {
      this.option.viewpoint &&
        this.setViewpoint(this.option.viewpoint, {
          duration: 1,
        })
    }

    this.viewer.scene.globe.depthTestAgainstTerrain = false

    if (this.option.minimumZoomDistance) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = this.option.minimumZoomDistance
    }
    if (this.option.maximumZoomDistance) {
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = this.option.maximumZoomDistance
    }

    // 安装指南针、罗盘插件
    if (Cesium.viewerCesiumNavigationMixin && this.option.showCompass) {
      const ops = {}
      ops.enableCompass = true //罗盘
      ops.enableZoomControls = true //缩放
      ops.enableDistanceLegend = true //比例尺
      ops.enableCompassOuterRing = true //指南针外环
      this.viewer.extend(Cesium.viewerCesiumNavigationMixin, ops)
    }

    // 三维瓦片模型集合
    this.models = []
    this.tileModelCollection = new Cesium.PrimitiveCollection('tilemodel')
    this.viewer.scene.primitives.add(this.tileModelCollection)

    // 绘制工具
    this.measureTool = new wutu3d.analysi.Measure({
      viewer: viewer,
      removeScreenSpaceEvent: true,
      label: {
        font_size: 18,
        border_width: 4,
        background: false,
      },
    })

    // 绘制工具
    this.plotDrawTool = new wutu3d.Draw(viewer, {
      hasEdit: false,
    })

    // 交互
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this._initEvent()

    this.popups = []

    // 修改鼠标事件
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ]

    // this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    // 	Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG
    // ];

    // 实始化地图视点
    if (this.option.viewpoint) {
      this.setViewpoint(this.option.viewpoint)
    }

    this.TrackAnimal = new TrackAnimal(this.viewer)
  }

  /**
   * 计算并合并交互事件
   * @private
   * @param {Object} evt
   */

  /**
   * 初始化事件
   * @private
   */
  _initEvent() {
    // this.viewer.wutu3d.keyboardRoam.bind({
    //     speedRatio: 150,    //平移步长，值越大步长越小。
    //     dirStep: 25,        //相机原地旋转步长，值越大步长越小。
    //     rotateStep: 1.0,    //相机围绕目标点旋转速率，0.3 - 2.0
    //     minPitch: 0.1,      //最小仰角  0 - 1
    //     maxPitch: 0.95,     //最大仰角  0 - 1
    // });
    const viewer = this.viewer
    const plotDrawTool = this.plotDrawTool
    const _mergeEvt = (event) => {
      let position = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
      let pick = viewer.scene.pick(event.position)
      if (Cesium.defined(pick) && pick.id && pick.id instanceof Cesium.Entity) {
        event.entity = pick.id
      } else {
        event.entity = null
      }
      event.editPlot = plotDrawTool.getCurrentEntity()
      event.cartesian3 = position
      event.latLngPosition = Cartesian3_to_WGS84(position)
    }

    this.handler.setInputAction((evt) => {
      _mergeEvt(evt)
      this.fire('click', evt)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler.setInputAction((evt) => {
      _mergeEvt(evt)
      this.fire('contextmenu', evt)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // this.plotDrawTool.on(wutu3d.draw.event.DrawStop, (e) => {
    // 	this.fire("drawStop", e);
    // });

    // this.plotDrawTool.on(wutu3d.draw.event.DrawAddPoint, (e) => {
    // 	this.fire("drawUpdate", e);
    // });

    // this.plotDrawTool.on(wutu3d.draw.event.DrawRemovePoint, (e) => {
    // 	this.fire("drawUpdate", e);
    // });

    // this.plotDrawTool.on(wutu3d.draw.event.EditMovePoint, (e) => {
    // 	this.fire("drawUpdate", e);
    // });
  }

  /**
   * 根据模型ID获取模型
   * @param {String} id 模型ID
   * @return {Object|undefined}
   */
  getModel(id) {
    return this.models.filter((d) => d.id === id)[0]
  }

  /**
   * 定位至模型
   * @param {String} id 模型ID
   */
  flyToModel(id) {
    const model = this.getModel(id)
    if (!model || !model.model) return
    this.viewer.flyTo(model.model)
  }

  /**
   * 添加模型
   * @param {Object} param 模型参数
   * @param {String} param.id 模型ID
   * @param {String} param.name 模型名称
   * @param {String} param.link 模型链接地址
   * @param {String} param.visible 模型可见度
   * @param {String} param.maximumScreenSpaceError 模型精度，1最高，越大越模糊，默认为4
   * @param {String} param.modifyZ 模型Z值高度修复，默认为0
   * @return {Object}
   */
  addModel({ id, name, link, visible, maximumScreenSpaceError, modifyZ, loaded, focus, modelMatrix } = {}) {
    let tileset = this.tileModelCollection.add(
      new Cesium.Cesium3DTileset({
        url: link,
        show: visible === undefined ? true : !!visible,
        // maximumNumberOfLoadedTiles: 3000,
        // maximumMemoryUsage: 1024,
        modelMatrix: Cesium.Matrix4.fromArray(modelMatrix || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        // maximumScreenSpaceError: maximumScreenSpaceError || 4,
        maximumNumberOfLoadedTiles: 3000, //最大加载瓦片个数
        // maximumMemoryUsage: 1024,
        skipLevelOfDetail: true,
        baseScreenSpaceError: 1024,
        maximumScreenSpaceError: maximumScreenSpaceError || 16, // 当离相机视点距离较远时，渲染低级别低精度的模型文件，距离相机视点较近时，则渲染高级别高精度的模型文件，数值加大，能让最终成像变模糊
        skipScreenSpaceErrorFactor: 16, //定义跳过最小屏幕空间误差的倍乘。如果瓦片的屏幕空间误差为100，不加载该瓦片。非模型。
        skipLevels: 1, //当skipLevelOfDetail=true时，一个定义加载图块要跳过最小级别数的常量。为0时，不跳入任何级别
        immediatelyLoadDesiredLevelOfDetail: false,
        loadSiblings: true, // 当skipLevelOfDetail=true时，如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋
        cullWithChildrenBounds: true, //是否使用子项边界体积的并集来剔除图块，默认true。cesium如果想要平面裁切，建议关闭。
        cullRequestsWhileMoving: true, //不请求那些很可能由于相机移动而在返回时可能未使用的图块，默认为true。
        cullRequestsWhileMovingMultiplier: 10, // 移动时用于剔除请求的乘数。较大的是更积极的剔除，较小的较不积极的剔除。默认值为60,值越小能够更快的剔除
        preloadWhenHidden: true, //当titleset.show=false时，预加载瓦片。实际建一缓存区，存储瓦片数据，不渲染。
        preferLeaves: true, //叶子节点优先加载,是Cesium加载瓦片优先级考虑的条件之一
        maximumMemoryUsage: 1024, // tileset可以使用的最大内存，默认512Mb。当然越小越好。内存分配变小有利于倾斜摄影数据回收，提升性能体验
        progressiveResolutionHeightFraction: 0.5, // progressiveResolutionHeightFraction * screenHeight的缩小屏幕分辨率的屏幕空间误差的瓦片将被优先考虑。这可以帮助在高分辨率的瓦片模型继续加载时，快速得到一层面片，但数值偏于0能够让初始加载变得模糊。默认值为0.3。
        dynamicScreenSpaceErrorDensity: 0.5, // 数值加大，能让周边加载变快，远处瓦片更模糊。
        dynamicScreenSpaceErrorFactor: 1, //增加动态屏幕错误的一个因子。作用目前只是产生最终的动态误差。
        dynamicScreenSpaceError: true, // 瓦片是否应根据动态屏幕空间误差进行细化。距离较远的瓦片将以较低的细节进行渲染，而不是较近的瓦片。这通过渲染更少的瓦片和提出更少的请求来提高性能，但可能会导致远处的瓦片的视觉质量略有下降,有了这个后，会在真正的全屏加载完之后才清晰化房屋
      })
    )
    tileset.readyPromise
      .then((tileset) => {
        if (modifyZ && !modelMatrix) {
          let boundingSphere = tileset.boundingSphere
          let cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
          let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
          let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, modifyZ || 0)
          let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
          tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        }
        if (focus) {
          this.viewer.flyTo(tileset)
        }
        // viewer.zoomTo(tileset);
      })
      .otherwise(function () {})

    tileset.allTilesLoaded.addEventListener(() => {
      loaded && loaded(tileset)
    })

    let _model = {
      name,
      id: id || Cesium.createGuid(),
      link: link,
      model: tileset,
      visible: visible === undefined ? true : !!visible,
      modelMatrix: modelMatrix,
    }
    this.models.push(_model)
    return _model
  }

  /**
   * 添加波动圈
   * @param {Object} params 波动圈参数
   * @param {Array} params.coord 经纬度
   * @param {Array} params.height 高度
   * @param {Number} params.minR 最小半径
   * @param {Number} params.maxR 最大半径
   * @param {Number} params.step 增速，越大越快
   *
   * @returns
   */
  createHandle(params, z) {
    const { height, minR, maxR, step, coord } = params
    console.log(height, minR, maxR, step, coord)
    let r1 = minR
    let r2 = minR
    const entity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(...coord),
      name: 'circle',
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty(() => {
          r1 > maxR ? (r1 = minR) : (r1 += step)
          return r1
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty(() => {
          r2 > maxR ? (r2 = minR) : (r2 += step)
          return r2
        }, false),
        height,
        // extrudedHeight: 1000,
        material: Cesium.Color.fromCssColorString('#f005'),
        outline: true, // height must be set for outline to display,
        fill: true,
        outlineColor: Cesium.Color.fromCssColorString('#f00'),
        outlineWidth: 10,
      },
    })
    return entity
  }

  /**
   *
   * @param {Object} entity 波动圈实体
   * @returns
   */
  removeCircle(entity) {
    entity && this.viewer.entities.remove(entity)
  }

  /**
   * 根据模型ID删除模型
   * @param {String} id 模型ID
   * @return this
   */
  removeModel(id) {
    const model = this.models.filter((d) => d.id === id)[0]
    if (model && model.model) {
      if (model.model instanceof Cesium.Cesium3DTileset && this.tileModelCollection.contains(model.model)) {
        this.tileModelCollection.remove(model.model)
      }
      this.models = this.models.filter((d) => d.id !== id)
    }
    return this
  }

  /**
   * 设置模型可见度
   * @param {String} id 模型ID
   * @param {Boolean} visible  可见性
   * @return this
   */
  setModelVisible(id, visible) {
    const model = this.models.filter((d) => d.id === id)[0]
    if (model && model.model) {
      if (model.model instanceof Cesium.Cesium3DTileset) {
        model.model.show = visible
      }
      for (let i = 0; i < this.models.length; i++) {
        let md = this.models[i]
        if (md.id === model.id) {
          md.visible = visible
        }
      }
    }
    return this
  }

  addPopup(popup, id) {
    id = id || Cesium.createGuid()
    this.popups.push({
      id,
      popup,
    })
  }

  removePopup(id) {
    for (let i = 0; i < this.popups.length; i++) {
      const popup = this.popups[i]
      if (popup.id === id && popup.popup) {
        popup.popup.destroy()
      }
    }
  }

  clearPopup() {
    this.popups.forEach((popup) => {
      popup.popup && popup.popup.destroy()
    })
    this.popups = []
  }

  /**
   * 获取视图中心值
   * @return {Object} {x, y, z, heading, roll, pitch}
   */
  getViewPoint() {
    const viewer = this.viewer
    return wutu3d.point.getCameraView(viewer, true)
  }

  /**
   * 设置视图中心
   * @param {Object} viewpoint {x, y, z, heading, roll, pitch}
   */
  setViewpoint(viewpoint, options) {
    if (viewpoint) {
      this.viewer.wutu3d.centerAt(viewpoint, options)
    }
  }

  /**
   * 初始化视图控制器
   * @private
   * @param {String|HTMLElement} container 地图DIV容器
   * @return {Cesium.Viewer}
   */
  _initViewer(container) {
    const {
      sceneModePicker,
      vrButton,
      baseLayerPicker,
      fullscreenButton,
      navigationHelpButton,
      imageryProvider,
      homeButton,
      currentTime,
    } = this.option
    let viewer = new Cesium.Viewer(container || 'map', {
      geocoder: false,
      homeButton: homeButton,
      sceneModePicker: sceneModePicker,
      fullscreenButton: fullscreenButton,
      vrButton: vrButton,
      baseLayerPicker: baseLayerPicker,
      infoBox: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      shouldAnimate: true,
      clockViewModel: currentTime ? getClockViewModel(currentTime) : undefined,
      navigationHelpButton: navigationHelpButton,
      navigationInstructionsInitiallyVisible: false,
      imageryProvider:
        imageryProvider ||
        new Cesium.SingleTileImageryProvider({
          url: SINGLE_MAP_IMAGE,
        }),
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    })

    viewer.wutu3d = new wutu3d.ViewerEx(viewer, {
      contextmenu: false,
      center: this.option.viewpoint || undefined,
      mouseZoom: false,
      contextmenuItems: [],
    })

    return viewer
  }

  _plusEntity(entity) {
    // console.log("图标加载完毕",entity);
    if (!entity) return
    let attr = entity.attribute && entity.attribute.attr
    let style = entity.attribute && entity.attribute.style
    if (entity.billboard) {
      entity.billboard.translucencyByDistance = undefined
      entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
      entity.billboard.eyeOffset = new Cesium.Cartesian3(0, 0, -10)
    }
    if (entity.label) {
      entity.label.translucencyByDistance = undefined
      entity.label.disableDepthTestDistance = Number.POSITIVE_INFINITY
      entity.label.eyeOffset = new Cesium.Cartesian3(0, 0, -10)
    }
    if (style && attr.animateLine) {
      entity.polyline.material = new wutu3d.LineFlowMaterial({
        //动画线材质
        color: Cesium.Color.fromCssColorString(style.color || '#ff0000'),
        duration: style.duration || 10000, //时长，控制速度
        url: style.image || './static/images/texture/route.png',
      })
    }
    if (style && attr.wave) {
      entity.ellipse.material = new wutu3d.CircleWaveMaterial({
        duration: style.duration, //动画时长，单位：毫秒
        color: Cesium.Color.fromCssColorString(style.color),
        gradient: style.gradient || 0,
        count: style.count || 2,
      })
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    }
  }

  /**
   * 开启编辑
   * @param {Boolean} editable
   */
  setPlotEditable(editable) {
    const pt = this.plotDrawTool
    pt.hasEdit(editable)
    if (!editable) {
      pt.stopDraw()
      pt.stopEditing()
    }
  }

  /**
   * 是否编辑中
   */
  isPlotEditing() {
    return this.plotDrawTool._hasEdit
  }

  /**
   * 开始绘制
   * @param {Object} drawOption 绘制参数，详见说明user.md
   * @param {Function} callback 绘制完成时加回调
   */
  startDraw(drawOption, callback) {
    let option = {
      success: (entity) => {
        setEntityAttributes(entity, {
          id: entity.id,
        })
        this._plusEntity(entity)
        callback && callback(entity)
      },
      ...drawOption,
    }
    this.plotDrawTool.startDraw(option)
  }

  /**
   * 通过代码添加点位
   * @param {Object} drawOption 绘制选项
   * @param {Array} position 位置坐标
   */
  createPlot(drawOption, position) {
    if (
      !drawOption ||
      !drawOption.type ||
      !drawOption.style ||
      !position ||
      position[0] === undefined ||
      position.length < 2
    )
      return null
    let entity = this.plotDrawTool.attributeToEntity(
      drawOption,
      wutu3d.draw.util.lonlat2cartesian([position[0], position[1], position[2] || 0])
    )
    setEntityAttributes(entity, {
      id: entity.id,
    })
    this._plusEntity(entity)
    return entity
  }

  /**
   * 获取对象
   * @param {String} id 对象ID
   */
  getPlotById(id) {
    return this.plotDrawTool.getEntityById(id)
  }

  /**
   * 更新对象样式
   * @param {String} id 对象ID
   * @param {Object} style 样式对象
   */
  updatePlotStyle(id, style) {
    if (!id || !style) return
    const entity = this.getPlotById(id)
    if (!entity || !entity.attribute) return
    const attribute = entity.attribute
    let type = attribute.type
    if (type === 'circle') {
      type = 'ellipse'
    }
    if (wutu3d.draw.attr[type]) {
      wutu3d.draw.attr[type].style2Entity(style, entity[type])
      this._plusEntity(entity)
    }
  }

  /**
   * 更新样式属性
   * @param {String} id 对象ID
   * @param {Object} attrs
   */
  updatePlotAttribute(id, attrs) {
    const entity = this.getPlotById(id)
    setEntityAttributes(entity, attrs)
  }

  /**
   * 删除绘制对象
   * @param {String} id 对象ID
   */
  deletePlot(id) {
    const entity = this.getPlotById(id)
    entity && this.plotDrawTool.deleteEntity(entity)
  }

  /**
   * 加载GeoJSON
   * @param {GeoJSON} geojson
   */
  loadGeoJSON(geojson, showable) {
    const entities = this.plotDrawTool.loadJson(geojson)
    for (let i = 0; i < entities.length; i++) {
      if (showable === false) {
        entities[i].show = showable
      }
      this._plusEntity(entities[i])
    }
    // console.log('%c 图标加载完毕','color:yellow',entities)

    console.log(333, entities)
    return entities[0]
  }

  /**
   * 将绘制对象转为Geojson数据
   */
  toGeoJSON() {
    return this.plotDrawTool.toGeoJSON()
  }

  // 清除所有绘制对象
  clearAllPlots() {
    let pt = this.plotDrawTool
    pt.stopEditing()
    pt.clearDraw()
    pt.deleteAll()
    console.log('清所有')
  }

  /*---------------以下为张东阳定义的接口------------*/
  /**
   * 回到默认视角
   */
  flyHome() {
    this.option.viewpoint &&
      this.setViewpoint(this.option.viewpoint, {
        duration: 1,
      })
  }

  /**
   * 根据属性添加标签（楼栋标签和社会资源标签等）
   */
  addLabel(data, courtName) {
    console.log('楼栋信息==》[{}],===小区名字=>[{}]', data, courtName)

    let buildingName = courtName + data.buildingName

    let position = {
      type: 'Feature',
      properties: {
        type: 'label',
        style: {
          text: buildingName,
          ...MapConfig.style.label,
        },
        attr: {
          name: buildingName,
          id: data.id,
          type: 'building',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude, data.altitude],
      },
    }

    // 地图画点
    // let entity = this.plotDrawTool.loadJson(position);
    // 加载后不显示
    let entity = this.loadGeoJSON(position, false)

    // 定位到响应位置
    this.viewer.flyTo(entity, {
      duration: 1,
    })
  }

  /**
   * 显示楼栋信息，并定位到该位置
   */
  showBuildNameAndFlyto(buildingInfo, courtName) {
    let entity = this.getPlotById(buildingInfo.buildingId)
    if (!entity) {
      // 创建楼栋名称label
      let buildingName = buildingInfo.buildingName
      let position = {
        type: 'Feature',
        properties: {
          type: 'label',
          style: {
            text: buildingName,
            ...MapConfig.style.label,
          },
          attr: {
            name: buildingName,
            id: buildingInfo.buildingId,
            type: 'building',
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [buildingInfo.longitude, buildingInfo.latitude, buildingInfo.altitude],
        },
      }

      // 加载后显示
      entity = this.loadGeoJSON(position, true)
    }

    entity.show = true
    this.viewer.flyTo(entity, {
      duration: 1,
    })
  }

  /**
   * 加载全部社会资源图标
   * @param list
   */
  loadSocialResIcon(list, showable) {
    console.log('allcamMap load social icon data list', list)
    // 获取社会资源坐标信息
    let entities = []

    if (!(list && list.length > 0)) {
      return
    }

    // 将信息项封装成entity对象
    for (let item of list) {
      let image = ''
      let iconType = ''

      if (!(item.longitude && item.latitude)) {
        continue
      }

      // 判断类型，赋值不同的图标
      switch (item.socialResType) {
        case 1: // 宾馆
          image = MapConfig.images.site_hotel
          iconType = 'site_hotel'
          break
        case 2: // 网吧
          image = MapConfig.images.site_netbar
          iconType = 'site_netbar'
          break
        case 3: // 寄递业
          image = MapConfig.images.site_express_station
          iconType = 'site_express_station'
          break
        case 4: // 沿街商铺
          image = MapConfig.images.site_store
          iconType = 'site_store'
          break
        case 5: // 酒吧/KTV
          image = MapConfig.images.site_bar_ktv
          iconType = 'site_bar_ktv'
          break
        case 6: // 中小学
          image = MapConfig.images.site_school
          iconType = 'site_school'
          break
        case 7: // 集贸市场
          image = MapConfig.images.site_trade_market
          iconType = 'site_trade_market'
          break
        case 8: // 宗教场所
          image = MapConfig.images.site_religion_station
          iconType = 'site_religion_station'
          break
        case 9: // 消防重点单位
          image = MapConfig.images.site_fire_station
          iconType = 'site_fire_station'
          break
        case 10: // 警务站点
          image = MapConfig.images.site_police_station
          iconType = 'site_police_station'
          break
        case 11: // 商场
          image = MapConfig.images.site_square_market
          iconType = 'site_square_market'
          break
        default: // 不在所规定类型之列
          image = MapConfig.images.site_else
          iconType = 'site_else'
          break
      }

      // 生成entity
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: image,
            scale: MapConfig.images.scale,
          },
          attr: {
            id: item.id,
            type: 'socialres',
            subType: item.socialResType,
            iconType: iconType,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [Number(item.longitude), Number(item.latitude), 43.04],
        },
      }
      entities.push(position)
    }

    if (entities.length === 0) {
      return
    }

    // 执行加载
    console.log('allcamMap load social icon data list2', entities)
    this.loadGeoJSON(
      {
        features: entities,
      },
      showable
    )
  }

  /**
   * 加载全部设备信息图标
   * @param list
   */
  loadDeviceIcon(list, showable) {
    // 设备正常状态值  '状态 0 未激活 1 在线 2 离线 3 异常
    // 获取社会资源坐标信息
    let entities = []

    // 将信息项封装成entity对象
    for (let item of list) {
      if (!(item.latitude && item.longitude)) {
        continue
      }

      let image = ''
      // 1.判断类型，赋值不同的图标（正常、故障、告警）

      // 1.1 判断设备状态 '状态 0 未激活 1 在线 2 离线 3 异常
      let status = item.status && item.status === 1
      //设备图标类型
      let iconType

      switch (item.type) {
        case 1: // 1:普通摄像机
          image = status ? MapConfig.images.device_camera : MapConfig.images.device_camera_fault
          iconType = 'device_camera'
          break
        case 2: // 2:智能摄像机
          image = status ? MapConfig.images.device_aicamera : MapConfig.images.device_aicamera_fault
          iconType = 'device_aicamera'
          break
        case 3: // 3:人脸抓拍机
          image = status ? MapConfig.images.device_snap : MapConfig.images.device_snap_fault
          iconType = 'device_snap'
          break
        case 4: //4:烟雾传感器
          image = status ? MapConfig.images.device_smog : MapConfig.images.device_smog_fault
          iconType = 'device_smog'
          break
        case 5: //  5:巡更系统
          image = status ? MapConfig.images.device_patrol : MapConfig.images.device_patrol_fault
          iconType = 'device_patrol'
          break
        case 6: // 6:一键报警
          image = status ? MapConfig.images.device_onekey : MapConfig.images.device_onekey_fault
          iconType = 'device_onekey'
          break
        case 7: // 7:燃气报警器
          image = status ? MapConfig.images.device_gas : MapConfig.images.device_gas_fault
          iconType = 'device_gas'
          break
        default: // 其他
          image = status ? MapConfig.images.device_patrol : MapConfig.images.device_patrol_fault
          iconType = 'device_patrol'
          break
      }

      // 生成entity
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: image,
            scale: MapConfig.images.scale,
          },
          attr: {
            id: item.deviceId,
            type: 'device',
            subType: item.type,
            iconType: iconType,
            alarmStatus: 1,
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude, 35.0],
        },
      }
      entities.push(position)
    }

    if (entities.length === 0) {
      return
    }

    // 执行加载
    this.loadGeoJSON(
      {
        features: entities,
      },
      showable
    )
  }

  /**
   * 加载人脸pad图标
   * @param list
   * @param showable
   */
  loadFacePadIcon(list, showable) {
    let entities = []

    // 将信息项封装成entity对象
    for (let item of list) {
      if (!(item.latitude && item.longitude)) {
        continue
      }

      // 1.1 判断设备状态 '状态 0 未激活 1 在线 2 离线
      let status = item.status && item.status === 1

      let image = status ? MapConfig.images.device_pad : MapConfig.images.device_pad_fault

      // 生成entity
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: image,
            scale: MapConfig.images.scale,
          },
          attr: {
            id: item.deviceId,
            type: 'facePad',
            subType: item.subType,
            iconType: 'device_pad',
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude, 21.1],
        },
      }
      entities.push(position)
    }

    if (entities.length === 0) {
      return
    }

    // 执行加载
    this.loadGeoJSON(
      {
        features: entities,
      },
      showable
    )
  }

  /**
   * 删除特定类型的图标
   * @param type
   */
  removeLabel(type) {
    let list = this.plotDrawTool.getEntitys().filter((item) => item.attribute.attr.type === type)
    console.log('remove entities list==>', list)

    list.forEach((entity) => {
      this.plotDrawTool.deleteEntity(entity)
    })
  }

  /**
   * 显示轨迹
   * @param item
   * {
   *   id： '',
   *   name: '',
   *   positions: [[],[],...[]]
   * }
   */
  drawTrack(item) {
    // 绘制线条
    let aaa = {
      type: 'Feature',
      properties: {
        type: 'polyline',
        style: MapConfig.style.line,
        attr: {
          id: item.id,
          name: item.name,
          animateLine: true,
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: item.positions,
      },
    }

    global.map.loadGeoJSON(aaa)
  }

  /**
   * 显示/隐藏某一类型的图标
   * @param type
   * @param show true_显示图标  false_隐藏图标
   */
  displayIcon(type, show) {
    let entities = this.plotDrawTool.getEntitys()
    console.log(entities, 'entities')
    entities.forEach((entity) => {
      console.log(entity.attribute.attr.devicetype, type)
      if (entity.attribute.attr.deviceType === type) {
        entity.show = show
      }
    })
  }

  /*
   *隐藏和显示某一类告警
   @param alarmLevel  告警等级
   * @param show true_显示图标  false_隐藏图标
  */
  displayWave(alarmLevel, show) {
    let entities = this.plotDrawTool.getEntitys()
    entities.forEach((entity) => {
      if (entity.attribute.attr.alarmLevel == alarmLevel) {
        entity.show = show
      }
    })
  }

  /**
   * 隐藏显示iot设备中某一类型的图标
   * @param type
   * @param show
   */
  displayIotDeviceIcon(type, show) {
    let entities = this.plotDrawTool.getEntitys()
    console.log('this is iot device entitys , show  list ===>', entities)

    entities.forEach((entity) => {
      if (type) {
        if (entity.attribute.attr.type === 'device' && entity.attribute.attr.subType == type) {
          entity.show = show
        }
      } else {
        if (entity.attribute.attr.type === 'device') {
          entity.show = show
        }
      }
    })
  }

  /**
   * 显示社会资源面中的某一类型的图标
   * @param type
   * @param show
   */
  displaySocialResIcon(type, show) {
    console.log(typeof type)

    let entities = this.plotDrawTool.getEntitys()

    entities.forEach((entity) => {
      if (entity.attribute.attr.type === 'socialres' && entity.attribute.attr.subType === Number(type)) {
        console.log('匹配到的', entity, show)
        entity.show = show
      }
    })
  }

  /**
   * 显示隐藏告警波动圈图标
   */
  removeAlarmIcon() {
    console.log(typeof type)
    let entities = this.plotDrawTool.getEntitys()
    entities.forEach((entity) => {
      if (entity.attribute.attr.type === 'deviceAlarmCircle') {
        this.plotDrawTool.deleteEntity(entity)
      } else if (entity.attribute.attr.type === 'device' && entity.attribute.attr.alarm == true) {
        entity.show = false
      }
    })
  }

  /**
   * 删除社会资源图标
   */
  removeSocialResIcon() {
    let entities = this.plotDrawTool.getEntitys()
    entities.forEach((entity) => {
      if (entity.attribute.attr.type === 'socialres') {
        this.plotDrawTool.deleteEntity(entity)
      }
    })
  }

  /**
   * 根据Id定位到地图位置
   * @param attrId
   */
  flyToIcon(id) {
    if (this) {
      const entity = this.getPlotById(id)
      if (entity) {
        this.viewer.flyTo(entity, {
          duration: 1,
        })
      }
    }
  }

  /**
   *
   * @param eventId 人员进出、抓拍事件Id
   * @returns {boolean} 如果存在entity 返回true, 否则返回false
   */
  /**
   * 根据eventId定位到地图位置
   * @param eventId 人员进出、抓拍事件Id
   * @param item  信息 {personId: "", eventId: "", longt}
   * @param flyto 是否定位到
   * @returns {boolean}
   */
  flyToIconByEventId(eventId, item, flyto, isVehicle) {
    flyto = String(flyto) === 'false' ? false : true

    let entities = this.plotDrawTool.getEntitys()
    let entity = entities.find((item) => item.attribute.attr.eventId === eventId)

    if (!entity) {
      if (item) {
        // 将信息项封装成entity对象
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: isVehicle ? MapConfig.images.vehicle_track : MapConfig.images.person_track,
              scale: MapConfig.images.scale,
            },
            attr: {
              id: item.personId,
              eventId: item.eventId,
              type: 'track',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude, 5.0],
          },
        }
        // 执行加载
        entity = this.loadGeoJSON(position, true)
      } else {
        return false
      }
    }

    if (flyto) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    }

    return true
  }

  /**
   * 设备告警
   * @param deviceId
   */
  deviceAlarm(deviceId, level) {
    const entity = this.getPlotById(deviceId)

    if (entity) {
      // 显示告警
      entity.show = true
      let image = entity.attribute.style.image
      let deviceType = entity.attribute.attr.deviceType
      // 是否是告警图标
      // let alarm = entity.attribute.attr.alarm || false;
      // if (alarm) {
      // 如果是告警图标，判断是否存在波动圈
      // 进行告警波动圈显示
      let entityAlarm = this.getPlotById(deviceId + 'wave')
      if (entityAlarm) {
        entityAlarm.show = true
      } else {
        let pos = Cartesian3_to_WGS84(entity.position._value)
        const position = {
          type: 'Feature',
          properties: {
            type: 'circle',
            style: {},
            attr: {
              id: deviceId + 'wave',
              alarm: true,
              type: 'deviceAlarmCircle',
              deviceType: deviceType,
              wave: true,
              alarmLevel: level,
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [pos.x, pos.y, 180],
          },
        }
        console.log(level, '==========')
        if (level == 1) {
          position.properties.style = {
            ...MapConfig.style.waveRed,
          }
        } else if (level == 2) {
          position.properties.style = {
            ...MapConfig.style.waveOrange,
          }
        } else if (level == 3) {
          position.properties.style = {
            ...MapConfig.style.waveyellow,
          }
        } else if (level == 4) {
          position.properties.style = {
            ...MapConfig.style.wavegreen,
          }
        }
        console.log(position)
        this.loadGeoJSON(position, true)
        //  }
      }

      // 更换原来的图标
      this.updatePlotStyle(deviceId, {
        image,
      })
      this.updatePlotAttribute(deviceId, {
        alarm: true,
      })
    }
  }

  /**
   * 设备告警恢复
   * @param deviceId
   */
  deviceAlarmRecover(deviceId) {
    if (this) {
      // 恢复设备图片
      const entity = this.getPlotById(deviceId)
      if (entity) {
        let subType = entity.attribute.attr.subType

        // 是否是告警图标
        let alarm = entity.attribute.attr.alarm
        console.log('sadfsdaf-----------------', alarm)
        if (alarm) {
          let image = ''
          switch (Number(subType)) {
            case 1: // 1:普通摄像机
              image = MapConfig.images.device_camera
              break
            case 2: // 2:智能摄像机
              image = MapConfig.images.device_aicamera
              break
            case 3: // 3:人脸抓拍机
              image = MapConfig.images.device_snap
              break
            case 4: //4:烟雾传感器
              image = MapConfig.images.device_smog
              break
            case 5: //  5:巡更系统
              image = MapConfig.images.device_patrol
              break
            case 6: // 6:一键报警
              image = MapConfig.images.device_onekey
              break
            case 7: // 7:燃气报警器
              image = MapConfig.images.device_gas
              break
            default: // 其他
              image = MapConfig.images.device_patrol_fault
              break
          }

          // 更换正常的图标
          this.updatePlotStyle(deviceId, {
            image: image,
          })
          // 更新告警属性
          this.updatePlotAttribute(deviceId, {
            alarm: false,
          })
        }
      }

      // 删除告警波动圈
      const entityAlarm = this.getPlotById(deviceId + 'wave')
      if (entityAlarm) {
        this.plotDrawTool.deleteEntity(entityAlarm)
      }
    }
  }

  /**
   * 设备故障
   * @param deviceId
   */
  deviceFault(deviceId) {
    if (this) {
      const entity = this.getPlotById(deviceId)
      if (entity) {
        let image = entity.attribute.style.image
        let subType = entity.attribute.attr.subType
        // 是否是告警图标
        let alarm = entity.attribute.attr.alarm

        if (!alarm) {
          switch (subType) {
            case 1: // 1:普通摄像机
              image = MapConfig.images.device_camera
              break
            case 2: // 2:智能摄像机
              image = MapConfig.images.device_aicamera
              break
            case 3: // 3:人脸抓拍机
              image = MapConfig.images.device_snap
              break
            case 4: //4:烟雾传感器
              image = MapConfig.images.device_smog
              break
            case 5: //  5:巡更系统
              image = MapConfig.images.device_patrol
              break
            case 6: // 6:一键报警
              image = MapConfig.images.device_onekey
              break
            case 7: // 7:燃气报警器
              image = MapConfig.images.device_gas
              break
            default: // 其他
              image = MapConfig.images.device_patrol_fault
              break
          }
          // 更换原来的图标
          this.updatePlotStyle(deviceId, {
            image,
          })
        }
      }
    }
  }

  /**
   * 设备故障恢复
   * @param deviceId
   */
  deviceFaultecover(deviceId) {
    if (this) {
      const entity = this.getPlotById(deviceId)
      if (entity) {
        let image = entity.attribute.style.image
        let subType = entity.attribute.attr.subType
        // 是否是告警图标
        let alarm = entity.attribute.attr.alarm

        if (!alarm) {
          switch (subType) {
            case 1: // 1:普通摄像机
              image = MapConfig.images.device_camera
              break
            case 2: // 2:智能摄像机
              image = MapConfig.images.device_aicamera
              break
            case 3: // 3:人脸抓拍机
              image = MapConfig.images.device_snap
              break
            case 4: //4:烟雾传感器
              image = MapConfig.images.device_smog
              break
            case 5: //  5:巡更系统
              image = MapConfig.images.device_patrol
              break
            case 6: // 6:一键报警
              image = MapConfig.images.device_onekey
              break
            case 7: // 7:燃气报警器
              image = MapConfig.images.device_gas
              break
            default: // 其他
              image = MapConfig.images.device_patrol_fault
              break
          }
          // 更换原来的图标
          this.updatePlotStyle(deviceId, {
            image,
          })
        }
      }
    }
  }

  /**
   * 显示人员轨迹路径
   * @param personId 人员ID
   * @param trackList 轨迹信息列表
   *  trackList： [
   *    [longitude, latitude, alt]
   *  ]
   */
  showPersonTrack(personId, trackList, trackListInfo) {
    console.log(trackListInfo)
    personId = personId + 'track'

    const entity = this.getPlotById(personId)
    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    } else {
      if (!(trackList && trackList.length > 0)) {
        return
      }

      let entities = []
      // 将信息项封装成entity对象
      for (let item of trackListInfo) {
        let image = MapConfig.images.track
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: image,
              scale: 0.8,
            },
            attr: {
              id: personId,
              personId: personId,
              type: 'track',
              trackListInfo: item.trackInfo,
            },
          },
          geometry: {
            type: 'Point',
            coordinates: item.position,
          },
        }
        console.log(position)
        entities.push(position)
      }

      // 绘制线条
      let pos = {
        type: 'Feature',
        properties: {
          type: 'polyline',
          style: {
            color: '#1CB2FF',
            width: 15,
            lineType: 'solid',
            outline: true,
            outlineColor: '#ffffff',
            outlineWidth: '2.0',
            opacity: 1,
            animationDuration: 20,
            animationImage: './static/images/texture/route.png',
            // "clampToGround": true,
          },
          attr: {
            id: personId,
            animateLine: true,
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: trackList,
        },
      }

      entities.push(pos)

      if (entities.length === 0) {
        return
      }

      // 执行加载
      this.loadGeoJSON(
        {
          features: entities,
        },
        true
      )
    }
  }

  showHistoryPersonTrack(personId, trackList, trackListInfo) {
    personId = personId + 'historytrack'

    const entity = this.getPlotById(personId)
    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    } else {
      if (!(trackList && trackList.length > 0)) {
        return
      }

      let entities = []
      // 将信息项封装成entity对象
      for (let item of trackListInfo) {
        let image = MapConfig.images.track
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: image,
              scale: 0.8,
            },
            attr: {
              id: personId,
              personId: personId,
              type: 'historytrack',
              trackListInfo: item.trackInfo,
            },
          },
          geometry: {
            type: 'Point',
            coordinates: item.position,
          },
        }
        console.log(position)
        entities.push(position)
      }

      // 绘制线条
      let pos = {
        type: 'Feature',
        properties: {
          type: 'polyline',
          style: {
            color: '#1CB2FF',
            width: 15,
            lineType: 'solid',
            outline: true,
            outlineColor: '#ffffff',
            outlineWidth: '2.0',
            opacity: 1,
            animationDuration: 20,
            animationImage: './static/images/texture/route.png',
            // "clampToGround": true,
          },
          attr: {
            id: personId,
            animateLine: true,
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: trackList,
        },
      }

      entities.push(pos)

      if (entities.length === 0) {
        return
      }

      // 执行加载
      this.loadGeoJSON(
        {
          features: entities,
        },
        true
      )
    }
  }

  /**
   * 创建人员轨迹路径
   */
  createPersonTrack(trackInfo) {
    let personId = trackInfo.id + 'track'
    let trackList = trackInfo.trackList

    // 如果没有id或坐标数据，直接返回
    if (!personId || !trackList || trackList.length === 0) {
      return
    }

    const entity = this.getPlotById(personId)
    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    } else {
      let entities = []
      // 路径信息
      let coordinates = []
      // 将信息项封装成entity对象
      for (let item of trackList) {
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: MapConfig.images.track,
              scale: 0.5,
            },
            attr: {
              id: personId,
              eventId: item.eventId,
              type: 'trackPoint',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude, 1],
          },
        }
        entities.push(position)
        coordinates.push([item.longitude, item.latitude, 2])
      }

      // 绘制线条
      let line = {
        type: 'Feature',
        properties: {
          type: 'polyline',
          style: {
            color: '#1CB2FF',
            width: 15,
            lineType: 'solid',
            outline: true,
            outlineColor: '#ffffff',
            outlineWidth: '2.0',
            opacity: 1,
            animationDuration: 20,
            animationImage: './static/images/texture/route.png',
            clampToGround: true,
          },
          attr: {
            id: personId,
            type: 'trackLine',
            animateLine: true,
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      }
      entities.push(line)

      // 执行加载
      this.loadGeoJSON(
        {
          features: entities,
        },
        true
      )
    }
  }

  closePopUp(popup) {
    console.log(popup)
    popup.remove()
  }

  /**
   * 创建车辆轨迹路径
   */
  createVehicleTrack(trackInfo, type) {
    console.log(trackInfo, 'trackInfo')
    let vehicleId = trackInfo.id + 'track'
    let trackList = trackInfo.trackList

    // 如果没有id或坐标数据，直接返回
    if (!vehicleId || !trackList || trackList.length === 0) {
      return
    }

    const entity = this.getPlotById(vehicleId)
    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    } else {
      let entities = []
      // 路径信息
      let coordinates = []
      // 将信息项封装成entity对象
      for (let item of trackList) {
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: MapConfig.images.vehicle_track,
              scale: 1,
            },
            attr: {
              id: vehicleId,
              type: 'cartrackPoint',
              trackListInfo: item,
              typeCar: type, //1代表是智能应用里面的车，2代表出入口的车
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude, 1],
          },
        }
        entities.push(position)
        coordinates.push([item.longitude, item.latitude, 1])
      }

      // 绘制线条
      let line = {
        type: 'Feature',
        properties: {
          type: 'polyline',
          style: MapConfig.style.track_line,
          attr: {
            id: vehicleId,
            type: 'trackLine',
            animateLine: true,
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      }
      console.log(line, 'line')
      entities.push(line)

      // 执行加载
      this.loadGeoJSON(
        {
          features: entities,
        },
        true
      )
    }
  }

  /**
   * 移除轨迹和轨迹点
   * @param id 轨迹id  （人员Id或车辆Id）
   */
  removeTrack(id) {
    let old = id
    id = id + 'track'
    let entity = this.getPlotById(id) || this.getPlotById(old)
    while (entity) {
      this.plotDrawTool.deleteEntity(entity)
      entity = this.getPlotById(id)
      if (!entity) {
        entity = this.getPlotById(old)
      }
    }
  }

  removeHistoryTrack(id) {
    let old = id
    id = id + 'historytrack'
    let entity = this.getPlotById(id) || this.getPlotById(old)
    while (entity) {
      this.plotDrawTool.deleteEntity(entity)
      entity = this.getPlotById(id)
      if (!entity) {
        entity = this.getPlotById(old)
      }
    }
  }

  /**
   * 显示人员位置点
   * @param personId 人员ID
   */
  showPersonPosition(personId, longitude, latitude, show) {
    show = show || true
    let pos = [longitude, latitude, 5.0] // 经度,纬度,高度；
    let entity = this.getPlotById(personId)
    if (entity) {
      // 改变位置
      entity.position = wutu3d.draw.util.lonlat2cartesian(pos)
      if (!show) {
        entity.show = false
      }
    } else if (longitude && latitude) {
      // 执行加载
      // 将信息项封装成entity对象
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: MapConfig.images.person_track,
            scale: MapConfig.images.scale,
          },
          attr: {
            id: personId,
            personId: personId,
            type: 'track',
          },
        },
        geometry: {
          type: 'Point',
          coordinates: pos,
        },
      }

      // 执行加载
      entity = this.loadGeoJSON(position, true)
    }

    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    }
  }

  /**
   * 显示车辆位置点
   * @param personId 人员ID
   */
  showVehiclePosition(vehicleId, longitude, latitude, show) {
    show = show || true
    let pos = [longitude, latitude, 10.0] // 经度,纬度,高度；
    let entity = this.getPlotById(personId)
    if (entity) {
      // 改变位置
      entity.position = wutu3d.draw.util.lonlat2cartesian(pos)
      if (!show) {
        entity.show = false
      }
    } else if (longitude && latitude) {
      // 执行加载
      // 将信息项封装成entity对象
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: MapConfig.images.vehicle_track,
            scale: MapConfig.images.scale,
          },
          attr: {
            id: vehicleId,
            personId: vehicleId,
            type: 'track',
          },
        },
        geometry: {
          type: 'Point',
          coordinates: pos,
        },
      }

      // 执行加载
      entity = this.loadGeoJSON(position, true)
    }

    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    }
  }

  /**
   * remove icon by type
   * if type is emity or null, do nothing
   * @param type
   */
  removeIcon(type) {
    if (type) {
      let entities = this.plotDrawTool.getEntitys()
      entities.forEach((entity) => {
        if (entity.attribute.attr.type === type) {
          this.plotDrawTool.deleteEntity(entity)
        }
      })
    }
  }

  /**
   * 绘制线条
   * @param option
   * @param positions
   */
  plotLine(option, positions) {
    if (!option.style || !positions || positions.length < 2) {
      console.log('绘制线段数据不正确')
      return
    }

    const attribute = option.attr || {}

    let line = {
      type: 'Feature',
      properties: {
        type: 'polyline',
        style: {
          color: option.style.color || '#FF0000',
          width: option.style.width || 5,
          lineType: option.style.lineType || 'solid',
          outline: option.style.outline || false,
          outlineColor: option.style.outlineColor || '#ffffff',
          outlineWidth: option.style.outlineWidth || '1.0',
          opacity: option.style.opacity || 1,
        },
        attr: {
          ...attribute,
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: positions,
      },
    }

    // 绘制
    // 执行加载
    this.loadGeoJSON(line, true)
  }

  /**
   * 绘制标记
   * @param option
   * @param positions
   */
  plotMarker(option, position) {
    if (!position || position.length < 2) {
      console.log('绘制线段数据不正确')
      return
    }

    const attribute = option ? option.attr || {} : {}

    const style = option ? option.style || {} : {}

    const marker = {
      type: 'Feature',
      properties: {
        type: 'billboard',
        style: {
          image: style.image || MapConfig.images.device_camera,
          scale: style.scale || 1,
        },
        attr: {
          ...attribute,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: position,
      },
    }

    // 绘制
    // 执行加载
    this.loadGeoJSON(marker, true)
  }

  /**
   * 绘制动圈
   * @param option
   * @param positions
   */
  plotCircle(option, position) {
    if (!option.style || !position || position.length < 2) {
      console.log('绘制线段数据不正确')
      return
    }

    const attribute = option.attr || {}
    const style = option.style

    let circle = {
      type: 'Feature',
      properties: {
        type: 'circle',
        style: {
          semiMinorAxis: style.semiMinorAxis || 100,
          semiMajorAxis: style.semiMajorAxis || 100,
          height: style.height || 0,
          extrudedHeight: style.extrudedHeight || 0,
          opacity: style.opacity || 0.6,
          fill: style.fill || true,
          color: style.color || '#3388ff',
          outline: style.outline || true,
          outlineColor: style.outlineColor || '#ffffff',
          rotation: style.rotation || 0,
        },
        attr: {
          ...attribute,
        },
      },
      geometry: {
        type: 'Point',
        coordinates: position,
      },
    }

    // 绘制
    // 执行加载
    this.loadGeoJSON(circle, true)
  }

  //巡逻轨迹
  showPatrolTrack(patrolId = 'person', trackList, trackListInfo) {
    // patrolId = patrolId + "track";
    patrolId = patrolId + '-track'

    const entity = this.getPlotById(patrolId)

    if (entity) {
      this.viewer.flyTo(entity, {
        duration: 1,
      })
    } else {
      if (!(trackList && trackList.length > 0)) {
        return
      }

      let entities = []
      // 将信息项封装成entity对象
      for (let i = 0; i < trackListInfo.length; i++) {
        let image = MapConfig.images.patrolArrow
        // 生成entity
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: image,
              scale: 0.8,
            },
            attr: {
              id: patrolId,
              personId: patrolId,
              type: 'patroltrack',
              trackListInfo: trackListInfo[i].trackInfo,
              index: i + 1,
            },
          },
          geometry: {
            type: 'Point',
            coordinates: trackListInfo[i].position,
          },
        }

        entities.push(position)
      }

      // 绘制线条
      let pos = {
        type: 'Feature',
        properties: {
          type: 'polyline',
          style: {
            color: '#1CB2FF',
            width: 15,
            lineType: 'solid',
            outline: true,
            outlineColor: '#ffffff',
            outlineWidth: '2.0',
            opacity: 1,
            animationDuration: 20,
            animationImage: './static/images/texture/route.png',
            // "clampToGround": true,
          },
          attr: {
            id: patrolId,
            animateLine: true,
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: trackList,
        },
      }

      entities.push(pos)

      if (entities.length === 0) {
        return
      }

      // 执行加载
      console.log('allcamMap patrol', entities)
      this.loadGeoJSON(
        {
          features: entities,
        },
        true
      )
    }
  }

  /*添加围栏 */
  addFence(geojson, option) {
    if (!geojson || !geojson.features) return
    if (!this.fenceDataSource) {
      const dataSource = (this.fenceDataSource = new Cesium.CustomDataSource('fence'))
      dataSource.show = true
      this.viewer.dataSources.add(dataSource)
    }
    option = option || {}

    const color = option.color || '#ff9900'
    const height = option.height || 50.0
    const showDynamic = option.showDynamic

    let dataSource = this.fenceDataSource
    geojson.features.forEach((feature) => {
      const coordinates = feature.geometry.coordinates[0][0]
      let positions = []
      coordinates.forEach((c) => {
        let position = Cesium.Cartesian3.fromDegrees(c[0], c[1], c[2] || 0.5)
        positions.push(position)
      })
      dataSource.fence = new Fence(dataSource, positions, height, Cesium.Color.fromCssColorString(color), showDynamic)
    })
    return this.fenceDataSource
  }

  /*导入物联设备图标 */
  loadIotDeviceIcon(list, showable) {
    let entities = []

    // 将信息项封装成entity对象
    for (let item of list) {
      if (!(item.latitude && item.longitude)) {
        continue
      }
      let image = ''
      // 1.1 判断设备状态 '状态 0 未激活 1 在线 2 离线 3 异常
      let status = item.status && item.status === 1
      let imgs = {
        1: {
          url: MapConfig.images.device_camera,
          offUrl: MapConfig.images.device_camera_fault,
        },
        2: {
          url: MapConfig.images.device_access1,
          offUrl: MapConfig.images.device_access2,
        },
        3: {
          url: MapConfig.images.device_gate1,
          offUrl: MapConfig.images.device_gate2,
        },
      }
      image = status ? imgs[item.deviceType].url : imgs[item.deviceType].offUrl

      // 生成entity
      let position = {
        type: 'Feature',
        properties: {
          type: 'billboard',
          style: {
            image: image,
            scale: 0.8,
          },
          attr: {
            id: item.deviceId,
            type: 'device',
            status: item.status,
            installLocation: item.installLocation,
            cameraName: item.deviceName,
            alarmNum: item.alarmNum,
            deviceType: item.deviceType,
            platType: item.platType, //门禁道闸使用
            platId: item.platId, //门禁道闸使用
            productId: item.productId, //门禁道闸使用
          },
        },
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude, item.altitude ? Number(item.altitude) : 5],
        },
      }
      entities.push(position)
      // console.log('%c entities','color:blue',entities)
    }

    if (entities.length === 0) {
      return
    }
    // 执行加载
    this.loadGeoJSON(
      {
        features: entities,
      },
      showable
    )

    const entities2 = AllcamMap.map.plotDrawTool.getEntitys()
    entities2.forEach((res) => {
      if (res._attribute.type == 'billboard') {
        // console.log("所有",res.position._value);
        let a = Cartesian3_to_WGS84(res.position._value)
        // console.log("所有坐标",a);
      }
    })

    //   array.forEach(e => {
    //     if (e.) {

    //     }
    //   });
    //   entities2[10].position.value = {
    //     "x": -1067758.5559767054,
    //     "y": 5020070.49862065,
    //     "z": 3774045.833049139
    // }
    // console.log("所有实例",entities2);
    entities2.forEach((entity) => {
      const attr = entity
      if (attr.attribute.type == 'billboard') {
        // console.log('%c 图标','color:blue',entity)

        // console.log('%c entities','color:red',AllcamMap.map.plotDrawTool.getCoordinates(entity))

        attr.show = true
      }
    })
    /*
    //添加滚轮事件，监听相机Z值，小于1000则显示数据
    const wheelHandler = new Cesium.ScreenSpaceEventHandler(AllcamMap.map.viewer.canvas);
    wheelHandler.setInputAction((event) => {
      const viewpoint = AllcamMap.map.getViewPoint();
      const entities2 = AllcamMap.map.plotDrawTool.getEntitys();
      const show = viewpoint.z < 9000
      entities2.forEach((entity) => {
          const attr = entity.attribute
        if (attr.type == 'billboard' && !show) {
          entity.show = false
        }
        if (attr.type == 'billboard' && show) {
          entity.show = true
        }
      });

    }, Cesium.ScreenSpaceEventType.WHEEL);
*/
  }

  // 添加
  addRotateImage(entity, effectSize) {
    effectSize = effectSize || 10
    // global.map.plotDrawTool.dataSource.entities.add()
    let s1 = 0.001,
      s2 = s1,
      sRotation = 0,
      sStartFlog = true
    const getRotationValue = () => {
      sRotation += 0.05
      return sRotation
    }
    entity.ellipse = {
      semiMinorAxis: new Cesium.CallbackProperty(() => {
        if (sStartFlog) {
          s1 = s1 + effectSize / 20
          if (s1 >= effectSize) {
            s1 = effectSize
          }
        }
        return s1
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(() => {
        if (sStartFlog) {
          s2 = s2 + effectSize / 20
          if (s2 >= effectSize) {
            s2 = effectSize
          }
        }
        return s2
      }, false),
      material: new Cesium.ImageMaterialProperty({
        image: `/images/wave1.png`,
        repeat: new Cesium.Cartesian2(1, 1),
        transparent: true,
      }),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false),
    }
  }

  /**
   * 加载门禁关联摄像机列表
   * @param list
   * @param showable
   */
  loadAccessRCamerIcon(accesslist, cameralist, showable) {
    let entities = []

    // 将信息项封装成entity对象
    if (accesslist.length > 0) {
      for (let item of accesslist) {
        if (!(item.latitude && item.longitude)) {
          continue
        }
        // 1.1 判断设备状态 '状态 0 未激活 1 在线 2 离线
        let status = item.status && item.status === 1
        let image = status ? MapConfig.images.peopleMenjin : MapConfig.images.peopleMenjin_fault
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: image,
              scale: 0.8,
            },
            attr: {
              id: item.deviceId,
              deviceType: 'access',
              iconType: 'access',
              item: item,
              type: 'access',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude, 2],
          },
        }
        entities.push(position)
      }
    }

    if (cameralist.length > 0) {
      for (let item of cameralist) {
        if (!(item.latitude && item.longitude)) {
          continue
        }
        // 1.1 判断设备状态 '状态 0 未激活 1 在线 2 离线
        let status = item.status && item.status === 1
        let image = status ? MapConfig.images.device_aicamera : MapConfig.images.device_aicamera_alarm
        // 生成entity
        let position = {
          type: 'Feature',
          properties: {
            type: 'billboard',
            style: {
              image: image,
              scale: 0.8,
            },
            attr: {
              id: item.cameraId,
              cameraName: item.cameraName,
              devicetype: 'access_camera',
              iconType: 'device_aicamera',
              type: 'device_aicamera',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude, 2],
          },
        }
        entities.push(position)
      }
    }
    if (entities.length === 0) {
      return
    }
    // 执行加载
    this.loadGeoJSON(entities, showable)
  }

  /*
    渲染区域retangle
  */
  loadplotRetangle(arealist, showable) {
    // console.log(arealist, 'arealist');
    let entities = []

    // 将信息项封装成entity对象
    for (let item of arealist) {
      let position = {
        type: 'Feature',
        properties: {
          type: 'rectangle',
          attr: {
            id: item.areaId,
            name: item.areaName,
          },
          style: {
            color: '#00A2FF',
            opacity: 0.3,

            height: 0,
          },
        },
        geometry: {
          type: 'MultiPoint',
          coordinates: item.coordinates,
        },
      }
      if (item.areaName !== '') {
        if (AllcamMap.map) {
          AllcamMap.map.plotLabel({
            name: item.areaName,
            id: item.areaId + 'label',
            coordinates: item.coordinates[0],
          })
        }
      }

      entities.push(position)
    }

    if (entities.length === 0) {
      return
    }

    // 执行加载
    this.loadGeoJSON(
      {
        features: entities,
      },
      showable
    )
    return entities
  }

  //画label
  plotLabel(option) {
    const label = {
      type: 'Feature',
      properties: {
        type: 'label',
        style: {
          text: option.name,
        },
        attr: {
          name: option.name,
          id: option.id,
          type: 'areaLabel',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [...option.coordinates, 5],
      },
    }

    // 绘制
    // 执行加载
    this.loadGeoJSON(label, true)
  }
}
