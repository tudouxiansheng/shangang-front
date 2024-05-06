<template>
  <CustomCard :moduleName="$t('alarm.typeAnalyze')">
    <div class="more-filter" v-if="isShowSelect" slot="filter" @click="handleOpenSelectVisible">
      {{ $t('public.select') }}
    </div>
    <div class="echarts" id="alarmType"></div>

    <selectDialog :data="alarmTypeList" :visible="selectVisible" @close="handleCloseDialog" @change="handleTypeChange">
    </selectDialog>
  </CustomCard>
</template>

<script>
import CustomCard from './custom-card'
import selectDialog from './select-dialog'
import Dayjs from '../../../../../utils/Dayjs'
import { getAlarmTypes, getTypeCount } from '../../../../../utils/api'
export default {
  name: 'alarmType',
  props: {
    queryDate: {
      beginTime: '',
      endTime: '',
    },
  },
  watch: {
    'queryDate.endTime': {
      handler(v) {
        this.handleGetTypeCount()
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
      alarmTypeChart: null,
      selectVisible: false,
      isShowSelect: false,
      alarmTypeList: [],
      alarmTypeCount: [],
      alarmTypeDom: null,
      selectList: [],
    }
  },
  components: {
    CustomCard,
    selectDialog,
  },
  async mounted() {
    await this.handleGetAlarmType()
    this.handleInitAlarmType()
    this.handleGetTypeCount()
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
    handleTypeChange(val) {
      this.selectList = [...val]
      let title = []
      let data = []
      this.alarmTypeCount.map((item) => {
        this.selectList.map((item1) => {
          if (item1.alarmType == item.alarmType) {
            title.push(item.alarmTypeName)
            data.push(item.countNum)
          }
        })
      })
      // let title = this.alarmTypeCount.map((item) => item.alarmTypeName)
      // let data = this.alarmTypeCount.map((item) => item.countNum)
      // console.log(title, data)
      this.handleInitAlarmType(title, data)
    },
    handleCloseDialog() {
      this.selectVisible = false
    },
    handleOpenSelectVisible() {
      this.selectVisible = true
    },
    handleGetTypeCount() {
      let params = {
        startTime: Dayjs(this.queryDate.beginTime).format('YYYY-MM-DD'),
        endTime: Dayjs(this.queryDate.endTime).format('YYYY-MM-DD'),
      }
      getTypeCount(params).then((res) => {
        if (res.resultCode == 0) {
          if (res.statsList && res.statsList.length) {
            res.statsList.sort((item, item1) => item1.countNum - item.countNum)
          }
          this.alarmTypeCount = [...res.statsList]
          if (this.alarmTypeList.length > 10) {
            this.isShowSelect = true
          } else {
            this.isShowSelect = false
          }
          let title = []
          let data = []
          this.alarmTypeCount.map((item) => {
            this.selectList.map((item1) => {
              if (item1.alarmType == item.alarmType) {
                title.push(this.isZh ? item1.alarmName : item1.alarmEnName)
                data.push(item.countNum)
              }
            })
          })
          // let title = this.alarmTypeCount.map((item) => item.alarmTypeName)
          // let data = this.alarmTypeCount.map((item) => item.countNum)
          // console.log(title, data)
          this.handleInitAlarmType(title, data)
        }
      })
    },
    handleInitAlarmType(titlename = [], data = []) {
      if (this.alarmTypeChart) {
        this.alarmTypeChart.dispose()
        this.alarmTypeChart = null
      }
      // let data = [70, 34, 60, 78, 69, 70, 34, 60, 78, 699]
      // let titlename = [
      //   '告警类型1',
      //   '告警类型2',
      //   '告警类型3',
      //   '告警类型4',
      //   '告警类型5',
      //   '告警类型6',
      //   '告警类型7',
      //   '告警类型8',
      //   '告警类型9',
      //   '告警类型10',
      // ]
      let barWidth = 10
      this.alarmTypeChart = this.$echarts.init(document.getElementById('alarmType'))
      let option = {
        title: {
          // 无数据时占位用
          show: data.length === 0, // 判断有没有数据，没有则show为true
          textStyle: {
            color: '#ccc',
            fontSize: 18,
          },
          text: this.$t('public.empty'),
          left: 'center',
          top: 'center',
        },
        backgroundColor: '#204b74',
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '10%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          formatter: function (params) {
            return params[0].name + ' : ' + params[0].value + params[0].seriesName
          },
          confine: true,
        },
        xAxis: {
          show: false,
          //设置title 刻度标签样式
          axisLabel: {
            show: true,
            color: '#a2a2a2',
          },
          //设置底部轴线样式
          axisLine: {
            show: false,
          },
          //设置网格线颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(160, 192, 252, 0.2)'],
              width: 1,
              type: [5, 8],
              dashOffset: 2,
            },
          },
        },
        yAxis: [
          //左侧Y轴设置
          {
            //数据
            data: titlename,
            //显示
            show: true,
            //是否是反向坐标轴
            inverse: true,
            //轴线样式
            axisLine: {
              show: false,
            },
            //设置网格线
            splitLine: {
              show: false,
            },
            //坐标轴刻度
            axisTick: {
              show: false,
            },
            //设置title 刻度标签样式
            axisLabel: {
              color: '#fff',
              formatter: function (value) {
                return value.length > 6 ? value.substring(0, 6) + '...' : value
              },
            },
          },
          //右侧侧Y轴设置
          {
            show: true,
            inverse: true,
            data: data,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#00F1FB',
              },
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: this.$t('public.piece'),
            type: 'bar',
            yAxisIndex: 0,
            data: data,
            barWidth: barWidth,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#28b1ff',
                  },
                  {
                    offset: 1,
                    color: '#00fcff',
                  },
                ]),
              },
            },
            label: {
              normal: {
                show: false,
                position: 'inside',
                formatter: '{c}%',
              },
            },
          },
          {
            name: '框',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: Array.from(Array(data.length), () =>
              Math.max.apply(null, data) < 100 ? 100 : Math.max.apply(null, data)
            ),
            barWidth: barWidth,
            itemStyle: {
              normal: {
                color: 'rgba(160, 192, 252, 0.1)',
                barBorderRadius: 15,
              },
            },
          },
        ],
      }
      this.alarmTypeChart.setOption(option, true)
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
