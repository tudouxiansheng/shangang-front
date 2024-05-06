export const DateDiff = (Date_end, Date_start) => {
  let start = new Date(Date_start).getTime()
  let end = new Date(Date_end).getTime()
  let iDays = parseInt(Math.abs(end - start) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  return iDays;
}

export const  getFormatTime = (timeStamp)=> {
  var dateTime = new Date(timeStamp);
  var no1new = dateTime.valueOf();
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = now.valueOf();
  var milliseconds = 0;
  var timeSpanStr;

  milliseconds = now_new - no1new;

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = "刚刚";
  } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60)) + "分钟前";
  } else {
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    timeSpanStr = month + "-" + day + " " + hour + ":" + minute;
  }

  return timeSpanStr;
}


const format = (time) => {
  let ymd = ''
  let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
  let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
  ymd += time.getFullYear() + '-' // 获取年份。
  ymd += mouth + '-' // 获取月份。
  ymd += day // 获取日。
  return ymd // 返回日期。
 }
/*
将毫秒数转换成如“2019-04-15 12：00：00”格式的日期
*/
const addZero = (num) => {
  if (parseInt(num) < 10) {
    num = "0" + num;
  }
  return num;
};
//! 日期格式化
export const getFormatDate = (str) => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds();
  let oTime =
    oYear +
    "-" +
    addZero(oMonth) +
    "-" +
    addZero(oDay) +
    " " +
    addZero(oHour) +
    ":" +
    addZero(oMin) +
    ":" +
    addZero(oSen);
  return oTime;
};
//标注时间转时间戳
export const timeChangeType = (stringTime) => {
  var timestamp = Date.parse(new Date(stringTime))
  return timestamp
}
export const getShortDay = (value) => {
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return y + "-" + MM + "-" + d;

}
export const formatDateTime =(value) =>{
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
};


export const getFormatDate1 = (str) => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds();
  let oTime =
    oYear +
    "年" +
    addZero(oMonth) +
    "月" +
    addZero(oDay) +
    "日 " +
    addZero(oHour) +
    ":" +
    addZero(oMin) +
    ":" +
    addZero(oSen);
  return oTime;
};
export const getFormatDate2 = (str) => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds();
  let oTime =
    oYear +
    "" +
    addZero(oMonth) +
    "" +
    addZero(oDay) +
    "" +
    addZero(oHour) +
    "" +
    addZero(oMin) +
    "" +
    addZero(oSen);
  return oTime;
};

export const getFormatDate3 = (str) => {
  let oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds();
  let oTime =
    oYear +
    "/" +
    addZero(oMonth) +
    "/" +
    addZero(oDay) +
    " " +
    addZero(oHour) +
    ":" +
    addZero(oMin) +
    ":" +
    addZero(oSen);
  return oTime;
};


export const getFormatDate5 = (date) => {
  let oDate = date,
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate();
  let oTime =
    oYear +
    "-" +
    addZero(oMonth) +
    "-" +
    addZero(oDay) +
    " " +
    "00:00:00";
  return oTime;
};
export const getFormatDate4 = (date) => {
  let oDate = date,
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHours = oDate.getHours(),
    oMinutes = oDate.getMinutes(),
    oSeconds = oDate.getSeconds();
  let oTime =
    oYear +
    "-" +
    addZero(oMonth) +
    "-" +
    addZero(oDay) +
    " " +
    addZero(oHours)+":"+addZero(oMinutes)+":"+addZero(oSeconds)
  return oTime;
};

//!  递归各个节点所需要的数据
function getNode(groupList, group) {
  let node = {};
  node.id = group.groupId;
  node.label = group.groupName;
  node.children = [];
  node.type = group.type;
  node.groupType = group.groupType;
  let childrens = groupList.filter(item => item.parentId == group.groupId);
  for (let i in childrens) {
    node.children.push(getNode(groupList, childrens[i]));
  }
  return node;
}
//! 将从后台获取到的数据转换成树形控件所需要的数据
export const getTreeData = (groupList, parentId) => {
  let treeData = [];
  let roots = groupList.filter(item => item.parentId == parentId);
  for (let i in roots) {
    treeData.push(getNode(groupList, roots[i]));
  }
  return treeData;
};
//! 获取到当前的时间往前一个月的日期
export function lastMonthDate() {
  // 此刻的日期
  var Nowdate = new Date();
  // 年
  var vYear = Nowdate.getFullYear();
  // 月
  var vMon = Nowdate.getMonth() + 1;
  // 日
  var vDay = Nowdate.getDate(); //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为  0）
  //
  var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  if (vMon == 1) {
    vYear = Nowdate.getFullYear() - 1;
    vMon = 12;
  } else {
    vMon = vMon - 1;
  } //若是闰年，二月最后一天是29号
  if (vYear % 4 == 0 && vYear % 100 != 0 || vYear % 400 == 0) {
    daysInMonth[2] = 29;
  }
  if (daysInMonth[vMon] < vDay) {
    vDay = daysInMonth[vMon];
  }
  if (vDay < 10) {
    vDay = '0' + vDay;
  }
  if (vMon < 10) {
    vMon = '0' + vMon;
  }
  var date = vYear + '-' + vMon + '-' + vDay;
  // console.log(date)
  return date;
}
// 以数组对象时间属性排序
export function arrayBySortTime(property) {
  return function (a, b) {
    var value1 = new Date(a[property]).getTime();
    var value2 = new Date(b[property]).getTime();
    return value2 - value1
  }
}

//当前日期星期几-cd
export function nowWeek() {
  var Nowdate = new Date();
  var week = Nowdate.getDay();
  var date = ""
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
  // console.log(date)
  return date;
}

// 获取本月第一天--cd--2020.05.27
export const getDateStart = () => {
  let oDate = new Date(),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1;

  oDate.setDate(1)
  let oDay = oDate.getDate();

  let oTime =
    oYear +
    "-" +
    addZero(oMonth) +
    "-" +
    addZero(oDay)

  return oTime;
};

//返回天、小时、分钟、秒--cd
export const getDayHourMinAndSec = (date) => {
  var day = Math.floor(date / 86400000),
    hour = Math.floor(date / 3600000 - day * 24),
    minute = Math.floor(date / 60000 - day * 24 * 60 - hour * 60),
    second = Math.ceil(date / 1000 - minute * 60 - hour * 3600 - day * 24 * 60 * 60);
  return (day == 0 ? "" : (day + "天")) + (hour == 0 ? (day != 0 && (minute != 0 || second != 0) ? "0小时" : "") : (hour + "小时")) + (minute == 0 ? (second != 0 && (hour != 0 || day != 0) ? "0分" : "") : (minute + "分")) + (second == 0 ? (day == 0 && hour == 0 && minute == 0 ? "0秒" : "") : (second + "秒"));
};

// 时间选择器默认选中七天--cd--2020.05.27
export const timeDefault = () => {
  var now = new Date().getTime();
  var oneDayTime = 60 * 60 * 24 * 1000; // 一天的秒数
  var dd = new Date(now - 6 * oneDayTime);
  var s1 = [dd, now];
  return s1;
}

// 时间选择器默认选中过去七天--cd--2020.05.27
export const timeDefault1 = () => {
  var now = new Date().getTime();
  var oneDayTime = 60 * 60 * 24 * 1000; // 一天的秒数
  var dd = new Date(now - oneDayTime);
  var dd1 = new Date(now - 7 * oneDayTime);
  var s1 = [dd1, dd];
  return s1;
}

// 统计报表导出sid--cd--2020.05.28
export const randomString = (len) => {
  len = len || 32;
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var str = '';
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}
// 登录clientNonce
export const generateMixed = (len) => {
  len = len || 32;
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var maxPos = chars.length;
  var str = 'wcs05' + getFormatDate2(new Date().getTime()) + (Date.now() % 1000);
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

// 自定义时间 1 昨天 2 上周 3 上月
export const getDIYTime = (data) => {
  let nowTime = new Date(new Date().toLocaleDateString());
  let beginTime, endTime;
  let oneTimes = 24 * 60 * 60 * 1000;
  switch (data) {
    case 1:
      beginTime = nowTime - oneTimes;
      endTime = nowTime;
      break;
    case 2:
      endTime = new Date(new Date().getTime() - oneTimes);
      beginTime = endTime - 7 * oneTimes;
      break;
    case 3:
      endTime = new Date(new Date().getTime() - oneTimes);
      beginTime = new Date(new Date().getTime() - 30 * oneTimes);
      break;
    default:
      break;
  }
  return {
    beginTime: getFormatDate(beginTime),
    endTime: getFormatDate(endTime - 1000)
  }
}

const getLastMonthDays = (time) => {
  time = new Date(time);
  let month = time.getMonth(),
    year = time.getFullYear();
  if (month == 0) {
    month = 12;
    year--;
  }
  let d = new Date(year, month, 0);
  return d.getDate();
}

// 自定义时间 1 昨天 2 今天 3 最近七天
export const getDIYTime1 = (data) => {
    let nowTime = new Date().getTime();
    let time = [];
    let oneTimes = 24 * 60 * 60 * 1000;
    switch (data) {
      case 1:
        time = [new Date(nowTime - oneTimes), new Date(nowTime - oneTimes)]
        break;
      case 2:
        time = [new Date(), new Date()]
        break;
      case 3:
        time = [new Date(nowTime - 6 * oneTimes), new Date(nowTime)]
        break;
      case 4:
        time = [new Date(nowTime - 2 * oneTimes), new Date(nowTime)]
        break;
      case 5:
        time = [new Date(nowTime - 29 * oneTimes), new Date(nowTime)]
        break;
      case 6:
        time = [new Date(nowTime - 14 * oneTimes), new Date(nowTime)]
        break;
      default:
        break;
    }
    return time
}
//获取当前时间戳的前某几天的日期 例如 今天是2021-04-10 getdays(7)就是7天前的日期
export const getdays = (aa) => {
  var date1 = new Date(),
    time1 =
    date1.getFullYear() +
    "-" +
    (date1.getMonth() + 1) +
    "-" +
    date1.getDate(); //time1表示当前时间
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + aa);
  var time2 =
    date2.getFullYear() +
    "-" +
    (date2.getMonth() + 1) +
    "-" +
    date2.getDate();
  return time2;
}
//返回当前时间的前面7天的工作日
export const getDate = () => {
  var endTime = new Date();
  var startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
  var timeArray = [];
  while (endTime.getTime() - startTime.getTime() >= 0) {
    var year = startTime.getFullYear();
    var month =
      startTime.getMonth().toString().length == 1 ?
      "0" + (startTime.getMonth() + 1).toString() :
      startTime.getMonth();
    var day =
      startTime.getDate().toString().length == 1 ?
      "0" + startTime.getDate() :
      startTime.getDate();
    timeArray = timeArray.concat(month + "/" + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  return timeArray;
}

export const getTwoTime = () => {
  var date1 = new Date(new Date(new Date().toLocaleDateString()).getTime());
  var date2 = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +
    24 * 60 * 60 * 1000 -
    1
  );
  var startTime =
    date1.getFullYear() +
    "-" +
    (date1.getMonth() + 1 < 10 ?
      "0" + (date1.getMonth() + 1) :
      date1.getMonth() + 1) +
    "-" +
    (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate()) +
    " " +
    (date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours()) +
    ":" +
    (date1.getMinutes() < 10 ?
      "0" + date1.getMinutes() :
      date1.getMinutes()) +
    ":" +
    (date1.getSeconds() < 10 ?
      "0" + date1.getSeconds() :
      date1.getSeconds());
  var endTime =
    date2.getFullYear() +
    "-" +
    (date2.getMonth() + 1 < 10 ?
      "0" + (date2.getMonth() + 1) :
      date2.getMonth() + 1) +
    "-" +
    (date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate()) +
    " " +
    (date2.getHours() < 10 ? "0" + date2.getHours() : date2.getHours()) +
    ":" +
    (date2.getMinutes() < 10 ?
      "0" + date2.getMinutes() :
      date2.getMinutes()) +
    ":" +
    (date2.getSeconds() < 10 ?
      "0" + date1.getSeconds() :
      date2.getSeconds());
  return {
    startTime,
    endTime
  }
}

export const getYesteday = () => {
  var date1 = new Date();
  date1.setTime(date1.getTime() - 24 * 60 * 60 * 1000);
  var s1 = date1.getFullYear() +
    "-" +
    (date1.getMonth() + 1 < 10 ?
      "0" + (date1.getMonth() + 1) :
      date1.getMonth() + 1) +
    "-" +
    (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate())
  return s1
}
export const getLastYesteday = () => {
  var date1 = new Date();
  date1.setTime(date1.getTime() - 48 * 60 * 60 * 1000);
  var s1 = date1.getFullYear() +
    "-" +
    (date1.getMonth() + 1 < 10 ?
      "0" + (date1.getMonth() + 1) :
      date1.getMonth() + 1) +
    "-" +
    (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate())
  return s1
}

 //给定开始时间和结束时间输出中间所有日期
 export const getAllDate = (start, end) => {
  let dateArr = []
  let startArr = start.split('-')
  let endArr = end.split('-')
  let db = new Date()
  db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2])
  let de = new Date()
  de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2])
  let unixDb = db.getTime()
  let unixDe = de.getTime()
  let stamp
  const oneDay = 24 * 60 * 60 * 1000;
  for (stamp = unixDb; stamp <= unixDe;) {
    dateArr.push(format(new Date(parseInt(stamp))))
    stamp = stamp + oneDay
  }
  return dateArr
 }
