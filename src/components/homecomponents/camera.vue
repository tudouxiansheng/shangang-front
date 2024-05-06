<template>
  <!--设备总览-->
  <CustomCard :module-name="showProperty.moduleName">
    <div class="alarm-Main">
      <div class="device-total">
        <div class="device-icon">
          <img src="../../assets/bigScreen/camera@2x.png" alt="" />
        </div>
        <div class="name">{{ $t('home.deviceTotal') }}</div>
        <div class="num">{{ cameraInfos.totalCount }}</div>
      </div>
      <ul class="device-status">
        <li class="processed">
          <div class="backImage">
            <img src="../../assets/bigScreen/组 25317.png" alt="" style="width: 100%; height: 100%" />
            <span class="processed-num">{{ cameraInfos.onlineCount }}</span>
            <span class="status">{{ $t('home.online') }}</span>
          </div>
        </li>
        <li class="processed">
          <div class="backImage">
            <img src="../../assets/bigScreen/组 25317.png" alt="" style="width: 100%; height: 100%" />
            <span class="processed-num">{{ cameraInfos.offlineCount }}</span>
            <span class="status">{{ $t('home.offline') }}</span>
          </div>
        </li>
      </ul>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './components/custom-card'
export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  data() {
    return {
      cameraInfos: [],
      loading: true,
      timer: null,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    this.fetchCarList()
    this.handleSetTimeOut(60 * 1000)
  },
  methods: {
    handleSetTimeOut(time) {
      this.timer = setInterval(() => {
        this.fetchCarList()
      }, time)
    },
    fetchCarList() {
      this.$api.cameraInfo({ passRecord: true }).then((res) => {
        if (res.resultCode === 0) {
          this.loading = false
          this.cameraInfos = { ...res.cameraInfos }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.alarm-Main {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 100%;
  margin: 15px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .device-total {
    width: 40%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    font-size: 16px;
    .device-icon {
      width: 100px;
      height: 95px;
      //position: absolute;
      //left: 50%;
      //top: 0;
      //transform: translateX(-50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .device-status {
    flex: 1;
    display: flex;
    justify-content: space-between;
    li {
      width: 40%;
      height: 100%;
      font-size: 14px;
      color: #fff;
      text-align: center;
      z-index: 99;

      .backImage {
        width: 79px;
        height: 125px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        .status {
          position: absolute;
          top: 85px;
          left: 50%;
          transform: translateX(-50%);
        }
        .processed-num {
          margin-top: -125px;
          display: block;
          color: #00e4ff;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
