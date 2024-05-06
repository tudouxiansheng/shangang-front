<template>
  <!--关键监控点位-->
  <CustomCard :module-name="showProperty.moduleName">
    <el-select
      slot="filter"
      v-model="checkpoint.value"
      placeholder="请选择卡口"
      class="key-select"
      size="mini"
      @change="handleCheckPoint"
    >
      <el-option v-for="(item, index) in checkpoint.list" :key="index" :label="item.label" :value="item.checkPointId">
      </el-option>
    </el-select>
    <div class="key-monitor">
      <div class="cameraStyleFather">
        <div class="cameraStyleFlex">
          <div class="cameraStyle" ref="serchOffset"></div>
          <div class="cameraStyle"></div>
          <div class="cameraStyle"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="luxiangname" v-for="(item, index) in nameList" :key="index">
          {{ item.cameraName }}
        </div>
      </div>
      <div class="moreln" @click="more">更多>></div>
    </div>
  </CustomCard>
</template>

<script>
import { checkCamera, getCheckpoints } from '../../utils/api'
import CustomCard from './components/custom-card'
export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  data() {
    return {
      //卡口列表查询
      checkpoint: {
        list: [],
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
        value: '', //选中的卡口
      },
      swiper: '',
      nameList: [],
    }
  },
  created() {
    this.fetchKakou()
  },
  methods: {
    //卡口查询
    fetchKakou() {
      let data = {
        pageInfo: this.checkpoint.pageInfo,
      }
      getCheckpoints(data).then((res) => {
        if (res.resultCode == 0) {
          this.checkpoint.list = res.checkPointList
          var newCheckPointArray = []
          for (let i = 0; i < res.checkPointList.length; i++) {
            newCheckPointArray.push({
              label: res.checkPointList[i].checkPointName,
              value: res.checkPointList[i].checkPointName,
              checkPointId: res.checkPointList[i].checkPointId,
            })
          }
          this.checkpoint.list = newCheckPointArray
          if (this.checkpoint.list && this.checkpoint.list.length) {
            this.handleCheckPoint(this.checkpoint.list[0].checkPointId)
          }
        }
      })
    },
    //选中卡口
    handleCheckPoint(e) {
      console.log(e, 'e')
      if (this.nameList.length > 0) {
        for (let j = 0; j < this.nameList.length; j++) {
          var myparm = {
            dialogId: this.nameList[j].cameraId,
          }
          window.webkitProc('player_dialog_close', JSON.stringify(myparm))
        }
      }
      let data = {
        pageInfo: {
          pageNum: 1,
          pageSize: 50,
        },
        checkPointId: e,
      }
      var cameraArray = []
      checkCamera(data).then((res) => {
        if (res.resultCode == 0) {
          for (let i = 0; i < res.cameraList.length; i++) {
            cameraArray = cameraArray.concat({
              cameraId: res.cameraList[i].cameraId,
              cameraName: res.cameraList[i].cameraName,
            })
          }
          this.nameList = cameraArray
          if (this.nameList.length > 3) {
            this.nameList = this.nameList.splice(0, 3)
          }
          let XoffsetLeft = this.getAbsLeft(this.$refs.serchOffset)
          let YoffsetTop = this.getAbsTop(this.$refs.serchOffset)
          let y2cm = YoffsetTop + this.$refs.serchOffset.offsetHeight + 2
          for (let i = 0; i < this.nameList.length; i++) {
            var X1cm = XoffsetLeft + (this.$refs.serchOffset.offsetWidth + 21) * i
            var X2cm = XoffsetLeft + (this.$refs.serchOffset.offsetWidth + 23) * i + this.$refs.serchOffset.offsetWidth
            // console.log("X1cm",X1cm,"X2cm",X2cm);
            var param = {
              cameraId: this.nameList[i].cameraId,
              cameraName: this.nameList[i].cameraName,
              customAppearance: {
                actionBar: {
                  bgColor: '',
                  buttonColor: '',
                  buttonSize: null,
                  isAllClearBtnVisible: false,
                  isFullScreenBtnVisible: false,
                  isSnapShotBtnVisible: false,
                },
                mainWindow: {
                  borderColor: '',
                  borderWidth: null,
                  isActionBarVisible: false,
                  isBorderVisible: false,
                  isPTZControlVisible: false,
                  isTitleBarVisible: false,
                },
                screenWindow: {
                  buttonColor: '',
                  buttonSize: null,
                  defaultBorderColor: '',
                  isCloseBtnVisible: false,
                  isControlBarVisible: false,
                  isEleEnlargeBtnVisible: false,
                  isPauseBtnVisible: false,
                  isSnapShotBtnVisible: false,
                  isTitleBarVisible: false,
                  isVideoBtnVisible: false,
                  isVolumeAdjustBtnVisible: false,
                  selectedBorderColor: '',
                },
                titleBar: {
                  buttonColor: '',
                  buttonSize: null,
                  isCloseBtnVisible: false,
                  isMaxBtnVisible: false,
                  isMiniBtnVisible: false,
                  title: '播放器',
                  titleBarBgColor: '',
                  titleColor: '',
                  titleFontSize: null,
                },
              },
              dialogId: this.nameList[i].cameraId,
              isDragable: false,
              isPopWindow: false,
              isScalable: false,
              isScreenDragable: false,
              leftTopX: X1cm,
              leftTopY: YoffsetTop,
              rightBottomX: X2cm,
              rightBottomY: y2cm,
              streamType: 1,
            }
            if (window.webkitProc) {
              window.webkitProc('realtime-play', JSON.stringify(param))
            }
          }
        }
      })
    },

    more() {
      window.webkitProc(
        'switch_page_by_url',
        JSON.stringify({
          url: '/realtime-play',
          dialogIdList: [],
        })
      )
      this.$router.push('/realtime-play')
    },
    // 元素距离顶部距离
    getAbsTop(obj) {
      var top = obj.offsetTop
      while (obj.offsetParent != null) {
        obj = obj.offsetParent
        top += obj.offsetTop
      }
      return top
    },
    // 元素距离左边距离
    getAbsLeft(obj) {
      var top = obj.offsetLeft
      while (obj.offsetParent != null) {
        obj = obj.offsetParent
        top += obj.offsetLeft
      }
      return top
    },
  },
  beforeDestroy() {
    console.log('视频窗口销毁')
    for (let i = 0; i < this.nameList.length; i++) {
      if (window.webkitProc) {
        window.webkitProc(
          'player_dialog_close',
          JSON.stringify({
            dialogId: this.nameList[i].cameraId,
          })
        )
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.key-select {
  width: 140px;
}
.key-monitor {
  .cameraStyleFather {
    width: 470px;
    position: absolute;
    top: 72px;
    left: 4px;
  }
  .cameraStyleFlex {
    width: 470px;
    display: flex;
    justify-content: space-around;
  }
  .cameraStyle {
    border: 1px solid #00ccff;
    width: 135px;
    height: 90px;
  }
  .bottom {
    display: flex;
    color: white;
    position: absolute;
    bottom: 25px;
    left: 35px;
    .luxiangname {
      width: 120px;
      text-align: center;
      margin-right: 20px;
    }
  }

  .leftarrow {
    position: absolute;
    top: 125px;
    left: 4px;
    width: 7px;
  }
  .rightarrow {
    position: absolute;
    right: 4px;
    width: 7px;
    top: 125px;
  }
}
.moreln {
  position: absolute;
  bottom: 25px;
  right: 10px;
  font-size: 16px;
  color: #00ccff;
  cursor: pointer;
  z-index: 10000;
  float: right;
}
.el-scrollbar__view .el-select-dropdown__list {
  z-index: 10000;
}
</style>
