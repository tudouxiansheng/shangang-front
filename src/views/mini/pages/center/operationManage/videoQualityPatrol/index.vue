<template>
  <div ref="videoQualityPatrol" class="videoQualityPatrol p-5" v-if="isRouterAlive">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('videoQualityPatrol.cameraVideoQuality')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('videoQualityPatrol.videoQualityTask')" name="second"></el-tab-pane>
    </el-tabs>
    <camera-video-quality v-if="activeName == 'first'" />
    <video-quality-task v-if="activeName == 'second'" />
  </div>
</template>
<script>
import cameraVideoQuality from './components/camera-video-quality'
import videoQualityTask from './components/video-quality-task'
export default {
  name: 'VideoQualityRoundTour',
  components: { cameraVideoQuality, videoQualityTask },
  data() {
    return {
      isRouterAlive: true,
      activeName: 'first'
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.activeName =
        from.name === 'VideoQualityTaskDetails' ||
        (from.name === 'CameraQualityDetail' && from.params.type === 2)
          ? 'second'
          : 'first'
    })
  }
}
</script>
<style lang="scss">
.videoQualityPatrol {
  .el-tabs__item {
    background: none !important;
    color: #fff;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
  .el-tabs__nav-wrap::after {
    background-color: #666666;
    height: 1px;
  }
}
</style>
