<template>
  <div class="searchDetail">
    <!-- 头部 -->
    <div class="title">
      <span>检索详情</span>
      <el-button type="primary" style="width: 80px; background-color: #00ccff" @click="goBack"
        >返<span style="display: inline-block; width: 12px"></span>回</el-button
      >
    </div>
    <!-- 主体 -->
    <div class="mainBox">
      <!-- 左侧 -->
      <div class="left">
        <div class="video">
          <img :src="$store.state.pictureSearchDetail.detectUrl" alt="" />
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <!-- 图片对比部分 -->
        <div class="item-wrapper">
          <div class="title">抓拍信息</div>
          <div class="item-content">
            <div class="item">
              <div class="item-label">设备名称</div>
              <div class="item-value">11</div>
            </div>
            <div class="item">
              <div class="item-label">设备位置</div>
              <div class="item-value">11</div>
            </div>
            <div class="item">
              <div class="item-label">抓拍时间</div>
              <div class="item-value">{{ $store.state.pictureSearchDetail.captureTime }}</div>
            </div>
            <div class="item">
              <div class="item-label">相似度</div>
              <div class="item-value">11</div>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="title">人员信息</div>
          <div class="item-content">
            <div class="item">
              <div class="item-label">姓名</div>
              <div class="item-value">11</div>
            </div>
            <div class="item">
              <div class="item-label">手机号</div>
              <div class="item-value">11</div>
            </div>
            <div class="item">
              <div class="item-label">性别</div>
              <div class="item-value">11</div>
            </div>
          </div>
        </div>
        <div class="video-btn-group">
          <div @click="shikuang" class="btn">
            <img src="../../../../../assets/faceSearch/shikuang.png" alt="" />
            <span>实况</span>
          </div>
          <div @click="huifang" class="btn">
            <img src="../../../../../assets/faceSearch/huifang.png" alt="" />
            <span>回放</span>
          </div>
          <div @click="toFaceSearch" class="btn">
            <img src="../../../../../assets/faceSearch/renlian.png" alt="" />
            <span>人脸检索</span>
          </div>
        </div>
      </div>
    </div>
    <!--底部轮播图-->
    <div class="bottom" v-if="false">
      <swiper></swiper>
    </div>
  </div>
</template>
<script>
import { formatDateTime } from '@/utils/mutil'
import { getUploadUrl, getDownloadUrl } from '@/utils/api'
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    goBack() {
      if (this.$store.state.pTab == 1) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 1)
      } else if (this.$store.state.pTab == 3) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 3)
      } else if (this.$store.state.pTab == 2) {
        this.$store.commit('closeDetail', true)
        this.$store.commit('exPictureToResult', 2)
      }
    },
    renlianjiansuo() {
      this.$emit('renlianjiasuo', $store.state.pictureSearchDetail.detectUrl)
    },
    // 实况视频
    shikuang() {
      let param = {
        dialogId: 'personDetail',
        cameraId: this.$store.state.pictureSearchDetail.cameraId,
        cameraName: this.$store.state.pictureSearchDetail.cameraName,
      }
      window.webkitProc('realtime-play', JSON.stringify(param))
    },

    huifang() {
      let param = {
        dialogId: 'personDetailhuifang',
        cameraId: this.$store.state.pictureSearchDetail.cameraId,
        cameraName: this.$store.state.pictureSearchDetail.cameraName,
        recordMethod: 0,
        startTime: formatDateTime(new Date()).substring(0, 10) + ' 00:00:00',
        endTime: formatDateTime(new Date()),
      }
      window.webkitProc('record-playback', JSON.stringify(param))
    },
    // 跳转至人脸检索
    toFaceSearch() {
      this.imageDeal()
    },
    // 图片处理
    imageDeal() {
      this.$emit('renlianjiasuo', this.$store.state.pictureSearchDetail.detectUrl)

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
  },
}
</script>
<style lang="scss" scoped>
.searchDetail {
  padding: 20px;
  width: 870px;
  position: absolute;
  background: url('../images/800.png') no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  .title {
    display: flex;
    justify-content: space-between;
    color: #1efffc;
    height: 35px;
  }
  .mainBox {
    display: flex;
    .left {
      width: 400px;
      .video {
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .right {
      flex: 1;
      color: #fff;
      padding: 20px;
      box-sizing: border-box;
      overflow: hidden;
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
      justify-content: space-between;
      .btn {
        flex: 1;
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
}
</style>
