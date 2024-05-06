<template>
  <!--门禁详情-->
  <div class="menjin">
    <div class="topTitle">
      <div class="name">详情</div>
      <i class="el-icon-close iconClose" @click="closeBtn"></i>
    </div>
    <div class="menJinContent">
      <div class="leftContentbox">
        <img
          :src="
            menjinObj.snapShotUrl ? menjinObj.snapShotUrl : menjinObj.snapPhoto
          "
          class="imgbox"
        />
      </div>
      <div class="rightContentBox">
        <div class="box1">
          <div class="name">姓名：</div>
          <div class="content">&nbsp;&nbsp;{{ menjinObj.personName }}</div>
        </div>
        <div class="box1">
          <div class="name">性别：</div>
          <div class="content">
            &nbsp;&nbsp;{{ menjinObj.gender == '1' ? '男' : '女' }}
          </div>
        </div>
        <div class="box1">
          <div class="name">年龄：</div>
          <div class="content">
            &nbsp;&nbsp;{{ menjinObj.age ? menjinObj.age : '无' }}
          </div>
        </div>
        <div class="box1">
          <div class="name">时间：</div>
          <div class="content">&nbsp;&nbsp;{{ menjinObj.eventTime }}</div>
        </div>
        <div class="box1">
          <div class="name">位置：</div>
          <div class="content">
            &nbsp;&nbsp;{{
              menjinObj.location ? menjinObj.location : menjinObj.installLocate
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['menjinObj'],
  data() {
    return {}
  },
  methods: {
    closeBtn() {
      this.$emit('closeBtn')
    },
  },
}
</script>

<style lang="scss">
.menjin {
  width: 730px;
  height: 372px;
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
