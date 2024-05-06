<template>
  <!--访客-->
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
    <div class="visitor-wrapper">
      <ul class="visitor-content">
        <li class="item">
          <div class="item-wrapper">
            <div class="label">{{ $t('public.reserve') }}</div>
            <div>
              <span class="num">{{ visitShowInfo.reservationCount }}</span
              >{{ $t('home.person') }}
            </div>
          </div>
        </li>
        <li class="item">
          <div class="item-wrapper">
            <div class="label">{{ $t('home.visitors') }}</div>
            <div>
              <span class="num">{{ visitShowInfo.visitCount }}</span
              >{{ $t('home.person') }}
            </div>
          </div>
        </li>
        <li class="item">
          <div class="item-wrapper">
            <div class="label">{{ $t('home.will', { num: 3 }) }}</div>
            <div>
              <span class="num">{{ visitShowInfo.nextThreeDayCount }}</span
              >{{ $t('home.person') }}
            </div>
          </div>
        </li>
        <li class="item">
          <div class="item-wrapper">
            <div class="label">{{ $t('home.will', { num: 7 }) }}</div>
            <div>
              <span class="num">{{ visitShowInfo.nextWeekCount }}</span
              >{{ $t('home.person') }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </CustomCard>
</template>

<script>
import { vistorCount } from '@/utils/api'
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
      timer: null,
      visitShowInfo: {},
      checkData:
        this.showProperty.timeRange && this.showProperty.timeRange.length
          ? this.showProperty.timeRange[0].value
          : 'today',
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    // 访客统计
    this.handleSetTimeOut(60 * 1000)
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
      let timeCount = {
        timeType: '',
        passRecord: true,
      }
      if (timeType == 'today') {
        timeCount.timeType = 'day'
      } else if (timeType == 'week') {
        timeCount.timeType = 'week'
      } else if (timeType == 'month') {
        timeCount.timeType = 'month'
      }
      this.getVisitorCount(timeCount)
    },
    getVisitorCount(params) {
      vistorCount(params).then((res) => {
        if (res.resultCode == 0) {
          this.visitShowInfo = { ...res.visitShowInfo }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.visitor-wrapper {
  height: 100%;
  padding: 15px 20px;
  box-sizing: border-box;

  .visitor-content {
    height: 100%;
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 50%;
      padding: 5px 10px;
      box-sizing: border-box;

      .item-wrapper {
        width: 100%;
        height: 100%;
        background: url('../../assets/bigScreen/ICON/border-rect@2x.png') no-repeat;
        background-size: 100% 100%;
        color: #fff;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .label {
          //margin-bottom: 8px;
          white-space: nowrap;
        }

        .num {
          color: #fdce01;
          padding-right: 3px;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
