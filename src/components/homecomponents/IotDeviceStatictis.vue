<template>
  <!--物联设备总览-->
  <CustomCard :module-name="showProperty.moduleName">
    <ul class="device-row">
      <li class="device-row_li">
        <div class="device-row_li_img">
          <img src="../../assets/door.png" />
        </div>
        <div class="device-row_li_total">
          <div class="flex flex-col box">
            <span class="num large">{{ info.doorTotal }}</span>
            <span>门禁总数(个)</span>
          </div>
        </div>
        <div class="device-row_li_online">
          <div class="flex flex-col">
            <span class="num">{{ info.doorOnline }}</span>
            <span>在线(个)</span>
          </div>
        </div>
        <div class="device-row_li_offline">
          <div class="flex flex-col">
            <span class="num">{{ info.doorOffline }}</span>
            <span>离线(个)</span>
          </div>
        </div>
      </li>
      <li class="device-row_li">
        <div class="device-row_li_img">
          <img src="../../assets/gate.png" />
        </div>
        <div class="device-row_li_total">
          <div class="flex flex-col box">
            <span class="num large">{{ info.gateTotal }}</span>
            <span>道闸总数(个)</span>
          </div>
        </div>
        <div class="device-row_li_online">
          <div class="flex flex-col">
            <span class="num">{{ info.gateOnline }}</span>
            <span>在线(个)</span>
          </div>
        </div>
        <div class="device-row_li_offline">
          <div class="flex flex-col">
            <span class="num">{{ info.gateOffline }}</span>
            <span>离线(个)</span>
          </div>
        </div>
      </li>
    </ul>
  </CustomCard>
</template>

<script>
import { getIotStatic } from '@/utils/api'
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
      //物联设备总览
      info: {
        doorTotal: '0', //门禁数量
        doorOnline: '0', //门禁数量
        doorOffline: '0', //门禁数量
        gateTotal: '0', //道闸数量
        gateOnline: '0', //道闸数量
        gateOffline: '0', //道闸数量
      },
      timer: null,
    }
  },
  created() {
    this.handleSetTimeOut(60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleSetTimeOut(time) {
      this.getIotInfo()
      this.timer = setInterval(() => {
        this.getIotInfo()
      }, time)
    },
    //布控数量
    getIotInfo() {
      getIotStatic({}).then((res) => {
        if (res.resultCode === 0) {
          res.deviceStatisticsInfoList.forEach((item) => {
            if (item.module == 1) {
              this.info.doorTotal = item.total
              this.info.doorOnline = item.online
              this.info.doorOffline = item.offline
            } else {
              this.info.gateTotal = item.total
              this.info.gateOnline = item.online
              this.info.gateOffline = item.offline
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.device-row {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  &_li {
    width: 100%;
    height: 49%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(9, 62, 108, 0.5);
    border-radius: 5px;
    background-image: url('~@/assets/iotBox.png');
    padding: 0 16px;
    background-size: 100% 100%;
    &:last-child {
      margin-top: 5px;
    }
    &_img {
      width: 48px;
      height: 48px;
      img {
        width: 48px;
        height: 48px;
      }
    }
    .num {
      color: #29b8ef;
      font-weight: 500;
    }
    .large {
      font-size: 18px;
      font-weight: 600;
    }
    .box {
      width: 140px;
      height: 48px;
      background-image: linear-gradient(#1d406b 30%, #487cac 100%);
      padding: 5px;
      clip-path: polygon(31% 0, 68% 0, 100% 100%, 0% 100%);
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-col {
    flex-direction: column;
  }
}
</style>
