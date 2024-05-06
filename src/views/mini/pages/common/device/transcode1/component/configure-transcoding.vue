<template>
  <!-- 设备分发转码配置 -->
  <el-dialog
    draggable
    :title="$t('lens.lensConfiguration')"
    v-model="$parent.lensConfiguration"
    width="1000px"
    top="10vh"
    :close-on-click-modal="false"
    class="deviceLens"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="$parent.locale == 'en' ? '180px' : '86px'"
      label-position="left"
    >
      <el-form-item :label="$t('lens.lensName') + '：'" auto-complete="off" prop="cameraName">
        <el-input v-model="form.cameraName" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item :label="$t('lens.BroadcastState') + '：'">
        <el-select v-model="form.streamStatus" disabled>
          <el-option
            v-for="(item, index) in $parent.streamStatusData"
            :key="index"
            :label="item.statusName"
            :value="item.statusType"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('lens.StreamType') + '：'" prop="streamType">
        <el-select
          clearable
          v-model="form.streamType"
          :placeholder="$t('lens.pleaseInputStreamType')"
        >
          <el-option
            v-for="(item, index) in $parent.streamTypeData"
            :key="index"
            :label="item.streamName"
            :value="item.streamType"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('lens.transcoding') + '：'" prop="templateId">
        <el-select clearable v-model="form.templateId" :placeholder="$t('lens.pleasetranscoding')">
          <el-option
            v-for="(item, index) in $parent.templateList"
            :key="index"
            :label="item.templateName"
            :value="item.templateId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="pauseTransCode" :disabled="form.streamStatus == 'notConfig'">
          {{ $t('lens.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="startTransCode"
          :disabled="form.streamStatus != 'notConfig'"
          :loading="$parent.maskloading"
        >
          {{ $t('lens.determine') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cameraName: '',
        streamType: '',
        templateId: '',
        streamStatus: ''
      },
      rules: {
        streamType: [
          {
            required: true,
            message: this.$t('lens.pleaseInputStreamType'),
            trigger: 'blur'
          }
        ],
        templateId: [
          {
            required: true,
            message: this.$t('lens.pleasetranscoding'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })
    },
    dialogClosed() {
      this.$parent.lensConfiguration = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },
    //启动转码
    startTransCode() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true

          let obj = {}
          obj.cameraId = this.form.cameraId
          obj.streamType = Number(this.form.streamType)
          obj.templateId = this.form.templateId
          this.$api.createCameraTranscode(obj).then(res => {
            if (res.resultCode == 0) {
              this.$parent.lensConfiguration = false
              this.$message({
                type: 'success',
                message: this.$t('lens.startTranscodingSuccess')
              })
              this.$parent.search_clear()
              this.$parent.handleFind()
            }
            this.$parent.maskloading = false
          })
        }
      })
    },
    //暂停转码
    pauseTransCode() {
      this.$confirm(this.$t('lens.stopTranscodingPormpt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delCameraTranscodeTasks({ cameraId: this.form.cameraId }).then(res => {
            if (res.resultCode == 0) {
              this.$parent.lensConfiguration = false
              this.$message({
                type: 'success',
                message: this.$t('lens.stopTranscodingSuccess')
              })
              this.$parent.search_clear()
              this.$parent.handleFind()
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
