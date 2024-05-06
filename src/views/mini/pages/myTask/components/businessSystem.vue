<template>
  <div class="business">
    <div class="plat-box" v-for="item in platArr" :key="item.platType" @click="jumpAddress(item)">
      <div class="circulate-box">
        <img :src="item.platPhotoUrl" v-if="item.platPhotoUrl" class="photos" />
        <!-- <el-empty :image-size="100" v-else description="未上传图片"> </el-empty> -->
        <div class="name">{{ item.platName }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getIotPlatformList } from '@/utils/api'
export default {
  data() {
    return {
      platArr: [],
      defaultImg: require('../img/barrier.png'),
    }
  },
  mounted() {
    this.getThirdParty()
  },
  methods: {
    jumpAddress(item) {
      if (!item.platAddress) return this.$message.warning('请先配置系统地址再操作!')
      // 跳转平台
      window.open(item.platAddress, '_blank', 'noopener,noreferrer')
    },
    // 获取第三方平台
    getThirdParty() {
      let data = {
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        organizationId: 0,
      }
      getIotPlatformList(data).then((res) => {
        if (res.resultCode === 0) {
          res.platList.forEach((p) => {
            if (!p.platPhotoUrl) p.platPhotoUrl = this.defaultImg
          })
          this.platArr = res.platList.filter((p) => !!p.platAddress)
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.business {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  justify-content: space-between;
  padding: 0 20px;

  .plat-box {
    height: calc(50% - 20px);
    width: calc(50% - 10px);
    cursor: pointer;
    margin-bottom: 20px;

    .circulate-box {
      width: 100%;
      height: 100%;
      position: relative;

      .photos {
        width: 100%;
        height: 98%;
      }

      .name {
        position: absolute;
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        line-height: 23px;
        top: 16px;
        left: 26px;
      }
    }
  }
}
</style>
