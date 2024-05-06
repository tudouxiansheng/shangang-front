<template>
  <div class="calendar">
    <div class="calendar-left">
      <div class="calendar-title">
        <div class="hello" :title="username">{{ $t('worktable.hello') }}，{{ username }}</div>
        <div class="tittle-time">{{ getYearMonth }}</div>
      </div>
      <div class="calendar-days">
        <div class="calendar-header">
          <span v-for="(item, index) in calendarHeader" :key="index" class="header-item">{{ item }}</span>
        </div>
        <div class="day-row" v-for="row in 6" :key="row">
          <div class="day-line" v-for="line in 7" :key="line">
            <!-- hasThings: hasThing(visibleDays[(row - 1) * 7 + line - 1]), -->
            <div
              @click="onSelectDay(row, line)"
              :class="{
                'select-day': selectDayFn(visibleDays[(row - 1) * 7 + line - 1]),
                'not-current-month': notCurrentMonth(visibleDays[(row - 1) * 7 + line - 1]),
                'current-day': currentDay(visibleDays[(row - 1) * 7 + line - 1]),
                'abnormal-day':
                  isAbnormal(visibleDays[(row - 1) * 7 + line - 1]) &&
                  !notCurrentMonth(visibleDays[(row - 1) * 7 + line - 1]),
                'date-item': true,
                'normal-day':
                  isDutyDays(visibleDays[(row - 1) * 7 + line - 1]) &&
                  !notCurrentMonth(visibleDays[(row - 1) * 7 + line - 1]),
              }"
            >
              {{ visibleDays[(row - 1) * 7 + line - 1] | getDay }}
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="calendar-right">
      <div class="right-top">
        <div class="btn-left" @click="onCheckDate('reduction', 'month')"></div>
        <div class="btn-right" @click="onCheckDate('add', 'month')"></div>
      </div>
      <div class="right-bottom">
        <div class="result-top">
          <div class="bottom-text">{{ $t('worktable.attendanceTime') }}</div>
          <div class="check-time-up">
            <img src="../img/timeUp.png" />{{ $t('worktable.workingTime') }}：{{
              ((isDutyDays(activeDay) || absenceDays.includes(activeDay)) && attendanceData.workTime) || ''
            }}
          </div>
          <div class="check-time-down">
            <img src="../img/timeDown.png" />{{ $t('worktable.offWorkTime') }}：{{
              ((isDutyDays(activeDay) || absenceDays.includes(activeDay)) && attendanceData.normalCloseTime) || ''
            }}
          </div>
        </div>
        <div class="result-bottom">
          <div class="bottom-text">{{ $t('worktable.AttendanceResult') }}</div>
          <div class="result-bottom-top">
            <div>
              {{ $t('worktable.workingTime') }}：{{
                ((isDutyDays(activeDay) || absenceDays.includes(activeDay)) && attendanceData.clockInTime) || ''
              }}
            </div>
            <template v-if="attendanceData.clockInStatus && (isDutyDays(activeDay) || absenceDays.includes(activeDay))">
              <div class="btn-normal" v-if="attendanceData.clockInStatus === 1">
                {{ $t('worktable.normal') }}
              </div>
              <div class="btn-error" v-if="[2, 3, 4].includes(attendanceData.clockInStatus)">
                {{ $t('worktable.abnormal') }}
              </div>
            </template>
          </div>
          <div class="result-bottom-bottom">
            <div>
              {{ $t('worktable.offWorkTime') }}：{{
                ((isDutyDays(activeDay) || absenceDays.includes(activeDay)) && attendanceData.clockOutTime) || ''
              }}
            </div>
            <template
              v-if="attendanceData.clockOutStatus && (isDutyDays(activeDay) || absenceDays.includes(activeDay))"
            >
              <div class="btn-normal" v-if="attendanceData.clockOutStatus === 1">
                {{ $t('worktable.normal') }}
              </div>
              <div class="btn-error" v-if="[2, 3, 4].includes(attendanceData.clockOutStatus)">
                {{ $t('worktable.abnormal') }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAttendance, getAttendanceDetail } from '@/utils/api'
import Dayjs from '@/utils/Dayjs'
import { getShortDay } from '@/utils/mutil'
export default {
  data() {
    return {
      username: sessionStorage.getItem('username'),
      calendarHeader: [
        this.$t('worktable.sunday'),
        this.$t('worktable.monday'),
        this.$t('worktable.tuesday'),
        this.$t('worktable.wednesday'),
        this.$t('worktable.thursday'),
        this.$t('worktable.friday'),
        this.$t('worktable.saturday'),
      ],
      nowDate: new Date(),
      selectDay: {
        row: null,
        line: null,
      },
      monthArray: [],
      // 考勤异常数组
      attendanceArray: [],
      // 考勤数据
      attendanceData: {},
      activeDay: Dayjs(new Date()).format('YYYY-MM-DD'),
      dutyDays: [], //考勤日
      // 缺勤日:（不在正常考勤日但是要请求考勤数据）需要单独处理
      absenceDays: [],
    }
  },
  async mounted() {
    await this.getAttendance()
    await this.firstSearch()
  },
  computed: {
    // 当前日期换为年月
    getYearMonth() {
      const date = new Date(this.nowDate)
      const year = date.getFullYear()
      let month = date.getMonth()
      month = month + 1
      month = month < 10 ? '0' + month : month
      return `${year}${this.$t('worktable.year')}${month}${this.$t('worktable.month')}`
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
    // 是否为考勤日
    isDutyDays(val) {
      return this.dutyDays.includes(Dayjs(val).format('YYYY-MM-DD'))
    },
    selectDayFn(data) {
      return this.activeDay === Dayjs(data).format('YYYY-MM-DD')
    },
    isAbnormal(val) {
      return this.attendanceArray.includes(Dayjs(val).format('YYYY-MM-DD'))
    },
    // 获取整个月的考勤情况
    getAttendance() {
      const params = {
        userId: sessionStorage.getItem('userId'),
        startTime: Dayjs(this.nowDate).startOf('month').format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs(this.nowDate).endOf('month').format('YYYY-MM-DD 23:59:59'),
      }
      getAttendance(params).then((res) => {
        if (res.resultCode === 0) {
          const { absenceTotal, lateTotal, leaveEarlyTotal, dutyDays } = res
          const totalArray = [
            ...absenceTotal.map((item) => item.dutyDay),
            ...lateTotal.map((item) => item.lateDay),
            ...leaveEarlyTotal.map((item) => item.leaveEarlyDay),
          ]
          this.dutyDays = dutyDays.map((item) => item.dutyDay)
          this.attendanceArray = [...new Set(totalArray)]
          this.absenceDays = absenceTotal.map((item) => item.dutyDay)
        }
      })
    },
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
      this.getAttendance()
    },
    firstSearch() {
      const params = {
        userId: sessionStorage.getItem('userId'),
        queryDate: Dayjs(new Date()).format('YYYY-MM-DD'),
      }
      this.getDetail(params)
    },
    // 点击日期事件
    onSelectDay(row, line) {
      this.selectDay.row = row
      this.selectDay.line = line
      const currentDay = Dayjs(this.visibleDays[(row - 1) * 7 + line - 1]).format('YYYY-MM-DD')
      this.activeDay = currentDay
      //   如果点击的这天不是考勤日并且状态不为缺卡，就不请求数据.
      if (!this.isDutyDays(currentDay) && !this.absenceDays.includes(currentDay)) {
        return
      }
      const params = {
        userId: sessionStorage.getItem('userId'),
        queryDate: currentDay,
      }
      this.getDetail(params)
    },
    // 获取详情
    getDetail(params) {
      // 获取当天详情
      getAttendanceDetail(params).then((res) => {
        if (res.resultCode === 0) {
          this.attendanceData = { ...res }
          console.log(!this.attendanceData.clockOutStatus, 'clockOutStatus')
        }
      })
    },
    // 判断哪个是当前日
    currentDay(date) {
      const currentDate = this.getYearMonthDay(new Date(date))
      const nowDate = this.getYearMonthDay(new Date())
      if (currentDate.year == nowDate.year && currentDate.month == nowDate.month && currentDate.day == nowDate.day) {
        return true
      } else {
        return false
      }
    },

    // 判断当前日期是不是本月
    notCurrentMonth(date) {
      if (this.getYearMonthDay(new Date(date)).month != this.getYearMonthDay(new Date(this.nowDate)).month) {
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
}
</script>

<style lang="scss" scoped>
.date-item {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.normal-day {
  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #3fe5ed;
    bottom: -6px;
  }
}
.abnormal-day {
  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #ff7a45 !important;
    bottom: -6px;
  }
}
.calendar {
  width: 100%;
  height: 100%;
  font-size: 12px;
  display: flex;
  .calendar-left {
    width: 360px;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  .calendar-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .right-top {
      height: 57px;
      width: 64%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      div {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .btn-left {
        background: url('../img/left.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .btn-right {
        background: url('../img/right.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-left: 14px;
      }
    }
    .right-bottom {
      flex: 1;
      background: url('../img/timeBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 158px;
      background-position: center;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
      font-size: 12px;
      > div {
        display: flex;
        flex-direction: column;
        height: 34%;
        justify-content: space-evenly;
        position: relative;
      }
      .bottom-text {
        position: absolute;
        font-style: italic;
        font-size: 18px;
        top: -22px;
        left: 40px;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
      .result-top {
        text-align: center;
        > div {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 95%;
          margin-left: 5px;
        }
        > div:nth-child(1) {
          margin-left: 0;
        }
        img {
          width: 15px;
          height: 15px;
          margin-right: 4px;
        }
      }
      .result-bottom {
        text-align: center;
        > div {
          display: flex;
          justify-content: space-between;
          width: 95%;
          margin-left: 5px;
        }
        > div:nth-child(1) {
          margin-left: 0;
          justify-content: center;
        }
        .btn-normal,
        .btn-error {
          background-color: #238af0;
          padding: 1px 4px;
          border-radius: 3px;
          margin-left: 3px;
          &.btn-error {
            background-color: #ff7a45;
          }
        }
        .bottom-text {
          top: -18px;
          left: 0;
        }
      }
    }
  }
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
  /* 重写头部 */
  .calendar-title {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    .hello {
      font-weight: bold;
      width: 60%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .title-time {
      font-weight: 400;
    }
  }
  // 日历
  .calendar-days {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 360px;
    .calendar-header {
      display: flex;
      margin: 10px 0;
      user-select: none;
      position: relative;
      &::after {
        position: absolute;
        display: block;
        content: '';
        width: 350px;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.4);
        bottom: -10px;
      }
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
        background-color: #00ccff !important;
        color: #fff;
        position: relative;
        border-radius: 50%;
      }

      // 选中的日期
      .select-day {
        background-color: #ffbf39;
        border-radius: 50%;
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
