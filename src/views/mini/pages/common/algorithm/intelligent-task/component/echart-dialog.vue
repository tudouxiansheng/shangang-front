<template>
  <!-- 镜头经纬度选择 -->
  <el-dialog
    :visible.sync="$parent.echartDialogVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    :modal="false"
          :draggable="false"  
    @closed="dialogClosed"
    @open="dialogOpen"
    id="echartDialog"
  >
    <template #header>
      <svg-icon icon-class="changesStorageSpace" /> <span>XXXX 未来15天内存储空间变化</span>
    </template>
    <el-row v-loading="loading" style="width: 100%;height: 400px">
      <div id="echartDialog_barChart" style="height: 100%; width: 100%;"></div>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import SvgIcon from "@components/svg-icon/index.vue"
import * as echarts from 'echarts'
import useChart from "@/hooks/useChart"
export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      loading: false,
      noServerImg: {
        zh: require('@/assets/img/amap/noMapService.png'),
        en: require('@/assets/img/amap/noMapService-en.png')
      },
      xData: [],
      onlineRateList: [],
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.getBarChart()
      })
    },
    dialogClosed() {
      this.$parent.echartDialogVisible = false
    },

    //图表配置即展示
    getBarChart() {
      const{ getBarChart } = useChart()
      getBarChart('echartDialog_barChart', {
        title: {
          subtext: '磁盘空间/G',
          right: 20,
          subtextStyle: {
            color: '#ffffff',
            fontSize: 12,
          }
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: '#25435C'
            }
          },
          axisLabel: {
            color: '#FFFFFF'
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#25435C'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#FFFFFF'
          }
        },
        tooltip: {
          show: true, // 是否显示提示框组件
          trigger: 'axis', // 触发类型，一般可设置为 'axis' 表示坐标轴触发
          axisPointer: { // 坐标轴指示器配置项
            type: 'line' // 坐标轴指示器的类型
          },
        },
        series: [
          {
            data: ['820', '932', '820', '934', '1290', '1330', '1320'],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFD511'
                },
                {
                  offset: 1,
                  color: 'rgba(255,213,17,0.1)'
                }
              ])
            },
            markPoint: {
              silent: false,
              symbolSize: [190, 57],
              symbolOffset: [0, -32],
              emphasis: {
                scale: false
              },
              label: {
                width: 160,
                height: 57,
                align: 'left',
                fontSize: 12,
                offset: [-80, 0],
                formatter: function (params) {
                  let str = `${params.data.xAxis}\n`
                  str += `${params.data.value}`
                  return str
                },
                overflow: 'breakAll',
              },
              itemStyle: {
                color: 'rgba(173,198,255,0.5)',
              },
              data: [
                {
                  name: '周最低',
                  value: '已用100000GB，剩余7854564GB',
                  xAxis: 'Wed',
                  yAxis: '820',
                  symbol: 'path://M140 7.54715C140 3.379 136.418 0 132 0H8C3.5817 0 0 3.379 0 7.54715V42.4529C0 46.621 3.5817 50 8 50H65.0004L70 56.9995L74.9996 50H132C136.418 50 140 46.621 140 42.4529V7.54715Z',
                }
              ],
            },
            itemStyle: {
              opacity: 1,
              color: '#FFD511',
              borderWidth: 10,
              borderColor: '#FFD511',
              shadowColor: '#FFD511',
              shadowBlur: 20
            },
            emphasis: {
              scale: 1.5,
              itemStyle: {
                opacity: 1,
                borderWidth: 10,
                borderColor: '#FFD511',
                shadowColor: '#FFD511',
                shadowBlur: 20
              },
            },
            lineStyle: {
              color: '#FFD511'
            },
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss">
#echartDialog {
  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer{
    background-color: #0D2233 !important;
  }
  .el-dialog__header {
    display: flex;
    align-items: center;
    .svg-icon {
      width: 32px;
      height: 32px;
      color: #10a9ff;
      margin-right: 12px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding: 15px 0 5px !important;
  }
  .no-map-service {
    width: 100%;
    overflow: auto;
    text-align: center;
    img {
      margin: 100px auto;
    }
  }
}
</style>
