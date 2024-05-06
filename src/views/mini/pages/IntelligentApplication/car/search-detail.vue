<!-- 车辆检索详情 -->
<template>
  <CusDialog :title="$t('public.detail')" isDetail @close="goBack" :visible="true">
    <div slot="body">
      <!-- 主体 -->
      <div class="mainBox">
        <!-- 左侧 -->
        <div class="left">
          <div class="video">
            <img v-viewer :src="detail.captureUrl" alt="" />
            <p>
              <a :href="detail.captureUrl">{{ $t('login.download') }}</a>
            </p>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="right">
          <!-- 图片对比部分 -->
          <div class="item-wrapper">
            <div class="title">{{ $t('public.capture') }}</div>
            <div class="item-content">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.deviceName') }}</div>
                <div class="item-value" :title="detail.cameraName">{{ detail.cameraName }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.devicePos') }}</div>
                <div class="item-value" :title="detail.snapLocation">
                  {{ detail.snapLocation || $t('public.unknown') }}
                </div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.captureTime') }}</div>
                <div class="item-value">{{ detail.captureTime }}</div>
              </div>
            </div>
          </div>
          <div class="item-wrapper">
            <div class="title">{{ $t('application.carInfo') }}</div>
            <div class="item-content">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.plateNum') }}</div>
                <div class="item-value">{{ detail.plateNumber }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.carType') }}</div>
                <div class="item-value">{{ getCarTypr(detail.carType) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.carColor') }}</div>
                <div class="item-value">{{ getCarColor(detail.carColor) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.plateColor') }}</div>
                <div class="item-value">{{ getPlateColor(detail.plateColor) }}</div>
              </div>
            </div>
          </div>
          <div class="video-btn-group" v-if="searchType != 3">
            <!--            <div @click="shikuang" class="btn">-->
            <!--              <img src="../../../../../assets/faceSearch/shikuang.png" alt="" />-->
            <!--              <span>实况</span>-->
            <!--            </div>-->
            <!--            <div @click="huifang" class="btn">-->
            <!--              <img src="../../../../../assets/faceSearch/huifang.png" alt="" />-->
            <!--              <span>回放</span>-->
            <!--            </div>-->
            <div @click="toGuiji(detail)" class="btn">
              <img src="../../../../../assets/faceSearch/jiansuo.png" alt="" />
              <span>{{ $t('application.vehicleTrack') }}</span>
            </div>
            <div @click="goToVideo(detail)" class="btn">
              <img src="../../../../../assets/faceSearch/jiansuo.png" alt="" />
              <span>{{ $t('application.captureRecord') }}</span>
            </div>
          </div>
        </div>
      </div>
      <!--底部轮播图-->
      <div class="bottom">
        <PreloadList
          :list="$parent.tableData"
          :sortNum.sync="detail.index + 1"
          @updateDetail="updateDetail"
        ></PreloadList>
      </div>
    </div>
  </CusDialog>
</template>
<script>
import { formatDateTime } from '@/utils/mutil'
import PreloadList from '../components/preloadList.vue'
import VideoScreen from '@/mixin/VideoScreen' //查看视频
export default {
  components: {
    PreloadList,
  },
  mixins: [VideoScreen],
  props: {
    detail: {
      type: Object,
      default() {
        return {}
      },
    },
    searchType: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  mounted() {
    console.log(this.searchType, 44444)
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    // 实况视频
    shikuang() {
      let param = {
        dialogId: 'personDetail',
        cameraId: this.detail.cameraId,
        cameraName: this.detail.cameraName,
      }
      window.webkitProc('realtime-play', JSON.stringify(param))
    },

    huifang() {
      let param = {
        dialogId: 'personDetailhuifang',
        cameraId: this.detail.cameraId,
        cameraName: this.detail.cameraName,
        recordMethod: 0,
        startTime: formatDateTime(new Date()).substring(0, 10) + ' 00:00:00',
        endTime: formatDateTime(new Date()),
      }
      window.webkitProc('record-playback', JSON.stringify(param))
    },
    // 跳转至人脸检索
    toGuiji(item) {
      this.$emit('close')
      this.$emit('guiji', item)
    },
    updateDetail(item) {
      this.$emit('update:detail', item)
    },
    getCarTypr(val) {
      if (typeof val === 'undefined') return
      return this.$parent.vehicleTypeList.find((up) => up.value == val)?.name
    },
    getCarColor(val) {
      if (typeof val === 'undefined') return
      return this.$parent.vehicleColorList.find((up) => up.value == val)?.name
    },
    getPlateColor(val) {
      if (typeof val === 'undefined') return
      return this.$parent.plateColorList.find((up) => up.value == val)?.name
    },
  },
}
</script>
<style lang="scss" scoped>
.mainBox {
  display: flex;
  .left {
    width: 400px;
    height: 400px;
    .video {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 80%;
        object-fit: contain;
        background: rgba(0, 0, 0, 0.2);
      }
      a {
        color: #fff;
        text-decoration: none;
      }
    }
  }
  .right {
    flex: 1;
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .item-wrapper {
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        color: #fff;
        margin-bottom: 15px;
      }
      .item {
        display: flex;
        margin-bottom: 10px;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        color: #d1d5db;
        .item-label {
          width: 80px;
          &.en {
            width: 120px;
          }
          &:after {
            content: '：';
          }
        }
        .item-value {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
      }
    }
  }
  .video-btn-group {
    margin-top: 15px;
    box-sizing: border-box;
    width: 100%;
    color: #ffffff;
    display: flex;
    // justify-content: space-between;
    .btn {
      width: 33%;
      display: flex;
      align-items: center;
      background-color: #0cd8fa;
      margin-left: 10px;
      padding: 8px 5px;
      box-sizing: border-box;
      border-radius: 4px;
      justify-content: center;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      span {
        font-size: 18px;
      }
    }
  }
}
.bottom {
  padding-top: 20px;
  box-sizing: border-box;
  width: 100%;
  .character {
    box-sizing: content-box;
    display: inline-block;
    border: 1px solid #00ccff;
    border-radius: 4px;
    height: 24px;
    line-height: 24px;
    padding: 0px 13px;
    color: #00ccff;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
