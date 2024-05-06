<template>
  <!--巡逻应用-->
  <div class="patrolwrapper">
    <div class="patrol">
      <img
        src="../../assets/bigScreen/wrapper.png"
        alt=""
        style="position: absolute; width: 100%; height: 100%"
      />
      <div class="title">
        <div class="title-info">{{ showProperty.moduleName }}</div>
        <img src="../../assets/bigScreen/BigIcon/标题装饰.png" alt="" />
      </div>
      <div id="patrolGragh" class="patrolGragh"></div>
    </div>
  </div>
</template>

<script>
import {
  patrolPlan, //巡逻计划
} from '@/utils/api'
import { getdays, getDate } from '@/utils/mutil'
import { partrolOption } from '@/utils/echartsconst'
export default {
  props: ['showProperty'],
  data() {
    return {
      patrolplan: {
        beginDate: '',
        endDate: '',
        passRecord: true,
      },
    }
  },
  created() {
    this.fetchpatrolPlan()
  },
  methods: {
    fetchpatrolPlan() {
      this.patrolplan.beginDate = getdays(-6)
      this.patrolplan.endDate = getdays(0)
      var dateArray = getDate()
      patrolPlan(this.patrolplan).then((res) => {
        if (res.resultCode == 0) {
          var deal = []
          var nodeal = []
          for (let i = 0; i < res.statsList.length; i++) {
            nodeal.push(res.statsList[i].unfinishedCount)
            deal.push(res.statsList[i].finishedCount)
          }

          let barChart = this.$echarts.init(
            document.getElementById('patrolGragh')
          )
          var barWidth = 10
          partrolOption.xAxis.data = [...dateArray.splice(-7)]
          partrolOption.series[0].data = nodeal
          partrolOption.series[1].data = deal
          barChart.setOption(partrolOption)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 40px;
  padding: 5px 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  .title-info {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #ffffff;
  }

  img {
    width: 30px;
    margin-left: 10px;
  }
}
.patrolwrapper {
  height: 100%;
  .patrol {
    width: 480px;
    height: 100%;
    border-radius: 8px;
    position: relative;
    // margin-top: 13px;
    #patrolGragh {
      width: 100%;
      height: 200px;
    }
    .patrolGragh div {
      top: 10px;
    }
  }
}
</style>
