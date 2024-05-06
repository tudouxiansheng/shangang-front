<template>
  <!--门禁详情-->
  <div class="menjin">
    <div class="topTitle">
      <div class="name">详情</div>
      <i class="el-icon-close iconClose" @click="closeBtn"></i>
    </div>
    <div class="menJinContent">
      <div class="cloumn">
        <div class="hengxiang">
          <div class="leftContentbox">
            <img :src="cameraObj.snapShotUrl ? cameraObj.snapShotUrl : cameraObj.snapPhoto" class="imgbox" />
          </div>
          <div class="rightContentBox">
            <div class="box1">
              <div class="name">姓名：</div>
              <div class="content">&nbsp;&nbsp;{{ cameraObj.personName ? cameraObj.personName : '未知' }}</div>
            </div>
            <div class="box1">
              <div class="name">性别：</div>
              <div class="content">&nbsp;&nbsp;{{ cameraObj.gender == '1' ? '男' : '女' }}</div>
            </div>
            <div class="box1">
              <div class="name">年龄：</div>
              <div class="content">&nbsp;&nbsp;{{ cameraObj.age ? cameraObj.age : '无' }}</div>
            </div>
            <div class="box1">
              <div class="name">时间：</div>
              <div class="content">&nbsp;&nbsp;{{ cameraObj.eventTime }}</div>
            </div>
            <div class="box1">
              <div class="name">位置：</div>
              <div class="content">
                &nbsp;&nbsp;{{ cameraObj.location ? cameraObj.location : cameraObj.installLocate }}
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 11px">
          <div style="display: inline-block; margin-right: 43px; cursor: pointer" @click="goToLive(cameraObj)">
            <span style="display: flex; align-items: center; color: white"
              ><img src="../../assets/alarmImg/实况.png" alt="" style="width: 22px; margin-right: 5px" />实况</span
            >
          </div>
          <div style="display: inline-block; cursor: pointer" @click="goToVideo(cameraObj)">
            <span style="display: flex; align-items: center; color: white"
              ><img
                src="../../assets/alarmImg/录像.png"
                alt=""
                style="width: 22px; margin-right: 5px; color: white"
              />回放</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoScreen from "@/mixin/VideoScreen" //查看视频
export default {
  props: ['cameraObj'],
  mixins:[VideoScreen],
  data() {
    return {}
  },
  methods: {
    closeBtn() {
      this.$emit('closeCameraBtn')
    },
  },
}
</script>

<style lang="scss">
.menjin {
  width: 730px;
  height: 417px;
  background: rgba(12, 25, 44, 0.6);
  border-radius: 8px;
  position: absolute;
  left: 40%;
  top: 20%;
  margin-left: -365px;
  z-index: 100;
  padding: 20px;

  .topTitle {
    display: flex;
    justify-content: space-between;

    .name {
      font-size: 14px;
      color: #1efffc;
    }

    .iconClose {
      font-size: 18px;
      color: white;
      cursor: pointer;
    }
  }

  .menJinContent {
    display: flex;
    margin-top: 15px;

    .clumn {
      display: flex;
      flex-direction: column;
    }

    .hengxiang {
      display: flex;
    }

    .leftContentbox {
      .imgbox {
        width: 400px;
        height: 300px;
      }
    }

    .rightContentBox {
      margin-left: 20px;
      flex: 1;
      background: rgba(12, 25, 44, 0.8);
      display: flex;
      flex-direction: column;

      .box1 {
        display: flex;
        padding: 20px;
        font-size: 14px;

        .name {
          color: #1efffc;
        }

        .content {
          color: #edf6f7;
        }
      }
    }
  }
}
</style>
