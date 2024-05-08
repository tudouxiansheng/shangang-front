<template>
  <div
    class="task-add"
    v-loading="imgLoad"
    element-loading-text="获取设备图像中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 返回主页面按钮 -->
    <el-button size="large" type="primary" @click="backTo">{{ $t('public.back') }}</el-button>
    <CameraDrawer :on-load-image="loadLiveImage" v-model="areas" />
    {{ areas }}
    <div style="text-align: center">
      <el-button @click="backTo">取消</el-button>
      <el-button type="primary" @click="submitTask" :loading="maskloading">确定</el-button>
    </div>
  </div>
</template>

<script>
const CameraTree = () => import('@/components/CameraTree1')
const DrawROI = () => import('@/components/DrawROI')
export default {
  components: {
    CameraDrawer: () => import('./components/CameraDrawer/index.vue'),
    CameraTree,
    DrawROI,
  },
  props: {
    taskTypeList: {
      type: Array,
      default: () => [
        { label: '目标识别', value: '2' },
        { label: '行为分析', value: '0' },
        { label: '人体特征', value: '4' },
      ],
    },
  },
  watch: {},
  data() {
    return {
      areas: [],
    }
  },
  async created() {},
  methods: {
    async loadLiveImage() {
      return (await this.$api.getCameraLiveCover({ cameraId: 1 })).base64
    },
  },
}
</script>

<style lang="scss" scoped>
.task-add {
}
</style>
