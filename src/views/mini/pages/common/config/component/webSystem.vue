<template>
  <!-- 前端系统设置 -->
  <div class="webSystem">
    <el-button type="danger" @click="resetDev">
      {{ $t('frontParameterConfiguration.resetDevice') }}
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    //重启前端
    resetDev() {
      this.$api.getCameraInfoQuery({ cameraId: this.$route.query.cameraId }).then(res => {
        const resetDeviceObj = {
          mainDevId: res.cameraInfo.mainDevId,
          cameraId: this.$route.query.cameraId
        }
        this.$api.resetDevice(resetDeviceObj).then(res1 => {
          if (res1.resultCode == 0) {
            this.$message({
              type: 'success',
              message: this.$t('frontParameterConfiguration.resetSucc')
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.webSystem {
  width: 25%;
  margin: 10px 0 10px 410px;
  display: flex;
  justify-content: space-around;
}
</style>
