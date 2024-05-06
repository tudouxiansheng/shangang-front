<template>
  <div class="worktable">
    <div class="worktable-main">
      <div class="worktable-left">
        <!-- 我的 -->
        <Card class="flex24" :title="$t('worktable.my')">
          <My />
        </Card>
        <!-- 我的考勤 -->
        <Card class="flex37" :title="$t('worktable.MyAttendance')">
          <MyAttendance />
        </Card>
        <!-- 最新通知 -->
        <Card class="flex37" :title="$t('worktable.LatestCircular')">
          <NewNotice />
        </Card>
      </div>
      <div class="worktable-right">
        <!-- 我的任务 -->
        <Card class="flex24" :title="$t('worktable.MyTask')">
          <Mytask :myTaskData="myTaskData" />
        </Card>
        <div class="worktable-right-bottom">
          <div class="worktable-right-bottom-left">
            <!-- 统计任务 -->
            <Card class="w564 flex49" :title="$t('worktable.StatisticalTask')">
              <StatiscalTask ref="StatiscalTask" :staticsData="staticsData" />
              <div slot="options" class="options-group">
                <div
                  :class="['options-group-item', cur === Number(key) ? 'active' : '']"
                  v-for="(value, key) in timeGroup"
                  :key="value"
                  @click="getData(key)"
                >
                  {{ value }}
                </div>
              </div>
            </Card>
            <!-- 资料中心 -->
            <Card class="w564 flex49" :title="$t('worktable.DataCenter')">
              <DataCenter />
            </Card>
          </div>
          <div class="worktable-right-bottom-right">
            <!-- 统计任务 -->
            <!-- 业务系统 -->
            <Card :title="$t('worktable.BusinessSystem')">
              <BusinessSystem />
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from './components/card.vue'
import My from './components/my.vue'
import BusinessSystem from './components/businessSystem.vue'
import DataCenter from './components/dataCenter.vue'
import MyAttendance from './components/myAttendance.vue'
import NewNotice from './components/newNotice.vue'
import StatiscalTask from './components/staticsTask.vue'
import Mytask from './components/mytask.vue'
import { getWorkTableAlarmCount } from '@/utils/api'
export default {
  components: { Card, My, BusinessSystem, DataCenter, MyAttendance, NewNotice, StatiscalTask, Mytask },
  data() {
    return {
      timeGroup: {
        1: this.$t('public.week'),
        2: this.$t('public.month'),
      },
      cur: 1,
      myTaskData: {},
      staticsData: {},
      timer: null,
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    window.addEventListener('resize', this.chartResize)
    this.handleSetTimeout()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.chartResize)
  },
  computed: {},
  methods: {
    // 定时调用我的任务和统计任务数据
    handleSetTimeout() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getData(this.cur)
        this.handleSetTimeout()
      }, 60 * 1000)
    },
    // 获取我的任务和统计任务数据
    getData(val = 1) {
      const type = Number(val)
      this.cur = type
      getWorkTableAlarmCount({ type }).then((res) => {
        if (res.resultCode === 0) {
          const { myTaskInfo, countTaskInfo } = res
          this.myTaskData = myTaskInfo
          this.staticsData = countTaskInfo
        }
      })
    },
    chartResize() {
      this.$refs.StatiscalTask.bar.resize()
    },
  },
}
</script>
<style scoped lang="scss">
.worktable {
  height: 100%;
  background-image: url('./img/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .worktable-main {
    padding: 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    width: 1760px;
    margin: 0 auto;

    .w564 {
      width: 564px;
    }

    .w1148 {
      width: 1148px;
    }

    .flex24 {
      flex: 0.24;
    }

    .flex37 {
      flex: 0.37;
    }

    .flex49 {
      flex: 0.493;
    }

    .worktable-left {
      width: 564px;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .worktable-right {
      width: 1156px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .worktable-right-bottom {
        display: flex;
        flex: 0.751;
        justify-content: space-between;

        .worktable-right-bottom-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 50%;
        }

        .worktable-right-bottom-right {
          width: 50%;
          display: flex;
        }
      }
    }

    .options-group {
      display: flex;
      justify-content: space-between;
      background: rgba(35, 153, 220, 0.13);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      border-radius: 2px;
      overflow: hidden;

      &-item {
        text-align: center;
        cursor: pointer;
        padding: 4px;

        &.active {
          background: #019ff8;
        }
      }
    }
  }
}
</style>
