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
      <div class="topTiltle">
        <div class="zhaopian">{{ $t('passageway.photo') }}</div>
        <div class="name">{{ $t('home.name') }}</div>
        <div class="channelName">{{ $t('passageway.channelName') }}</div>
        <div class="leixing">{{ $t('home.direction') }}</div>
        <div class="shijian">{{ $t('passageway.time') }}</div>
      </div>
      <vue-seamless-scroll
        v-if="peopleRec.recognizationList && peopleRec.recognizationList.length"
        :data="peopleRec.recognizationList"
        class="seamless-warp"
        :class-option="classOption"
      >
        <ul class="itemIndex">
          <li class="slide-item" v-for="(item, index) in peopleRec.recognizationList" :key="index">
            <img :src="item.snapPhotoUrl" alt="" :data-item="item.snapPhotoUrl" class="img-wrapper" />
            <div class="personName2">{{ item.personName }}</div>
            <!--            <div class="temperature">{{ item.temperature }}</div>-->
            <div class="deviceName">{{ item.deviceName || item.channelName }}</div>
            <div class="inOutType">
              {{ item.inOutType | inOutTypeRegion }}
            </div>
            <div class="eventTime">
              {{ item.eventTime | formatDate }}
            </div>
          </li>
        </ul>
      </vue-seamless-scroll>
      <div v-else class="empty">{{ $t('public.empty') }}</div>
    </div>
  </CustomCard>
</template>

<script>
import { getPeopleRecognize } from '../../utils/api'
import CustomCard from './components/custom-card'
import Dayjs from '../../utils/Dayjs'

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
      peopleRec: {
        loading: true,
        pageSize: 50,
        pageNum: 1,
        recognizationList: [],
      },
      classOption: {
        step: 0.2,
      },
    }
  },
  mounted() {
    this.handleSetTimeOut(60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  watch: {
    '$store.state.person_inout': function (newVal, old) {
      console.log('这下我可以监听到了---', newVal)
      this.peopleRec.recognizationList.unshift(newVal)
    },
  },
  methods: {
    handleSetTimeOut(time) {
      this.handleCheckData(this.checkData)
      this.timer = setInterval(() => {
        this.handleCheckData(this.checkData)
      }, time)
    },
    handleCheckData(timeType) {
      this.checkData = timeType
      let data = {
        pageInfo: {
          pageNum: this.peopleRec.pageNum,
          pageSize: this.peopleRec.pageSize,
        },
        timeType: '',
        minutes: '',
        passRecord: true,
      }
      if (this.checkData == 0) {
        data.timeType = 'minutes'
        data.minutes = 15
      }
      if (this.checkData == 1) {
        data.timeType = 'minutes'
        data.minutes = 60
      }
      if (this.checkData == 2) {
        data.timeType = 'day'
        delete data.minutes
      }
      this.fetchPeopleRecognize(data)
    },
    defaultImgMethod(index) {
      this.$set(
        this.peopleRec.recognizationList,
        index,
        Object.assign(this.peopleRec.recognizationList[index], { init: false })
      )
    },
    //人员识别记录列表查询
    fetchPeopleRecognize(params) {
      getPeopleRecognize(params).then((res) => {
        if (res.resultCode === 0) {
          this.peopleRec.loading = false
          if (res.pageInfo.pageNum == 1) {
            this.peopleRec.recognizationList = res.doorRecognitionInfos || []
          } else {
            this.peopleRec.recognizationList = this.peopleRec.recognizationList.concat(res.recognitionLis)
          }
          if (this.peopleRec.recognizationList) {
            for (let i = 0; i < this.peopleRec.recognizationList.length; i++) {
              Object.assign(this.peopleRec.recognizationList[i], {
                init: true,
              })
            }
          }
        }
      })
    },
    // 使用委托解决无限滚动导致点击失效的问题
    handleItemClick($event) {
      const item = $event.target.dataset.item
      if (item) {
        this.$viewerApi({
          images: [item],
        })
      }
    },
  },
  filters: {
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
  cursor: pointer;
  padding: 0 20px 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;

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
    flex: 1;
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
