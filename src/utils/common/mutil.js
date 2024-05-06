import dayjs from 'dayjs'

/*
将毫秒数转换成如“2019-04-15 12：00：00”格式的日期
*/
const addZero = num => {
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}
//! 日期格式化
export const getFormatDate = str => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds()
  let oTime =
    oYear +
    '-' +
    addZero(oMonth) +
    '-' +
    addZero(oDay) +
    ' ' +
    addZero(oHour) +
    ':' +
    addZero(oMin) +
    ':' +
    addZero(oSen)
  return oTime
}

export const getFormatDate1 = str => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds()
  let oTime =
    oYear +
    '年' +
    addZero(oMonth) +
    '月' +
    addZero(oDay) +
    '日 ' +
    addZero(oHour) +
    ':' +
    addZero(oMin) +
    ':' +
    addZero(oSen)
  return oTime
}
export const getFormatDate2 = str => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds()
  let oTime =
    oYear +
    '' +
    addZero(oMonth) +
    '' +
    addZero(oDay) +
    '' +
    addZero(oHour) +
    '' +
    addZero(oMin) +
    '' +
    addZero(oSen)
  return oTime
}

export const getFormatDate3 = str => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds()
  let oTime =
    oYear +
    '/' +
    addZero(oMonth) +
    '/' +
    addZero(oDay) +
    ' ' +
    addZero(oHour) +
    ':' +
    addZero(oMin) +
    ':' +
    addZero(oSen)
  return oTime
}

export const getFormatDate4 = date => {
  let oDate = date,
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate()
  let oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay) + ' ' + '00:00:00'
  return oTime
}
export const getFormatDate5 = date => {
  let oDate = date,
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate()
  let oTime = oYear + addZero(oMonth).toString() + addZero(oDay)
  return oTime
}
export const getFormatDate6 = date => {
  let oDate = date,
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate()
  let oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay)
  return oTime
}

//! 获取到当前的时间往前一个月的日期
export function lastMonthDate() {
  // 此刻的日期
  var Nowdate = new Date()
  // 年
  var vYear = Nowdate.getFullYear()
  // 月
  var vMon = Nowdate.getMonth() + 1
  // 日
  var vDay = Nowdate.getDate() //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为  0）
  //
  var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
  if (vMon == 1) {
    vYear = Nowdate.getFullYear() - 1
    vMon = 12
  } else {
    vMon = vMon - 1
  } //若是闰年，二月最后一天是29号
  if ((vYear % 4 == 0 && vYear % 100 != 0) || vYear % 400 == 0) {
    daysInMonth[2] = 29
  }
  if (daysInMonth[vMon] < vDay) {
    vDay = daysInMonth[vMon]
  }
  if (vDay < 10) {
    vDay = '0' + vDay
  }
  if (vMon < 10) {
    vMon = '0' + vMon
  }
  var date = vYear + '-' + vMon + '-' + vDay
  return date
}
// 以数组对象时间属性排序
export function arrayBySortTime(property) {
  return function (a, b) {
    var value1 = new Date(a[property]).getTime()
    var value2 = new Date(b[property]).getTime()
    return value2 - value1
  }
}

//当前日期星期几-cd
export function nowWeek() {
  var Nowdate = new Date()
  var week = Nowdate.getDay()
  var date = ''
  if (week == 1) {
    date = '星期一'
  } else if (week == 2) {
    date = '星期二'
  } else if (week == 3) {
    date = '星期三'
  } else if (week == 4) {
    date = '星期四'
  } else if (week == 5) {
    date = '星期五'
  } else if (week == 6) {
    date = '星期六'
  } else {
    date = '星期日'
  }
  return date
}

// 获取本月第一天--cd--2020.05.27
export const getDateStart = () => {
  let oDate = new Date(),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1

  oDate.setDate(1)
  let oDay = oDate.getDate()

  let oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay)

  return oTime
}

//返回天、小时、分钟、秒--cd
export const getDayHourMinAndSec = date => {
  var day = Math.floor(date / 86400000),
    hour = Math.floor(date / 3600000 - day * 24),
    minute = Math.floor(date / 60000 - day * 24 * 60 - hour * 60),
    second = Math.ceil(date / 1000 - minute * 60 - hour * 3600 - day * 24 * 60 * 60)
  return (
    (day == 0 ? '' : day + i18n.t('public.day')) +
    (hour == 0
      ? day != 0 && (minute != 0 || second != 0)
        ? `0${i18n.t('public.hour1')}`
        : ''
      : hour + i18n.t('public.hour1')) +
    (minute == 0
      ? second != 0 && (hour != 0 || day != 0)
        ? `0${i18n.t('public.minute1')}`
        : ''
      : minute + i18n.t('public.minute1')) +
    (second == 0
      ? day == 0 && hour == 0 && minute == 0
        ? `0${i18n.t('public.second1')}`
        : ''
      : second + i18n.t('public.second1'))
  )
}

//返回天、小时、分钟、秒、毫秒--cd
export const getDayHourMinAndSecAndMilli = date => {
  /*对精度丢失的处理*/
  let day = Math.floor(date / 86400000),
    hour = Math.floor(date / 3600000 - day * 24),
    minute = Math.floor(date / 60000 - day * 24 * 60 - hour * 60),
    second = Math.floor(date / 1000 - minute * 60 - hour * 3600 - day * 24 * 60 * 60)
  let a = second * 1000 + minute * 60000 + hour * 3600000 + day * 86400000,
    millisecond = date - a
  let text = ''
  if (localStorage.getItem('locale') == 'en') {
    text =
      (day == 0 ? '' : day + ' day ') +
      (hour == 0
        ? day != 0 && (minute != 0 || second != 0)
          ? '0 hours '
          : ''
        : hour + ' hours ') +
      (minute == 0
        ? second != 0 && (hour != 0 || day != 0)
          ? '0 minute '
          : ''
        : minute + ' minute ') +
      (second == 0
        ? millisecond != 0 && (minute != 0 || hour != 0 || day != 0)
          ? '0 second'
          : ''
        : second + ' second') +
      (millisecond == 0
        ? day == 0 && hour == 0 && minute == 0 && second == 0
          ? '0 millisecond'
          : ''
        : millisecond + ' millisecond')
  } else {
    text =
      (day == 0 ? '' : day + '天') +
      (hour == 0 ? (day != 0 && (minute != 0 || second != 0) ? '0小时' : '') : hour + '小时') +
      (minute == 0 ? (second != 0 && (hour != 0 || day != 0) ? '0分' : '') : minute + '分') +
      (second == 0
        ? millisecond != 0 && (second != 0 || hour != 0 || day != 0)
          ? '0秒'
          : ''
        : second + '秒') +
      (millisecond == 0
        ? day == 0 && hour == 0 && minute == 0 && second == 0
          ? '0毫秒'
          : ''
        : millisecond + '毫秒')
  }
  return text
}

// 时间选择器默认选中七天--cd--2020.05.27
export const timeDefault = () => {
  var now = new Date().getTime()
  var oneDayTime = 60 * 60 * 24 * 1000 // 一天的秒数
  var dd = new Date(now - 6 * oneDayTime)
  var s1 = [dd, now]
  return s1
}

// 时间选择器默认选中过去七天--cd--2020.05.27
export const timeDefault1 = () => {
  var now = new Date().getTime()
  var oneDayTime = 60 * 60 * 24 * 1000 // 一天的秒数
  var dd = new Date(now - oneDayTime)
  var dd1 = new Date(now - 7 * oneDayTime)
  var s1 = [dd1, dd]
  return s1
}

// 自定义时间 1 昨天 2 上周 3 上月
export const getDIYTime = data => {
  let nowTime = new Date(new Date().toLocaleDateString())
  let beginTime, endTime
  let oneTimes = 24 * 60 * 60 * 1000
  switch (data) {
    case 1:
      beginTime = nowTime - oneTimes
      endTime = nowTime
      break
    case 2:
      endTime = new Date(new Date().getTime() - oneTimes)
      beginTime = endTime - 6 * oneTimes
      break
    case 3:
      endTime = new Date(new Date().getTime() - oneTimes)
      beginTime = new Date(new Date().getTime() - 30 * oneTimes)
      break
    default:
      break
  }
  return {
    beginTime: getFormatDate(beginTime),
    endTime: getFormatDate(endTime - 1000),
    time: [beginTime, endTime - 1000]
  }
}
// 自定义时间 1 近三天 2 近七天 3 近一个月
export const getDIYTime2 = data => {
  let nowTime = new Date().getTime()
  let time = []
  let oneTimes = 24 * 60 * 60 * 1000
  switch (data) {
    case 1:
      time = [new Date(nowTime - 2 * oneTimes), new Date(nowTime)]
      break
    case 2:
      time = [new Date(nowTime - 6 * oneTimes), new Date(nowTime)]
      break
    case 3:
      time = [new Date(nowTime - 29 * oneTimes), new Date(nowTime)]
      break
    default:
      break
  }
  return time
}

// 自定义时间 1 昨天 2 近七天 （从昨天计算近7天）
export const getDIYTime3 = data => {
  let Nowdate = new Date()
  let time = []
  switch (data) {
    case 1:
      let nowTime = new Date(new Date().toLocaleDateString())
      let oneTimes = 24 * 60 * 60 * 1000
      time = [
        new Date(getFormatDate(new Date(nowTime - oneTimes))),
        new Date(getFormatDate(new Date(nowTime - 1000)))
      ]
      break
    case 2:
      let cnDayOfWeek = 0
      if (Nowdate.getDay() == 0) {
        cnDayOfWeek = 7
      } else {
        cnDayOfWeek = Nowdate.getDay()
      }
      let dd = new Date(Nowdate.setDate(Nowdate.getDate() - (cnDayOfWeek - 2) - 7))
      let dd1 = new Date(Nowdate.setDate(Nowdate.getDate() + 6))
      time = [dd, dd1]
      break

    default:
      break
  }
  return time
}

// 自定义时间 1 近三天 2 近七天 3 近一个月
export const getDIYTime4 = data => {
  let nowTime = new Date().getTime()
  let time = []
  let oneTimes = 24 * 60 * 60 * 1000
  switch (data) {
    case 1:
      time = [new Date(nowTime - 2 * oneTimes), new Date(nowTime - 60 * 60 * 1000)]
      break
    case 2:
      time = [new Date(nowTime - 6 * oneTimes), new Date(nowTime - 60 * 60 * 1000)]
      break
    case 3:
      time = [new Date(nowTime - 29 * oneTimes), new Date(nowTime - 60 * 60 * 1000)]
      break
    default:
      break
  }
  return time
}

const getLastMonthDays = time => {
  time = new Date(time)
  let month = time.getMonth(),
    year = time.getFullYear()
  if (month == 0) {
    month = 12
    year--
  }
  let d = new Date(year, month, 0)
  return d.getDate()
}

// 自定义时间 1 昨天 2 今天 3 最近七天
export const getDIYTime1 = data => {
  let nowTime = new Date().getTime()
  let time = []
  let oneTimes = 24 * 60 * 60 * 1000
  switch (data) {
    case 1:
      time = [new Date(nowTime - oneTimes), new Date(nowTime - oneTimes)]
      break
    case 2:
      time = [new Date(), new Date()]
      break
    case 3:
      time = [new Date(nowTime - 6 * oneTimes), new Date(nowTime)]
      break
    case 4:
      time = [new Date(new Date().getTime() - 29 * oneTimes), new Date(nowTime)]
      break
    default:
      break
  }
  return time
}

// 自定义时间 1 昨天 2 今天 3 最近七天 4 最近三天 5 最近三十天 6 最近十五天
export const getRecentDays = data => {
  let nowTime = new Date().getTime()
  let time = []
  let oneTimes = 24 * 60 * 60 * 1000
  switch (data) {
    case 1:
      time = [new Date(nowTime - oneTimes), new Date(nowTime)]
      break
    case 2:
      time = [new Date(), new Date()]
      break
    case 3:
      time = [new Date(nowTime - 6 * oneTimes), new Date(nowTime)]
      break
    case 4:
      time = [new Date(nowTime - 2 * oneTimes), new Date(nowTime)]
      break
    case 5:
      time = [new Date(nowTime - 29 * oneTimes), new Date(nowTime)]
      break
    case 6:
      time = [new Date(nowTime - 14 * oneTimes), new Date(nowTime)]
      break
    default:
      break
  }
  return time
}
// 字节转换
export const byteConversion = byte => {
  let size = ''
  if (byte == undefined) {
    size = '0B'
  } else if (byte < 1024) {
    //小于1KB，则转化成B
    size = byte.toFixed(2) + 'B'
  } else if (byte < 1024 * 1024) {
    //小于01MB，则转化成KB
    size = (byte / 1024).toFixed(2) + 'KB'
  } else if (byte < 1024 * 1024 * 1024) {
    //小于1GB，则转化成MB
    size = (byte / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (byte / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
  return size
}

// excel中日期格式化
export function formatterExcelTime(time) {
  let year = dayjs(time * 24 * 60 * 60 * 1000).year() - 70
  let month = dayjs(time * 24 * 60 * 60 * 1000).month() + 1
  let date = dayjs(time * 24 * 60 * 60 * 1000).date() - 1
  return year + '-' + addZero(month) + '-' + addZero(date)
}
