<template>
  <div>
    <div class="box_center">
      <div class="box_center_header">今日告警区域top5</div>
      <ul class="box_center_header_list">
        <li class="box_center_header_list_item" style="margin-bottom: 10px">
          <span class="common_inblock" style="width: 20px; height: 20px"></span
          ><span>区域名称</span><span>数量</span>
        </li>
        <li
          v-for="item in areaList"
          :key="item.alarmRanking"
          class="box_center_header_list_item"
        >
          <span style="width: 20px; height: 20px">
            <img
              src="@/assets/mytask/1.png"
              alt=""
              v-if="item.alarmRanking == 1"
              style="width: 20px; height: 20px"
            />
            <img
              src="@/assets/mytask/2.png"
              alt=""
              v-else-if="item.alarmRanking == 2"
              style="width: 20px; height: 20px"
            />
            <img
              src="@/assets/mytask/3.png"
              alt=""
              v-else-if="item.alarmRanking == 3"
              style="width: 20px; height: 20px"
            />
            <span v-else class="common_inblock">{{ item.alarmRanking }}</span>
          </span>
          <span style="text-align: left">{{ item.alarmArea }}</span
          ><span>{{ item.alarmNum }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAlarmArea } from '@/utils/api'
export default {
  name: 'CenterList',
  data() {
    return {
      areaList: [], //区域数组
    }
  },
  created() {
    this.gitTopList()
  },
  methods: {
    gitTopList() {
      let arr = []
      arr.push(this.$route.query.codeType)
      getAlarmArea({
        alarmTypeList: arr,
      }).then((res) => {
        console.log('总告警区域TOP5', res)
        this.areaList = res.alarmRankingList
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.common_inblock {
  display: inline-block;
  height: 20px;
  width: 20px;
  text-align: center;
}
.box_center {
  border-bottom: 1px solid #2a95fc;
  padding-bottom: 20px;
  .box_center_header {
    margin-top: 23px;
    border-left: 4px solid #00fff0;
    font-size: 16px;
    color: #ffffff;
    padding-left: 9px;
  }
  .box_center_header_list {
    margin-top: 14px;
    max-height: 150px;
    overflow-y: scroll;
    .box_center_header_list_item {
      display: flex;
      justify-content: space-around;
      margin: 5px 0;
      color: #c6defd;
      > span {
        display: inline-block;
        width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
