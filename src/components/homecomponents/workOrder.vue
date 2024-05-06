<template>
  <!--工单统计-->
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
    <div class="work-order-wrapper">
      <div class="zhu" id="zhu" ref="zhu"></div>
      <div class="pie" id="workPie" ref="workPie"></div>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'
import resizes from '@/mixin/resizes'
export default {
  props: ['showProperty'],
  mixins: [resizes],
  components: {
    CustomCard,
  },
  data() {
    return {
      selected1: false,
      selected2: true,
      selected3: false,
      info: {},
      workPie: null,
      workZhu: null,
      timer: null,
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      support3800: true,
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  created() {
    this.support3800 = this.$store.getters.get3800Support
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    this.handleInitPie()
    this.handleInitZhu()
    this.handleCheckData(this.checkData)
    this.handleSetTimeOut(60 * 1000)
  },
  methods: {
    chartResize() {
      this.$echarts.init(this.$refs.zhu).resize()
      this.$echarts.init(this.$refs.workPie).resize()
    },
    handleSetTimeOut(time) {
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
    },
    handleCheckData(timeType) {
      this.checkData = timeType
      let timeCount = {
        timeType: '',
        passRecord: true,
      }
      if (timeType == 'today') {
        timeCount.timeType = 'day'
      } else if (timeType == 'week') {
        timeCount.timeType = 'week'
      } else if (timeType == 'month') {
        timeCount.timeType = 'month'
      }
      this.handleGetData(timeCount)
    },
    handleInitZhu(info) {
      this.workZhu = this.$echarts.init(document.getElementById('zhu'))
      let xData = [this.$t('home.alert'), this.$t('home.patrol')]
      let yData = [0, 0]
      if (!this.support3800) {
        xData = [this.$t('home.alert')]
        yData = [0]
      }
      // let yData = [100, 101]
      let option = {
        grid: {
          top: '35%',
          left: '-5%',
          bottom: '5%',
          right: '5%',
          containLabel: true,
        },
        tooltip: {
          show: true,
          appendToBody: true,
          confine: true,
          trigger: 'axis',
          formatter: '{b0}: {c0}',
        },
        animation: false,
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: false,
            },
            nameTextStyle: {
              color: '#82b0ec',
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#82b0ec',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
              margin: 30,
            },
          },
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#0c2c5a',
              },
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, -6], // 上部椭圆
            symbolPosition: 'end',
            z: 12,
            // "barWidth": "0",
            label: {
              normal: {
                show: true,
                position: 'top',
                // "formatter": "{c}%"
                fontSize: 12,
                fontWeight: 'bold',
                color: '#34DCFF',
              },
            },
            color: '#2DB1EF',
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, 7], // 下部椭圆
            // "barWidth": "20",
            z: 12,
            color: '#2DB1EF',
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: function (d) {
              return d > 0 ? [50, 15] : [0, 0]
            },
            symbolOffset: [0, 12], // 下部内环
            z: 10,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: '#2EA9E5',
                borderType: 'solid',
                borderWidth: 1,
              },
            },
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: function (d) {
              return d > 0 ? [60, 20] : [0, 0]
            },
            symbolOffset: [0, 18], // 下部内环
            z: 10,
            itemStyle: {
              color: 'transparent',
              borderColor: '#33a0d9',
              borderType: 'solid',
              borderWidth: 1,
            },
            data: yData,
          },
          {
            type: 'bar',
            //silent: true,
            barWidth: '40',
            barGap: '10%', // Make series be overlap
            barCateGoryGap: '10%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                  {
                    offset: 0,
                    color: '#38B2E6',
                  },
                  {
                    offset: 1,
                    color: 'rgba(110,174,229,0.57)',
                  },
                ]),
                opacity: 0.8,
              },
            },

            data: yData,
          },
        ],
      }

      this.workZhu.setOption(option)
    },
    handleInitPie() {
      this.workPie = this.$echarts.init(document.getElementById('workPie'))
      let data1 = []
      let option = {
        textStyle: {
          rich: {
            orgname: {
              fontSize: 12,
              width: 50,
            },
            count: {
              fontSize: 12,
              verticalAlign: 'top',
              align: 'center',
              color: '#fff',
            },
          },
        },
        title: {
          show: true,
          text: 0,
          subtext: this.$t('home.total'),
          textAlign: 'center',
          top: '40%',
          left: '48%',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            color: '#fff',
            fontFamily: 'number',
          },
          subtextStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'item',
          show: true,
          textStyle: {
            //图例字体大小
            fontSize: 12,
            color: '#fff',
          },
        },
        color: ['#FF2F2F', '#00F8FF', '#FFF100', '#CC1CFB', '#eec098'],
        legend: {
          data: [],
          selectedMode: false,
          bottom: this.isZh ? '15' : '5',
          left: 'center',
          icon: 'circle',
          orient: this.isZh ? 'horizontal' : 'vertical',
          textStyle: {
            //图例字体大小
            fontSize: 10,
            color: '#fff',
          },
        },

        series: [
          {
            name: '',
            type: 'pie',
            hoverAnimation: true,
            radius: ['40%', '55%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 1,
            },
            label: {
              show: false,
              position: 'center',
              formatter: '{b}' + '\n' + '{c}',
            },
            emphasis: {
              //hover之后中间内容
              label: {
                show: false,
                fontSize: '12',
                lineHeight: 24,
                color: '#fff',
                formatter: '{num|{c}}' + '\n' + '{b}',
                rich: {
                  num: {
                    fontSize: '20',
                    fontFamily: 'number',
                  },
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: data1,
          },
        ],
      }
      this.workPie.setOption(option)
    },
    clickTime(time) {
      switch (time) {
        case 1:
          this.selected1 = true
          this.selected2 = false
          this.selected3 = false
          this.getAttendanceData(1)
          break
        case 2:
          this.selected1 = false
          this.selected2 = true
          this.selected3 = false
          this.getAttendanceData(2)
          break
        case 3:
          this.selected1 = false
          this.selected2 = false
          this.selected3 = true
          this.getAttendanceData(3)
          break
      }
    },
    handleUpdate(info) {
      const that = this
      let pieData1 = [
        { value: info.unIssonCount, name: this.$t('work.pending') },
        { value: info.untreatedCount, name: this.$t('work.processed') },
        { value: info.uncheckedCount, name: this.$t('work.audit') },
        { value: info.finishCount, name: this.$t('work.completed') },
      ]
      let xData = [this.$t('home.alert'), this.$t('home.patrol')]
      let yData = [info.alarmSheetCount, info.patrolSheetCount]
      if (!this.support3800) {
        xData = [this.$t('home.alert')]
        yData = [info.alarmSheetCount]
      }
      this.workPie.setOption({
        title: {
          text: info.totalCount,
        },
        legend: {
          data: pieData1.map((item) => item.name),
          // formatter: function (name) {
          //   let target
          //   for (let i = 0; i < pieData1.length; i++) {
          //     if (pieData1[i].name === name) {
          //       target = pieData1[i].value
          //     }
          //   }
          //   // let arr = [`{orgname|${name}}`, `{count|${target}}`]
          //   // if (!that.isZh) {
          //   //   arr = [`{orgname|${name}}`]
          //   // }
          //   let arr = [`{orgname|${name}}`]
          //   return arr.join('')
          // },
          selectedMode: false,
          bottom: this.isZh ? '5' : '5',
          left: 'center',
          icon: 'circle',
          orient: 'horizontal',
          textStyle: {
            //图例字体大小
            fontSize: 10,
            color: '#fff',
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            hoverAnimation: true,
            radius: ['40%', '55%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 1,
            },
            label: {
              show: false,
              position: 'center',
              formatter: '{b}' + '\n' + '{c}',
            },
            emphasis: {
              //hover之后中间内容
              label: {
                show: false,
                fontSize: '12',
                lineHeight: 24,
                color: '#fff',
                formatter: '{num|{c}}' + '\n' + '{b}',
                rich: {
                  num: {
                    fontSize: '20',
                    fontFamily: 'number',
                  },
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: pieData1,
          },
        ],
      })
      this.workZhu.setOption({
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#82b0ec',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
              margin: 30,
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, -6], // 上部椭圆
            symbolPosition: 'end',
            z: 12,
            barWidth: '0',
            label: {
              normal: {
                show: true,
                position: 'top',
                // "formatter": "{c}%"
                fontSize: 12,
                fontWeight: 'bold',
                color: '#34DCFF',
              },
            },
            color: '#2DB1EF',
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, 7], // 下部椭圆
            // "barWidth": "20",
            z: 13,
            color: '#2DB1EF',
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: function (d) {
              return d > 0 ? [50, 15] : [0, 0]
            },
            symbolOffset: [0, 12], // 下部内环
            z: 10,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: '#2EA9E5',
                borderType: 'solid',
                borderWidth: 1,
              },
            },
            data: yData,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: function (d) {
              return d > 0 ? [60, 20] : [0, 0]
            },
            symbolOffset: [0, 18], // 下部外环
            z: 11,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: '#33a0d9',
                borderType: 'solid',
                borderWidth: yData[0] < 1 ? 0 : 2,
              },
            },
            data: yData,
          },
          {
            type: 'bar',
            silent: true,
            barWidth: '40',
            barGap: '10%', // Make series be overlap
            barCateGoryGap: '10%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                  {
                    offset: 0,
                    color: '#38B2E6',
                  },
                  {
                    offset: 1,
                    color: 'rgba(110,174,229,0.57)',
                  },
                ]),
                opacity: 0.8,
              },
            },
            data: yData,
          },
        ],
      })
    },
    handleGetData(params) {
      this.$api.workSheetInfo(params).then((res) => {
        if (res.resultCode == 0) {
          this.info = { ...res.info }
          this.handleUpdate(this.info)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.work-order-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  pointer-events: auto;
  top: 0;
  display: flex;

  .zhu {
    width: 220px;
  }

  .pie {
    width: 260px;
  }
}
</style>
