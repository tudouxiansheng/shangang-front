<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import tdTheme from './theme.json' // 引入默认主题
import resizeMixins from '@/mixin/resizeMixins'
import menu from '@store/modules/menu'

export default {
  name: 'Echart',
  mixins: [resizeMixins],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    options: {
      handler(options) {
        if (!document.getElementById(this.id)) {
          return
        }
        let barChart = echarts.init(document.getElementById(this.id))
        // 设置true清空echart缓存
        barChart.setOption(options, true)
      },
      deep: true
    },
    '$store.state.menu.longNav'() {
      this.$nextTick(() => {
        this.chart.resize()
      })
    },
    '$store.state.thirdMenuShow'() {
      this.$nextTick(() => {
        this.chart.resize()
      })
    }
  },
  mounted() {
    echarts.registerTheme('tdTheme', tdTheme) // 覆盖默认主题
    this.$nextTick(function () {
      setTimeout(() => {
        this.initChart()
      })
    })
  },
  methods: {
    initChart() {
      // 初始化echart
      this.chart = echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options, true)
    },
    resizeEchart() {
      this.$nextTick(() => {
        this.chart.resize()
      })
    }
  }
}
</script>
