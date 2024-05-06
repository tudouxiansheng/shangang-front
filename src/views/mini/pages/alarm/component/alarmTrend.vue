<template>
  <CustomCard :moduleName="$t('alarm.trend')">
    <div class="more-filter" slot="filter" @click="handleOpenSelectVisible" v-if="isShowSelect">
      {{ $t('public.select') }}
    </div>
    <div class="echarts" id="trend"></div>
    <selectDialog :data="alarmTypeList" :visible="selectVisible" @close="handleCloseDialog" @change="handleTypeChange">
    </selectDialog>
  </CustomCard>
</template>

<script>
import CustomCard from './custom-card'
import selectDialog from './select-dialog'
import Dayjs from '../../../../../utils/Dayjs'
import { getAlarmTypes, getAlarmTypeTrend } from '../../../../../utils/api'
export default {
  name: 'alarmTrend',
  components: {
    CustomCard,
    selectDialog,
  },
  props: {
    queryDate: {
      beginTime: '',
      endTime: '',
    },
  },
  watch: {
    'queryDate.endTime': {
      handler() {
        this.handleGetAlarmTrend()
      },
      deep: true,
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  data() {
    return {
      alarmTypeList: [],
      selectList: [],
      charts: [],
      selectVisible: false,
      isShowSelect: false,
      trendChart: null,
      color: [
        '#AB4CFB',
        '#FFF100',
        '#2691FF',
        '#4D4ADE',
        '#FFA900',
        '#FF4E00',
        '#FFD900',
        '#CC1CFB',
        '#dd4090',
        '#eec098',
      ],
    }
  },
  async mounted() {
    await this.handleGetAlarmType()
    this.handleInitTrend()
    this.handleGetAlarmTrend()
  },
  methods: {
    async handleGetAlarmType() {
      const result = await getAlarmTypes({
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
      })
      if (result.resultCode == 0) {
        this.alarmTypeList = result.alarmTypeList
      }
      // console.log(result)
    },
    handleOpenSelectVisible() {
      this.selectVisible = true
    },
    handleCloseDialog() {
      this.selectVisible = false
    },
    handleTypeChange(val) {
      this.selectList = [...val]
      let title = []
      let series = []
      this.charts.map((item) => {
        this.selectList.map((item1) => {
          if (item1.alarmType == item.alarmType) {
            title = item.infos.map((item) => item.date)
            series.push({
              name: this.isZh ? item.alarmTypeName : item.alarmType,
              type: 'line',
              colorBy: 'data',
              data: item.infos.map((item) => item.typeTotal),
            })
          }
        })
      })
      this.handleInitTrend(title, series)
    },
    handleInitTrend(title = [], series = []) {
      if (this.trendChart) {
        this.trendChart.dispose()
        this.trendChart.clear()
        this.trendChart = null
      }
      this.trendChart = this.$echarts.init(document.getElementById('trend'))
      let option = {
        color: this.color,
        title: {
          // 无数据时占位用
          show: title.length === 0, // 判断有没有数据，没有则show为true
          textStyle: {
            color: '#ccc',
            fontSize: 18,
          },
          text: this.$t('public.empty'),
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'axis',
          appendToBody: true,
          confine: true,
        },
        grid: {
          top: '8%',
          left: '3%',
          right: '7%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            color: '#fff',
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          data: title,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: '#fff',
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        series: series,
      }
      this.trendChart.setOption(option, true)
    },
    handleGetAlarmTrend() {
      let params = {
        startTime: Dayjs(this.queryDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.queryDate.endTime).format('YYYY-MM-DD'),
      }
      const that = this
      getAlarmTypeTrend(params).then((res) => {
        if (res.resultCode == 0) {
          this.charts = res.charts
          if (this.charts.length > 10) {
            this.isShowSelect = true
          } else {
            this.isShowSelect = false
          }
          // console.log(this.charts)
          let title = []
          let series = []
          this.charts.map((item) => {
            this.selectList.map((item1) => {
              if (item1.alarmType == item.alarmType) {
                title = item.infos.map((item) => item.date)
                series.push({
                  name: this.isZh ? item.alarmTypeName : item.alarmType,
                  type: 'line',
                  colorBy: 'data',
                  data: item.infos.map((item) => item.typeTotal),
                })
              }
            })
          })
          this.handleInitTrend(title, series)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.echarts {
  width: 100%;
  height: 100%;
  position: relative;
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: #aaa;
  }
}
</style>
