<template>
  <div
    class="task-add"
    v-loading="loading"
    element-loading-text="获取设备图像中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 返回主页面按钮 -->
    <el-button size="large" type="primary">{{ $t('public.back') }}</el-button>
    <!--    {{ areas }}-->
    <!--    <CameraDrawer :on-load-image="loadLiveImage" v-model="areas" />-->
    <CameraAlgorithmEditor />
    <div style="text-align: center">
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
import CameraAlgorithmEditor from './components/CameraAlgorithmEditor/index.vue'
import CameraDrawer from './components/CameraDrawer/index.vue'

const CameraTree = () => import('@/components/CameraTree1')
const DrawROI = () => import('@/components/DrawROI')
export default {
  components: {
    CameraAlgorithmEditor,
    CameraDrawer,
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
      loading: false,
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
