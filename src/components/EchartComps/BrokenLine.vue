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
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,.5)',
        },
        legend: {
          align: 'left',
          right: '5%',
          top: '0%',
          textStyle: {
            color: '#F3FFFF',
            fontSize: 14,
          },
          icon: 'rectangle',
          itemGap: 20,
          itemWidth: 14, // 图例图形的宽度
          itemHeight: 10, // 图例图形的高度
          data: [],
        },
        grid: {
          top: '15%',
          left: '4%',
          right: '4%',
          bottom: '30%',
          //   containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: '#233653',
              },
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: '#F3FFFF',
                padding: 14,
                fontSize: 14,
              },
              formatter: function (data) {
                return data
              },
              interval: 2,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: '#fff',
              fontSize: 14,
              padding: 10,
            },
            min: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#404553',
                type: 'dashed',
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#F3FFFF',
                padding: [0, 10],
                fontSize: 14,
              },
              formatter: function (value) {
                if (value === 0) {
                  return value
                }
                return value
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: false,
            lineStyle: {
              normal: {
                width: 2,
                color: 'rgba(25,163,223,1)', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: 'rgba(25,163,223,1)',
              borderColor: '#646ace',
              borderWidth: 2,
            },

            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(25,163,223,.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(25,163,223, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [],
          },
          {
            name: '',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: false,
            lineStyle: {
              normal: {
                width: 2,
                color: 'rgba(29, 253, 253, 1)', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: 'rgba(10,219,250,1)',
              borderColor: '#646ace',
              borderWidth: 2,
            },

            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(10,219,250,.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(10,219,250, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(10,219,250, 0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
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
    init(data1, data2, option) {
      this.option.xAxis[0].data = option.xLabel || []
      this.option.xAxis[0].axisLabel.interval = option.interval || 2
      this.option.series[0].data = data1
      this.option.series[1].data = data2
      this.option.legend.data = option.legend
      this.option.series[0].name = option.legend[0].name
      this.option.series[1].name = option.legend[1].name
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