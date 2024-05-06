<!-- 通行统计 异常次数 -->
<template>
  <div class="chart-pie" :id="id" ref="charts"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
    },
    data: {
      type: Array,
    },
  },
  data() {
    return {
      chartDom: null,
      option: {
        tooltip: {
          trigger: 'item',
        },
        color: ['#1DADFF', '#12B796', '#24DCF7'],
        legend: {
          bottom: '0',
          orient: 'horizontal',
          itemGap: 20,
          itemWidth: 14, // 图例图形的宽度
          itemHeight: 10, // 图例图形的高度
          selectedMode: false,
          textStyle: {
            color: '#fff',
            fontSize: 10,
          },
          data: [],
          formatter: (name) => {
            // 获取legend显示内容
            return name
          },
        },
        title: [
          {
            text: '',
            textAlign: 'center',
            left: '49%',
            bottom: '52%',
            textStyle: {
              color: '#ff0',
              fontSize: 32,
              fontWeight: 400,
            },
          },
        ],
        series: [
          {
            type: 'pie',
            radius: ['40%', '55%'],
            background: '#051E2D',
            center: ['50%', '40%'],
            color: ['#1DADFF', '#12B796', '#24DCF7'],
            itemStyle: {
              borderWidth: 5,
              borderColor: '#051E2D',
            },
            data: [],
            labelLine: {
              length: 30,
              length2: 20,
            },
            label: {
              fontWeight: 'bold',
              formatter: function (params) {
                return params.value + '\n\n' + params.name
              },
            },
          },
          {
            color: ['#163d59'],
            type: 'gauge',
            center: ['50%', '40%'],
            startAngle: 150,
            endAngle: -209.999,
            splitNumber: 12,
            radius: '75%',
            pointer: {
              show: false,
            },
            progress: {
              show: false,
              roundCap: true,
              width: 1,
            },
            axisLine: {
              show: false,
              lineStyle: {
                width: 10,
                color: [
                  [0, '#163d59'],
                  [0.5, '#163d59'],
                  [1, '#163d59'],
                ],
              },
            },
            axisTick: {
              distance: -25,
              length: 5,
              splitNumber: 10,
              lineStyle: {
                width: 1,
                color: '#099fe4',
              },
            },
            splitLine: {
              distance: -35,
              length: 10,
              lineStyle: {
                width: 2,
                color: '#099fe4',
              },
            },
            axisLabel: {
              show: false,
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [],
          },
        ],
      },
    }
  },
  mounted() {
    this.chartDom = this.$echarts.init(this.$refs.charts)
  },
  methods: {
    init(data) {
      this.option.series[0].data = data
      this.option.title[0].text =
        data.reduce((prev, cur) => {
          return prev + cur.value
        }, 0) + ''
      this.option.legend.data = data.map((d) => d.name)
      this.$nextTick(() => {
        this.chartDom.setOption(this.option)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-pie {
  width: 100%;
  height: 100%;
}
</style>