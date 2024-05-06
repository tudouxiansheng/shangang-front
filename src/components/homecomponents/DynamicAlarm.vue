<template>
  <!--人员进出统计-->
  <CustomCard :module-name="showProperty.moduleName">
    <ul slot="filter" v-if="showProperty.timeRange && showProperty.timeRange.length">
      <li
        :class="checkData == item.value ? 'active' : ''"
        @click="handleCheckData(item.value)"
        v-for="(item, index) in showProperty.timeRange"
        :key="index"
      >
        {{ isZh ? item.label : item.labelEn }}
      </li>
    </ul>
    <div class="personTable" @click="handleItemClick($event)">
      <vue-seamless-scroll
        v-if="tableData && tableData.length"
        :data="tableData"
        class="seamless-warp"
        :class-option="classOption"
        :key="updateKeys"
      >
        <ul class="itemIndex">
          <li class="slide-item" v-for="(item, index) in tableData" :key="index">
            <div class="icon iconfont icon-jinggao" :class="setLevelClass(item.alarmLevel)"></div>
            <div
              class="deviceName"
              :data-item="JSON.stringify(item)"
              :title="isZh ? item.alarmTypeName : item.alarmType"
            >
              {{ isZh ? item.alarmTypeName : item.alarmType }}
            </div>
            <div class="inOutType" :data-item="JSON.stringify(item)" :class="setLevelClass(item.alarmLevel)">
              {{ item.alarmLevel | formatStatus(that) }}
            </div>
            <div class="eventTime" :data-item="JSON.stringify(item)">
              {{ item.alarmTime | formatDate }}
            </div>
          </li>
        </ul>
      </vue-seamless-scroll>
      <div v-else class="empty">{{ $t('public.empty') }}</div>
      <div v-has-permi="[151, 873]" class="more" @click.s.stop="handleGoAlarm">{{ $t('public.more') }}>></div>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'
import { getGuardHitInfo } from '../../utils/api'
import { Base64 } from 'js-base64'

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
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length ? this.showProperty.timeRange[0].value : '0',
      timer: null,
      that: this,
      bigCardVisible: false,
      alarmData: {},
      tableData: [],
      updateKeys: 1,
      classOption: {
        step: 0.2,
      },
    }
  },
  created() {
    this.$EventBus.$on('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$on('updateData', this.handleUpdateData)
  },
  mounted() {
    this.handleSetTimeOut(60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.$EventBus.$off('websocketMessage', this.handleWebSocketMessage)
    this.$EventBus.$off('updateData')
  },
  methods: {
    handleUpdateKeys() {
      this.updateKeys += 1
      if (this.updateKeys > 100000) {
        this.updateKeys = 0
      }
    },
    handleUpdateData() {
      this.handleUpdateKeys()
      this.handleCheckData(this.checkData)
    },
    handleWebSocketMessage(data) {
      if (data.type == 'alarm') {
        this.handleCheckData(this.checkData)
      }
    },
    handleGoAlarm() {
      // 根据cutype 区分路由跳转或者发送指令qt跳转
      if (sessionStorage.getItem('cuType') == 1) {
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/alarmpage',
            menuName: this.isZh ? '告警信息' : 'Alarm information',
          })
        )
        // qt
      } else {
        this.$router.push('/alarmpage')
      }
    },
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
    },
    // 使用委托解决无限滚动导致点击失效的问题
    handleItemClick($event) {
      const item = JSON.parse($event.target.dataset?.item)
      this.handleDetail(item)
    },
    handleDetail(item) {
      console.log(item)
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let { platId } = item
      platId = platId.slice(12, 14)
      if (platId == '90') {
        let alarmData = {
          ...item,
          alarmId: item.alarmId,
          alarmName: item.alarmTypeName,
          hitTime: item.alarmTime,
          deviceName: item.alarmDevName,
          captureImage: item.alarmSnapUrl,
        }
        loading.close()
        this.$emit('detail', alarmData)
        return
      }
      //告警详情
      getGuardHitInfo({ alarmId: item.alarmId })
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            if (res.guardHitInfo && Object.keys(res.guardHitInfo).length) {
              let alarmData = {
                ...item,
                ...res.guardHitInfo,
                alarmId: item.alarmId,
              }
              this.$emit('detail', alarmData)
            } else {
              // this.$message.warning(this.$t('public.empty'))
              let alarmData = {
                ...item,
                ...res.guardHitInfo,
                alarmId: item.alarmId,
                captureImage: item.alarmSnapUrl,
                alarmId: item.alarmId,
                alarmName: item.alarmTypeName,
                hitTime: item.alarmTime,
                deviceName: item.alarmDevName,
              }
              this.$emit('detail', alarmData)
            }
            // console.log(item)
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    handleSetTimeOut(time) {
      this.handleCheckData(this.checkData)
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
    },
    handleCheckData(timeType) {
      this.checkData = timeType
      let data = {
        timeType: '',
        minutes: '',
      }
      if (this.checkData == 0) {
        data.timeType = 'day'
        delete data.minutes
      }
      if (this.checkData == 1) {
        data.timeType = 'minutes'
        data.minutes = 3 * 60
      }
      if (this.checkData == 2) {
        data.timeType = 'minutes'
        data.minutes = 6 * 60
      }
      if (this.showProperty.showItems && this.showProperty.showItems.length) {
        data.typeCodes = this.showProperty.showItems.map((item) => item.value)
      }
      if (this.showProperty.status && this.showProperty.status.length) {
        if (this.showProperty.status.length == 2) {
          data.confirmState = ''
        } else {
          data.confirmState = this.showProperty.status[0]
        }
      } else {
        data.confirmState = ''
      }
      this.handleGetAlarmList(data)
    },
    //告警列表查询
    async handleGetAlarmList(data) {
      let params = {
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
        passRecord: true,
        // ...this.filterForm,
        // typeCodes:!!this.filterForm.typeCodes ? [this.filterForm.typeCodes] : [],
        // alarmLevel:!!this.filterForm.alarmLevel ? [this.filterForm.alarmLevel] : [],
        // confirmState:!!this.filterForm.confirmState ? [this.filterForm.confirmState] : [],
      }
      if (data.typeCodes != '') {
        params.typeCodes = data.typeCodes
      }
      if (data.confirmState != '') {
        params.confirmStates = data.confirmState == 0 ? [0] : [1, 2, 3]
      } else {
        params.confirmStates = ''
      }
      params.timeType = data.timeType
      params.minutes = data.minutes
      Object.keys(params).map((key) => {
        if (params[key] === '') {
          delete params[key]
        }
      })
      let res = await this.$api.API.getAlarmListNew(params)
      if (res.resultCode == 0) {
        this.tableData = res.alarmList
        this.handleUpdateKeys()
      }
    },
  },
  filters: {
    formatStatus(val, that) {
      if (val == 1) {
        return that.$t('home.level1')
      } else if (val == 2) {
        return that.$t('home.level2')
      } else if (val == 3) {
        return that.$t('home.level3')
      } else if (val == 4) {
        return that.$t('home.level4')
      }
    },
    formatDate(val) {
      return Dayjs(val).format('HH:mm:ss')
    },
    inOutTypeRegion(str) {
      if (null != str && str != undefined) {
        if (str == '1') {
          return '进入'
        } else if (str == '2') {
          return '外出'
        }
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.level1 {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.2);
}

.level2 {
  color: #ff4e00;
  background: rgba(255, 78, 0, 0.2);
}

.level3 {
  color: #ffa900;
  background: rgba(255, 169, 0, 0.2);
}

.level4 {
  color: #00ccff;
  background: rgba(0, 204, 255, 0.2);
}

.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #e9e9e9;
}

.personTable {
  height: 100%;
  padding: 0 20px 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;
  position: relative;

  .more {
    position: absolute;
    bottom: 8px;
    right: 30px;
    color: #00ccff;
    cursor: pointer;
  }

  .seamless-warp {
    overflow: hidden;
    height: calc(100% - 20px);
    box-sizing: border-box;
  }
}

.topTiltle {
  padding-bottom: 5px;
  box-sizing: border-box;
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: #fff;
  z-index: 2;

  .plateNo {
    width: 100px;
  }

  .name {
    width: 80px;
  }

  .zhaopian {
    width: 55px;
  }

  .shijian {
    width: 100px;
  }

  .leixing {
    flex: 1;
  }

  .weizhi {
    flex: 1;
  }
}

.itemIndex li {
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  text-align: center;
  cursor: pointer;

  .icon {
    background-color: transparent;
    font-size: 14px;
  }

  .img-wrapper {
    width: 50px;
    height: 37px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .personName2 {
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    padding: 0 3px;
    box-sizing: border-box;
  }

  .personName2:hover {
    overflow: visible;
  }

  .plateNo {
    width: 100px;
    text-align: center;
  }

  .inOutType {
    width: 100px;
    margin: 0 10px;
  }

  .eventTime {
    width: 100px;
  }

  .deviceName {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    padding: 0 5px;
    box-sizing: border-box;
  }
}
</style>
