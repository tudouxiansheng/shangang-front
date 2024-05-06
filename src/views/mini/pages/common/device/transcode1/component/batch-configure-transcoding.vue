<template>
  <!-- 批量设置转码模板 -->
  <el-dialog
    :title="$t('lens.lensConfiguration')"
    v-model="$parent.batchConfiguration"
    width="1000px"
    top="10vh"
    :close-on-click-modal="false"
    class="deviceLens"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="batchForm"
      :model="batchForm"
      :rules="batchRules"
      :label-width="$parent.locale == 'en' ? '180px' : '86px'"
      label-position="left"
    >
      <el-form-item :label="$t('lens.lensName') + '：'" auto-complete="off" prop="cameraName">
        <el-tooltip
          class="item"
          effect="dark"
          :content="batchForm.cameraName"
          placement="top-start"
        >
          <el-input v-model="batchForm.cameraName" disabled></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item :label="$t('lens.BroadcastState') + '：'" auto-complete="off">
        <el-tooltip
          class="item"
          effect="dark"
          :content="batchForm.streamStatus"
          placement="top-start"
        >
          <el-input v-model="batchForm.streamStatus" disabled></el-input>
        </el-tooltip>
      </el-form-item>

      <el-form-item :label="$t('lens.StreamType') + '：'" prop="streamType">
        <el-select
          clearable
          v-model="batchForm.streamType"
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
        <el-select
          clearable
          v-model="batchForm.templateId"
          :placeholder="$t('lens.pleasetranscoding')"
        >
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
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('lens.havePauseTransedPormpt')"
          placement="top-start"
          v-if="$parent.ifHavePauseTransed"
        >
          <div style="display: inline; margin-left: 10px">
            <el-button
              type="primary"
              @click="manyPauseStartTransCode"
              :disabled="$parent.ifHavePauseTransed"
            >
              {{ $t('lens.cancel') }}
            </el-button>
          </div>
        </el-tooltip>
        <el-button
          type="primary"
          @click="manyPauseStartTransCode"
          v-if="!$parent.ifHavePauseTransed"
          :disabled="$parent.ifHavePauseTransed"
        >
          {{ $t('lens.cancel') }}
        </el-button>

        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('lens.haveTransedPormpt')"
          placement="top-start"
          v-if="$parent.ifHaveTransed"
        >
          <div style="display: inline; margin-left: 10px">
            <el-button type="primary" @click="manyStartTransCode" :disabled="$parent.ifHaveTransed">
              {{ $t('lens.determine') }}
            </el-button>
          </div>
        </el-tooltip>
        <el-button
          type="primary"
          @click="manyStartTransCode"
          v-if="!$parent.ifHaveTransed"
          :disabled="$parent.ifHaveTransed"
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
      batchForm: {
        cameraName: '',
        streamType: '',
        templateId: '',
        streamStatus: ''
      },
      batchRules: {
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
      if (this.$refs.batchForm) {
        this.$nextTick(() => {
          this.$refs.batchForm.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.batchForm = this.$parent.batchDataForm
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.batchDataForm = {}
    },

    //批量设置转码
    manyStartTransCode() {
      this.$refs['batchForm'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let multipleSelection = this.$parent.multipleSelection
          for (let i = 0; i < multipleSelection.length; i++) {
            const item = multipleSelection[i]

            let obj = {
              cameraId: item.cameraId,
              streamType: Number(this.batchForm.streamType),
              templateId: this.batchForm.templateId
            }

            this.$api.createCameraTranscode(obj).then(res => {
              if (res.resultCode == 0 && i == multipleSelection.length - 1) {
                this.$parent.batchConfiguration = false
                this.$message({
                  type: 'success',
                  message: this.$t('lens.batchStartTranscodingSuccess')
                })
                this.$parent.search_clear()
                this.$parent.handleFind()
              }
            })
          }
          this.$parent.maskloading = false
        }
      })
    },

    //批量暂停转码
    manyPauseStartTransCode() {
      this.$confirm(this.$t('lens.stopTranscodingPormpt'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let multipleSelection = this.$parent.multipleSelection
          for (let i = 0; i < multipleSelection.length; i++) {
            this.$api
              .delCameraTranscodeTasks({
                cameraId: multipleSelection[i].cameraId
              })
              .then(res => {
                if (res.resultCode == 0 && i == multipleSelection.length - 1) {
                  this.$parent.batchConfiguration = false
                  this.$message({
                    type: 'success',
                    message: this.$t('lens.batchStopTranscodingSuccess')
                  })
                  this.$parent.search_clear()
                  this.$parent.handleFind()
                }
              })
          }
        })
        .catch(() => {})
    }
  }
}
</script>
