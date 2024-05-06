<template>
  <div class="data-center">
    <div class="data-center-item" v-for="(item, index) in data" :key="index">
      <div class="item-left">
        <img :src="item.url" alt="" />
        <div class="item-left-text">
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
      <div class="item-right">
        <el-button type="primary" class="download" @click="downLoad(index)">{{
          index === 2 ? $t('patrol.check') : $t('login.download')
        }}</el-button>
      </div>
    </div>
    <CusDialog :title="$t('worktable.APP')" :visible="visible" isDetail @close="dialogClosed" :width="600">
      <div slot="body" class="code-body">
        <div class="code-item" v-for="item in codeArray" :key="item.name">
          <img :src="item.url" />
        </div>
      </div>
    </CusDialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        { url: require('../img/client.png'), title: `${this.$t('worktable.client')}` },
        { url: require('../img/doc.png'), title: `${this.$t('worktable.doc')}.doc` },
        { url: require('../img/app.png'), title: `${this.$t('worktable.APP')}` },
      ],
      visible: false,
      // 安卓和ios二维码
      codeArray: [{ name: '安卓', url: require('../img/android.png') }],
    }
  },
  methods: {
    downLoad(index) {
      if (index === 2) {
        this.visible = true
      } else {
        const herfs = [
          '/download/acs_client_1.5.2.8_unified_Setup_Win32.exe',
          '/download/《综合安防智慧园区产品》客户端操作手册.docx',
        ]
        window.location.href = location.origin + herfs[index]
      }
    },
    dialogClosed() {
      this.visible = false
    },
  },
}
</script>
<style scoped lang="scss">
.data-center {
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .data-center-item {
    background-image: url('../img/centerBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    width: 540px;
    height: 80px;
    justify-content: space-between;
    padding: 20px;
    /* border-radius: 4px 4px 4px 4px;
    border: 1px solid;
    border-image: linear-gradient(153deg, rgba(187, 201, 221, 1), rgba(187, 201, 221, 0.12), rgba(187, 201, 221, 0.8)) 1
    1; */
    align-items: center;
    .item-left {
      display: flex;
      justify-content: space-between;
      img {
        width: 64px;
        height: 64px;
      }
      .item-left-text {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 12px;
        font-size: 18px;
        font-weight: normal;
        text-shadow: 0px 4px 4px rgba(149, 244, 255, 0.25);
        font-style: italic;
      }
    }
    .download {
      font-style: italic;
    }
  }
}
.code-body {
  display: flex;
  justify-content: space-around;
  .code-item {
    display: flex;
    flex-direction: column;
    p {
      text-align: center;
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
