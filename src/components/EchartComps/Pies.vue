<template>
  <div class="chartcontent">
    <div class="chart-pie" :id="id" ref="charts"></div>
    <div class="label">{{ seriesName }}</div>
  </div>
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
    seriesName: {
      type: String,
      default: '设备',
    },
  },
  data() {
    return {
      chartDom: null,
      option: {
        tooltip: {
          trigger: 'item',
        },
        color: ['#76b876', '#ccc', '#db6868'],
        legend: {
          right: '0%',
          top: 'center',
          orient: 'vertical',
          itemGap: 20,
          itemWidth: 14, // 图例图形的宽度
          itemHeight: 10, // 图例图形的高度
          selectedMode: false,
          textStyle: {
            color: '#fff',
          },
          data: [],
          formatter: (name) => {
            // 获取legend显示内容
            let data = this.option.series[0].data
            let n = data.find((d) => d.name == name)?.value
            if (n >= 0) return name + ' ' + data.find((d) => d.name == name)?.value
          },
        },
        title: [
          {
            text: '',
            textAlign: 'center',
            left: '49%',
            bottom: '38%',
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
            radius: ['47%', '60%'],
            background: '#051E2D',
            center: ['50%', '50%'],
            color: ['#24DCF7', '#00FDFF', '#1DADFF'],
            itemStyle: {
              borderWidth: 5,
              borderColor: '#051E2D',
            },
            data: [],
            labelLine: {
              normal: {
                show: false,
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
          },
          {
            type: 'pie',
            hoverAnimation: false,
            radius: ['36%', '38%'],
            center: ['50%', '50%'],
            color: ['transparent', 'yellow', 'transparent', 'yellow', 'transparent', 'yellow', 'transparent', 'yellow'],
            data: [
              {
                value: 4,
                name: '11',
              },
              {
                value: 20,
                name: '22',
              },
              {
                value: 8,
                name: '33',
              },
              {
                value: 20,
                name: '44',
              },
              {
                value: 8,
                name: '55',
              },
              {
                value: 20,
                name: '66',
              },
              {
                value: 8,
                name: '77',
              },
              {
                value: 20,
                name: '88',
              },
              {
                value: 4,
                name: '99',
              },
            ],
            tooltip: {
              show: false,
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
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
.chartcontent {
  width: 100%;
  height: 100%;
  position: relative;
}
.chart-pie {
  width: 100%;
  height: 100%;
}
.label {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
}
</style>