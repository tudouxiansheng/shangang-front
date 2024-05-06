<template>
  <!-- 我的 -->
  <div class="my">
    <div class="my-main">
      <img :src="avatarUrl || defaultUrl" alt class="my-left" />
      <div class="my-right">
        <div class="name">{{ username }}</div>
        <div class="role" ref="roler" slot="reference" v-popover:popover>
          <span v-for="(item, index) in roles" :key="index">{{ item }}</span>
        </div>
        <el-popover ref="popover" popper-class="rolepop" placement="bottom" width="200" trigger="hover" v-if="showMore">
          <div v-for="(item, index) in roles" :key="index" class="role-item" :title="item">{{ item }}</div>
        </el-popover>
        <div class="my-right-bottom" v-if="!isAdmin">{{ organizationName }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDownloadUrl, getLoginUserInfo } from '@/utils/api'
export default {
  data() {
    return {
      username: sessionStorage.getItem('username'),
      organizationName: sessionStorage.getItem('organizationName') || '未知',
      roleName: sessionStorage.getItem('roleName'),
      avatarFileId: sessionStorage.getItem('avatarFileId'),
      avatarUrl: '',
      defaultUrl: require('../img/touxiang.jpg'),
      roles: [],
      showMore: true,
      userId: sessionStorage.getItem('userId'),
    }
  },
  created() {
    if (sessionStorage.getItem('cuType') == 1) {
      getLoginUserInfo({}).then((res) => {
        let userInfo = res.userInfo
        this.roleName = userInfo.roleName
        this.organizationName = userInfo.organizationName
        this.avatarFileId = userInfo.avatarFileId
        this.roles = this.roleName.split(',')
        getDownloadUrl({ fileId: this.avatarFileId }).then((res) => {
          if (res.resultCode == 0) {
            this.avatarUrl = res.downloadUrl
          }
        })
      })
    } else {
      if (!!this.avatarFileId) {
        getDownloadUrl({ fileId: this.avatarFileId }).then((res) => {
          if (res.resultCode == 0) {
            this.avatarUrl = res.downloadUrl
          }
        })
      }
      this.roles = this.roleName.split(',')
    }
  },
  mounted() {
    if (this.$refs.roler.scrollWidth <= this.$refs.roler.clientWidth) this.showMore = false
  },
  computed: {
    isAdmin() {
      return this.userId === '00000000000000000201000000000000'
    },
  },
  methods: {},
}
</script>
<style scoped lang="scss">
.my {
  width: 100%;
  height: 100%;
  padding: 0 20px 20px;
  .my-main {
    padding-left: 44px;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    margin: 0 auto;
    justify-content: center;
    .my-left {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .my-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90%;
      // flex: 1;
      width: calc(100% - 140px);
      margin-left: 40px;
      // .my-right-top {
      // display: flex;
      // margin-bottom: 10px;
      // align-items: center;
      .name {
        font-size: 24px;
        // margin-right: 40px;
        // margin-bottom: 10px;
      }
      .role {
        // display: flex;
        // flex-wrap: wrap;
        // overflow: hidden;
        /* height: 30px; */
        overflow-x: hidden;
        overflow-y: hidden;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // overflow: hidden;
        width: 100%;
        position: relative;
        span {
          display: inline-block;
          /* height: 30px; */
          line-height: 30px;
          font-size: 16px;
          background-color: #30afff;
          border-radius: 2px 2px 2px 2px;
          padding: 1px 8px;
          margin-right: 10px;
          // margin-bottom: 10px;
        }
      }
      // }
      .my-right-bottom {
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.rolepop {
  background: #2e3e55;
  color: #fff;
  border: 1px solid #4179bd;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  .role-item {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    background-color: #30afff;
    border-radius: 2px 2px 2px 2px;
    padding: 1px 8px;
    margin-right: 10px;
    margin-bottom: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 170px;
  }
  .popper__arrow::after {
    border-top-color: #0c3c6a !important;
  }
}
</style>
