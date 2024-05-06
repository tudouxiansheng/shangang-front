/**
 * 通用js方法封装处理
 */
// import { i18n as i18nn } from '@/i18n'
// const i18n = i18nn.global
import api from '@/api'

// 回显数据字典
export function selectDictLabel(datas, value, fieldObj) {
  let actions = [],
    currentFieldObj = []
  if (undefined === fieldObj) {
    currentFieldObj = {
      key: 'name',
      value: 'code'
    }
  } else {
    if (
      Object.prototype.toString.call(fieldObj) === '[object Object]' &&
      fieldObj.hasOwnProperty('key') &&
      fieldObj.hasOwnProperty('value')
    ) {
      currentFieldObj = fieldObj
    } else {
      // throw new Error(i18n.t('public.fieldObjError'))
    }
  }
  Object.keys(datas).some(key => {
    if (datas[key][currentFieldObj.value] == '' + value) {
      actions.push(datas[key][currentFieldObj.key])
      return true
    }
  })
  return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator, fieldObj) {
  let actions = [],
    currentFieldObj = []
  let currentSeparator = undefined === separator ? '/' : separator
  if (undefined === fieldObj) {
    currentFieldObj = {
      key: 'name',
      value: 'code'
    }
  } else {
    if (
      Object.prototype.toString.call(fieldObj) === '[object Object]' &&
      fieldObj.hasOwnProperty('key') &&
      fieldObj.hasOwnProperty('value')
    ) {
      currentFieldObj = fieldObj
    } else {
      throw new Error(i18n.t('public.fieldObjError'))
    }
  }
  if (value !== undefined) {
    let temp = value.split(currentSeparator)
    Object.keys(value.split(currentSeparator)).forEach(val => {
      Object.keys(datas).some(key => {
        if (datas[key][currentFieldObj.value] == '' + temp[val]) {
          actions.push(datas[key][currentFieldObj.key] + currentSeparator)
          return true
        }
      })
    })

    return actions.join('').substring(0, actions.join('').length - 1)
  }
}

// 树形结构扁平化
export function flapTree(arr) {
  let temp = []
  arr.forEach(item => {
    temp.push(item)
    if (item.children) {
      temp = temp.concat(flapTree(item.children))
    }
  })
  return temp
}

//轮播影响图片按比例缩放的侦听事件
//防抖
export function debounce(fn, t = 800) {
  let lastTime
  return function () {
    clearTimeout(lastTime)
    const [that, args] = [this, arguments]
    lastTime = setTimeout(() => {
      fn.apply(that, args)
    }, t)
  }
}

// 节流
export function throttle(fn, t = 800) {
  let last
  let timer
  return function () {
    let th = this
    let args = arguments
    let now = +new Date()
    if (last && now - last < t) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(th, args)
      }, t)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

export function getObjType(obj) {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * 对象深拷贝
 */
export function deepClone(data) {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description safeRandomNumber
 * @return {number}
 */
export function getRandomValues() {
  const crypto =
    window.crypto || window.webkitCrypto || window.mozCrypto || window.oCrypto || window.msCrypto
  return crypto.getRandomValues(new Uint8Array(1)) * 0.001
}

/**
 * 生成uuid
 * @returns {string}
 */
export function generateUuid() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + getRandomValues()) * 65536 + '') + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * N位随机数
 * @returns {string}
 * @param {Number} n
 * */
export function randomNum(n) {
  let t = ''
  for (let i = 0; i < n; i++) {
    t += Math.floor(getRandomValues() * 10)
  }
  return t
}

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.hash.split('?')[1].match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 获取分页list的所有数据
 * @returns {Promise}
 * @param {string} listApi:获取列表的api
 * @param {string} paramsObj:获取列表的api的入参
 * @param {string} resList:接口返回的列表数组名称
 * */
export async function getListAllData(listApi, paramsObj, resList) {
  let searchedNum = paramsObj.pageInfo.pageSize
  let totalNum = 0
  let tableData = []
  let res = await api[listApi](paramsObj)
  if (res.resultCode == 0) totalNum = res.pageInfo.totalNum
  if (totalNum > 0) tableData = res[resList]
  if (searchedNum < totalNum) {
    let searchCount = Math.ceil(totalNum / searchedNum) - 1
    for (let i = 0; i < searchCount; i++) {
      ++paramsObj.pageInfo.pageNum
      let res1 = await api[listApi](paramsObj)
      if (res1[resList]) tableData = tableData.concat(res1[resList])
    }
  }
  return Promise.resolve(tableData)
}

export function withInstall(component) {
  const comp = component
  comp.install = app => {
    app.component(comp.name || comp.displayName, component)
  }
  return component
}

/**
 * @description: promise 并发控制
 * @param poolLimit 并发数
 * @param array 任务数组
 * @param iteratorFn 任务函数
 * @returns {Promise<Awaited<unknown>[]>}
 */
export function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0
  const ret = []
  const executing = [] //保存正在执行的promise
  // 递归调用，加入队列
  const enqueue = () => {
    const endFlag = this?.taskEndFlag === true
    // 边界处理 array为空数组 || 所有任务都已加入队列 || 任务结束标志为true
    if (i === array.length || endFlag) {
      return Promise.resolve()
    }

    // 每调用一次enqueue，初始化一个Promise
    const item = array[i++]
    const p = Promise.resolve().then(() => iteratorFn(item, i - 1, array))

    // 将初始化的promise放入promises数组
    ret.push(p)
    // promise执行完毕，从executing数组中删除
    const e = p.then(() => executing.splice(executing.indexOf(e), 1))
    executing.push(e)

    let r = Promise.resolve()
    // 使用Promise.race，获得executing中promise的执行情况
    // 每当正在执行的promise数量高于poolLimit，就执行一次 否则继续实例化新的Promise达到poolLimit时执行
    if (executing.length >= poolLimit) {
      r = Promise.race(executing)
    }

    // 递归，直到遍历完array
    return r.then(() => enqueue())
  }
  return enqueue().then(() => {
    //所有的 promise 都执行完了，调用Promise.all返回
    return Promise.all(ret)
  })
}
