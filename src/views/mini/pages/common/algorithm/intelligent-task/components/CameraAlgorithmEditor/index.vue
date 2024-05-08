<style lang="scss" scoped>
.camera-algorithm-editor {
}
</style>
<template>
  <div
    class="camera-algorithm-editor"
    v-loading="loading"
    element-loading-text="加载数据中..."
    element-loading-spinner="el-icon-loading"
  >
    <div style="display: flex">
      <div style="flex: 1">
        <CameraTree1
          :selected-options.sync="selectedCameras"
          :focused-item.sync="currentCamera"
          canModify
          ref="camera"
          :dataOption="{
            dataType: 'camera',
            single: false,
            strictly: true,
            showAllSel: false,
          }"
          :disableIds="[]"
          :platType="is1800 ? 14 : 16"
        ></CameraTree1>
      </div>
      <div style="flex: 1; padding-left: 38px">
        <CameraDrawer
          v-if="currentCamera"
          :key="currentCamera.id"
          :on-load-image="loadLiveImage"
          v-model="currentCamera.dashData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CameraTree1 from '@components/CameraTree1'

export default {
  components: {
    CameraDrawer: () => import('@views/mini/pages/common/algorithm/intelligent-task/components/CameraDrawer/index.vue'),
    CameraTree1,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    is1800: {
      type: Boolean,
    },
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {
    actionDisabled() {
      return !this.snapshotImg
    },
  },
  data() {
    return {
      loading: false,
      currentCamera: null,
      selectedCameras: [],
    }
  },
  created() {
    setInterval(() => console.log(this.currentCamera), 1000)
  },
  methods: {
    async loadLiveImage() {
      return (await this.$api.getCameraLiveCover({ cameraId: this.currentCamera.id })).base64
    },
  },
}
</script>
