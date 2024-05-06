var now = new Date() // 当前日期
var nowDayOfWeek = now.getDay() // 今天本周的第几天
var nowDay = now.getDate() // 当前日
var nowMonth = now.getMonth() // 当前月
var nowYear = now.getYear() // 当前年
nowYear += nowYear < 2000 ? 1900 : 0
import Vue from 'vue'
Vue.mixin({
  methods: {
    $formatDate(date) {
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      var myweekday = date.getDate()

      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return myyear + '-' + mymonth + '-' + myweekday
    },
    // 获取本周开始时间
    $getStartDayOfWeek() {
      var day = nowDayOfWeek || 7
      return this.$formatDate(
        new Date(now.getFullYear(), nowMonth, nowDay + 1 - day)
      )
    },
    // 获取本周结束时间
    $getEndDayOfWeek() {
      var day = nowDayOfWeek || 7
      return this.$formatDate(
        new Date(now.getFullYear(), nowMonth, nowDay + 7 - day)
      )
    },
    // 获取本月开始时间
    $getStartDayOfMonth() {
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      return this.$formatDate(monthStartDate)
    },
    // 获取本月结束时间
    $getEndDayOfMonth() {
      var monthEndDate = new Date(nowYear, nowMonth, this.$getMonthDays())
      return this.$formatDate(monthEndDate)
    },
    // 获取本月天数
    $getMonthDays() {
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth + 1, 1)
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    },
  },
})
