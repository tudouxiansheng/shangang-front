<template>
  <!--告警数量状态-->
  <CustomCard :module-name="showProperty.moduleName">
    <div class="alarm-wrapper">
      <ul class="alarmLeavl">
        <li v-for="(item, index) in alarmList" :key="index">
          <div>{{ status(item.alarmLevel) }}</div>
          <div
            :class="[
              item.alarmLevel == '1'
                ? 'danger'
                : item.alarmLevel == '2'
                ? 'littledanger'
                : item.alarmLevel == '3'
                ? 'warn'
                : item.alarmLevel == '4'
                ? 'success'
                : '',
              ,
            ]"
          >
            {{ item.countNum ? item.countNum : '0' }}
          </div>
        </li>
      </ul>
      <div class="alarmTable">
        <div class="info" v-for="(item, index) in alarmListType.alarmListType" :key="index">
          <li style="width: 30%">
            <div
              :class="
                item.alarmLevel == '1'
                  ? 'dabgerIcon'
                  : item.alarmLevel == '2'
                  ? 'warningIcon'
                  : item.alarmLevel == '3'
                  ? 'warnIcon'
                  : item.alarmLevel == '4'
                  ? 'successIcon'
                  : ''
              "
            ></div>
            <span>{{ item.alarmTypeName }}</span>
          </li>
          <li style="width: 50%">{{ item.alarmTime }}</li>
          <li style="width: 10%">{{ alarmstatus(item.confirmState) }}</li>
        </div>
        <div class="nodata flex-column" style="color: #cebfbf" v-if="alarmListType.nodata">
          {{ $t('public.empty') }}
        </div>
      </div>
    </div>
  </CustomCard>
</template>

<script>
import { getAlarmLevel, getAlarmList2 } from '../../utils/api'
import { getYesteday, getLastYesteday, getTwoTime } from '../../utils/mutil'
import CustomCard from './components/custom-card'

export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  data() {
    return {
      //告警类型
      alarmListType: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
        alarmListType: [],
        nodata: false,
      },
      alarmList: [],
    }
  },
  created() {
    this.fetchgetAlarmLevel()
    this.fetchAlarmList()
  },
  methods: {
    status(val) {
      if (val == 1) {
        return this.$t('home.level1')
      } else if (val == 2) {
        return this.$t('home.level2')
      } else if (val == 3) {
        return this.$t('home.level3')
      } else if (val == 4) {
        return this.$t('home.level4')
      }
    },
    alarmstatus(val) {
      if (val == 0) {
        return '未确认'
      } else if (val == 1) {
        return '已确认'
      } else if (val == 2) {
        return '已了结'
      } else {
        return '已关闭'
      }
    },
    fetchgetAlarmLevel() {
      getAlarmLevel({}).then((res) => {
        if (res.resultCode === 0) {
          this.alarmList = res.statsList
        }
      })
    },
    //告警列表
    fetchAlarmList() {
      let data = {
        pageInfo: {
          pageNum: this.alarmListType.pageInfo.pageNum,
          pageSize: this.alarmListType.pageInfo.pageSize,
        },
        searchInfo: {
          beginTime: getTwoTime().startTime,
          endTime: getTwoTime().endTime,
        },
      }
      getAlarmList2(data).then((res) => {
        if (res.resultCode === 0) {
          if (res.alarmList.length > 0) {
            if (res.pageInfo.pageNum == 1) {
              this.alarmListType.alarmListType = res.alarmList
            }
          } else {
            data.searchInfo.beginTime = getYesteday() + ' 00:00:00'
            data.searchInfo.endTime = getYesteday() + ' 23:59:59'
            getAlarmList2(data).then((res) => {
              if (res.resultCode === 0) {
                if (res.alarmList.length > 0) {
                  if (res.pageInfo.pageNum == 1) {
                    this.alarmListType.alarmListType = res.alarmList
                  }
                } else {
                  data.searchInfo.beginTime = getLastYesteday() + ' 00:00:00'
                  data.searchInfo.endTime = getLastYesteday() + ' 23:59:59'
                  getAlarmList2(data).then((res) => {
                    if (res.alarmList.length > 0) {
                      if (res.pageInfo.pageNum == 1) {
                        this.alarmListType.alarmListType = res.alarmList
                      }
                    } else {
                      this.alarmListType.nodata = true
                    }
                  })
                }
              }
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.alarm-wrapper {
  height: calc(100% - 40px);
  max-height: 220px;
  padding-bottom: 20px;
  box-sizing: border-box;
  .alarmLeavl {
    width: 90%;
    height: 55px;
    margin: 10px auto 0;
    display: flex;
    justify-content: space-between;

    li {
      width: 25%;
      height: 100%;
      color: #e6e6e6;
      font-size: 16px;
      text-align: center;
      z-index: 99;
    }
  }

  .alarmTable {
    width: 90%;
    height: calc(100% - 55px);
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin: 5px auto;

    .info {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;

      li {
        width: 30%;
        height: 30px;
        line-height: 30px;
        color: #f4f5fe;
        font-size: 12px;
        position: relative;

        span {
          position: absolute;
          left: 15px;
        }
      }
    }
  }
}

.success {
  font-size: 24px;
  color: #ffda2f;
  font-weight: bold;
}

.warn {
  font-size: 24px;
  color: #ff872f;
  font-weight: bold;
}

.danger {
  font-size: 24px;
  font-weight: bold;
  color: #ff2f2f;
}

.littledanger {
  font-size: 24px;
  color: #ff602f;
  font-weight: bold;
}

.successIcon {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #ffda2f;
  position: absolute;
  top: 10px;
  border-radius: 50%;
  font-weight: bold;
}

.warnIcon {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #ff872f;
  position: absolute;
  top: 10px;
  border-radius: 50%;
  font-weight: bold;
}

.dabgerIcon {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #ff2f2f;
  position: absolute;
  top: 10px;
  border-radius: 50%;
}

.warningIcon {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #ff872f;
  position: absolute;
  top: 10px;
  border-radius: 50%;
}

.nodata {
  text-align: center;
  color: white;
  font-size: 22px;
}
</style>
