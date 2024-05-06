import { onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default function useChart () {
    //图表配置即展示
    const getBarChart = (id, option = {}) => {
        nextTick(() => {
            console.log(document.getElementById(id))
            if (!document.getElementById(id)) {
                return
            }
            let barChart = echarts.init(document.getElementById(id))
            let resizeFn = () => {
                barChart.resize()
            }
            window.addEventListener('resize', resizeFn)
            onUnmounted(() => {
                console.log('resize')
                window.removeEventListener('resize', resizeFn)
            })
            // 指定图表的配置项和数据
            // 使用刚指定的配置项和数据显示图表。
            // 绘制图表
            barChart.setOption(option)
            nextTick(() => {
                barChart.resize()
            })
        })
    }
    return {
        getBarChart
    }
}