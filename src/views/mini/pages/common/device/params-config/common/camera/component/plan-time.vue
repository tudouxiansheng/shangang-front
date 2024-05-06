<template>
  <div class="week-plan-time-wrap">
    <div class="clearfix tool-tips" :style="{ maxWidth: boxWidth }">
      <span v-if="!disabled && clearIsShow" class="fr" @click.stop="resetForm">
        <el-icon><Delete /></el-icon>
        {{ $t('public.clear') }}
      </span>
    </div>
    <div class="scroll-box" @mousemove="mousemoveNow" @mouseup="mouseupEnd">
      <div class="week-plan-time" :style="{ width: boxWidth }">
        <div class="az-time-list">
          <ul ref="timeContainer">
            <li v-for="index in 24" :key="index">{{ index - 1 }}</li>
          </ul>
        </div>
        <div class="az-week-list" :ref="weekId">
          <div class="week-item" v-for="(item, index) in weekList" :key="index">
            <span class="label">{{ item[props.label] }}</span>
            <div
              class="time-swiper"
              @mousedown.stop="
                event => mousedownStart(event, [index, item[props.timeList].length - 1])
              "
            >
              <s class="chunk" v-for="ind in 24" :key="ind"></s>
              <el-popover
                placement="top"
                effect="light"
                width="310"
                v-for="(time, ind) in item[props.timeList]"
                :key="ind + '_'"
                trigger="click"
                :ref="`popover-${index}-${ind}`"
              >
                <template #reference>
                  <div
                    class="slider-time"
                    :class="{
                      active: activeTime[0] == index && activeTime[1] == ind
                    }"
                    :style="{ width: time.width, left: time.pointX }"
                  >
                    <div
                      class="content"
                      :style="{ background: time.style }"
                      @contextmenu.prevent="rightClick($event, [index, ind])"
                      @mousedown.stop="event => arrowsStart(event, time, 'content', [index, ind])"
                    >
                      {{ time.content ? time.content.label : '' }}
                    </div>
                    <div
                      class="left-arrows arrows"
                      v-if="activeTime[0] == index && activeTime[1] == ind"
                      @mousedown.stop="event => arrowsStart(event, time, 'start')"
                    >
                      <el-icon><CaretBottom /></el-icon>
                      <el-icon><CaretTop /></el-icon>
                    </div>
                    <div
                      class="right-arrows arrows"
                      v-if="activeTime[0] == index && activeTime[1] == ind"
                      @mousedown.stop="event => arrowsStart(event, time, 'end')"
                    >
                      <el-icon><CaretBottom /></el-icon>
                      <el-icon><CaretTop /></el-icon>
                    </div>
                  </div>
                </template>
                <div class="detail-box">
                  <el-time-picker
                    class="time-picker"
                    v-if="timeLevel == 'mm'"
                    style="width: 48%"
                    v-model="time[props.startTime]"
                    :clearable="false"
                    :disabled="disabled"
                    value-format="HH:mm"
                    :picker-options="{
                      selectableRange: startSelectableRange
                    }"
                    @focus="timePickerFocus(item[props.timeList], time, ind, 1)"
                    :placeholder="$t('public.startTime')"
                  ></el-time-picker>
                  <span v-if="timeLevel == 'mm'" class="pl-1 pr-1">-</span>
                  <el-time-picker
                    class="time-picker"
                    v-if="timeLevel == 'mm'"
                    style="width: 48%"
                    v-model="time[props.endTime]"
                    :picker-options="{
                      selectableRange: endSelectableRange
                    }"
                    :clearable="false"
                    :disabled="disabled"
                    value-format="HH:mm"
                    @focus="timePickerFocus(item[props.timeList], time, ind, 2)"
                    :placeholder="$t('public.endTime')"
                  ></el-time-picker>
                  <el-time-picker
                    class="time-picker"
                    v-if="timeLevel == 'ss'"
                    style="width: 48%"
                    v-model="time[props.startTime]"
                    :clearable="false"
                    :disabled="disabled"
                    value-format="HH:mm:ss"
                    :picker-options="{
                      selectableRange: startSelectableRange
                    }"
                    @focus="timePickerFocus(item[props.timeList], time, ind, 1)"
                    :placeholder="$t('public.startTime')"
                  ></el-time-picker>
                  <span v-if="timeLevel == 'ss'" class="pl-1 pr-1">-</span>
                  <el-time-picker
                    class="time-picker"
                    v-if="timeLevel == 'ss'"
                    style="width: 48%"
                    v-model="time[props.endTime]"
                    :picker-options="{
                      selectableRange: endSelectableRange
                    }"
                    :clearable="false"
                    :disabled="disabled"
                    value-format="HH:mm:ss"
                    @focus="timePickerFocus(item[props.timeList], time, ind, 2)"
                    :placeholder="$t('public.endTime')"
                  ></el-time-picker>
                  <div class="btn-box" v-if="!disabled" style="text-align: right; margin-top: 10px">
                    <el-button
                      type="primary"
                      @click.stop="saveTime(time, `popover-${index}-${ind}`)"
                    >
                      {{ $t('public.save') }}
                    </el-button>
                    <el-button
                      type="danger"
                      @click.stop="deleteTime(index, ind, `popover-${index}-${ind}`)"
                    >
                      {{ $t('public.delete') }}
                    </el-button>
                  </div>
                </div>
              </el-popover>
            </div>
            <span
              :class="['delete-btn', disabled ? 'disabled-delete-btn' : 'enabled-delete-btn']"
              @click="deleteRowTime(index)"
            >
              <el-icon><el-icon-delete /></el-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShowOption" class="option" :style="{ top: optionY, left: optionX }">
      <ul>
        <li
          class="option-item"
          v-for="option in optionList"
          :key="option.value"
          @click="selectOtion(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    clearIsShow: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    repeat: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '720px'
    },
    weekList: {
      type: Array,
      default() {
        return [
          {
            label: this.$t('public.Monday'),
            dayType: 1,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Tuesday'),
            dayType: 2,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Wednesday'),
            dayType: 3,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Thursday'),
            dayType: 4,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Friday'),
            dayType: 5,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Saturday'),
            dayType: 6,
            active: false,
            timeList: []
          },
          {
            label: this.$t('public.Sunday'),
            dayType: 7,
            active: false,
            timeList: []
          }
        ]
      }
    },
    planType: {
      type: Number,
      default: 0 //0：周计划，1：日计划
    },
    timeLevel: {
      type: String,
      default: 'ss' // mm：分钟，ss：秒
    },
    optionList: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          timeList: 'timeList',
          startTime: 'startTime',
          endTime: 'endTime'
        }
      }
    }
  },

  data() {
    return {
      weekId: 'week' + new Date().getTime(),
      // 当前激活对象
      activeTime: [],
      // 组件操作对象
      temp: false,
      // 拖拽节点
      dageDom: '',
      secondWidth: '', // 1秒对应的容器总宽度
      // 判断是否鼠标点下
      ifDrag: false,
      dataList: [],
      isShowOption: false,
      optionX: undefined,
      optionY: undefined,

      rightClickAction: [],
      startSelectableRange: undefined,
      endSelectableRange: undefined,
      isSave: true
    }
  },
  computed: {
    boxWidth() {
      return this.width.replace('px', '') * 1 + 122 + 'px'
    }
  },
  watch: {
    weekList() {
      this.initFormatData()
    }
  },
  mounted() {
    // 获取1秒时间容器宽度
    this.secondWidth = this.width.replace('px', '') / (24 * 60 * 60)
    if (this.weekList) {
      this.initFormatData()
    }
  },
  methods: {
    // 获取随机色
    randomRgb() {
      let R = Math.floor(Math.random() * 255)
      let G = Math.floor(Math.random() * 255)
      let B = Math.floor(Math.random() * 255)
      return 'rgb(' + R + ',' + G + ',' + B + ')'
    },
    // 格式化数据  转化成组件可操作格式
    initFormatData() {
      // 重置参数
      this.temp = false
      this.dageDom = ''
      this.ifDrag = false
      this.activeTime = []
      // 格式化数据  转化成组件可操作格式
      this.weekList.forEach(value => {
        if (value[this.props.timeList] && value[this.props.timeList].length) {
          value[this.props.timeList].forEach(val => {
            val.pointX = '' // 时段定位
            val.r_width = '' // 备份
            val.r_pointX = '' // 备份
            val.width = '' // 时段宽度
            val.startX = '' // 操作时鼠标点击起始点位置
            val.endX = '' // 操作时鼠标最终位置
            val.id = '' // 时段id
            val.temporary = false // 时段id
            val.style = 'rgb(103, 148, 101)'
            val.RangeTime = [val[this.props.startTime], val[this.props.endTime]]
            // 计算时段宽度
            let st = this.formatSecond(val[this.props.startTime])
            let et = this.formatSecond(val[this.props.endTime])
            val.width = (et - st) * this.secondWidth + 'px'
            // 计算时段定位
            val.pointX = st * this.secondWidth + 'px'
          })
          // 按起始时间重新排序
          value[this.props.timeList].sort((a, b) => {
            return a.pointX.replace('px', '') * 1 - b.pointX.replace('px', '') * 1
          })
        }
      })
      this.weekListFormatter()
    },
    weekListFormatter() {
      let list = []
      this.weekList.forEach((item1, index1) => {
        if (item1[this.props.timeList].length > 0) {
          list[index1] = {
            dayType: item1.dayType,
            timeSpanList: []
          }
          item1[this.props.timeList].forEach((item2, index2) => {
            list[index1].timeSpanList[index2] = {
              startTime: item2.startTime,
              endTime: item2.endTime,
              cruiseNo: item2?.content?.value
            }
          })
        }
      })
      this.$emit('planListChange', list, this.weekList)
    },
    // 时间段格式化转秒单位
    formatSecond(time) {
      if (!time) return
      let t = time.split(':')
      if (this.timeLevel == 'mm') {
        if (t.length != 2) return
        // 去除前缀0
        let ht = t[0].replace(/^0/, '')
        let mt = t[1].replace(/^0/, '')
        return ht * 60 * 60 + mt * 60
      } else {
        if (t.length != 3) return
        // 去除前缀0
        let ht = t[0].replace(/^0/, '')
        let mt = t[1].replace(/^0/, '')
        let st = t[1].replace(/^0/, '')
        return ht * 60 * 60 + mt * 60 + st * 1
      }
    },
    // 点击预新增时段
    mousedownStart(event, action) {
      this.isShowOption = false
      // 非警用状态下触发添加时段
      if (event.button == 1 || event.button == 2) return
      if (!this.disabled) {
        this.dageDom = 'addTime'
        let temp = {
          pointX: event.layerX + 'px', // 时段定位
          r_width: '', // 备份
          r_pointX: '', // 备份
          width: `${this.secondWidth}px`, // 时段宽度
          startX: '', // 操作时鼠标点击起始点位置
          endX: '', // 操作时鼠标最终位置
          [this.props.startTime]: '', // 计算出的起始时间
          [this.props.endTime]: '', // 计算出的结束时间
          RangeTime: [],
          isPre: true,
          style: 'rgb(103, 148, 101)',
          temporary: true // 标记当前操作项 操作结束后为false
        }
        this.recalcTime(temp)
        this.weekList[action[0]][this.props.timeList].push(temp)
        // 按起始时间重新排序
        this.weekList[action[0]][this.props.timeList].sort((a, b) => {
          return a.pointX.replace('px', '') * 1 - b.pointX.replace('px', '') * 1
        })
        // 激活vue数据更新钩子
        this.weekList[action[0]][this.props.timeList]['length'] =
          this.weekList[action[0]][this.props.timeList].length
        this.activeTime = [action[0], this.weekList[action[0]][this.props.timeList].length - 1]
        this.ifDrag = true
        this.dageDom = 'end'
        this.temp = temp
        // 备份记录
        this.temp.r_width = temp.width.replace('px', '') * 1
        this.temp.r_pointX = temp.pointX.replace('px', '') * 1
        this.temp.startX = event.clientX
      }
    },
    // 时段点击拖拽
    arrowsStart(event, temp, dom, action) {
      // 非禁用状态下触发编辑时段
      if (!this.disabled) {
        if (!this.isSave && temp.RangeTime && temp.RangeTime.length > 0) {
          temp[this.props.startTime] = temp.RangeTime[0]
          temp[this.props.endTime] = temp.RangeTime[1]
        }
        this.activeTime = action ? action : this.activeTime
        this.ifDrag = true
        this.dageDom = dom
        this.temp = temp
        this.temp.temporary = true
        // 备份记录
        this.temp.r_width = temp.width.replace('px', '') * 1
        this.temp.r_pointX = temp.pointX.replace('px', '') * 1
        this.temp.startX = event.clientX
      }
    },
    // 鼠标移动
    mousemoveNow(event) {
      if (this.ifDrag) {
        this.temp.endX = event.clientX
        this.temp.isPre = false

        this.recalcAttr(this.temp)
      }
    },
    // 点击结束
    mouseupEnd(event) {
      try {
        // 鼠标点击其他位置取消选中的操作对象
        let item_index = this.weekList[this.activeTime[0]][this.props.timeList].findIndex(d => {
          return d.temporary
        })
        if (!this.temp) {
          this.activeTime = []
        } else {
          this.listenerChange()
        }
        // 并非真正想新增
        if (this.temp && this.temp.isPre) {
          this.weekList[this.activeTime[0]][this.props.timeList].splice(item_index, 1)
          this.weekList[this.activeTime[0]][this.props.timeList]['length'] =
            this.weekList[this.activeTime[0]][this.props.timeList].length
        }
        this.temp.temporary = false
        this.temp = false
        this.dageDom = ''
        this.ifDrag = false
      } catch (error) {}
    },
    // 重新计算宽度和定位
    recalcAttr(temp) {
      let point = temp.r_pointX
      let minX = 0
      let maxW = this.width.replace('px', '') * 1
      // 复选模式
      if (!this.repeat) {
        let item_index = this.weekList[this.activeTime[0]][this.props.timeList].findIndex(d => {
          return d.temporary == true
        })
        // 最小不能小于前一个已有时段的最大值
        if (item_index > 0) {
          let last_item = this.weekList[this.activeTime[0]][this.props.timeList][item_index - 1]
          minX =
            last_item.pointX.replace('px', '') * 1 +
            last_item.width.replace('px', '') * 1 +
            this.secondWidth
        }
        // 最大不能大于后一个已有时段的最小值
        if (item_index < this.weekList[this.activeTime[0]][this.props.timeList].length - 1) {
          let next_item = this.weekList[this.activeTime[0]][this.props.timeList][item_index + 1]
          maxW = next_item.pointX.replace('px', '') * 1 - this.secondWidth
        }
      }
      // 拖拽左滑块
      if (this.dageDom == 'start') {
        let width = temp.r_width * 1 + (temp.startX - temp.endX)
        point = point * 1 - (temp.startX - temp.endX)
        if (point < minX) {
          point = minX
          width = temp.width.replace('px', '')
        }
        if (temp.startX - temp.endX + temp.r_width * 1 < 0) {
          width *= -1
        } else {
          temp.pointX = point + 'px'
        }
        temp.width = width + 'px'
        // 拖拽右滑块
      } else if (this.dageDom == 'end') {
        let width = temp.r_width * 1 + (temp.endX - temp.startX)
        if (width < 0) {
          point = point * 1 + width
          if (point < minX) {
            point = minX
            width = temp.width.replace('px', '')
          }
          temp.pointX = point + 'px'
          temp.width = width * -1 + 'px'
        } else {
          if (point + width > maxW) {
            width = maxW - point
          }
          temp.width = width + 'px'
        }
        // 拖拽时段主体
      } else if (this.dageDom == 'content') {
        let width = temp.r_width
        point = point + (temp.endX - temp.startX)
        if (point < minX) {
          point = minX
        }
        if (point + width > maxW) {
          point = maxW - width
        }
        temp.pointX = point + 'px'
        // 添加新时段
      }
      // 计算新时间
      this.recalcTime(this.temp)
    },
    // 重新计算时间
    recalcTime(temp) {
      let pointX = temp.pointX.replace('px', '') * 1
      let width = temp.width.replace('px', '') * 1
      let s_second = pointX / this.secondWidth
      let e_second = (pointX + width) / this.secondWidth
      temp[this.props.startTime] = this.formatMinute(s_second)
      temp[this.props.endTime] = this.formatMinute(e_second)
      if (temp[this.props.endTime] == '24:00:00') temp[this.props.endTime] = '23:59:59'
      temp.RangeTime = [temp[this.props.startTime], temp[this.props.endTime]]
    },
    // 秒数转 分秒显示 100 => 01:40 或者 02:40:00
    formatMinute(scNumber) {
      if (this.timeLevel == 'mm') {
        let minute = Math.floor(scNumber / 60)
        let second = Math.floor(scNumber % 60)
        minute = minute >= 10 ? minute : '0' + minute
        second = second >= 10 ? second : '0' + second
        return minute + ':' + second
      } else {
        let hour = Math.floor(scNumber / (60 * 60))
        let minute = Math.floor((scNumber % (60 * 60)) / 60)
        let second = Math.floor((scNumber % (60 * 60)) % 60)
        hour = hour >= 10 ? hour : '0' + hour
        minute = minute >= 10 ? minute : '0' + minute
        second = second >= 10 ? second : '0' + second
        return hour + ':' + minute + ':' + second
      }
    },
    // 编辑保存操作
    saveTime(temp, name) {
      temp.RangeTime = [temp[this.props.startTime], temp[this.props.endTime]]
      this.closePopover(name)
      // 计算时段宽度
      let st = this.formatSecond(temp[this.props.startTime])
      let et = this.formatSecond(temp[this.props.endTime])
      temp.width = (et - st) * this.secondWidth + 'px'
      // 计算时段定位
      temp.pointX = st * this.secondWidth + 'px'
      this.listenerChange()
      this.isSave = true
    },
    // 删除操作
    deleteTime(index, ind, name) {
      this.weekList[index][this.props.timeList].splice(ind, 1)
      this.listenerChange()
    },
    // 关闭popover
    closePopover(name) {
      if (!name) return
      this.$refs[name][0].doClose()
    },
    timePickerFocus(timeList, time, index, type) {
      if (!this.repeat) {
        this.isSave = false
        let startTime = undefined
        let endTime = undefined
        if (this.timeLevel == 'ss') {
          startTime = index > 0 ? this.timeFormatter(timeList[index - 1].endTime, 'ss') : '00:00:00'
          endTime =
            timeList && index < timeList.length - 1
              ? this.timeFormatter(timeList[index + 1].startTime)
              : '23:59:59'

          type == 1
            ? (this.startSelectableRange = `${startTime}-${time.endTime ? time.endTime : endTime}`)
            : (this.endSelectableRange = `${
                time.startTime ? time.startTime : startTime
              }-${endTime}`)
        } else {
          startTime = index > 0 ? this.timeFormatter(timeList[index - 1].endTime, 'mm') : '00:00'
          endTime =
            timeList && index < timeList.length - 1
              ? this.timeFormatter(timeList[index + 1].startTime)
              : '23:59'
          type == 1
            ? (this.startSelectableRange = `${startTime}-${time.endTime ? time.endTime : endTime}`)
            : (this.endSelectableRange = `${
                time.startTime ? time.startTime : startTime
              }-${endTime}`)
        }
      }
    },
    timeFormatter(time, type) {
      if (type == 'ss') {
        const unix = this.dayjs('2020-01-01 ' + time).unix() + 1
        return this.dayjs(unix * 1000).format('HH:mm:ss')
      } else {
        const unix = this.dayjs('2020-01-01 ' + time).unix() + 60
        return this.dayjs(unix * 1000).format('HH:mm')
      }
    },
    deleteRowTime(index) {
      if (this.disabled) return
      this.weekList[index][this.props.timeList] = []
      this.listenerChange()
    },
    // 重置时段
    resetForm() {
      this.$confirm(this.$t('mainDevConfiguration.clearTime'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.weekList.forEach(value => {
            value[this.props.timeList] = []
          })
          ;(this.temp = false), (this.dageDom = '')
          this.ifDrag = false
          this.activeTime = []
          this.listenerChange()
        })
        .catch(() => {})
    },
    // 监听数据变动
    listenerChange() {
      this.weekListFormatter()
    },
    rightClick(event, action) {
      this.optionX = event.x + 20 + 'px'
      this.optionY = event.y + 20 + 'px'
      this.isShowOption = true
      this.rightClickAction = action
    },
    selectOtion(option) {
      this.weekList[this.rightClickAction[0]][this.props.timeList][this.rightClickAction[1]][
        'content'
      ] = option

      this.isShowOption = false
      this.listenerChange()
    }
  }
}
</script>

<style lang="scss">
.fr {
  float: right;
  margin-bottom: 10px;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.week-plan-time-wrap {
  width: 100%;
  box-sizing: border-box;
  .tool-tips {
    padding: 0;
    box-sizing: border-box;
  }
  .scroll-box {
    width: 100%;
    overflow: auto;
    .week-plan-time {
      border: 1px solid #ddd;
      overflow: auto;
      .az-time-list {
        width: 100%;
        padding: 0 40px 0 80px;
        box-sizing: border-box;
        height: 24px;
        border-bottom: 1px solid #ddd;

        ul {
          display: flex;
          padding: 0;
          margin: 0;
          li {
            list-style-type: none;
            flex: 1;
            width: calc(100% / 24);
            height: 24px;
            font-size: 12px;
            line-height: 24px;
          }
        }
      }
      .az-week-list {
        width: 100%;
        .week-item {
          width: 100%;
          height: 40px;
          padding: 0 40px 0 80px;
          box-sizing: border-box;
          position: relative;
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
          .label {
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            width: 80px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ddd;
            user-select: none;
          }
          .time-swiper {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            position: relative;
            cursor: pointer;
            .chunk {
              display: block;
              height: 100%;
              flex: 1;
              border-left: 1px solid #ddd;
              &:first-child {
                border: none;
              }
            }
            .slider-time {
              position: absolute;
              height: 100%;
              padding: 10px 0;
              box-sizing: border-box;
              z-index: 30;
              .content {
                width: 100%;
                height: 100%;
                background: #13c2c2;
                opacity: 0.8;
                text-align: center;
              }
              .arrows {
                position: absolute;
                height: 100%;
                size: 10px;
                color: #11a983;
                width: 14px;
                cursor: e-resize;
                .el-icon-caret-bottom {
                  position: absolute;
                  top: 0;
                  left: 0;
                }
                .el-icon-caret-top {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                }
                &.left-arrows {
                  left: -7px;
                  top: 0;
                }
                &.right-arrows {
                  right: -7px;
                  top: 0;
                }
              }
            }
          }
          .delete-btn {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-left: 1px solid #ddd;
            text-align: center;
            font-size: 16px;
          }
          .enabled-delete-btn {
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
          }
          .disabled-delete-btn {
            cursor: not-allowed;
          }
        }
      }
    }
    .footer-chunk {
      padding: 15px 0;
    }
  }

  .option {
    padding-bottom: 20px;
    padding-top: 15px;
    position: fixed;
    background: #fff;
    z-index: 9999;
    border-radius: 5px;
    .option-item {
      padding: 5px 10px;
      padding-bottom: 0;
      font-size: 14px;
      cursor: pointer;
      border-radius: 2px;
      &:hover {
        background: #eee;
      }
    }
  }
}
.time-picker {
  .el-input__inner {
    border: 1px solid #e6e6e6;
  }
}
</style>
