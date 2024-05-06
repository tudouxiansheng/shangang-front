<!-- 通行统计 开门次数 -->
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
      dataSource: [],
      colorList: ['#1DADFF', '#12B796', '#24DCF7'],
      option: {
        grid: [
          {
            left: 10,
            top: 10,
            right: -100,
            bottom: 10,
            // containLabel: true,
          },
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'value',
            axisLabel: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: 'category',
            inverse: true,
            position: 'left',
            data: [],
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            axisLabel: {
              width: 80,
              padding: [0, 0, 0, -80],
              align: 'left',
            },
          },
          {
            gridIndex: 0,
            type: 'category',
            inverse: true,
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            position: 'left',
            axisLabel: {
              width: 80,
              padding: [0, 0, 40, 0],
              align: 'left',
              formatter: (name) => {
                return `{value|${name}}`
              },
              rich: {
                value: {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                },
              },
            },
            data: [],
          },
        ],
        series: [
          {
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: 5,
            data: [],
            silent: true,
            itemStyle: {
              emphasis: {
                barBorderRadius: [0, 20, 20, 0],
              },
              normal: {
                barBorderRadius: [30, 20, 20, 30],
              },
            },
          },
          {
            type: 'pictorialBar',
            data: [],
            xAxisIndex: 0,
            yAxisIndex: 0,
            // symbol: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
            symbolRotate: null,
            symbolSize: [30, 30],
            symbolPosition: 'end',
            symbolOffset: [15, 0],
            itemStyle: {
              color: 'white',
              shadowColor: 'rgba(115, 243, 255, 0.2)',
              shadowBlur: 10,
            },
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: 5,
            barGap: '-100%',
            data: [],
            itemStyle: {
              normal: {
                color: 'rgba(131, 132, 132, 0.1)',
                barBorderRadius: [30, 30, 30, 30],
              },
            },
          },
        ],
      },
      cir0: require('./img/c1.png'),
      cir1: require('./img/c2.png'),
      cir2: require('./img/c3.png'),
    }
  },
  mounted() {
    this.chartDom = this.$echarts.init(this.$refs.charts)
  },
  methods: {
    init(data) {
      this.dataSource = data
      let max = Math.max(...data.map((d) => d.value)) + 20
      this.option.series[0].data = data.map((d, i) => {
        return {
          value: d.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              1,
              0,
              [
                {
                  offset: 0,
                  color: 'rgba(0, 0, 0, 0)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: this.colorList[i], // 100% 处的颜色
                },
              ],
              false
            ),
          },
        }
      })
      this.option.series[1].data = data.map((d, i) => {
        return {
          value: d.value,
          symbol: 'image://' + this['cir' + i],
        }
      })
      this.option.series[2].data = [max, max, max]
      this.option.yAxis[0].data = data.map((item) => item.name)
      this.option.yAxis[1].data = data.map((item) => {
        return item.name + '  ' + item.value
      })
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