<template>
  <CusDialog :title="$t('public.detail')" @close="goBack" isDetail :visible="true">
    <div slot="body">
      <!-- 主体 -->
      <div class="mainBox">
        <!-- 左侧 captureUrl-->
        <div class="left">
          <div class="video">
            <div class="capture">
              <p>{{ $t('alarm.panorama') }}</p>
              <img class="captureImg" v-viewer :src="detail.captureUrl" alt="" />
              <p>
                <a :href="detail.captureUrl" target="blank">{{ $t('login.download') }}</a>
              </p>
            </div>
            <div class="detect">
              <p>{{ $t('alarm.snapshot') }}</p>
              <img v-viewer :src="detail.detectUrl" alt="" />
              <p>
                <a :href="detail.detectUrl" target="blank">{{ $t('login.download') }}</a>
              </p>
            </div>
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
              <div class="item" v-if="detail.confidence">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.similarity') }}</div>
                <div class="item-value" :title="detail.confidence">{{ (detail.confidence * 1).toFixed(2) }}%</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.captureTime') }}</div>
                <div class="item-value">{{ detail.captureTime }}</div>
              </div>
            </div>
          </div>
          <div class="item-wrapper">
            <div class="title">{{ personInfo }}</div>
            <div class="item-content" v-if="[0, 1].includes(searchType)">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.sex') }}</div>
                <div class="item-value">{{ getSex(detail.gender) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.age') }}</div>
                <div class="item-value">{{ getAge(detail.age) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.withHat') }}</div>
                <div class="item-value">{{ getHat(detail.hat) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.withGlass') }}</div>
                <div class="item-value">
                  {{ getGlass(detail.eyeGlass) }}
                </div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.withMask') }}</div>
                <div class="item-value">{{ getMask(detail.mouthMask) }}</div>
              </div>
            </div>
            <div class="item-content" v-if="searchType == 2">
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.topColor') }}</div>
                <div class="item-value">{{ setColor(detail.upperColor) }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.topStyle') }}</div>
                <div class="item-value">{{ setStyle(detail.upperStyle, 'up') }}</div>
              </div>
              <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.bottomColor') }}</div>
                <div class="item-value">{{ setColor(detail.lowerColor) }}</div>
              </div>
              <!-- <div class="item">
                <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.bottomStyle') }}</div>
                <div class="item-value">{{ setStyle(detail.lowerStyle, 'bot') }}</div>
              </div> -->
            </div>
          </div>
          <div class="video-btn-group">
            <!--            <div @click="shikuang" class="btn">-->
            <!--              <img src="../../../../../assets/faceSearch/shikuang.png" alt="" />-->
            <!--              <span>实况</span>-->
            <!--            </div>-->
            <!--            <div @click="huifang" class="btn">-->
            <!--              <img src="../../../../../assets/faceSearch/huifang.png" alt="" />-->
            <!--              <span>回放</span>-->
            <!--            </div>-->
            <div @click="toFaceSearch" class="btn" v-if="searchType != 2">
              <img src="../../../../../assets/faceSearch/renlian.png" alt="" />
              <!-- <span>{{ searchType == 0 ? $t('application.personnelTrack') : $t('application.personnelSearch') }}</span> -->
              <span>{{ $t('application.personnelTrack') }}</span>
            </div>
            <div @click="goToVideo(detail)" class="btn">
              <img src="../../../../../assets/faceSearch/renlian.png" alt="" />
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
import { getUploadUrl, getDownloadUrl } from '@/utils/api'
import PreloadList from './preloadList'
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
  data() {
    return {
      ageList: [
        {
          label: this.$t('public.child'),
          value: 1,
        },
        {
          label: this.$t('public.juvenile'),
          value: 2,
        },
        {
          label: this.$t('public.youth'),
          value: 3,
        },
        {
          label: this.$t('public.middleAged'),
          value: 4,
        },
        {
          label: this.$t('public.elderly'),
          value: 5,
        },
      ],
    }
  },
  mounted() {
    console.log(this.searchType, 44444)
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    personInfo() {
      return this.searchType == 2 ? this.$t('application.bodyInfo') : this.$t('application.faceInfo')
    },
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    // 回显年龄段
    getAge(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      return this.ageList.find((a) => a.value == val)?.label
    },
    getSex(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.man') : this.$t('public.woman')
    },
    getHat(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.wearHat') : this.$t('public.noHat')
    },
    getGlass(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.glasses') : this.$t('public.withoutGlasses')
    },
    getMask(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      if (val == 0) {
        return this.$t('public.unknown')
      } else return val == 1 ? this.$t('public.wearmask') : this.$t('public.withoutMask')
    },
    setColor(val) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      return (
        this.$parent.colors.find((up) => up.value == val)?.label ||
        this.$parent.colors.find((up) => up.value == 0)?.label
      )
    },
    setStyle(val, type) {
      if (typeof val === 'undefined') return
      if (val === -1) return
      let item
      if (type == 'up') {
        item = this.$parent.upStyles.find((up) => up.value == val)
      } else {
        // item = this.$parent.botStyles.find((up) => up.value == val)
      }
      return item?.label
    },
    renlianjiansuo() {
      this.$emit('renlianjiasuo', this.detail.detectUrl)
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
    toFaceSearch() {
      this.$emit('close')
      this.imageDeal()
    },
    // 图片处理
    imageDeal() {
      this.$EventBus.$emit('renlianguiji', this.detail)
      // if (this.searchType == 0) {
      //   //轨迹
      //   //继续检索
      //   this.$EventBus.$emit('renlianguiji', this.detail)
      // } else {
      //   //继续检索
      //   this.$EventBus.$emit('renlianjiasuo', this.detail)
      // }

      // let that = this;
      // let img = this.$store.state.pictureSearchDetail.captureUrl;
      // let image = new Image();
      // image.crossOrigin = "";
      // image.src = img;
      // image.onload = function () {
      //   // 将图片绝对路径转换为base64
      //   let base64 = that.getBase64Image(image);
      //   // 将base64换为blob类型
      //   let img2 = that.convertBase64UrlToBlob(base64);
      //   // 将blob转换为file对象
      //   let myfile = new File([img2], img);
      //   // 获取文件上传地址
      //   that.getUploadUrl(myfile);
      // };
    },
    // 获取文件上传地址
    async getUploadUrl(myfile) {
      console.log(myfile, 'myfile')
      let res1 = await getUploadUrl({})
      if (res1.resultCode === 0) {
        this.uploadUrl = res1.uploadUrl
        // 文件上传
        let myformData = new FormData()
        myformData.append('file', myfile, new Date().getTime())
        let res2 = await this.$postFetch(this.uploadUrl, myformData)
        if (res2.data.resultCode == 0) {
          this.$store.commit('set_faceReportId', res2.data.fileId)
          let res3 = await getDownloadUrl({
            fileId: this.$store.state.faceReportId,
          })
          if (res3.resultCode == 0) {
            console.log(res3.downloadUrl, 'res3.downloadUrl')
            this.$store.commit('set_facePath', res3.downloadUrl)
            // 触发人脸检索的点击事件
            this.$emit('renlianjiasuo', res3.downloadUrl)
          }
        }
      }
    },
    convertBase64UrlToBlob(base64) {
      var urlData = base64.dataURL
      var type = base64.type
      var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: type })
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return {
        dataURL: dataURL,
        type: 'image/' + ext,
      }
    },
    fileChange() {
      let file = document.getElementById('file').files[0]
    },
    updateDetail(item) {
      this.$emit('update:detail', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.mainBox {
  display: flex;
  font-size: 14px;
  color: #fff;
  .left {
    width: 500px;
    height: 400px;
    .video {
      width: 100%;
      height: 100%;
      padding: 0 20px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      //align-items: center;
      //justify-content: center;
      .capture {
        box-sizing: border-box;
        overflow: hidden;
        margin-right: 10px;
        .captureImg {
          width: 240px;
          height: 200px;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.3);
        }
      }
      .detect {
        flex: 1;
        //padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        img {
          width: 240px;
          height: 200px;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.3);
        }
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
    padding: 15px 20px 20px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .item-wrapper {
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
      }
      .item {
        display: flex;
        margin-bottom: 10px;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        color: #d1d5db;
        .item-label {
          width: 90px;
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
    // position: absolute;
    // bottom: 20px;
    .btn {
      //width: 33%;
      display: flex;
      align-items: center;
      background-color: #0cd8fa;
      margin-left: 10px;
      padding: 8px 10px;
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
