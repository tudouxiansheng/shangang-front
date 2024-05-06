<template>
  <div class="config-form" id="video-channel" v-loading="loading">
    <div class="config-container">
      <div class="config-container-left">
        <config-container-left ref="configContainerLeft" @cameraChange="handleCurrentChange" />
      </div>
      <div class="config-container-right">
        <video-channel-config ref="videoChannelConfig" />
      </div>
    </div>
  </div>
</template>
<script>
import ConfigContainerLeft from './config-container-left.vue'
import VideoChannelConfig from '../../component/video-channel-config'
import { mapActions } from 'vuex'
export default {
  components: { ConfigContainerLeft, VideoChannelConfig },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    ...mapActions('deviceConfig', ['setCameraInfo']),
    async handleCurrentChange(cameraId) {
      this.loading = true
      await this.setCameraInfo(cameraId)
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
#video-channel {
  height: calc(100% - 68px);
  overflow: hidden;
  .config-container {
    display: flex;
    height: 100%;
    &-left {
      min-width: 300px;
      flex: 3;
      margin-right: 20px;
      height: 100%;
      background-color: #082b40;
    }
    &-right {
      flex: 17;
      height: 100%;
    }
  }
}
</style>
