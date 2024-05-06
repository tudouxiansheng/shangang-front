<template>
  <div class="calendar">
    <div class="title">
      <div class="checks">
        <span @click="onCheckDate('reduction', 'year')" class="check-item"
          >&lt;&lt;</span
        >
        <span @click="onCheckDate('reduction', 'month')" class="check-item"
          >&nbsp;&lt;&nbsp;</span
        >
        <span class="check-item-date">{{ getYearMonth }}</span>
        <span @click="onCheckDate('add', 'month')" class="check-item"
          >&nbsp;&gt;&nbsp;</span
        >
        <span @click="onCheckDate('add', 'year')" class="check-item"
          >&gt;&gt;</span
        >
      </div>
    </div>
    <div class="calendar-days">
      <div class="calendar-header">
        <span
          v-for="(item, index) in calendarHeader"
          :key="index"
          class="header-item"
          >{{ item }}</span
        >
      </div>
      <div class="day-row" v-for="row in 6" :key="row">
        <div class="day-line" v-for="line in 7" :key="line">
          <div
            @click="onSelectDay(row, line)"
            :class="{
              'select-day': row == selectDay.row && line == selectDay.line,
              'not-current-month': notCurrentMonth(
                visibleDays[(row - 1) * 7 + line - 1]
              ),
              'current-day': currentDay(visibleDays[(row - 1) * 7 + line - 1]),
              hasThings: hasThing(visibleDays[(row - 1) * 7 + line - 1]),
            }"
            style="
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ visibleDays[(row - 1) * 7 + line - 1] | getDay }}
            <i></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  noticeList,
  getMyTaskList,
  addRoutes,
  /*新增日程 */
  modifyRoutes,
  /*修改日程 */
  getOneDayRoute,
  /*查询某一天任务列表 */
  getRouteListsDate,
  /*获取一个月中有哪些天有任务 */
  getGongdanData /*查询工单柱状图 */,
} from '@/utils/api'
import { getdays, getShortDay } from '@/utils/mutil'
export default {
  data() {
    return {
      calendarHeader: ['日', '一', '二', '三', '四', '五', '六'],
      nowDate: new Date(),
      selectDay: {
        row: null,
        line: null,
      },
      monthArray: [],
    }
  },
  computed: {
    // 当前日期换为年月
    getYearMonth() {
      const date = new Date(this.nowDate)
      const year = date.getFullYear()
      let month = date.getMonth()
      month = month + 1
      month = month < 10 ? '0' + month : month
      return `${year}年${month}月`
    },
    visibleDays() {
      const { year, month } = this.getYearMonthDay(new Date(this.nowDate)) // 获取当前年月
      let currentFirstDay = new Date(year, month, 1) // 当前月份的第一天
      const week = currentFirstDay.getDay() // 周几
      let startDay = currentFirstDay - week * 24 * 60 * 60 * 1000 // 开始时间
      // 循环42天（保证日历格式统一   6*7）
      let dayArr = new Array()
      for (let i = 0; i < 42; i++) {
        dayArr.push(new Date(startDay + i * 24 * 60 * 60 * 1000))
      }
      return dayArr
    },
  },
  methods: {
    // 切换年月事件
    onCheckDate(mode, category) {
      const { year, month } = this.getYearMonthDay(new Date(this.nowDate))
      if (mode == 'add') {
        if (category == 'year') {
          this.nowDate = new Date(year + 1, month, 1)
        } else {
          this.nowDate = new Date(year, month + 1, 1)
        }
      } else {
        if (category == 'year') {
          this.nowDate = new Date(year - 1, month, 1)
        } else {
          this.nowDate = new Date(year, month - 1, 1)
        }
      }
    },
    // 点击日期事件
    onSelectDay(row, line) {
      this.selectDay.row = row
      this.selectDay.line = line

      let count = (row - 1) * 7 + line
      console.log('点击的日期', getShortDay(this.visibleDays[count - 1]))
      this.$emit('clickDay', getShortDay(this.visibleDays[count - 1]))
      let clickDay = getShortDay(this.visibleDays[count - 1])
      getOneDayRoute({
        scheduleDay: clickDay,
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          if (res.schedulesInfoList.length > 0) {
            this.$emit('taskList', res.schedulesInfoList)
          } else {
            this.$emit('noTask')
          }
        }
      })
    },
    selectDayfunc(time) {
      getOneDayRoute({
        scheduleDay: time,
      }).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, 'res')
          if (res.schedulesInfoList.length > 0) {
            this.$emit('taskList', res.schedulesInfoList)
          } else {
            this.$emit('noTask')
          }
        }
      })
    },
    // 判断哪个是当前日
    currentDay(date) {
      const currentDate = this.getYearMonthDay(new Date(date))
      const nowDate = this.getYearMonthDay(new Date())
      if (
        currentDate.year == nowDate.year &&
        currentDate.month == nowDate.month &&
        currentDate.day == nowDate.day
      ) {
        return true
      } else {
        return false
      }
    },

    // 判断当前日期是不是本月
    notCurrentMonth(date) {
      if (
        this.getYearMonthDay(new Date(date)).month !=
        this.getYearMonthDay(new Date(this.nowDate)).month
      ) {
        return true
      } else {
        return false
      }
    },
    // 获取年月日
    getYearMonthDay(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      return {
        year,
        month,
        day,
      }
    },
    hasThing(date) {
      const hasThingDate = getShortDay(date)
      for (let i = 0; i < this.monthArray.length; i++) {
        if (this.monthArray[i] == hasThingDate) {
          return true
        }
      }
    },
  },
  filters: {
    // 日期转换为日
    getDay(date) {
      return new Date(date).getDate()
    },
  },
  mounted() {
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    console.log(year, month)

    getRouteListsDate({
      scheduleMonth: `${year}-${month}`,
    }).then((res) => {
      console.log(res, 'res月份')
      if (res.resultCode == 0) {
        this.monthArray = res.days
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.calendar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // 头部
  .title {
    display: flex;
    justify-content: center;
    align-items: center;

    color: #ffffff;

    .check-item-date {
      margin: 0 10px;
    }

    .check-item {
      margin: 0 10px;
      cursor: pointer;
      user-select: none;
      display: inline-block;

      &:hover {
        color: #ccc;
        transform: scale(1.1);
      }
    }
  }

  // 日历
  .calendar-days {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .calendar-header {
      display: flex;
      margin: 10px 0;
      user-select: none;

      .header-item {
        display: block;
        flex: 1;
        text-align: center;
        font-weight: bold;
        color: #ffffff;
      }
    }

    .day-row {
      flex: 1;
      display: flex;

      .day-line {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
        color: #ffffff;
        font-weight: 450;

        // &:hover {
        //     color: #00CCFF;
        // }
      }
      .hasThings {
        position: relative;
      }

      .hasThings i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: red;
        display: inline-block;
        vertical-align: super;
        position: absolute;
        top: -4px;
        right: -4px;
      }

      // 非本月
      .not-current-month {
        color: #aaa;
      }

      // 当前日期
      .current-day {
        background-color: #00ccff;
        color: #fff;
        position: relative;
        border-radius: 4px;
      }

      // 选中的日期
      .select-day {
        background-color: #ffbf39;
        border-radius: 4px;
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
