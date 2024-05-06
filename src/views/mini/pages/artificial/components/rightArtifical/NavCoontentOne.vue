<template>
  <div class="box">
    <p style="font-size: 14px">当前告警数：{{ total }}</p>
    <ul class="box_list">
      <li
        class="box_list_item"
        v-for="item in listRequest"
        :key="item.alarmId"
        @click="clickDetail(item)"
      >
        <img
          :src="item.alarmSnapUrl"
          alt=""
          style="height: 100px; width: 100px"
        />
        <div class="box_list_item_right">
          <div class="box_list_item_right_header">
            <p style="margin: 0">{{ item.alarmTypeName }}</p>
            <div
              style="border: 1px solid #ff7675; color: #ff7675"
              class="box_list_item_right_header_icon"
              v-if="item.confirmState == 0"
            >
              未处理
            </div>
            <div
              style="border: 1px solid #16d4a1; color: #16d4a1"
              class="box_list_item_right_header_icon"
              v-else-if="item.confirmState == 1"
            >
              进行中
            </div>
            <div
              style="border: 1px solid #04d5fa; color: #04d5fa"
              class="box_list_item_right_header_icon"
              v-else-if="item.confirmState == 2 || item.confirmState == 3"
            >
              已处理
            </div>
          </div>
          <div style="font-size: 14px; color: #f1fefe">
            <p style="margin: 6px 0">
              <span>位置信息：</span><span>{{ item.alarmLocate }}</span>
            </p>
            <p style="margin: 6px 0">
              <span
                >抓拍时间：<span>{{ item.alarmTime }}</span></span
              >
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div class="box_pag">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        :pager-count="5"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
    <div class="box_more" @click="routerPushFn()">
      <span class="box_more_text">查看更多</span>
      <div class="box_more_box"></div>
      <div class="box_more_box box_more_right"></div>
    </div>
    <alarmDetail :infoObj="infoObj" v-if="showTab == 1"></alarmDetail>
    <ai-event-detail v-if="showTab == 2" @refresh="refresh"></ai-event-detail>
    <ai-close-loop v-if="showTab == 3"></ai-close-loop>
  </div>
</template>

<script>
import { AItablistSearch } from '@/utils/api.js'
import alarmDetail from './artDetail.vue'
import AiEventDetail from './aiEventDetail.vue'
import AiCloseLoop from './aiCloseLoop.vue'
export default {
  name: 'NavCoontentOne',
  components: {
    alarmDetail,
    AiEventDetail,
    AiCloseLoop,
  },
  data() {
    return {
      total: 0,
      listRequest: [], //告警列表数组
      currentPage: 1, //当前页数
      areaId: '', //区域ID
      deviceId: '', //设备ID
      alarmTypeList: [], //告警类型
      infoObj: {},
      showTab: '',
    }
  },

  methods: {
    refresh(newVal) {
      console.log(newVal)
      this.listRequestFn('', '', this.alarmTypeList)
    },
    /* 当前页发生变化时触发 */
    handleCurrentChange() {
      this.listRequestFn(this.areaId, this.deviceId, this.alarmTypeList)
    },
    /* 列表请求 */
    async listRequestFn(
      areaId = '',
      deviceId = '',
      alarmTypeList = [
        'ALARM_STAFF_LEAVE',
        'ALARM_STAFF_SELEEP',
        'ALARM_SMOKE',
        'ALARM_HELMET_DETECT',
        'ALARM_USE_PHONE_WHILE_WALKING',
        'ALARM_YELLOW_SMOKE',
        'ALARM_WATER_DETECT',
        'ALARM_WEAR_LABOR_CLOTH',
      ]
    ) {
      const res = await AItablistSearch({
        pageInfo: {
          pageNum: this.currentPage,
          pageSize: 5,
        },
        areaId,
        deviceId,
        alarmTypeList,
      })
      this.total = res.pageInfo.totalNum
      this.listRequest = res.resultList
    },
    /* 查询跳转传参 */
    querySearch() {
      this.alarmTypeList.push(this.$route.query.codeType)
    },
    /* 页面跳转 */
    routerPushFn() {
      this.$router.push({
        path: '/alarmpage',
        query: {
          type: 3,
        },
      })
    },
    //点击详情
    clickDetail(obj) {
      this.infoObj = obj
      this.$store.commit('dealAialarm', 1)
      this.$store.commit('dealAiEventId', obj.alarmId)
      //把单个告警信息告诉全局
      this.$store.commit('alarmItem', obj)
    },
  },
  created() {
    // 通过vuex的变化携带不同的请求参数
    this.querySearch()
    this.listRequestFn('', '', this.alarmTypeList)
    console.log('xx')
  },
  watch: {
    '$store.state.areaID': function (newID) {
      this.areaId = newID
      this.listRequestFn(this.areaId, '', this.alarmTypeList)
    },
    '$store.state.facilityID': function (newID) {
      this.deviceId = newID
      console.log(this, '区域id')
      this.listRequestFn(this.areaId, this.deviceId, this.alarmTypeList)
    },
    '$store.state.aiAlarm': function (newVal, oldVal) {
      this.showTab = newVal
    },
  },
  beforeDestroy() {
    console.log('destroy')
    this.$store.commit('dealAialarm', 0)
  },
}
</script>

<style lang="scss" scoped>
.box {
  color: #ffffff;

  .box_list_item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    background-color: rgba(33, 78, 124, 0.5);
    padding: 15px;

    .box_list_item_right {
      width: 248px;
      margin-left: 19px;
      font-size: 16px;

      .box_list_item_right_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 26px;

        .box_list_item_right_header_icon {
          width: 59px;
          height: 26px;
          border-radius: 4px;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
        }
      }
    }
  }

  .box_pag {
    position: absolute;
    bottom: 20px;

    .btn-prev,
    .number,
    .btn-next,
    .el-pager li {
      background-color: transparent;
    }

    .el-pagination,
    .el-pagination__jump,
    .el-icon-more,
    .btn-prev,
    .btn-next {
      color: #e6e6e6;
    }

    .active,
    .el-pager li:hover,
    .el-pagination button:hover {
      color: #00ccff;
    }

    .el-input__inner {
      border: 1px solid #00ccff;
    }
  }

  .box_more {
    position: relative;
    position: absolute;
    bottom: 30px;
    right: 50px;
    color: #04d5fa;

    .box_more_box {
      position: absolute;
      right: -10px;
      top: 4px;
      width: 8px;
      height: 8px;
      border-top: 1px solid #04d5fa;
      border-right: 1px solid #04d5fa;
      transform: rotate(45deg);
    }

    .box_more_right {
      right: -15px;
      top: 4px;
    }
  }
}
</style>
