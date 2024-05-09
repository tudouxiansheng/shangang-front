<template>
  <div
    class="task-add"
    v-loading="loading"
    element-loading-text="获取设备图像中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 返回主页面按钮 -->
    <el-button type="primary" style="margin-bottom: 18px" @click="onClose">返回</el-button>
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
          <el-option :label="$t('public.all')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input style="width: 860px" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="算法类型" prop="type">
        <el-select multiple clearable :popper-append-to-body="false" v-model="formData.type">
          <el-option v-for="a in algorithmOptions" :key="a.id" :label="a.name" :value="a.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摄像机范围" prop="cameraScope">
        <CameraAlgorithmEditor v-model="formData.cameraScope" />
      </el-form-item>
      <el-form-item label="任务时间" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务计划" prop="schedule">
        <ScheduleEditor v-model="formData.schedule" />
      </el-form-item>
    </el-form>

    <div style="text-align: center">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import CameraAlgorithmEditor from './components/CameraAlgorithmEditor/index.vue'
import CameraDrawer from './components/CameraDrawer/index.vue'
import ScheduleEditor from './components/ScheduleEditor/index.vue'
const CameraTree = () => import('@/components/CameraTree1')
const DrawROI = () => import('@/components/DrawROI')
export default {
  components: {
    ScheduleEditor,
    CameraAlgorithmEditor,
    CameraDrawer,
    CameraTree,
    DrawROI,
  },
  props: {
    defaultValue: {},
  },
  watch: {},
  data() {
    return {
      algorithmOptions: [],
      formData: {},
      formRules: {
        platformId: [
          {
            required: true,
            message: `请选择算法平台名称`,
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: `请输入任务名称`,
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: `请选择算法类型`,
            trigger: 'blur',
          },
        ],
        cameraScope: [
          {
            required: true,
            message: `请选择摄像机范围`,
            trigger: 'blur',
          },
        ],
        date: [
          {
            required: true,
            message: `请选择任务时间`,
            trigger: 'blur',
          },
        ],
        schedule: [
          {
            required: true,
            message: `请设置任务计划`,
            trigger: 'blur',
          },
        ],
      },
      loading: false,
    }
  },
  async created() {
    this.formData = this.defaultValue || {}
    this.loading = true
    try {
      this.algorithmOptions = await this.$api.getAlgorithmOptions().data
    } finally {
      this.loading = false
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    async confirm() {
      await this.$refs.form.validate()
      console.log(this.formData, JSON.stringify(this.formData))
      this.onClose()
    },
  },
}
</script>

<style lang="scss" scoped>
.task-add {
  padding-bottom: 38px;
}
</style>
