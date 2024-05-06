<template>
  <!--巡更任务统计-->
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
    <div class="patrol-task">
      <div class="right">
        <div id="patrolTask" ref="patrolTask"></div>
        <div class="num">
          <div class="total total-num">{{ total }}</div>
          <span class="total">总数</span>
        </div>
      </div>
    </div>
  </CustomCard>
</template>

<script>
import { patrolPlan } from '@/utils/api'
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
      dailyTask: 0, //日常任务
      temporaryTaskCount: 0, //临时任务
      taskCount: 0, //巡更任务
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
      timer: null,
      total: 0,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
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
      this.fetchPatrolPlan(timeCount)
    },
    fetchPatrolPlan(params) {
      patrolPlan(params).then((res) => {
        if (res.resultCode == 0) {
          let barChart = this.$echarts.init(document.getElementById('patrolTask'))
          const data = [
            {
              name: '未开始',
              value: res.unStartCount || 0,
            },
            {
              name: '执行中',
              value: res.underWayCount || 0,
            },
            {
              name: '已完成',
              value: res.finishedCount || 0,
            },
            {
              name: '未完成',
              value: res.unfinishedCount || 0,
            },
            {
              name: '已过期',
              value: res.overdueCount || 0,
            },
          ]
          const pieData1 = []
          this.total = data.reduce((a, b) => {
            return a + b.value
          }, 0)
          const gap = this.total === 1 ? 0 : (this.total * 1) / 100
          const gapData = {
            name: '',
            value: gap,
            itemStyle: {
              color: 'transparent',
            },
          }
          const color2 = [
            'rgba(0,255,253,.8)',
            'rgba(0,145,246,.8)',
            'rgba(40,224,174,.8)',
            'rgba(229,179,108,.8)',
            'rgba(225,133,133,.8)',
          ]
          for (let i = 0; i < data.length; i++) {
            pieData1.push({
              ...data[i],
              itemStyle: {
                borderRiadus: 0,
              },
            })
            if (data[i].value) {
              pieData1.push(gapData)
            }
          }

          let option = {
            tooltip: {
              extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.15);',
              padding: [12, 16, 12, 16],
              textStyle: {
                color: 'rgba(255,255,255,0.65)',
              },
              formatter: (param) => {
                let { marker, name, value, data } = param
                let result = `
         <div>${marker}${name}</div>
         <div>数量：${value} </div>`
                return result
              },
            },
            legend: {
              orient: 'vertial',
              itemWidth: 8,
              itemHeight: 8,
              right: 20,
              top: 28,
              data: data,
              itemGap: 2,
              formatter: (name) => {
                for (var i = 0; i < data.length; i++) {
                  if (name == data[i].name) {
                    return '{name|' + name + '}{value|}'
                  }
                }
              },
              textStyle: {
                rich: {
                  name: {
                    fontSize: 14,
                    fontWeight: 400,
                    width: 100,
                    height: 26,
                    padding: [0, 0, 0, 5],
                    color: '#fff',
                  },
                },
              },
              itemStyle: {
                borderWidth: 0,
              },
            },
            color: [
              'rgba(0,255,253,.8)',
              'rgba(0,145,246,.8)',
              'rgba(40,224,174,.8)',
              'rgba(229,179,108,.8)',
              'rgba(225,133,133,.8)',
            ],
            series: [
              {
                type: 'pie',
                roundCap: true,
                radius: ['75%', '85%'],
                center: ['30%', '55%'],
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                silent: true,
                data: this.total > 0 ? pieData1 : 0,
              },
              {
                type: 'pie',
                radius: ['50%', '60%'],
                center: ['30%', '55%'],
                itemStyle: {
                  opacity: 0.5,
                  color: (params) => {
                    return color2[params.dataIndex]
                  },
                },
                label: {
                  // 鼠标悬浮具体数据显示
                  show: false,
                },
                data: this.total > 0 ? data : 0,
              },
            ],
          }
          barChart.setOption(option)
          window.addEventListener('resize', function () {
            barChart.resize()
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.patrol-task {
  width: 100%;
  padding: 20px 20px 10px;
  box-sizing: border-box;
  height: 100%;
  position: absolute;
  pointer-events: auto;
  top: 0;
  display: flex;
  justify-content: center;

  .right {
    flex: 1;
    position: relative;

    #patrolTask {
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }

    .num {
      position: absolute;
      top: 42%;
      left: 24%;
      font-size: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .total {
        font-weight: 700;
        letter-spacing: 2px;
        color: transparent;
        -webkit-background-clip: text;
        text-shadow: 0.00521rem 0.03125rem 0.02083rem rgba(241, 236, 232, 0.4);
        background-image: linear-gradient(0deg, #eee2da, #fef9f4);
      }

      .total-num {
        font-size: 24px;
      }
    }

    .empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #e9e9e9;
    }
  }
}
</style>
