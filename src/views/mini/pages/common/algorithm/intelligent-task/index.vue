<template>
  <div
    class="task-add"
    v-loading="loading"
    element-loading-text="获取设备图像中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 返回主页面按钮 -->
    <el-button type="primary">{{ $t('public.back') }}</el-button>
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      class="addForm"
      label-suffix="："
      label-position="right"
      label-width="110px"
    >
      <el-form-item label="算法平台名称" prop="platformId">
        <el-select clearable :popper-append-to-body="false" v-model="formData.platformId">
          <el-option :label="$t('public.all')" value></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input style="width: 860px" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="算法类型" prop="type">
        <el-select clearable :popper-append-to-body="false" v-model="formData.platformId">
          <el-option :label="$t('public.all')" value></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摄像机范围" prop="cameraScope">
        <CameraAlgorithmEditor v-model="formData.cameraScope" />
      </el-form-item>
      <el-form-item label="任务时间" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>

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
      formData: {},
      formRules: {},
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
