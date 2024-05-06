<template>
  <!--考情管理-->
  <CustomCard :module-name="showProperty.moduleName">
    <ul slot="filter" v-if="showProperty.timeRange && showProperty.timeRange.length">
      <li
        :class="checkData == item.value ? 'active' : ''"
        @click="handleCheckData(item.value)"
        v-for="(item, index) in showProperty.timeRange"
        :key="index"
      >
        {{ isZh ? item.label : item.labelEn }}
      </li>
    </ul>
    <div class="attendance" id="attendance"></div>
  </CustomCard>
</template>

<script>
import { getAttendancePie } from '@/utils/api'
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'
export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  data() {
    return {
      selected1: false,
      selected2: true,
      selected3: false,
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      timer: null,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    this.handleSetTimeOut(60 * 1000)
  },
  methods: {
    handleSetTimeOut(time) {
      this.handleCheckData(this.checkData)
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
    },
    handleCheckData(timeType) {
      this.checkData = timeType
      let timeCount = {
        startTime: '',
        endTime: '',
        passRecord: true,
      }
      if (timeType == 'today') {
        timeCount.startTime = Dayjs().format('YYYY-MM-DD 00:00:00')
        timeCount.endTime = Dayjs().format('YYYY-MM-DD 23:59:59')
      } else if (timeType == 'week') {
        timeCount.startTime = Dayjs().startOf('week').format('YYYY-MM-DD 00:00:00')
        timeCount.endTime = Dayjs().endOf('week').format('YYYY-MM-DD 23:59:59')
      } else if (timeType == 'month') {
        timeCount.startTime = Dayjs().startOf('month').format('YYYY-MM-DD 00:00:00')
        timeCount.endTime = Dayjs().endOf('month').format('YYYY-MM-DD 23:59:59')
      }
      this.getAttendanceData(timeCount)
    },
    getAttendanceData(params) {
      let barChart = this.$echarts.init(document.getElementById('attendance'))
      getAttendancePie(params).then((res) => {
        if (res.resultCode == 0) {
          console.log(res, '考勤数据')
          let data = res.resultList
          let dataName = []
          for (let i = 0; i < data.length; i++) {
            dataName.push(data[i].name)
          }
          let option = {
            tooltip: {
              show: this.isZh ? true : false,
              trigger: 'item',
              formatter: (e) => {
                return `人数: ${e.data.value}人`
              },
            },
            legend: {
              bottom: '10',
              orient: 'vertical',
              right: '10',
              y: 'center',
              data: dataName,
              textStyle: {
                color: '#ffffff',
              },
              formatter: function (name) {
                return name
              },
            },
            color: ['#2691ff', '#ab4cfb', '#d88416', '#7d4cfb', '#fff100'],
            series: [
              {
                name: '',
                type: 'pie',
                radius: [50, 70],
                center: ['40%', '55%'],
                roseType: false,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  borderRadius: 8,
                },
                data: data,
              },
            ],
          }
          barChart.setOption(option)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.attendance {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  pointer-events: auto;
  top: 0;
}
</style>
